"use client";

import type { ListBlobResult } from "@vercel/blob";
import {
  ArrowLeftIcon,
  FileIcon,
  ImageIcon,
  ImageUpIcon,
  Loader2Icon,
  UploadIcon,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { search } from "@/app/actions/search";
import { MediaModal } from "./media-modal";
import { Button } from "./ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Input } from "./ui/input";
import { UploadButton } from "./upload-button";
import { useUploadedImages } from "./uploaded-images-provider";
import { AspectRatio } from "./ui/aspect-ratio";

type ResultsClientProps = {
  defaultData: ListBlobResult["blobs"];
  initialCursor?: string;
  initialHasMore?: boolean;
};

export const ResultsClient = ({ defaultData }: ResultsClientProps) => {
  const { images } = useUploadedImages();
  const [state, formAction, isPending] = useActionState(search, { data: [] });

  useEffect(() => {
    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state]);

  const reset = () => {
    globalThis.location.reload();
  };

  const hasImages =
    images.length ||
    defaultData.length ||
    ("data" in state && state.data?.length);

  return (
    <>
      {hasImages ? (
        <div className="gap-4 sm:columns-2 md:columns-3 lg:columns-2 xl:columns-3">
          {images.map((image) => (
            <div key={image.url} className="mb-4 break-inside-avoid">
              <AspectRatio ratio={1}>
                <MediaModal imgSrc={image.url} />
              </AspectRatio>
            </div>
          ))}
          {"data" in state && state.data?.length
            ? state.data.map((blob) => (
                <div key={blob.url} className="mb-4 break-inside-avoid">
                  <AspectRatio ratio={1}>
                    <MediaModal imgSrc={blob.url} />
                  </AspectRatio>
                </div>
              ))
            : defaultData.map((blob) => (
                <div key={blob.url} className="mb-4 break-inside-avoid">
                  <AspectRatio ratio={1}>
                    <MediaModal imgSrc={blob.downloadUrl} />
                  </AspectRatio>
                </div>
              ))}
        </div>
      ) : (
        <Empty className="h-full min-h-[50vh] rounded-lg border">
          <EmptyHeader className="max-w-none">
            <div className="relative isolate mb-8 flex">
              <div className="-rotate-12 translate-x-2 translate-y-2 rounded-full border bg-background p-3 shadow-xs">
                <ImageIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="z-10 rounded-full border bg-background p-3 shadow-xs">
                <UploadIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="-translate-x-2 translate-y-2 rotate-12 rounded-full border bg-background p-3 shadow-xs">
                <FileIcon className="size-5 text-muted-foreground" />
              </div>
            </div>
            <EmptyTitle>No images found</EmptyTitle>
            <EmptyDescription>
              Upload some images with the{" "}
              <ImageUpIcon className="inline size-4" /> button below to get
              started!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <form
        action={formAction}
        className="-translate-x-1/2 fixed bottom-8 left-1/2 flex w-full max-w-sm items-center gap-1 rounded-full bg-background p-1 shadow-xl sm:max-w-lg lg:ml-[182px]"
      >
        {"data" in state && state.data.length > 0 && (
          <Button
            className="shrink-0 rounded-full"
            disabled={isPending}
            onClick={reset}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
        )}
        <Input
          className="w-full rounded-full border-none bg-secondary shadow-none outline-none"
          disabled={isPending || !hasImages}
          id="search"
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
    </>
  );
};

