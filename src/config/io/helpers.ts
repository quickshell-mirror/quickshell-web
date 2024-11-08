import {
  //  Flag,
  PowerCord,
  Tag,
  FourDiamonds,
  RoundBrackets,
  // @icons breaks when imported indirectly from astro.config.mjs
} from "../../components/icons.tsx";
import type {
  ConfigHeading,
  ConfigTOC,
  GroupedRoutes,
} from "@components/navigation/sidebars/types";
import type { QMLTypeLinkObject, RouteData } from "./types";

export function buildHierarchy(headings: ConfigHeading[]) {
  const toc: ConfigTOC[] = [];
  const parentHeadings = new Map();

  if (!headings || headings.length === 0) {
    return toc;
  }

  for (const h of headings) {
    const heading = { ...h, subheadings: [] };
    parentHeadings.set(heading.depth, heading);

    if (heading.depth === 1) {
      toc.push(heading);
    } else {
      parentHeadings
        .get(heading.depth - 1)
        .subheadings.push(heading);
    }
  }
  return toc;
}

export function groupRoutes(routes: RouteData[]): GroupedRoutes {
  const froutes = routes.filter(route => route.name !== "index");
  const defaultValue = {
    tutorials: {
      configuration: [
        { name: "Getting Started", type: "getting-started" },
        { name: "Intro", type: "intro" },
        { name: "Positioning", type: "positioning" },
        { name: "QML Overview", type: "qml-overview" },
      ],
    },
    types: {},
  };
  return froutes.reduce<GroupedRoutes>((acc, route) => {
    if (!acc.tutorials) {
      acc.tutorials = {
        configuration: [
          { name: "Getting Started", type: "getting-started" },
          { name: "Intro", type: "intro" },
          { name: "Positioning", type: "positioning" },
          { name: "QML Overview", type: "qml-overview" },
        ],
      };
    }

    if (!acc.types) acc.types = {};

    if (!acc.types[route.type]) {
      acc.types[route.type] = [];
    }

    acc.types[route.type].push({
      name: route.name,
      type: route.type,
    });
    return acc;
  }, defaultValue);
}

export function getQMLTypeLinkObject(unparsed: string) {
  const isLocal = unparsed.startsWith("MQS_") ? "local" : false;
  const isQT = unparsed.startsWith("MQT_") ? "qt" : false;
  const index = isLocal || isQT || "self";

  const hashMap = {
    local: () => {
      const linkSplit = unparsed.slice(4).split("99");
      const hasSubmodule = linkSplit[0].indexOf("_") !== -1;
      const linkModule = hasSubmodule
        ? linkSplit[0].replace("_", ".")
        : linkSplit[0];
      const linkObj: QMLTypeLinkObject = {
        type: "local",
        module: linkModule.replace("_", "."),
        name: linkSplit[1].slice(1),
      };
      if (linkSplit.length > 2) {
        linkObj.mname = linkSplit[2].slice(1);
        linkObj.mtype = linkSplit[3].slice(1);
      }
      return linkObj;
    },
    qt: () => {
      const linkSplit = unparsed.slice(4).split("99");
      const hasSubmodule = linkSplit[0].indexOf("_") !== -1;
      const linkModule = hasSubmodule
        ? linkSplit[0].replace("_", "-")
        : linkSplit[0];
      const linkObj: QMLTypeLinkObject = {
        type: "qt",
        module: linkModule.replace("_", "-"),
        name: linkSplit[1].slice(1),
      };
      if (linkSplit.length > 2) {
        linkObj.mname = linkSplit[2].slice(1);
        linkObj.mtype = linkSplit[3].slice(1);
      }
      return linkObj;
    },
    self: () => {
      const linkSplit = unparsed.slice(1).split("99");
      const linkObj: QMLTypeLinkObject = {
        type: "self",
        mname: linkSplit[0],
        mtype: linkSplit[1].slice(1),
      };
      return linkObj;
    },
  };

  return hashMap[index]();
}

