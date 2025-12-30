"use client"

import * as React from "react"
import { getDisplayText } from "./get-display-text"

export function useSearch(open: boolean) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [allData, setAllData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      const fetchAll = async () => {
        setLoading(true)
        setAllData([])
        try {
          const response = await fetch("/api/search-data")
          if (!response.ok) {
            throw new Error("Failed to fetch")
          }
          const data = await response.json()
          setAllData(data || [])
        } catch (error) {
          setAllData([])
        } finally {
          setLoading(false)
        }
      }
      fetchAll()
    } else {
      setAllData([])
      setResults([])
    }
  }, [open])

  React.useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const filterData = () => {
      if (allData.length === 0) {
        setResults([])
        return
      }
      try {
        const filtered = allData.filter((item) => {
          const text = getDisplayText(item).toLowerCase()
          return text.includes(query.toLowerCase())
        })
        setResults(filtered)
      } catch (error) {
        setResults([])
      }
    }

    const debounce = setTimeout(filterData, 300)
    return () => clearTimeout(debounce)
  }, [query, allData])

  return {
    query,
    setQuery,
    results,
    allData,
    loading
  }
}
