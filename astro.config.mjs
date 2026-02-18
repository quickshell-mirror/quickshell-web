import { defineConfig, envField } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

import pagefind from "./pagefind";
import { markdownConfig } from "./src/config/io/markdown.ts";

// https://astro.build/config
export default defineConfig({
  markdown: markdownConfig,
  site: "https://quickshell.org",
  integrations: [
    solidJs({
      devtools: false,
    }),
    mdx(),
    pagefind(),
    icon(),
    sitemap(),
  ],
  env: {
    schema: {
      VERSION_FILE_PATH: envField.string({
        context: "server",
        access: "secret",
        default: "./versions.json",
      }),
      BASE_URL: envField.number({
        context: "server",
        access: "public",
      }),
      PRODUCTION: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
