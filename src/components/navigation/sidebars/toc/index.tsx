import { createSignal, onMount, type Component } from "solid-js";

import { Article } from "@icons";
import { Table } from "./Table";
import type { TOCProps } from "../types";
import { buildHierarchy } from "@config/io/helpers";

const TableOfContents: Component<TOCProps> = props => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { mobile, config, type } = props;
  let tocRef: HTMLDivElement;

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
  const handleClickOutside = (event: MouseEvent) => {
    const isLink = "href" in (event.target || {});
    if (
      isLink ||
      (document.body.contains(event.target as Node) &&
        !tocRef.contains(event.target as Node))
    ) {
      setOpen(false);
    }
  };

  onMount(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div
      class="toc-toggle"
      ref={tocRef!}
    >
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
