import type { Config } from "@react-router/dev/config";

const localBuild = process.env.NODE_ENV === "development";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,

  // Allows serving the SPA from GH Pages
  basename: localBuild ? "/" :  "/KazeMatsuri/",

} satisfies Config;
