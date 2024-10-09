import type { Transformer } from "unified";
import type { Node, Parent } from "unist";
import { visit, CONTINUE, SKIP } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";

import type { AstroMarkdownOptions, MarkdownProcessor } from "@astrojs/markdown-remark";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";

import { remarkAlert } from "remark-github-blockquote-alert";
import sectionize from "@hbsnow/rehype-sectionize";

import { getQMLTypeLinkObject, getQMLTypeLink, getIconForLink } from "./helpers.ts"

// couldn't find the actual type to use
type HtmlNode = Node & {
  value: string,
  type: string,
  tagName: string,
};

function rehypeRewriteTypelinks(): Transformer {
  return function (root: Node): Node {
    // @ts-ignore: does not appear to be a way to give this a correct type, it works for the one with a test below
    visit(root, (node: HtmlNode, index: number, parent: Parent) => {
      if (node.type == "element" && node.tagName == "pre") return SKIP;

      if (node.type == "text") {
        let changed = false;

        node.value = node.value.replace(/TYPE99(\w+.)99TYPE/g, (_full: string, match: string) => {
          changed = true;

          const linkObject = getQMLTypeLinkObject(match);
          const link = getQMLTypeLink(linkObject);
          const icon = (linkObject.mtype && linkObject.mtype != "func") ? getIconForLink(linkObject.mtype, false) : null;
          const hasParens = linkObject.mtype == "func" || linkObject.mtype == "signal";
          const hasDot = linkObject.name && linkObject.mname;

          return `<a class="type${linkObject.mtype}-link typedata-link" href=${link}>${icon ?? ""}${linkObject.name ?? ""}${hasDot ? "." : ""}${linkObject.mname ?? ""}${hasParens ? "()" : ""}</a>`;
        });

        if (changed) {
          const fragment = fromHtml(node.value, { fragment: true });
          parent.children.splice(index, 1, ...fragment.children);
          return SKIP;
        }
      }

      return CONTINUE;
    });

    return root;
  }
}

const shikiRewriteTypelinks = {
  code: (root: Node) => {
    visit(root, "text", (node: HtmlNode, index: number, parent: Parent) => {
      let changed = false;

      node.value = node.value.replace(/TYPE99(\w+.)99TYPE/g, (_full: string, match: string) => {
        changed = true;

        const linkObject = getQMLTypeLinkObject(match);
        const link = getQMLTypeLink(linkObject);

        return `<a href=${link}>${linkObject.name ?? ""}</a>`;
      });

      if (changed) {
        const fragment = fromHtml(node.value, { fragment: true });
        parent.children.splice(index, 1, ...fragment.children);
      }
    });
  }
};

export const markdownConfig: AstroMarkdownOptions = {
  syntaxHighlight: "shiki",
  shikiConfig: {
    theme: "material-theme-ocean",
    wrap: true,
    transformers: [ shikiRewriteTypelinks ],
  },
  remarkPlugins: [[
    remarkAlert,
    { legacyTitle: true },
  ]],
  rehypePlugins: [
    [ sectionize, { idPropertyName: "id" } ],
    // @ts-ignore: can't tell what this wants
    [ rehypeRewriteTypelinks, {} ],
  ],
};

let globalMarkdownProcessor: Promise<MarkdownProcessor>;

async function getMarkdownProcessor(): Promise<MarkdownProcessor> {
  if (!globalMarkdownProcessor) {
    globalMarkdownProcessor = createMarkdownProcessor(markdownConfig);
  }

  return globalMarkdownProcessor;
}

export async function processMarkdown(markdown: string): Promise<string> {
  return (await (await getMarkdownProcessor()).render(markdown)).code;
}
