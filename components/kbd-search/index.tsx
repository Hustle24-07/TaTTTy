"use client"

import * as React from "react"
import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command"
import { useKeyboardShortcut } from "./kbd-shortcut"
import { useSearch } from "./use-search"
import { SearchInput } from "./search-input"
import { LoadingState } from "./loading-state"
import { ResultList } from "./result-list"

export function KbdInputGroup() {
  const [open, setOpen] = React.useState(false)
  const { query, setQuery, results, allData, loading } = useSearch(open)

  useKeyboardShortcut(setOpen)

  return (
    <>
      <SearchInput onOpen={() => setOpen(true)} />
      <CommandDialog 
        open={open} 
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) {
            setQuery("")
          }
        }}
        title=""
        description=""
      >
        <CommandInput 
          placeholder="" 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading ? (
            <LoadingState />
          ) : (
            <ResultList query={query} results={results} allData={allData} loading={loading} />
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
