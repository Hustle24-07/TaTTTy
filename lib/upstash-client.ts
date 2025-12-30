import { Search } from "@upstash/search"

const UPSTASH_URL = process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_URL;
const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_DB_UPSTASH_SEARCH_REST_READONLY_TOKEN;

export const searchClient = (UPSTASH_URL && UPSTASH_TOKEN) 
  ? new Search({ url: UPSTASH_URL, token: UPSTASH_TOKEN }) 
  : null;

export const searchIndex = searchClient?.index("search_data");