"use client";

import { SearchBar } from "@upstash/search-ui";
import "@upstash/search-ui/dist/index.css";
import { Search } from "@upstash/search";
import { FileText, SearchIcon } from "lucide-react";

// Initialize the client with the "Data" index credentials
// We use the NEXT_PUBLIC_ prefix to make these available on the client side
// Note: The user needs to ensure these variables are prefixed in .env.local
const client = new Search({
  url: process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_URL || "",
  token: process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_READONLY_TOKEN || "",
});

// Define the index
const index = client.index("data");

export function GlobalSearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <SearchBar.Dialog>
        <SearchBar.DialogTrigger className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 border border-input px-4 py-2 inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          <span className="hidden lg:inline-flex">Search data...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </SearchBar.DialogTrigger>

        <SearchBar.DialogContent>
          <SearchBar.Input placeholder="Search styles, meanings, colors..." />
          <SearchBar.Results
            searchFn={async (query) => {
              if (!query) return [];
              try {
                const results = await index.search(query, {
                  limit: 10,
                });
                return results;
              } catch (error) {
                console.error("Search error:", error);
                return [];
              }
            }}
          >
            {(result) => (
              <SearchBar.Result
                value={result.id}
                key={result.id}
                onSelect={() => {
                  console.log("Selected:", result);
                  // Handle selection (navigation, etc.)
                }}
              >
                <SearchBar.ResultIcon>
                  <FileText className="text-gray-600 h-4 w-4" />
                </SearchBar.ResultIcon>

                <SearchBar.ResultContent>
                  <SearchBar.ResultTitle>
                    {/* @ts-ignore - content structure varies */}
                    {result.data || result.id}
                  </SearchBar.ResultTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {/* @ts-ignore - metadata access */}
                    {result.metadata?.type || "Result"}
                  </p>
                </SearchBar.ResultContent>
              </SearchBar.Result>
            )}
          </SearchBar.Results>
        </SearchBar.DialogContent>
      </SearchBar.Dialog>
    </div>
  );
}
