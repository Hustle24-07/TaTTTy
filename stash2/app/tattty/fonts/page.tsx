"use client";

import { Copy, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { ImageDisplay } from "@/components/ImageDisplay";
import {
  MODEL_CONFIGS,
  type ModelMode,
  PROVIDER_ORDER,
  type ProviderKey,
  initializeProviderRecord,
} from "@/lib/provider-config";

export default function FontsPage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("");
  const [mode, setMode] = useState<ModelMode>("performance");
  const [selectedModels, setSelectedModels] = useState(
    MODEL_CONFIGS.performance
  );
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true)
  );

  const {
    images,
    timings,
    failedProviders,
    isLoading: isGenerating,
    startGeneration,
  } = useImageGeneration();

  const { toast } = useToast();

  const handleGenerate = () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate fonts.",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 100) {
      toast({
        title: "Text Too Long",
        description: "Please enter text with 100 characters or less.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Generate a tattoo design of the text "${text}"${style ? ` in a ${style} style` : ""}`;
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      const providerToModel = {
        replicate: selectedModels.replicate,
      };
      startGeneration(prompt, activeProviders, providerToModel);
    }
  };

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="h-full overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <h1 className="mb-8 pt-4 text-center font-[family-name:var(--font-rock-salt)] font-bold text-3xl sm:mb-12 sm:pt-[30px] sm:text-5xl md:text-6xl lg:text-7xl">
              FONT FORGE
            </h1>

            {/* Input Section */}
            <div className="mx-auto mb-8 max-w-full px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
              <div className="relative rounded-lg border-2 border-[#39FF14] bg-zinc-900/90 p-6 shadow-[0_0_15px_rgba(57,255,20,0.5),inset_0_0_15px_rgba(57,255,20,0.1)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(57,255,20,0.7),inset_0_0_20px_rgba(57,255,20,0.15)]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text" className="text-[#39FF14] font-medium">Text</Label>
                    <Textarea
                      id="text"
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter the text you want to stylize..."
                      rows={3}
                      value={text}
                      className="resize-none border-none bg-transparent p-2 font-medium text-[#39FF14] text-base tracking-wide placeholder:text-[#39FF14]/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-[#39FF14] font-medium">Style (optional)</Label>
                    <Input
                      id="style"
                      onChange={(e) => setStyle(e.target.value)}
                      placeholder="e.g., bold, elegant, gothic, modern..."
                      value={style}
                      className="border-none bg-transparent p-2 font-medium text-[#39FF14] text-base tracking-wide placeholder:text-[#39FF14]/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <Button
                    className="w-full rounded-full"
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    size="lg"
                  >
                    {isGenerating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate Text Design
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Image Display */}
            {images.length > 0 && (
              <div className="mx-auto mb-8 max-w-full px-4 sm:max-w-xl sm:px-0 md:max-w-2xl lg:max-w-3xl">
                <div className="flex justify-center">
                  {images
                    .slice(0, 1)
                    .map((imageItem) => (
                      <div className="w-full max-w-[600px]" key={imageItem.provider}>
                        <div className="relative h-[400px] sm:h-[500px] w-full rounded-lg bg-zinc-50 shadow-lg">
                          <ImageDisplay
                            failed={failedProviders.includes(imageItem.provider as ProviderKey)}
                            image={imageItem.image}
                            modelId={imageItem.modelId ?? "N/A"}
                            provider={imageItem.provider}
                            timing={timings[imageItem.provider as ProviderKey]}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isGenerating && images.length === 0 && (
              <div className="mx-auto max-w-full px-4 py-12 text-center text-muted-foreground sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <p>
                  Enter text above and click "Generate Text Design" to create a tattoo design.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
