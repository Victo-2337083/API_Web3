// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";


export default defineConfig({
  test: {
    setupFiles: ["./tests/setup-env.ts"],
    globals: true,
  },
    resolve: {
    alias: {
        "@src": path.resolve(__dirname, "src"),
    },
  },
});
