import { CommandGroup, CommandEmpty } from "@/components/ui/command"
import { ResultItem } from "./result-item"

type ResultListProps = {
  query: string
  results: any[]
  allData: any[]
  loading: boolean
}

export function ResultList({ query, results, allData, loading }: ResultListProps) {
  if (loading) {
    return null
  }

  return (
    <>
      {query && results.length > 0 && (
        <CommandGroup>
          {results.map((result) => (
            <ResultItem key={result.id} result={result} />
          ))}
        </CommandGroup>
      )}

      {!query && allData.length > 0 && (
        <CommandGroup>
          {allData.map((result) => (
            <ResultItem key={result.id} result={result} />
          ))}
        </CommandGroup>
      )}

      {!loading && !query && allData.length === 0 && (
        <CommandEmpty />
      )}

      {!loading && query && results.length === 0 && (
        <CommandEmpty />
      )}
    </>
  )
}

