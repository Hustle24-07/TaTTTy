"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { STYLES, PLACEMENTS, COLORS, ASPECT_RATIOS, MOODS, UI_TEXT, type TattooStyle, type TattooPlacement, type TattooColor, type AspectRatio, type Mood } from "@/app/tattty/constants";
import { askBaddie } from "@/app/actions/baddie";
import { generateTattoo } from "@/app/actions/generate-tattoo";
import { MediaModal } from "@/components/media-modal";
import { TattooVisuals, SoulSection } from "./tattty-form-sections";
import { cn } from "@/lib/utils";

export function TatttyForm() {
  const [style, setStyle] = useState<TattooStyle>(STYLES[0].id);
  const [placement, setPlacement] = useState<TattooPlacement>(PLACEMENTS[0].id);
  const [color, setColor] = useState<TattooColor>("Black & Grey");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0].value);
  const [mood, setMood] = useState<Mood>(MOODS[0]);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "baddie" | "tattty">("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSoul, setShowSoul] = useState(false);

  const handleGenerate = async () => {
    if (!q1 || !q2) return setError("Your soul is required for the ink.");
    setIsGenerating(true); setError(null); setStatus("baddie");
    try {
      const bResponse = await askBaddie({ style, colors: color, placement, aspectRatio, mood, q1Answer: q1, q2Answer: q2 });
      if (!bResponse.success || !bResponse.prompt) throw new Error(bResponse.error || "Baddie failed.");
      setStatus("tattty");
      const tResponse = await generateTattoo(bResponse.prompt, aspectRatio);
      if (!tResponse.success || !tResponse.output) throw new Error(tResponse.error || "Tattty failed.");
      const output = Array.isArray(tResponse.output) ? tResponse.output[0] : tResponse.output;
      setResult(typeof output === 'object' && output.url ? output.url() : output);
    } catch (err: any) { setError(err.message); } finally { setIsGenerating(false); setStatus("idle"); }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-24 lg:pb-32">
      <div className="text-center space-y-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase"
        >
          {UI_TEXT.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl mx-auto px-4"
        >
          {UI_TEXT.subtitle}
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-14 lg:space-y-16">
        <TattooVisuals style={style} setStyle={setStyle} placement={placement} setPlacement={setPlacement} color={color} setColor={setColor} mood={mood} setMood={setMood} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />

        {!showSoul && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-6 sm:pt-8">
            <Button
              className="h-16 sm:h-20 lg:h-24 text-2xl sm:text-3xl font-black rounded-3xl lg:rounded-4xl uppercase shadow-2xl shadow-primary/20 group bg-primary hover:scale-[1.02] transition-transform px-8 sm:px-10 lg:px-12"
              onClick={() => setShowSoul(true)}
            >
              Getting Hotter <Sparkles className="ml-2 sm:ml-3 w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-pulse" />
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {showSoul && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border shadow-2xl backdrop-blur-sm"
            >
              <button
                onClick={() => setShowSoul(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <SoulSection q1={q1} setQ1={setQ1} q2={q2} setQ2={setQ2} />
              <div className="text-center">
                <Button
                  className="h-16 sm:h-20 lg:h-24 text-lg sm:text-xl font-black shadow-2xl rounded-2xl sm:rounded-3xl uppercase hover:scale-[1.02] transition-transform px-8 sm:px-10 lg:px-12"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                >
                  <span className="truncate">
                    {isGenerating ? (
                      <>{status === "baddie" ? UI_TEXT.generating : UI_TEXT.inking}</>
                    ) : (
                      <>{UI_TEXT.generateButton}</>
                    )}
                  </span>
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin ml-2 sm:ml-3 flex-shrink-0" />
                  ) : (
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 ml-2 sm:ml-3 flex-shrink-0 group-hover:animate-pulse" />
                  )}
                </Button>
                {error && <p className="text-destructive text-xs sm:text-sm text-center font-black uppercase tracking-widest animate-bounce">{error}</p>}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="space-y-6 sm:space-y-8 pt-12 sm:pt-14 lg:pt-16"
          >
            <div className="text-center px-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-primary mb-6 sm:mb-8">Your Tattty</h2>
            </div>
            <div className="relative max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-8 sm:border-12 lg:border-16 border-muted shadow-2xl ring-1 sm:ring-2 ring-border">
              <MediaModal imgSrc={result} />
            </div>
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="h-16 sm:h-18 lg:h-20 rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-lg sm:text-xl px-8 sm:px-10 lg:px-12"
                onClick={() => setResult(null)}
              >
                <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4" /> Create Another Masterpiece
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
