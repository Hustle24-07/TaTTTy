"use server";

import { Search } from '@upstash/search';

const client = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

export async function getTatttyStyles() {
  try {
    const index = client.index("search_data");
    
    const results = await index.search({
      query: "",
      limit: 160
    });
    
    return results.map(r => r.metadata?.style_name).filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
}

export async function getTatttyColors() {
  try {
    const index = client.index("search_data");
    
    const results = await index.search({
      query: "",
      limit: 160
    });
    
    return results.map(r => r.metadata?.color_name).filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}
