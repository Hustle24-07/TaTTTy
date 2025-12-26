"use client";

import type { ListBlobResult } from "@vercel/blob";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { loadMoreImages } from "@/app/actions/load-more-images";

type UseInfiniteScrollOptions = {
	initialData: ListBlobResult["blobs"];
	initialCursor?: string;
	initialHasMore?: boolean;
};

export const useInfiniteScroll = ({
	initialData,
	initialCursor,
	initialHasMore = false,
}: UseInfiniteScrollOptions) => {
	const { error } = useToast();
	const [blobs, setBlobs] = useState(initialData);
	const [cursor, setCursor] = useState(initialCursor);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const loadMore = useCallback(async () => {
		if (isLoadingMore || !hasMore || !cursor) return;

		setIsLoadingMore(true);
		try {
			const result = await loadMoreImages(cursor);
			setBlobs((prev) => [...prev, ...result.blobs]);
			setCursor(result.cursor);
			setHasMore(result.hasMore);
		} catch (err) {
			console.error("Failed to load more images:", err);
			error("Failed to load more images");
		} finally {
			setIsLoadingMore(false);
		}
	}, [cursor, hasMore, isLoadingMore, error]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					loadMore();
				}
			},
			{ rootMargin: "200px" },
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [hasMore, isLoadingMore, loadMore]);

	return {
		blobs,
		hasMore,
		isLoadingMore,
		loadMoreRef,
	};
};
