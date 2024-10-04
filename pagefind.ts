import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { dirname, relative } from "node:path";

export default function pagefind(): AstroIntegration {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const targetDir = fileURLToPath(dir);
        const cwd = dirname(fileURLToPath(import.meta.url));
        const relativeDir = relative(cwd, targetDir);
        return new Promise<void>(resolve => {
          spawn(
            "yarn dlx",
            ["-q", "pagefind", "--site", relativeDir],
            {
              stdio: "inherit",
              shell: true,
              cwd,
            }
          ).on("close", () => resolve());
        });
      },
    },
  };
}
