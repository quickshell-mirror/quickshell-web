import {
  createResource,
  createSignal,
  type Component,
} from "solid-js";

import type { SearchResult } from "./types";
import SearchModal from "./SearchModal";

const pagefind = await import("@dist/pagefind/pagefind.js");
pagefind.init();

async function PagefindSearch(query: string) {
  const search = await pagefind.search(query);
  const resultdata: SearchResult[] = [];
  for (const result of search.results) {
    const data = await result.data();
    resultdata.push(data);
  }
  return resultdata;
}

const SearchComponent: Component = () => {
  let modal!: HTMLElement;
  const [query, setQuery] = createSignal("");
  const [results, { refetch }] = createResource(
    query,
    PagefindSearch
  );

  function handleSearch(value: string) {
    setQuery(value);
    refetch();
    console.log(results());
  }

  return (
    <div class="search">
      <input
        id="search-input"
        type="text"
        role="searchbox"
        incremental
        value={query()}
        placeholder="Search"
        onChange={e => handleSearch(e.target.value)}
      //onfocusout={() => setQuery("")}
      />{" "}
      {!results.loading && results() && results()!.length > 0 ? (
        <SearchModal
          results={results()!}
          ref={modal}
        />
      ) : null}
    </div>
  );
};

export default SearchComponent;
