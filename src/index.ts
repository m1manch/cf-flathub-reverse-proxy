function welcomeText(url: URL, uname: string, passwd: string): string {
  url.username = uname;
  url.password = passwd;
  if (uname === "none") {
    url.username = "";
  }
  if (passwd === "none") {
    url.password = "";
  }
  let result = "This is a Flathub reverse proxy.\n\n";
  result = `${result}If you want to use it, run this command:\n\n`;
  result = `${result}flatpak remote-modify flathub --url=${url.toString()}`;
  return result;
}

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    if (
      env.USERNAME !== "" &&
      env.USERNAME !== "none" &&
      env.PASSWORD !== "" &&
      env.PASSWORD !== "none"
    ) {
      const authHead = request.headers.get("Authorization");
      const unauthResp = new Response("Unauthorized request", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
      });
      if (authHead === null) {
        return unauthResp;
      }
      const [method, content] = authHead.split(" ", 2);
      if (method !== "Basic") {
        return unauthResp;
      }
      const [username, passwd] = atob(content).split(":", 2);
      if (username !== env.USERNAME || passwd !== env.PASSWORD) {
        return unauthResp;
      }
    }

    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response(welcomeText(url, env.USERNAME, env.PASSWORD));
    }
    return fetch(`https://dl.flathub.org/repo${url.pathname}`); // url.pathname contains prefix '/'
  },
} satisfies ExportedHandler<Env>;
