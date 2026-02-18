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

interface QuickshellVariant {
  [key: string]: {
    name?: string;
    details: string;
    params?: QuickshellInstance[];
  };
}

interface TypeData {
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
  // FIXME: QuickshellData[]
  subtypes?: any[];
}

interface ModuleData {
  name: string;
  description: string;
  details: string;
  types: TypeData[];
}

interface VersionData {
  name: string;
  changelog?: string;
  modules: ModuleData[];
}

interface VersionsData {
  default: string;
  versions: VersionData[];
}

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
};
