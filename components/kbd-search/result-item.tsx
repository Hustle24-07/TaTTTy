import { FileText } from "lucide-react"
import { CommandItem } from "@/components/ui/command"
import { getDisplayText } from "./get-display-text"

type ResultItemProps = {
  result: any
}

export function ResultItem({ result }: ResultItemProps) {
  return (
    <CommandItem key={result.id} value={result.id}>
      <FileText className="mr-2 h-4 w-4" />
      <span>{getDisplayText(result)}</span>
    </CommandItem>
  )
}

