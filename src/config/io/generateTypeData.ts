import { promises as fs } from "node:fs";
import path from "node:path";

import type { RouteData, dirData } from "./types";

async function readSubdir(basePath: string, subdir: string): Promise<dirData[]> {
  const fullpath = path.join(basePath, subdir);
  const filenames = await fs.readdir(fullpath);

  const data = await Promise.all(
    filenames.map(async filename => {
      const filepath = path.join(fullpath, filename);
      const content = await fs.readFile(filepath, "utf8");
      const data = JSON.parse(content);
      if (typeof data.module === "undefined") {
        data.module = "index";
        data.contains = filenames
          .filter(filename => filename !== "index.json")
          .map(filename => filename.replace(".json", ""));
      }
      const returnValue = {
        fullpath: path.join(fullpath, filename),
        filename: filename.replace(".json", ""),
        category: subdir,
        data: data,
      };
      return returnValue;
    })
  );
  return data;
}

async function generateTypeData(basePath: string): Promise<RouteData[]> {
  const subdirs = await fs.readdir(basePath, {
    withFileTypes: true,
  });
  const routes: RouteData[] = [];

  for (const subdir of subdirs) {
    const data = await readSubdir(basePath, subdir.name);
    const returnValue = data.map(entry => {
      return {
        type: entry.category,
        name: entry.filename,
        path: entry.fullpath,
        data: entry.data,
      };
    });
    routes.push(...returnValue);
  }
  return routes;
}

async function generateVersionsData(): Promise<VersionsData> {
  const versionsPath = import.meta.env.VERSION_FILE_PATH;

  if (!versionsPath || versionsPath === "") {
    throw new Error(
      "Cannot generate types, missing VERSION_FILE_PATH"
    );
  }

  const content = await fs.readFile(versionsPath, "utf8");
  const data = JSON.parse(content);

  const versions = await Promise.all(data.versions.map(async d => ({
    name: d.name,
    modules: await generateTypeData(d.types),
  })))

  return {
    versions,
    default: data.default,
  }
}

let globalVersionsData: Promise<VersionsData>;

export function getVersionsData(): Promise<VersionsData> {
  if (!globalVersionsData) {
    globalVersionsData = generateVersionsData();
  }

  return globalVersionsData;
}

export async function getTypeData(): RouteData[] {
  const versions = await getVersionsData();
  return versions.versions.find(v => v.name == versions.default).modules;
}
