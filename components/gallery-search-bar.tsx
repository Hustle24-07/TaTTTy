"use client";

import { useId } from "react";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/components/upload-button";

interface GallerySearchBarProps {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  hasImages: boolean;
  showBackButton: boolean;
  onReset: () => void;
}

export function GallerySearchBar({
  formAction,
  isPending,
  hasImages,
  showBackButton,
  onReset,
}: GallerySearchBarProps) {
  const searchId = useId();
  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm items-center gap-1 rounded-full bg-background p-1 shadow-xl sm:max-w-lg mx-auto mb-8 border"
    >
      {showBackButton && (
        <Button
          className="shrink-0 rounded-full"
          disabled={isPending}
          onClick={onReset}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
      )}
      <Input
        className="w-full rounded-full border-none bg-transparent shadow-none outline-none focus-visible:ring-0"
        disabled={isPending || !hasImages}
        id={searchId}
        name="search"
        placeholder="Search by description"
        required
      />
      {isPending ? (
        <Button className="shrink-0" disabled size="icon" variant="ghost">
          <Loader2Icon className="size-4 animate-spin" />
        </Button>
      ) : (
        <UploadButton />
      )}
    </form>
  );
}
