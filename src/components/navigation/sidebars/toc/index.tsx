import { createSignal, type Component } from "solid-js";

import { Article } from "@icons";
import { Table } from "./Table";
import type { TOCProps } from "../types";
import { buildHierarchy } from "@config/io/helpers";

const TableOfContents: Component<TOCProps> = props => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { mobile, config, type } = props;

  function toggle(e: MouseEvent) {
    e.preventDefault();
    setOpen(!open());
  }

  if (!mobile) {
    return type ? (
      <Table typeTOC={type} />
    ) : (
      <Table configTOC={buildHierarchy(config!)} />
    );
  }

  return (
    <div class="toc-toggle">
      <div onclick={e => toggle(e)}>
        <Article />
      </div>
      <div class={`toc-mobile ${open() ? "shown" : ""}`}>
        {type ? (
          <Table typeTOC={type} />
        ) : (
          <Table configTOC={buildHierarchy(config!)} />
        )}
      </div>
    </div>
  );
};

export default TableOfContents;
