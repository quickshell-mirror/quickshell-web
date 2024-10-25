import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

import pagefind from "./pagefind";
import { markdownConfig } from "./src/config/io/markdown.ts";

// https://astro.build/config
export default defineConfig({
  markdown: markdownConfig,
  site: "https://quickshell.outfoxxed.me",
  integrations: [
    solidJs({
      devtools: true,
    }),
    mdx(),
    pagefind(),
    icon(),
    sitemap(),
  ],
});
