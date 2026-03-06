import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Create a virtual module for CSS modules
const cssModulePlugin = {
  name: "vite-plugin-mock-css-modules",
  apply: "serve" as const,
  resolveId(id: string) {
    if (id.endsWith(".module.css")) {
      return { id, external: false };
    }
  },
  load(id: string) {
    if (id.endsWith(".module.css")) {
      return 'export default new Proxy({}, {get: () => "mocked-class"})';
    }
  },
};

export default defineConfig({
  plugins: [react(), cssModulePlugin],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    pool: "forks",
    maxWorkers: 4,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "coverage/",
        ".next/",
        "app/components/Analytics/",
        "**/*.config.*",
        "**/*.setup.*",
        "**/*.d.ts",
        "**/*.module.css",
        "**/index.ts",
      ],
    },
    isolate: true,
    testTimeout: 5000,
    hookTimeout: 5000,
    reporters: ["default"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", ".next", "coverage"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
