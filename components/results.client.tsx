"use client";

import type { ListBlobResult } from "@vercel/blob";
import {
  ArrowLeftIcon,
  FileIcon,
  ImageIcon,
  ImageUpIcon,
  UploadIcon,
} from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { search } from "@/app/actions/search";
import ImagePreview from "./image_preview";
import { Button } from "./ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Input } from "./ui/input";
import { UploadButton } from "./upload-button";
import { useUploadedImages } from "./uploaded-images-provider";
import { AspectRatio } from "./ui/aspect-ratio";
import { LoaderGooeyBlobs } from "@/components/gooey-blobs";

type ResultsClientProps = {

  defaultData: ListBlobResult["blobs"];
  initialCursor?: string;
  initialHasMore?: boolean;
};

export const ResultsClient = ({ defaultData }: ResultsClientProps) => {
  const { images } = useUploadedImages();
  const [state, formAction, isPending] = useActionState(search, { data: [] });
  const searchId = useId();
  const { error } = useToast();

  useEffect(() => {
    if ("error" in state) {
      error(state.error);
    }
  }, [state, error]);

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
                <ImagePreview
                  src={image.url}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
                />
              </AspectRatio>
            </div>
          ))}
          {"data" in state && state.data?.length
            ? state.data.map((blob) => (
                <div key={blob.url} className="mb-4 break-inside-avoid">
                  <AspectRatio ratio={1}>
                    <ImagePreview
                      src={blob.url}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
                    />
                  </AspectRatio>
                </div>
              ))
            : defaultData.map((blob) => (
                <div key={blob.url} className="mb-4 break-inside-avoid">
                  <AspectRatio ratio={1}>
                    <ImagePreview
                      src={blob.downloadUrl}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
                    />
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
          id={searchId}
          name="search"
          placeholder="Search by description"
          required
        />
        {isPending ? (
          <Button className="shrink-0" disabled size="icon" variant="ghost">
            <LoaderGooeyBlobs size={16} />
          </Button>
        ) : (
          <UploadButton />
        )}
      </form>
    </>
  );
};
