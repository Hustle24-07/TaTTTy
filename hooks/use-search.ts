"use client"

import { useState, useEffect } from "react"
import { searchIndex } from "@/lib/upstash-client"

export function useSearch(query: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      if (!query || !searchIndex) {
        setResults([])
        return
      }
      
      setLoading(true)
      try {
        const result = await searchIndex.search({ 
          query, 
          limit: 10,
          reranking: true 
        })
        setResults(result)
      } catch (err) {
        console.error("Search error:", err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return { results, loading, hasConfig: !!searchIndex }
}