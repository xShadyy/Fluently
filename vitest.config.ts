import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
    testTimeout: 50000,
    coverage: {
      provider: "v8",
    },
  },
});