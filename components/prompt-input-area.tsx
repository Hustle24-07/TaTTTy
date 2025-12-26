"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconArrowUp,
  IconCloud,
  IconPhotoScan,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

export interface Suggestion {
  icon: ReactNode;
  text: string;
}

export interface PromptInputAreaProps {
  suggestions?: Suggestion[];
  placeholder?: string;
  modelName?: string;
  modelDescription?: string;
}

export function PromptInputArea({
  suggestions = [],
  placeholder = "Ask anything",
  modelName = "Model Name",
  modelDescription = "Description",
}: PromptInputAreaProps) {
  const renderMaxBadge = () => (
    <div className="flex h-[14px] items-center gap-1.5 rounded border border-border px-1 py-0">
      <span
        className="text-[9px] font-bold uppercase"
        style={{
          background:
            "linear-gradient(to right, rgb(129, 161, 193), rgb(125, 124, 155))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MAX
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-[calc(42rem-5rem)]">
      <div className="flex min-h-[120px] flex-col rounded-2xl cursor-text bg-card border border-border shadow-lg">
        <div className="flex-1 relative overflow-y-auto max-h-[258px]">
          <Textarea
            placeholder={placeholder}
            className="w-full border-0 p-3 transition-[padding] duration-200 ease-in-out min-h-[48.4px] outline-none text-[16px] text-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! whitespace-pre-wrap break-words"
          />
        </div>

        <div className="flex min-h-[40px] items-center gap-2 p-2 pb-1">
          <div className="flex aspect-1 items-center gap-1 rounded-full bg-muted p-1.5 text-xs">
            <IconCloud className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="relative flex items-center">
            <Select defaultValue="placeholder">
              <SelectTrigger className="w-fit border-none bg-transparent! p-0 text-sm text-muted-foreground hover:text-foreground focus:ring-0 shadow-none">
                <SelectValue>
                  <div className="flex items-center gap-1">
                    <span>{modelName}</span>
                    {renderMaxBadge()}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">
                  <div className="flex items-center gap-1">
                    <span>{modelName}</span>
                    {renderMaxBadge()}
                  </div>
                  <span className="text-muted-foreground block text-xs">
                    {modelDescription}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground transition-all duration-100"
              title="Attach images"
            >
              <IconPhotoScan className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-full transition-all duration-100 cursor-pointer bg-primary"
              )}
            >
              <IconArrowUp className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="group flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-muted/30 h-auto bg-transparent dark:bg-muted"
          >
            {suggestion.icon}
            <span>{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
