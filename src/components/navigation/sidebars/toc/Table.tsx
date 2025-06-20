import { type Component, For } from "solid-js";

import type { TypeTOC, ConfigTOC } from "../types";
import {
  LoadingSpinner,
  Tag,
  RoundBrackets,
  PowerCord,
  FourDiamonds,
} from "@icons";
import { Heading } from "./Heading";

export const Table: Component<{
  title?: string;
  typeTOC?: TypeTOC;
  configTOC?: ConfigTOC[];
}> = props => {
  const { title, typeTOC, configTOC } = props;

  if (configTOC) {
    return (
      <div class="toc-content">
        {title && <>
          <p>{title}</p>
          <hr/>
        </>}
        <For each={configTOC}>
          {heading => (
            <Heading
              heading={heading}
              index={0}
            />
          )}
        </For>
      </div>
    );
  }

  if (!typeTOC) {
    return <LoadingSpinner />;
  }

  return (
    <nav class="toc-content">
      {typeTOC.properties ? (
        <ul class="types-list props-list">
          <For each={typeTOC.properties}>
            {prop => (
              <li class="types-item props-item">
                <a
                  class="type-anchor"
                  href={`#prop-${prop}`}
                >
                  <Tag />
                  {prop}
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : null}
      {typeTOC.functions ? (
        <ul class="types-list funcs-list">
          <For each={typeTOC.functions}>
            {func => (
              <li class="types-item func-item">
                <a
                  class="type-anchor"
                  href={`#func-${func}`}
                >
                  <RoundBrackets />
                  {func}
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : null}
      {typeTOC.signals ? (
        <ul class="types-list signals-list">
          <For each={typeTOC.signals}>
            {signal => (
              <li class="types-item signals-item">
                <a
                  class="type-anchor"
                  href={`#signal-${signal}`}
                >
                  <PowerCord />
                  {signal}
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : null}
      {typeTOC.variants ? (
        <ul class="types-list vars-list">
          <For each={typeTOC.variants}>
            {variant => (
              <li class="types-item vars-item">
                <a
                  class="type-anchor"
                  href={`#variant-${variant}`}
                >
                  <FourDiamonds />
                  {variant}
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : null}
    </nav>
  );
};