export function getQMLTypeLink({
  type,
  module,
  name,
  mtype,
  mname,
}: QMLTypeLinkObject) {
  if (type === "unknown") {
    return "#unknown";
  }
  const qtStart = "https://doc.qt.io/qt-6/";
  const localStart = "/docs/types";

  const hashMap = {
    local: () => {
      const isSpecific = mname ? `#${mname}` : "";
      const localLink = `${localStart}/${module}/${name}${isSpecific}`;
      return localLink;
    },
    qt: () => {
      const isSpecific = mname ? `#${mname}-${mtype === "func" ? "method" : mtype}` : "";
      const qtLink = `${qtStart}${module!.toLowerCase().replace(".", "-")}-${name!.toLowerCase()}.html${isSpecific}`;
      return qtLink;
    },
    self: () => {
      const selfLink = `#${mname}`;
      return selfLink;
    },
  };

  if (!type) {
    type = "self";
  }

  return hashMap[type as keyof typeof hashMap]();
}

export function getIconForLink(mtype: string, isJsx: boolean) {
  const TagIconString: string = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class=""
    >
      <title>Go to</title>
      <path
        fill="currentColor"
        d="M246.66 123.56L201 55.13A15.94 15.94 0 0 0 187.72 48H40a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h147.72a16 16 0 0 0 13.28-7.12l45.63-68.44a8 8 0 0 0 .03-8.88M187.72 192H40V64h147.72l42.66 64Z"
      />
    </svg>`;
  const RoundBracketsIconString: string = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class=""
    >
      <title>Go to</title>
      <path
        fill="currentColor"
        d="M40 128c0 58.29 34.67 80.25 36.15 81.16a8 8 0 0 1-8.27 13.7C66.09 221.78 24 195.75 24 128s42.09-93.78 43.88-94.86a8 8 0 0 1 8.26 13.7C74.54 47.83 40 69.82 40 128m148.12-94.86a8 8 0 0 0-8.27 13.7C181.33 47.75 216 69.71 216 128s-34.67 80.25-36.12 81.14a8 8 0 0 0 8.24 13.72C189.91 221.78 232 195.75 232 128s-42.09-93.78-43.88-94.86"
      />
    </svg>`;
  const PowerCordIconString: string = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class=""
    >
      <title>Go to</title>
      <path
        fill="currentColor"
        d="M149.66 138.34a8 8 0 0 0-11.32 0L120 156.69L99.31 136l18.35-18.34a8 8 0 0 0-11.32-11.32L88 124.69l-18.34-18.35a8 8 0 0 0-11.32 11.32l6.35 6.34l-23.32 23.31a32 32 0 0 0 0 45.26l5.38 5.37l-28.41 28.4a8 8 0 0 0 11.32 11.32l28.4-28.41l5.37 5.38a32 32 0 0 0 45.26 0L132 191.31l6.34 6.35a8 8 0 0 0 11.32-11.32L131.31 168l18.35-18.34a8 8 0 0 0 0-11.32m-52.29 65a16 16 0 0 1-22.62 0l-22.06-22.09a16 16 0 0 1 0-22.62L76 135.31L120.69 180Zm140.29-185a8 8 0 0 0-11.32 0l-28.4 28.41l-5.37-5.38a32.05 32.05 0 0 0-45.26 0L124 64.69l-6.34-6.35a8 8 0 0 0-11.32 11.32l80 80a8 8 0 0 0 11.32-11.32l-6.35-6.34l23.32-23.31a32 32 0 0 0 0-45.26l-5.38-5.37l28.41-28.4a8 8 0 0 0 0-11.32m-34.35 79L180 120.69L135.31 76l23.32-23.31a16 16 0 0 1 22.62 0l22.06 22a16 16 0 0 1 0 22.68Z"
      />
    </svg>`;
  const FourDiamondsIconString: string = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class=""
    >
      <title>Go to</title>
      <path
        fill="currentColor"
        d="M122.34 109.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32ZM128 35.31L156.69 64L128 92.69L99.31 64Zm5.66 111a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32ZM128 220.69L99.31 192L128 163.31L156.69 192Zm109.66-98.35l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32M192 156.69L163.31 128L192 99.31L220.69 128Zm-82.34-34.35l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32M64 156.69L35.31 128L64 99.31L92.69 128Z"
      />
    </svg>`;
  const map = {
    prop: () => (isJsx ? Tag : TagIconString),
    func: () => (isJsx ? RoundBrackets : RoundBracketsIconString),
    signal: () => (isJsx ? PowerCord : PowerCordIconString),
    variant: () =>
      isJsx ? FourDiamonds : FourDiamondsIconString,
  };

  return map[mtype as keyof typeof map]();
}
