import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const isGHPagesBuild = process.env.NODE_ENV === "production";

export default defineConfig({
  // Allows serving the SPA from GH Pages
  base: isGHPagesBuild ? "/KazeMatsuri/" : "/",

  plugins: [tailwindcss(), reactRouter()],

  resolve: {
    tsconfigPaths: true,
  },
});
