/**
 * Shared layout styles for consistent spacing across pages
 * 100% Mobile-first responsive design
 * Base styles = mobile, then sm: (640px+), md: (768px+), lg: (1024px+), xl: (1280px+)
 */

export const LAYOUT_STYLES = {
	/** Main page container - mobile first */
	pageContainer:
		"flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden sm:h-[calc(100svh-var(--header-height)-0.5rem)] md:h-[calc(100svh-var(--header-height)-1rem)]",

	/** Header section - stays fixed, separate from content */
	headerSection: "shrink-0 px-4 sm:px-6 md:px-8 lg:px-10",

	/** Header text styling - mobile first (small text -> larger) */
	headerText:
		"pt-3 text-center font-[family-name:var(--font-rock-salt)] font-bold text-2xl sm:pt-4 sm:text-4xl md:pt-6 md:text-5xl lg:pt-8 lg:text-6xl xl:text-7xl",

	/** Scrollable content wrapper */
	scrollableContent: "flex-1 overflow-y-auto",

	/** Content area with responsive spacing from header - mobile first */
	contentArea:
		"flex min-h-full flex-col items-center px-4 pt-16 pb-6 sm:px-6 sm:pt-24 sm:pb-8 md:px-8 md:pt-40 lg:pt-[200px] xl:pt-[260px]",

	/** Input container max width - mobile first */
	inputContainer:
		"w-full max-w-full space-y-4 sm:space-y-6 sm:max-w-xl md:max-w-2xl lg:max-w-3xl",

	/** Image display wrapper */
	imageWrapper: "relative mt-8 flex w-full justify-center sm:mt-10 md:mt-12",

	/** Image container */
	imageContainer: "w-full max-w-full px-2 sm:px-4 sm:max-w-[800px] md:px-0 md:max-w-[900px] lg:max-w-[1000px]",

	/** Image box - mobile first (smaller height on mobile) */
	imageBox:
		"relative h-[300px] w-full rounded-lg bg-zinc-50 shadow-lg sm:h-[400px] md:h-[450px] lg:h-[500px]",

	/** Prompt display */
	promptDisplay: "mt-6 text-center text-muted-foreground sm:mt-8",
} as const;
