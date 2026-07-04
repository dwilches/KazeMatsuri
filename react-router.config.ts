import type { Config } from "@react-router/dev/config";

const isGHPagesBuild = process.env.NODE_ENV === "production";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,

  // Allows serving the SPA from GH Pages
  basename: isGHPagesBuild ? "/KazeMatsuri/" : "/",

} satisfies Config;
