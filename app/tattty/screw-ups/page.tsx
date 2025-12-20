"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaModal } from "@/components/media-modal";
import { generateTattoo } from "@/app/actions/generate-tattoo";
import { LAYOUT_STYLES } from "@/lib/layout-styles";
import { ASPECT_RATIOS, STYLES } from "@/app/tattty/constants";
import { UniformBadgeSection, PillCarouselSection } from "@/components/tattty-form-sections";
import { UploadButton } from "@/components/upload-button";
import { UploadedImagesProvider } from "@/components/uploaded-images-provider";

export default function Page() {
	const [prompt, setPrompt] = useState("");
	const [style, setStyle] = useState(STYLES[0].id);
	const [aspectRatio, setAspectRatio] = useState("1:1");
	const [isGenerating, setIsGenerating] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!prompt.trim()) return setError("Please enter a tattoo prompt to continue.");
		if (!style) return setError("Please select a style to continue.");
		setIsGenerating(true);
		setError(null);
		try {
			const styleLabel = STYLES.find(s => s.id === style)?.label || style;
			const fullPrompt = `${styleLabel} style tattoo: ${prompt}`;
			const response = await generateTattoo(fullPrompt, aspectRatio);
			if (response.success && response.output) {
				setResult(response.output);
			} else {
				setError(response.error || "Failed to generate tattoo. Please try again.");
			}
		} catch (err: any) {
			setError(`Generation error: ${err.message}. Check your connection and try again.`);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<UploadedImagesProvider>
			<div className={LAYOUT_STYLES.pageContainer}>
				{/* Header section - completely separate */}
				<div className={LAYOUT_STYLES.headerSection}>
					<h1 className={LAYOUT_STYLES.headerText}>
						Screw Ups 🧠
					</h1>
				</div>

				{/* Scrollable content area */}
				<div className={LAYOUT_STYLES.scrollableContent}>
					<div className={LAYOUT_STYLES.contentArea}>
						<div className={LAYOUT_STYLES.inputContainer}>
						<div className="space-y-6">
							<Textarea
								placeholder="Enter your tattoo prompt..."
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								className="min-h-32"
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
									<input
										type="file"
										accept="image/*"
										className="hidden"
										id="upload1"
									/>
									<label htmlFor="upload1" className="cursor-pointer">
										<div className="text-muted-foreground">
											<svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
											</svg>
											<p className="text-sm">Upload Reference Image 1</p>
											<p className="text-xs text-muted-foreground mt-1">Click to select file</p>
										</div>
									</label>
								</div>
								<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
									<input
										type="file"
										accept="image/*"
										className="hidden"
										id="upload2"
									/>
									<label htmlFor="upload2" className="cursor-pointer">
										<div className="text-muted-foreground">
											<svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
											</svg>
											<p className="text-sm">Upload Reference Image 2</p>
											<p className="text-xs text-muted-foreground mt-1">Click to select file</p>
										</div>
									</label>
								</div>
							</div>
							<PillCarouselSection title="Style" items={STYLES} selected={style} onSelect={setStyle} />
								<UniformBadgeSection
									title="Frame Aspect"
									items={ASPECT_RATIOS.map(ar => `${ar.label} (${ar.value})`)}
									selected={`${ASPECT_RATIOS.find(ar => ar.value === aspectRatio)?.label} (${aspectRatio})`}
									onSelect={(label: string) => {
										const match = label.match(/(.+) \((.+)\)/);
										if (match) {
											setAspectRatio(match[2]);
										}
									}}
								/>
								<div className="text-center">
									<Button
										onClick={handleSubmit}
										disabled={isGenerating || !prompt.trim()}
										size="lg"
										className="px-8 h-16 font-black uppercase"
									>
										{isGenerating ? "Creating..." : "Create Now"}
									</Button>
								</div>
								{error && <p className="text-red-500 text-sm text-center">{error}</p>}
							</div>
						</div>

						<div className={LAYOUT_STYLES.imageWrapper}>
							{result ? (
								<div className="relative max-w-2xl mx-auto rounded-[3rem] overflow-hidden border-16 border-muted shadow-2xl ring-2 ring-border">
									<MediaModal imgSrc={result} />
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</UploadedImagesProvider>
	);
}
