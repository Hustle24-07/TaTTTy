import { Search } from "@upstash/search";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pathname } = await request.json();

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 });
    }

    const upstash = Search.fromEnv();
    const index = upstash.index("images");

    const results = await index.fetch({ ids: [pathname] });

    if (!results || results.length === 0) {
      return NextResponse.json({ description: null });
    }

    const doc = results[0];
    const description = (doc?.content as { text?: string })?.text;

    return NextResponse.json({ description });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
