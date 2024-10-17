import {
  createEffect,
  createSignal,
  onMount,
  onCleanup,
  type Component,
} from "solid-js";

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
    const isInBody = document.body.contains(event.target as Node);
    if (
      isLink ||
      !isInBody ||
      (isInBody && !tocRef.contains(event.target as Node))
    ) {
      setOpen(false);
    }
  };

  onMount(() => {
    onCleanup(() => {
      window.removeEventListener("click", handleClickOutside);
    });
  });

  createEffect(() => {
    if (open()) {
      window.addEventListener("click", handleClickOutside);
      document.body.classList.add("overflow-toc");
      document.body.classList.add("dim-content-toc");
    } else {
      window.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "auto";
      document.body.classList.remove("overflow-toc");
      document.body.classList.remove("dim-content-toc");
    }
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
