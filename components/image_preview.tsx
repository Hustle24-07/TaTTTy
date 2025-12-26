"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
}

export default function ImagePreview({
  src,
  alt = "Preview image",
  width = 400,
  height = 400,
  className = "cursor-pointer rounded-lg hover:opacity-90 transition-opacity",
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onClick={() => setIsOpen(true)}
        loading="lazy"
      />

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[90vw] max-h-[90vh] w-auto h-auto p-0 bg-transparent border-0 z-51 outline-none">
            <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Low-res placeholder (matches thumbnail to hit browser cache) */}
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="absolute inset-0 w-full h-full object-contain opacity-50 rounded-lg"
                aria-hidden="true"
              />
              {/* High-res image */}
              <Image
                src={src}
                alt={alt}
                width={width * 2}
                height={height * 2}
                className="object-contain rounded-lg relative z-10"
                priority
              />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 focus:outline-none transition-colors"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
