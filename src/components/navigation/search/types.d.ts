interface SearchResult {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    image?: string;
  };
  sub_results: {
    title: string;
    url: string;
    excerpt: string;
  }[];
}

export type { SearchResult }
