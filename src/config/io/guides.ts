import {
  type CollectionEntry,
  getCollection,
} from "astro:content";
import { getVersionsData } from "@config/io/generateTypeData";

// load latest version of each page for version
async function buildGuideCollection(
  version: string
): Promise<CollectionEntry<"guide">[]> {
  const { versions } = await getVersionsData();
  const guidePages = await getCollection("guide");

  const pages: { [key: string]: CollectionEntry<"guide"> } = {};

  for (const currentVersion of versions.toReversed()) {
    for (const page of guidePages) {
      let [guideVersion, id] = page.id.split("/");
      guideVersion = guideVersion.replaceAll("_", ".");
      id = id ?? "index";
      if (guideVersion !== currentVersion.name) continue;

      pages[id] = { ...page, id };
    }

    if (currentVersion.name === version) break;
  }

  return Object.values(pages);
}

let guideCollections: {
  [key: string]: Promise<CollectionEntry<"guide">[]>;
} = {};

async function getGuideCollection(
  version: string
): Promise<CollectionEntry<"guide">[]> {
  if (!(version in guideCollections)) {
    guideCollections[version] = buildGuideCollection(version);
  }

  return guideCollections[version];
}

export { getGuideCollection };
