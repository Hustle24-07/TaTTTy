import { useState } from "react";
import {
  initializeProviderRecord,
  MODEL_CONFIGS,
  PROVIDER_ORDER,
  type ProviderKey,
} from "@/lib/provider-config";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { STYLES, ASPECT_RATIOS, type AspectRatio } from "@/app/tattty/constants";

export function useCouplesLogic() {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
  } = useImageGeneration();

  const [input, setInput] = useState("");
  const [style, setStyle] = useState(STYLES[0].id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0].value);
  const [files, setFiles] = useState<File[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedModels] = useState<Record<ProviderKey, string>>(
    MODEL_CONFIGS.performance
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enabledProviders] = useState(initializeProviderRecord(true));

  const providerToModel = {
    replicate: selectedModels.replicate,
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      // Find the label for the selected style to include in the prompt
      const selectedStyle = STYLES.find((s) => s.id === style)?.label || style;
      // Construct a richer prompt using the input, style, and aspect ratio
      // Note: In the original logic, 'aspectRatio' is passed separately to generateTattoo.
      // Here, we might want to include style in the prompt or let the backend handle it.
      // For now, let's append the style to the prompt to ensure it's used, similar to how askBaddie might.
      // Or we can just pass the raw input if the backend handles style separately.
      // However, startGeneration takes a single prompt string.
      // Let's assume we should prepend the style for better results if we aren't using the full 'askBaddie' flow yet.
      const fullPrompt = `Style: ${selectedStyle}. ${newPrompt}`;
      startGeneration(fullPrompt, activeProviders, providerToModel, files);
    }
  };

  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      handlePromptSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return {
    input,
    setInput,
    style,
    setStyle,
    aspectRatio,
    setAspectRatio,
    files,
    setFiles,
    isLoading,
    images,
    timings,
    failedProviders,
    activePrompt,
    handleSubmit,
    handleKeyDown,
    STYLES,
    ASPECT_RATIOS,
  };
}
