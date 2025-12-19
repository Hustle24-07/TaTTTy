"use client";

import { useMemo } from "react";
import type { GalleryItem } from "../types";
import { getBlobUrl, getFilenameFromUrl } from "../utils";

type UploadedImage = {
	url: string;
};

type BlobLike = {
	url?: string;
	downloadUrl?: string;
	size?: number;
	content?: {
		text?: string;
	};
};

export const useGalleryItems = (
	uploadedImages: UploadedImage[],
	remoteBlobs: BlobLike[],
): GalleryItem[] => {
	return useMemo<GalleryItem[]>(() => {
		const optimistic = uploadedImages
			.map((image) => ({
				url: image.url,
				name: getFilenameFromUrl(image.url),
				size: undefined,
			}))
			.filter((item) => item.url);

		const persisted = (remoteBlobs ?? [])
			.map((blob) => ({
				url: getBlobUrl(blob),
				name: getFilenameFromUrl(getBlobUrl(blob)),
				description: blob.content?.text,
				size: "size" in blob ? blob.size : undefined,
			}))
			.filter((item) => item.url);

		return [...optimistic, ...persisted];
	}, [uploadedImages, remoteBlobs]);
};
