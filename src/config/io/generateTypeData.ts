import { promises as fs } from "node:fs";
import path from "node:path";

import type { VersionsData, ModuleData } from "@_types";

async function readModulesData(
  basePath: string
): Promise<ModuleData[]> {
  const moduleDirs = await fs.readdir(basePath);

  const modules = await Promise.all(
    moduleDirs.map(async moduleDir => {
      const modulePath = path.join(basePath, moduleDir);

      const indexPromise = async () => {
        const indexPath = path.join(modulePath, "index.json");
        const indexContent = await fs.readFile(indexPath, "utf8");
        return JSON.parse(indexContent);
      };

      const typeNames = (await fs.readdir(modulePath)).filter(
        name => name !== "index.json"
      );
      const typePromises = typeNames.map(async fileName => {
        const typePath = path.join(modulePath, fileName);
        const fileContent = await fs.readFile(typePath, "utf8");
        return JSON.parse(fileContent);
      });

      const [index, ...types] = await Promise.all([
        indexPromise(),
        ...typePromises,
      ]);

      return {
        name: index.name,
        description: index.description,
        details: index.details,
        types,
      };
    })
  );

  return modules;
}

async function readVersionsData(): Promise<VersionsData> {
  const versionsPath = import.meta.env.VERSION_FILE_PATH;

  if (!versionsPath || versionsPath === "") {
    throw new Error(
      "Cannot generate types, missing VERSION_FILE_PATH"
    );
  }

  const resolvedPath = path.join(process.cwd(), versionsPath);
  console.log(resolvedPath);
  const content = await fs.readFile(versionsPath, "utf8");
  const data = JSON.parse(content);

  const versions = await Promise.all(
    data.versions.map(
      async (d: {
        name: string;
        changelog?: string;
        types: any;
      }) => ({
        name: d.name,
        changelog: d.changelog
          ? await fs.readFile(d.changelog, "utf8")
          : undefined,
        modules: await readModulesData(d.types),
      })
    )
  );

  return {
    versions,
    default: data.default,
  };
}

let globalVersionsData: Promise<VersionsData>;

export function getVersionsData(): Promise<VersionsData> {
  if (!globalVersionsData) {
    globalVersionsData = readVersionsData();
  }

  return globalVersionsData;
}

export async function getModulesData(): Promise<ModuleData[]> {
  const versions = await getVersionsData();
  return versions.versions.find(v => v.name === versions.default)!
    .modules;
}
