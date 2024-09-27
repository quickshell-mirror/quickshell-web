import { For, type Component } from "solid-js";
import type { SearchResult } from "./types";
import {
  getIconForLink,
  getQMLTypeLink,
  getQMLTypeLinkObject,
} from "@src/config/io/helpers";

const SearchModal: Component<{
  results: SearchResult[];
}> = props => {
  const { results } = props;
  const linkRegex = /TYPE99(\w+.)99TYPE/g;

  return (
    <div
      id="search-modal"
      class="search-output"
    >
      <For each={results}>
        {result => {
          let excerpt = result.excerpt;
          const linkMatch = [...excerpt.matchAll(linkRegex)];
          for (const match of linkMatch) {
            const unparsed = match[1];
            const linkObject = getQMLTypeLinkObject(unparsed);
            const linkParsed = getQMLTypeLink(linkObject);
            const icon = linkObject.mtype
              ? getIconForLink(linkObject.mtype, false)
              : "";
            const bracketString = getIconForLink("func", false);
            const newString = `<span class="type${linkObject.mtype}-link typedata-link">${icon}<a href=${linkParsed}>${linkObject.mname || linkObject.name}</a>${linkObject.mtype === "signal" ? bracketString : ""}</span>`;
            excerpt = excerpt.replace(match[0], newString);
          }
          excerpt = `${excerpt}...`;
          return (
            <div class="search-output_item">
              <h3 class="search-output_heading">
                <a href={result.url}>{result.meta.title}</a>
              </h3>
              <section
                class="search-output_excerpt"
                innerHTML={excerpt}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default SearchModal;
