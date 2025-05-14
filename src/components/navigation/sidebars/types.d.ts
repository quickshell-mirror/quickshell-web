// Left
export interface Item {
  name: string;
  type: string;
}

export interface GroupedRoutes {
  types: { [key: string]: Item[] };
}

export interface TreeProps {
  items: GroupedRoutes;
  currentRoute?: string;
  currentModule: string | null;
  currentClass: string | null;
}

// Right
export interface TOCProps {
  config?: ConfigHeading[];
  type?: TypeTableProps;
  mobile: boolean;
}

// -- Config
export interface ConfigHeading {
  slug: string;
  text: string;
  depth: number;
}

export interface ConfigTOC {
  slug: string;
  text: string;
  depth: number;
  subheadings: ConfigTOC[];
}

export interface ConfigTableProps {
  content: {
    title: string;
  };
  headings: ConfigHeading[];
  frontmatter?: {
    title: string;
    description: string;
  };
}

// -- Types
export interface TypeTOC {
  properties: string[] | null;
  functions: string[] | null;
  signals: string[] | null;
  variants: string[] | null;
}
