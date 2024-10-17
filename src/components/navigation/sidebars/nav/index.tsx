import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  type Component,
} from "solid-js";

import { LoadingSpinner, MenuToX, XToMenu } from "@icons";
import { Tree } from "./Tree";
import type { NavProps } from "../types";

const NavComponent: Component<NavProps> = props => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { tree, mobile, routes } = props;
  let navRef: HTMLDivElement;

  if (!tree) {
    return <LoadingSpinner />;
  }

  function toggle(e: MouseEvent) {
    e.preventDefault();
    setOpen(!open());
  }

  if (!mobile) {
    return (
      <Tree
        currentRoute={tree.currentRoute}
        currentModule={tree.currentModule || null}
        currentClass={tree.currentClass || null}
        items={routes}
      />
    );
  }

  const handleClickOutside = (event: MouseEvent) => {
    const isLink = "href" in (event.target || {});
    if (
      isLink ||
      (document.body.contains(event.target as Node) &&
        !navRef.contains(event.target as Node))
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
      document.body.style.overflow = "hidden";
      document.body.classList.add("dim-content");
    } else {
      window.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "auto";
      document.body.classList.remove("dim-content");
    }
  });

  return (
    <div
      class="nav-toggle"
      ref={navRef!}
    >
      <div onclick={e => toggle(e)}>
        {open() ? (
          <MenuToX class="nav-icon" />
        ) : (
          <XToMenu class="nav-icon" />
        )}
      </div>
      <div
        id={open() ? "#qs_search" : ""}
        class={`nav-items ${open() ? "shown" : ""}`}
      >
        <Tree
          currentRoute={tree.currentRoute}
          currentModule={tree.currentModule}
          currentClass={tree.currentClass}
          items={routes}
        />
      </div>
    </div>
  );
};

export default NavComponent;
