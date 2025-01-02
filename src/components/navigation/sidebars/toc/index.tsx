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
  const [clientWidth, setClientWidth] = createSignal<number>(0);
  const [screenWidth, setScreenWidth] = createSignal<number>(0);
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
    setClientWidth(document.body.clientWidth);
    setScreenWidth(window.outerWidth);
    onCleanup(() => {
      window.removeEventListener("click", handleClickOutside);
    });
  });

  createEffect(() => {
    if (clientWidth() !== document.body.clientWidth) {
      setClientWidth(document.body.clientWidth);
    }
    if (screenWidth() !== window.outerWidth) {
      setScreenWidth(window.outerWidth);
    }

    if (open()) {
      window.addEventListener("click", handleClickOutside);
      document.body.classList.add("overflow-toc");
      document.body.classList.add("dim-content-toc");

      // onsetter
      const header = document.getElementsByClassName(
        "header"
      )[0]! as HTMLElement;
      const bodyOffset = screenWidth() - clientWidth();
      document.body.style.width = `${screenWidth() - bodyOffset}px`;
      header.style.width = `${screenWidth() - bodyOffset}px`;
    } else {
      window.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("overflow-toc");
      document.body.classList.remove("dim-content-toc");

      // offsetter
      const header = document.getElementsByClassName(
        "header"
      )[0]! as HTMLElement;
      document.body.style.width = "";
      header.style.width = "";
    }
  });

  return (
    <div
      class="toc-toggle"
      ref={tocRef!}
      id="toc-toggle"
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
