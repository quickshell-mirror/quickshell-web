import { promises as fs } from "node:fs";
import path from "node:path";

import type { RouteData, dirData } from "./types";

async function readSubdir(subdir: string): Promise<dirData[]> {
  const fullpath = path.join(process.cwd(), "modules", subdir);
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

export async function generateTypeData(): Promise<RouteData[]> {
  const mainDir = import.meta.env.SECRET_MODULES_PATH;

  const subdirs = await fs.readdir(mainDir, {
    withFileTypes: true,
  });
  const routes: RouteData[] = [];

  for (const subdir of subdirs) {
    const data = await readSubdir(subdir.name);
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
