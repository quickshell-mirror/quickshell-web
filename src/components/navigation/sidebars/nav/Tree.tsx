import { type Component, Index, For } from "solid-js";
import { Accordion } from "@ark-ui/solid";

import { LinkSimple, ShevronSmallDown } from "@icons";
import type { TreeProps } from "../types";

export const Tree: Component<TreeProps> = props => {
  const { currentRoute, currentModule, currentClass, items } =
    props;

  const typeKeys = items!.types && Object.keys(items!.types);

  const tutorials =
    items!.tutorials && items!.tutorials
      ? items!.tutorials.configuration
      : null;

  return (
    <nav class="navtree">
      <Accordion.Root
        defaultValue={
          currentRoute === "types" ? ["Types"] : ["Configuration"]
        }
        collapsible
        multiple
      >
        <Accordion.Item value={"Configuration"}>
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator>
              <ShevronSmallDown class={"nav-shevron"} />
            </Accordion.ItemIndicator>
            <p>
              <a href={"/docs/configuration"}>Configuration</a>
            </p>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <For each={tutorials}>
              {item => (
                <div
                  class={`arktree-item ${currentModule === item.type ? "__current-type-doc" : ""}`}
                >
                  <a href={`/docs/configuration/${item.type}`}>
                    {item.name}
                  </a>
                </div>
              )}
            </For>
          </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item value={"Types"}>
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator>
              <ShevronSmallDown class={"nav-shevron"} />
            </Accordion.ItemIndicator>
            <p>
              <a href={"/docs/types"}>Type Definitions</a>
            </p>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Index each={typeKeys}>
              {typeKey => {
                return (
                  <Accordion.Root
                    defaultValue={
                      currentModule === typeKey()
                        ? [typeKey()]
                        : [""]
                    }
                    multiple
                    collapsible
                  >
                    <Accordion.Item
                      value={typeKey()}
                      id={typeKey()}
                      class={
                        typeKey() === currentModule
                          ? "__current-type-doc"
                          : ""
                      }
                    >
                      <Accordion.ItemTrigger
                        id={`${typeKey()}:button`}
                      >
                        <Accordion.ItemIndicator>
                          <ShevronSmallDown
                            class={"nav-shevron"}
                          />
                        </Accordion.ItemIndicator>
                        <p>
                          <a href={`/docs/types/${typeKey()}`}>
                            {typeKey()}
                          </a>
                        </p>
                      </Accordion.ItemTrigger>
                      <Accordion.ItemContent>
                        <For each={items!.types[typeKey()]}>
                          {submodule => (
                            <div
                              class={
                                currentClass === submodule.name
                                  ? "__current-type-doc"
                                  : ""
                              }
                            >
                              <a
                                href={`/docs/types/${submodule.type}/${submodule.name}`}
                              >
                                {submodule.name}
                              </a>
                            </div>
                          )}
                        </For>
                      </Accordion.ItemContent>
                    </Accordion.Item>
                  </Accordion.Root>
                );
              }}
            </Index>
          </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item
          value="QtQuick Type Reference"
          id="qtquick-reference"
        >
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator>
              <LinkSimple />
            </Accordion.ItemIndicator>
            <span
              class="link-outside"
              onMouseDown={() =>
                window.open(
                  "https://doc.qt.io/qt-6/qtquick-qmlmodule.html"
                )
              }
            >
              <a
                href="https://doc.qt.io/qt-6/qtquick-qmlmodule.html"
                target="_blank"
                rel="noreferrer"
              >
                QtQuick Types
              </a>
            </span>
          </Accordion.ItemTrigger>
        </Accordion.Item>
        <Accordion.Item
          value="Quickshell Examples"
          id="quickshell-examples"
        >
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator>
              <LinkSimple />
            </Accordion.ItemIndicator>
            <span
              class="link-outside"
              onMouseDown={() =>
                window.open(
                  "https://git.outfoxxed.me/outfoxxed/quickshell-examples"
                )
              }
            >
              <a
                href="https://git.outfoxxed.me/outfoxxed/quickshell-examples"
                target="_blank"
                rel="noreferrer"
              >
                Quickshell Examples
              </a>
            </span>
          </Accordion.ItemTrigger>
        </Accordion.Item>
      </Accordion.Root>
    </nav>
  );
};
