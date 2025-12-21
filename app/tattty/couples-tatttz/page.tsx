"use client";

import { Loader2, Sparkles, Plus } from "lucide-react";
import { COUPLES_UI_TEXT } from "../constants";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { ImageDisplay } from "@/components/ImageDisplay";
import { useCouplesLogic } from "@/hooks/use-couples-logic";
import { PillCarouselSection, UniformBadgeSection } from "@/components/tattty-form-sections";
import { LAYOUT_STYLES } from "@/lib/layout-styles";
import { ButtonGroup } from "@/components/ui/button-group";
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/uilayouts/file-upload";

export default function Page() {
	const {
		input,
		setInput,
		isLoading,
		images,
		timings,
		failedProviders,
		activePrompt,
		handleSubmit,
		handleKeyDown,
		style,
		setStyle,
		aspectRatio,
		setAspectRatio,
		files,
		setFiles,
		STYLES,
		ASPECT_RATIOS,
	} = useCouplesLogic();

	return (
		<div className={LAYOUT_STYLES.pageContainer}>
			{/* Header section - completely separate */}
			<div className="shrink-0 px-4 sm:px-6 md:px-8 lg:px-10 text-center">
				<h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8">
					Couples TaTTTz
				</h1>
				<p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto mt-4">
					Create matching tattoo designs for couples with AI-powered creativity
				</p>
			</div>

			{/* Scrollable content area */}
			<div className={LAYOUT_STYLES.scrollableContent}>
				<div className={LAYOUT_STYLES.contentArea}>
					<div className={LAYOUT_STYLES.inputContainer}>
						<div className="w-full space-y-4">
							<InputGroup>
								<InputGroupTextarea
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder={COUPLES_UI_TEXT.inputPlaceholder}
									rows={3}
									value={input}
									className="min-h-[80px] max-h-[200px] resize-y overflow-y-auto"
								/>
							</InputGroup>

							<FileUploader
								value={files}
								onValueChange={setFiles}
								dropzoneOptions={{
									maxFiles: 4,
									maxSize: 1024 * 1024 * 4, // 4MB
									accept: {
										"image/*": [".jpg", ".jpeg", ".png", ".webp"],
									},
								}}
								className="space-y-4"
							>
								{files && files.length > 0 && (
									<FileUploaderContent className="flex flex-col gap-2">
										{files.map((file, i) => (
											<FileUploaderItem
												key={i}
												index={i}
												className="w-full h-16 p-2 rounded-md border border-border bg-background flex items-center gap-3"
												aria-roledescription={`file ${i + 1} containing ${file.name}`}
											>
												<div className="h-full aspect-square rounded-sm overflow-hidden bg-muted">
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={URL.createObjectURL(file)}
														alt={file.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<span className="text-sm font-medium truncate flex-1">
													{file.name}
												</span>
											</FileUploaderItem>
										))}
									</FileUploaderContent>
								)}
								<FileInput className="mt-2">
									<div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer gap-2">
										<Plus className="w-5 h-5 text-muted-foreground" />
										<span className="text-sm font-medium text-muted-foreground">
											Upload References (Max 4)
										</span>
									</div>
								</FileInput>
							</FileUploader>
						</div>

						{/* Style Carousel */}
						<div className="w-full pt-8">
							<PillCarouselSection 
								title="Style" 
								items={STYLES} 
								selected={style} 
								onSelect={setStyle} 
							/>
						</div>

						{/* Aspect Ratio Section */}
						<div className="w-full pt-8">
							<UniformBadgeSection 
								title="Frame Aspect" 
								items={ASPECT_RATIOS.map((ar) => `${ar.label} (${ar.value})`)} 
								selected={`${ASPECT_RATIOS.find((ar) => ar.value === aspectRatio)?.label} (${aspectRatio})`} 
								onSelect={(label: string) => {
								const match = label.match(/(.+) \((.+)\)/);
								if (match) {
									const ratio = match[2];
									if (ratio === "1:1" || ratio === "3:4" || ratio === "4:3" || ratio === "16:9") {
										setAspectRatio(ratio);
									}
								}
							}} 
								aspectRatios={ASPECT_RATIOS} 
							/>
						</div>

						<div className="w-full pt-8 flex justify-center">
							<ButtonGroup className="w-full sm:w-auto shadow-xl rounded-xl">
								<Button
									onClick={handleSubmit}
									disabled={isLoading || !input.trim()}
									size="lg"
									className="w-full sm:w-auto text-lg font-black rounded-xl uppercase hover:scale-[1.02] transition-transform py-8 px-12"
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-6 w-6 animate-spin" />
											{COUPLES_UI_TEXT.loadingText}
										</>
									) : (
										<>
											<Sparkles className="mr-2 h-6 w-6" />
											{COUPLES_UI_TEXT.buttonText}
										</>
									)}
								</Button>
							</ButtonGroup>
						</div>
					</div>

					<div className={LAYOUT_STYLES.imageWrapper}>
						{images.length > 0 ? (
							<div className={LAYOUT_STYLES.imageContainer}>
								<div className={LAYOUT_STYLES.imageBox}>
									<ImageDisplay
										failed={failedProviders.includes("replicate")}
										image={images[0]?.image}
										modelId={images[0]?.modelId ?? "N/A"}
										provider={images[0]?.provider || "replicate"}
										timing={timings["replicate"]}
									/>
								</div>
							</div>
						) : null}
					</div>

					{activePrompt && activePrompt.length > 0 && (
						<div className={LAYOUT_STYLES.promptDisplay}>
							<p className="text-sm">{COUPLES_UI_TEXT.promptLabel} {activePrompt}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
