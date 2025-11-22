/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly VERSION_FILE_PATH: string;
  readonly BASE_URL: string;
  readonly PRODUCTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export type { ImportMeta };
