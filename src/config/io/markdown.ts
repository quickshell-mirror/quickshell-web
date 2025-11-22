import { visit, CONTINUE, SKIP } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import type * as Unist from "unist";
import type * as Html from "hast";
import type * as Md from "mdast";
import type {
  AstroMarkdownOptions,
  MarkdownProcessor,
  RemarkPlugin,
  RehypePlugin,
} from "@astrojs/markdown-remark";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkAlert } from "remark-github-blockquote-alert";
import rehypeShiki from "@shikijs/rehype";
import sectionize from "@hbsnow/rehype-sectionize";
import type { ShikiTransformer } from "shiki";

import {
  getQMLTypeLinkObject,
  getQMLTypeLink,
  getIconForLink,
} from "./helpers.ts";

let currentVersion = "NOVERSION";

const remarkParseAtTypes: RemarkPlugin<[]> =
  () =>
    (root: Md.Root): Md.Root => {
      visit(root as Unist.Parent, (rawNode: Unist.Node) => {
        if (
          rawNode.type === "text" ||
          (rawNode.type === "code" &&
            (rawNode as Md.Code).lang === "qml")
        ) {
          const node = rawNode as Md.Literal;

          node.value = node.value.replace(
            /@@((?<module>([A-Z]\w*\.)*)(?<type>([A-Z]\w*))(\.(?!\s|$))?)?((?<member>[a-z]\w*)((?<function>\(\))|(?<signal>\(s\)))?)?(?=[$.,;:)\s]|$)/g,
            (_full, ...args) => {
              type Capture = {
                module: string | undefined;
                type: string | undefined;
                member: string | undefined;
                function: string | undefined;
                signal: string | undefined;
              };

              const groups = args.pop() as Capture;

              if (groups.module) {
                groups.module = groups.module.substring(
                  0,
                  groups.module.length - 1
                );
                const isQs = groups.module.startsWith("Quickshell");
                groups.module = `99M${isQs ? "QS" : "QT_qml"}_${groups.module.replace(".", "_")}`;
              } else groups.module = ""; // WARNING: rehype parser can't currently handle intra-module links

              groups.type = groups.type ? `99N${groups.type}` : "";
              groups.member = groups.member
                ? `99V${groups.member}`
                : "";
              const type = groups.member
                ? `99T${groups.function ? "func" : groups.signal ? "signal" : "prop"}`
                : "";
              return `TYPE${groups.module}${groups.type}${groups.member}${type}99TYPE`;
            }
          );
        }
      });
      return root;
    };

const rehypeRewriteTypelinks: RehypePlugin<[]> =
  () =>
    (root: Html.Root): Html.Root => {
      visit(
        root as Unist.Parent,
        "text",
        (node: Html.Text, index: number, parent: Html.Parent) => {
          let changed = false;

          node.value = node.value.replace(
            /TYPE99(\w+.)99TYPE/g,
            (_full: string, match: string) => {
              changed = true;

              const linkObject = getQMLTypeLinkObject(match);
              const link = getQMLTypeLink(
                currentVersion,
                linkObject
              );
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

      return root;
    };

const rehypeRewriteVersionedDoclinks: RehypePlugin<[]> =
  () =>
    (root: Html.Root): Html.Root => {
      visit(
        root as Unist.Parent,
        "element",
        ({ tagName, properties }: Html.Element) => {
          if (tagName !== "a") return CONTINUE;
          if (
            !((properties.href as string) ?? "").startsWith("@docs")
          )
            return CONTINUE;
          properties.href = `/docs/${currentVersion}/${(properties.href as string).slice(6)}`;
          return CONTINUE;
        }
      );

      return root;
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
        const link = getQMLTypeLink(currentVersion, linkObject);
        return `<a href=${link}>${linkObject.name ?? ""}</a>`;
      });
    }
  },
};

export const markdownConfig: AstroMarkdownOptions = {
  syntaxHighlight: false,
  remarkPlugins: [
    remarkParseAtTypes,
    [remarkAlert, { legacyTitle: true }],
  ],
  rehypePlugins: [
    [
      rehypeShiki,
      {
        themes: {
          light: "slack-ochin",
          dark: "slack-dark",
        },
        colorReplacements: {
          "slack-ochin": {
            "#fff": "#f1f3f4", // bg
            "#357b42": "#989eb9", // comments
            "#b1108e": "#224bbb", // fields
          },
          "slack-dark": {
            "#222222": "#0f111a", // bg
            "#6a9955": "#525666", // comments
          },
        },
        defaultColor: false,
        wrap: true,
        transformers: [shikiRewriteTypelinks],
      },
    ],
    // FIXME: incompatible types between unified/Plugin and Astro/RehypePlugin
    [
      sectionize as unknown as RehypePlugin,
      { idPropertyName: "id" },
    ],
    rehypeRewriteTypelinks,
    rehypeRewriteVersionedDoclinks,
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
  version: string,
  markdown: string
): Promise<string> {
  currentVersion = version;
  const r = (
    await (await getMarkdownProcessor()).render(markdown)
  ).code;
  currentVersion = "NOVERSION";
  return r;
}
