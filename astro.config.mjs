import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import { remarkAlert } from "remark-github-blockquote-alert";
import sectionize from "@hbsnow/rehype-sectionize";
import mdx from "@astrojs/mdx";

import pagefind from "./pagefind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs({
      devtools: true,
    }),
    mdx(),
    pagefind(),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "material-theme-ocean",
      wrap: true,
    },
    remarkPlugins: [
      [
        remarkAlert,
        {
          legacyTitle: true,
        },
      ],
    ],
    rehypePlugins: [
      [
        sectionize,
        {
          idPropertyName: "id",
        },
      ],
    ],
  },
});
