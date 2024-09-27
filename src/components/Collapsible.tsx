import { Collapsible } from "@ark-ui/solid";
import type { Component, JSX } from "solid-js";
import { CaretCircleRight } from "@icons";

export const DocsCollapsible: Component<{
  title: string;
  children: JSX.Element;
}> = props => {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>
        <CaretCircleRight />
        {props.title}
      </Collapsible.Trigger>
      <Collapsible.Content>{props.children}</Collapsible.Content>
    </Collapsible.Root>
  );
};
