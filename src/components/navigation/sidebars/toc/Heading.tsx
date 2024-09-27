import { For, type Component } from "solid-js";

import type { ConfigTOC } from "../types";

export const Heading: Component<{
  heading: ConfigTOC;
  index: number;
}> = props => {
  const { heading, index } = props;

  return (
    <li class={`toc_heading toc_heading-${index}`}>
      <a
        class="toc_a"
        href={`#${heading.slug}`}
      >
        {heading.text}
      </a>
      {heading.subheadings.length > 0 && (
        <ul>
          <For each={heading.subheadings}>
            {subheading => (
              <Heading
                heading={subheading}
                index={subheading.depth}
              />
            )}
          </For>
        </ul>
      )}
    </li>
  );
};
