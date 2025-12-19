"use client";

import { useState } from "react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptInput } from "@/components/PromptInput";
import { useImageGeneration } from "@/hooks/use-image-generation";
import {
	initializeProviderRecord,
	MODEL_CONFIGS,
	type ModelMode,
	PROVIDER_ORDER,
	type ProviderKey,
} from "@/lib/provider-config";
import { LAYOUT_STYLES } from "@/lib/layout-styles";

export default function Page() {
	const {
		images,
		timings,
		failedProviders,
		isLoading,
		startGeneration,
		activePrompt,
	} = useImageGeneration();

	const [selectedModels, setSelectedModels] = useState<
		Record<ProviderKey, string>
	>(MODEL_CONFIGS.performance);
	const [enabledProviders, setEnabledProviders] = useState(
		initializeProviderRecord(true),
	);
	const [mode, setMode] = useState<ModelMode>("performance");

	const handleModeChange = (newMode: ModelMode) => {
		setMode(newMode);
		setSelectedModels(MODEL_CONFIGS[newMode]);
	};

	const providerToModel = {
		replicate: selectedModels.replicate,
	};

	const handlePromptSubmit = (newPrompt: string) => {
		const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
		if (activeProviders.length > 0) {
			startGeneration(newPrompt, activeProviders, providerToModel);
		}
	};

	return (
		<div className={LAYOUT_STYLES.pageContainer}>
			{/* Header section - completely separate */}
			<div className={LAYOUT_STYLES.headerSection}>
				<h1 className={LAYOUT_STYLES.headerText}>
					AGENTS? 🤖
				</h1>
			</div>

			{/* Scrollable content area */}
			<div className={LAYOUT_STYLES.scrollableContent}>
				<div className={LAYOUT_STYLES.contentArea}>
					<div className={LAYOUT_STYLES.inputContainer}>
						<PromptInput
							isLoading={isLoading}
							mode={mode}
							onModeChange={handleModeChange}
							onSubmit={handlePromptSubmit}
							onToggleProviders={() => {}}
							showProviders={true}
						/>
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
							<p className="text-sm">Current prompt: {activePrompt}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
