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
import sectionize from "@hbsnow/rehype-sectionize";
import type { ShikiTransformer } from "shiki";

import {
  getQMLTypeLinkObject,
  getQMLTypeLink,
  getIconForLink,
} from "./helpers.ts";

const remarkParseAtTypes: RemarkPlugin<[]> = () => {
  return (root: Md.Root): Md.Root => {
    visit(
      root as Unist.Parent,
      (rawNode: Unist.Node) => {
        if (rawNode.type === "text" || (rawNode.type === "code" && (rawNode as Md.Code).lang === "qml")) {
          const node = rawNode as Md.Literal;

          node.value = node.value.replace(
            /@@((?<module>([A-Z]\w*\.)*)(?<type>([A-Z]\w*))\.?)?((?<member>[a-z]\w*)((?<function>\(\))|(?<signal>\(s\)))?)?(?=[$.,;:\s]|$)/g,
            (_full, ...args) => {
              type Capture = {
                module: string | undefined;
                type: string | undefined;
                member: string | undefined;
                function: string | undefined;
                signal: string | undefined;
              }

              const groups = args.pop() as Capture;

              if (groups.module) {
                groups.module = groups.module.substring(0, groups.module.length - 1);
                const isQs = groups.module.startsWith("Quickshell");
                groups.module = `99M${isQs ? "QS" : "QT_qml"}_${groups.module.replace(".", "_")}`;
              } else groups.module = ""; // WARNING: rehype parser can't currently handle intra-module links

              groups.type = groups.type ? `99N${groups.type}` : "";
              groups.member = groups.member ? `99V${groups.member}` : "";
              const type = groups.member ? `99T${groups.function ? "func" : groups.signal ? "signal" : "prop"}` : "";
              return `TYPE${groups.module}${groups.type}${groups.member}${type}99TYPE`;
            }
          );
        }
      }
    );
    return root;
  };
};

const rehypeRewriteTypelinks: RehypePlugin<[]> = () => {
  return (root: Html.Root): Html.Root => {
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

    return root;
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
  remarkPlugins: [remarkParseAtTypes, [remarkAlert, { legacyTitle: true }]],
  rehypePlugins: [
    // FIXME: incompatible types between unified/Plugin and Astro/RehypePlugin
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
