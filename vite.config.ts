import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        "src/content-scripts/profileScraper":
          "src/content-scripts/profileScraper.ts",
        background: "background.ts",
        deepProfileScraper: "src/content-scripts/deepProfileScraper.ts",
        "src/content-scripts/commentScraper":
          "src/content-scripts/commentScraper.ts",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
