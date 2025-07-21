//#FIXME fuseConfig.ts
// --

// generateSearchLists.ts
interface SearchLists {
  slug: string;
  link: string;
  summary: string;
}
// --

// generateTypeData.ts
interface QuickshellBase {
  type: string;
  module: string;
  name: string;
}

interface QuickshellInstance {
  name?: string;
  type: {
    gadget?: QuickshellGadget;
    type: string;
    module: string;
    name: string;
    of?: QuickshellBase;
  };
  details?: string;
  flags?: string[];
}

interface QuickshellGadget {
  [key: string]: QuickshellInstance;
}

interface QuickshellProps {
  [key: string]: QuickshellInstance;
}

interface QuickshellFunction {
  ret: QuickshellInstance;
  name: string;
  id: string;
  details: string;
  params: QuickshellInstance[];
}

interface QuickshellSignal {
  [key: string]: {
    name: string;
    details: string;
    params: QuickshellInstance[];
  };
}

export interface QuickshellVariant {
  [key: string]: {
    name?: string;
    details: string;
    params?: QuickshellInstance[];
  };
}

export interface QuickshellData {
  type: string;
  module: string;
  name: string;
  description: string;
  details: string;
  flags?: string[];
  contains?: string[];
  super?: QuickshellBase;
  properties?: QuickshellProps;
  functions?: QuickshellFunction[];
  signals?: QuickshellSignal;
  variants?: QuickshellVariant;
  subtypes?: QuickshellData[];
}

export interface RouteData {
  // priority 1: Quickshell, Quickshell.Io, etc.
  type: string;
  // priority 1.1: entry name (e.g. DataStreamParser)
  name: string;
  // path to json
  path: string;
  // data content of the route
  data: QuickshellData;
}

export interface VersionData {
  name: string;
  modules: RouteData[];
}

export interface VersionsData {
  default: string;
  versions: VersionData[];
}

export interface dirData {
  fullpath: string;
  filename: string;
  category: string;
  data: QuickshellData;
}
// --

// helpers.ts
interface QMLTypeLinkObject {
  type: string;
  module?: string;
  name?: string;
  mtype?: string;
  mname?: string;
}
// --

export type {
  QuickshellBase,
  QuickshellInstance,
  QuickshellGadget,
  QuickshellProps,
  QuickshellFunction,
  QuickshellSignal,
  QuickshellVariant,
  QuickshellData,
  RouteData,
  dirData,
  QMLTypeLinkObject,
};
