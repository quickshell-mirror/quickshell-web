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
import { h } from "hastscript";

import {
  getQMLTypeLinkObject,
  getQMLTypeLink,
  getIconForLink,
} from "./helpers.ts";
import type { CopyButtonOptions } from "@_types";

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

const shikiCopyButton: ShikiTransformer = {
  name: "copy-button",
  pre(node) {
    const options: CopyButtonOptions = {
      duration: 3000,
    };
    const button = h(
      "button",
      {
        class: "copy-button",
        role: "button",
        "aria-label": "Copy to clipboard",
        "alia-live": "polite",
        // "data-code": removeCodeAnnotations(this.source),
        onclick: `
                navigator.clipboard.writeText(this.dataset.code);
                this.classList.add('copied');
                this.setAttribute('aria-pressed', 'true');
                setTimeout(() => { this.classList.remove('copied'); this.setAttribute('aria-pressed', 'false');}, ${options.duration})
                `,
      },
      [
        h("span", { class: "ready" }),
        h("span", { class: "success" }),
        h(
          "svg",
          {
            class: "copy-icon",
            role: "icon",
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 256 256",
          },
          [
            h("path", {
              fill: "currentColor",
              d: "M200 32h-36.26a47.92 47.92 0 0 0-71.48 0H56a16 16 0 0 0-16 16v168a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-72 0a32 32 0 0 1 32 32H96a32 32 0 0 1 32-32m72 184H56V48h26.75A47.9 47.9 0 0 0 80 64v8a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-8a47.9 47.9 0 0 0-2.75-16H200Z",
            }),
          ]
        ),
      ]
    );
    node.children.splice(0, 0, button);
  },
};

const markdownConfig: AstroMarkdownOptions = {
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
        transformers: [shikiRewriteTypelinks, shikiCopyButton],
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

async function processMarkdown(
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

export { markdownConfig, processMarkdown };
