import { defineConfig, mergeConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/tests/setup.ts",
      exclude: [...configDefaults.exclude, "./e2e/**"],
      outputFile: {
        html: "./src/tests/test-report/test-report.html",
      },
    },
  })
);
