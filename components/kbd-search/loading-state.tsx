import { LoaderGooeyBlobs } from "@/components/gooey-blobs"

export function LoadingState() {
  return (
    <div className="flex justify-center py-6">
      <LoaderGooeyBlobs size={24} />
    </div>
  )
}

