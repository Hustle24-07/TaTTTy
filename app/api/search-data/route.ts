import { NextResponse } from "next/server";
import { Search } from '@upstash/search';

const client = new Search({
  url: process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_URL!,
  token: process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_READONLY_TOKEN!,
});

export async function GET() {
  try {
    const index = client.index("search_data");
    const results = await index.search({ 
      query: "", 
      limit: 100 
    });
    return NextResponse.json(results || []);
  } catch (error) {
    console.error('Error listing search data:', error);
    return NextResponse.json({ error: 'Failed to fetch search data' }, { status: 500 });
  }
}

