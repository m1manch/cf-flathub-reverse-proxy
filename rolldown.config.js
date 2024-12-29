import { defineConfig } from "rolldown";
import { swc } from "rollup-plugin-swc3";

export default defineConfig({
  input: "src/index.ts",
  plugins: [swc()],
  output: {
    file: "_worker.js",
    format: "esm",
  },
});
