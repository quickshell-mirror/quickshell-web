import {
  type ParentComponent,
  onMount,
  createSignal,
  onCleanup,
} from "solid-js";
import { Hashtag } from "@icons";

const MD_Title: ParentComponent<{ titleVar: number }> = props => {
  const [_, setMounted] = createSignal<boolean>(false);

  onMount(() => {
    setMounted(true);
    onCleanup(() => {
      setMounted(false);
    });
  });

  return (
    <div class={`heading heading-${props.titleVar}`}>
      <span class="heading-hashtag">
        <Hashtag />
      </span>
      {props.children}
      <hr />
    </div>
  );
};

export default MD_Title;
