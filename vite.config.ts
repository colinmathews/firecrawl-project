import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        /**
         * We need stable chunk names to avoid issues during deployments:
         *
         * 1. When navigating routes, imports happen like:
         *    `import {r as o, j as n, u as v} from "./chunk-HA7DTUK3-CZBcQYua.js";`
         *
         * 2. For new deployments, if chunks aren't already loaded:
         *    - Browser loads new chunks with different names
         *    - Can get React collisions with multiple instances
         *    - React context breaks due to referential identity
         *    - useContext() may return null unexpectedly
         *
         * 3. Individual hook files can also cause issues:
         *    - Different chunk = different context references
         *    - Hooks like useMyThing() get wrong context objects
         *
         * By using stable chunk names, browser reuses existing loaded chunks
         * across deployments rather than fetching new ones.
         */
        chunkFileNames: "assets/chunk-[name].js",
      },
    },
  },
});
