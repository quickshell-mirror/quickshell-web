import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  type Component,
  type JSXElement,
} from "solid-js";

import { MenuToX, XToMenu } from "@icons";

export interface SidebarContent {
  children: JSXElement;
}

const NavComponent: Component<SidebarContent> = props => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { children } = props;
  let navRef: HTMLDivElement;

  function toggle(e: MouseEvent) {
    e.preventDefault();
    setOpen(!open());
  }

  const handleClickOutside = (event: MouseEvent) => {
    const isLink = "href" in (event.target || {});
    const isInBody = document.body.contains(event.target as Node);
    if (
      isLink ||
      !isInBody ||
      (isInBody && !navRef.contains(event.target as Node))
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
      document.body.classList.add("overflow-nav");
      document.body.classList.add("dim-content-nav");
    } else {
      window.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("overflow-nav");
      document.body.classList.remove("dim-content-nav");
    }
  });

  return (
    <div
      class="nav-toggle"
      ref={navRef!}
    >
      <div onclick={e => toggle(e)}>
        <MenuToX class={`nav-icon ${open() ? "active" : ""}`} />
        <XToMenu class={`nav-icon ${!open() ? "active" : ""}`} />
      </div>
      <div
        id={open() ? "#qs_search" : ""}
        class={`nav-items ${open() ? "shown" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default NavComponent;
