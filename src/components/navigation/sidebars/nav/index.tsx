import { createSignal, type Component } from "solid-js";

import { LoadingSpinner, MenuToX, XToMenu } from "@icons";
import { Tree } from "./Tree";
import type { NavProps } from "../types";

const NavComponent: Component<NavProps> = props => {
  const [open, setOpen] = createSignal<boolean>(false);
  const { tree, mobile, routes } = props;

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

  return (
    <div class="nav-toggle">
      <div onclick={e => toggle(e)}>
        {open() ? (
          <MenuToX class="nav-icon" />
        ) : (
          <XToMenu class="nav-icon" />
        )}
      </div>
      <div class={`nav-items ${open() ? "shown" : ""}`}>
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
