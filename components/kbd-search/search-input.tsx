import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { SearchIcon } from "lucide-react"

type SearchInputProps = {
  onOpen: () => void
}

export function SearchInput({ onOpen }: SearchInputProps) {
  return (
    <InputGroup onClick={onOpen} className="w-full sm:max-w-md h-10 cursor-pointer">
      <InputGroupInput placeholder="" className="pointer-events-none" readOnly />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

