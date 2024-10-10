import type { Parent, Node } from "unist";
import { visit, CONTINUE, SKIP } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import type { Root } from "hast";
import type {
  AstroMarkdownOptions,
  MarkdownProcessor,
  RehypePlugin,
} from "@astrojs/markdown-remark";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkAlert } from "remark-github-blockquote-alert";
import sectionize from "@hbsnow/rehype-sectionize";
import type { ShikiTransformer } from "shiki";

import {
  getQMLTypeLinkObject,
  getQMLTypeLink,
  getIconForLink,
} from "./helpers.ts";

// couldn't find the actual type to use
interface HtmlNode extends Node {
  value: string;
  type: string;
  tagName: string;
}

const rehypeRewriteTypelinks: RehypePlugin<[]> = () => {
  return (root: Node): Root => {
    visit(
      root,
      "text",
      (node: HtmlNode, index: number, parent: Parent) => {
        let changed = false;

        node.value = node.value.replace(
          /TYPE99(\w+.)99TYPE/g,
          (_full: string, match: string) => {
            changed = true;

            const linkObject = getQMLTypeLinkObject(match);
            const link = getQMLTypeLink(linkObject);
            const icon =
              linkObject.mtype && linkObject.mtype !== "func"
                ? getIconForLink(linkObject.mtype, false)
                : null;
            const hasParens =
              linkObject.mtype === "func" ||
              linkObject.mtype === "signal";
            const hasDot = linkObject.name && linkObject.mname;

            return `<a class="type${linkObject.mtype}-link typedata-link" href=${link}>${icon ?? ""}${linkObject.name ?? ""}${hasDot ? "." : ""}${linkObject.mname ?? ""}${hasParens ? "()" : ""}</a>`;
          }
        );

        if (changed) {
          const fragment = fromHtml(node.value, {
            fragment: true,
          });
          parent.children.splice(index, 1, ...fragment.children);
          return SKIP;
        }

        return CONTINUE;
      }
    );

    return root as Root;
  };
};

const shikiRewriteTypelinks: ShikiTransformer = {
  name: "rewrite-typelinks",
  postprocess(code, _options) {
    // WARN: need to change the code link identifier to this
    const regExp = /TYPE99(\w+.)99TYPE/g;
    const hasTypelinks = code.search(regExp) !== -1;

    if (hasTypelinks) {
      code.replace(regExp, (_full: string, match: string) => {
        const linkObject = getQMLTypeLinkObject(match);
        const link = getQMLTypeLink(linkObject);
        return `<a href=${link}>${linkObject.name ?? ""}</a>`;
      });
    }
  },
};

export const markdownConfig: AstroMarkdownOptions = {
  syntaxHighlight: "shiki",
  shikiConfig: {
    theme: "material-theme-ocean",
    wrap: true,
    transformers: [shikiRewriteTypelinks],
  },
  remarkPlugins: [[remarkAlert, { legacyTitle: true }]],
  rehypePlugins: [
    // FIXME: incompatible types between unified/Plugin and Astro/RehypePlugin
    // @ts-expect-error
    [sectionize as RehypePlugin, { idPropertyName: "id" }],
    rehypeRewriteTypelinks,
  ],
};

let globalMarkdownProcessor: Promise<MarkdownProcessor>;

async function getMarkdownProcessor(): Promise<MarkdownProcessor> {
  if (!globalMarkdownProcessor) {
    globalMarkdownProcessor =
      createMarkdownProcessor(markdownConfig);
  }

  return globalMarkdownProcessor;
}

export async function processMarkdown(
  markdown: string
): Promise<string> {
  return (await (await getMarkdownProcessor()).render(markdown))
    .code;
}
