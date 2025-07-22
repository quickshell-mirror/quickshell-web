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

export interface TypeData {
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

export interface ModuleData {
  name: string;
  description: string;
  details: string;
  types: TypeData[];
}

export interface VersionData {
  name: string;
  modules: ModuleData[];
}

export interface VersionsData {
  default: string;
  versions: VersionData[];
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
  TypeData,
  ModuleData,
  VersionData,
  VersionsData,
  QMLTypeLinkObject,
};
