"use server";

import { Search } from "@upstash/search";

export const fetchDescription = async (
  pathname: string
): Promise<{ description?: string; error?: string }> => {
  console.log("[fetchDescription] Fetching for pathname:", pathname);
  
  if (!pathname) {
    return { error: "No pathname provided" };
  }

  try {
    const upstash = Search.fromEnv();
    const index = upstash.index("images");
    
    const results = await index.fetch({ ids: [pathname] });
    console.log("[fetchDescription] Results:", results);

    if (!results || results.length === 0) {
      console.log("[fetchDescription] No results found");
      return { description: undefined };
    }

    const doc = results[0];
    const description = (doc?.content as { text?: string })?.text;
    console.log("[fetchDescription] Description:", description);

    return { description };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[fetchDescription] Error:", message);
    return { error: message };
  }
};
