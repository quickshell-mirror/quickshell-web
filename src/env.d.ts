/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro-icon/empty-types" />

declare module "astro-icon/components" {
  export const Icon: typeof import("astro-icon/components").Icon;
}

interface ImportMetaEnv {
  readonly VERSION_FILE_PATH: string;
  readonly BASE_URL: string;
  readonly PRODUCTION: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// fix astro-breadcrumbs
declare module "astro-breadcrumbs" {
  interface BreadcrumbsProps {
    indexText?: string;
    mainText?: string;
    crumbs: {
      text: string;
      href: string;
    }[];
    linkTextFormat?: string;
    truncated?: boolean;
    case?:
      | "lower"
      | "upper"
      | "capitalize"
      | "title"
      | "original";
    // Add other props you use here
  }
  export const Breadcrumbs: (props: BreadcrumbsProps) => any;
  export default Breadcrumbs;
}

// fix for "?raw" imports
declare module "*?raw" {
  const content: string;
  export default content;
}
