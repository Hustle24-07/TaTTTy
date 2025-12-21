"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCcw, AlertCircle } from "lucide-react";
import { UI_TEXT } from "@/app/tattty/constants";
import { askBaddie } from "@/app/actions/baddie";
import { generateTattoo } from "@/app/actions/generate-tattoo";
import { getSettings } from "@/app/actions/settings";
import { MediaModal } from "@/components/media-modal";
import { TattooVisuals, QuestionSection } from "./tattty-form-sections";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TatttyForm() {
  const [style, setStyle] = useState<string>("");
  const [placement, setPlacement] = useState<string>("");
  const [color, setColor] = useState<string>("Black & Grey");
  const [aspectRatio, setAspectRatio] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "baddie" | "tattty">("idle");
  const [result, setResult] = useState<string | string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Dynamic Lists State
  const [lists, setLists] = useState<{
    styles: any[];
    placements: any[];
    moods: string[];
    aspectRatios: any[];
    colors: string[];
  } | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoadingError(null);
      const settings = await getSettings();
      const l = settings.lists;
      
      if (!l || !l.styles || l.styles.length === 0) throw new Error("Style options missing from settings.");
      if (!l.placements || l.placements.length === 0) throw new Error("Placement options missing from settings.");
      
      setLists(l);
      
      if (settings.tattty.questions && settings.tattty.questions.length > 0) {
          setQuestions(settings.tattty.questions);
      } else {
           throw new Error("Questions configuration is missing in settings.");
      }
      
      // Set defaults from loaded lists
      if (l.styles.length > 0) setStyle(l.styles[0].id);
      if (l.placements.length > 0) setPlacement(l.placements[0].id);
      if (l.moods.length > 0) setMood(l.moods[0]);
      if (l.aspectRatios && l.aspectRatios.length > 0) setAspectRatio(l.aspectRatios[0].value);
      if (l.colors && l.colors.length > 0) setColor(l.colors[0]);

    } catch (e: any) {
      console.error("Critical: Failed to load application settings.", e);
      setLoadingError(e.message || "Failed to load configuration.");
      toast.error("Configuration Error", {
        description: e.message || "Could not load application settings.",
        duration: Infinity, // Keep open until resolved
        action: {
            label: "Retry",
            onClick: () => loadData()
        }
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!q1 || !q2) return setError("Please answer both questions to generate your tattoo.");
    setIsGenerating(true); setError(null); setStatus("baddie");
    const requestId = `req_${Math.random().toString(36).substring(7)}`; // Client-side tracking ID
    try {
      // Get current questions to pass as context
      const q1Text = questions?.[0]?.question || "Story 1";
      const q2Text = questions?.[1]?.question || "Story 2";

      // Resolve IDs to Labels for LLM Context
      const styleLabel = lists?.styles.find(s => s.id === style)?.label || style;
      const placementLabel = lists?.placements.find(p => p.id === placement)?.label || placement;

      const bResponse = await askBaddie({ 
        style: styleLabel, 
        colors: color, 
        placement: placementLabel, 
        aspectRatio, 
        mood, 
        q1Answer: q1, 
        q2Answer: q2, 
        q1Question: q1Text,
        q2Question: q2Text,
        requestId 
      });
      if (!bResponse.success || !bResponse.prompt) throw new Error(bResponse.error || "Baddie failed.");
      setStatus("tattty");
      const tResponse = await generateTattoo(bResponse.prompt, aspectRatio, requestId);
      if (!tResponse.success || !tResponse.output) throw new Error(tResponse.error || "Tattty failed.");
      
      // Handle array of images or single image
      const output = tResponse.output;
      
      let finalResult: string | string[] = "";
      if (Array.isArray(output)) {
          finalResult = output.map((item: any) => (typeof item === 'object' && item.url ? item.url() : item));
      } else {
          finalResult = typeof output === 'object' && 'url' in output && typeof (output as any).url === 'function'
            ? (output as any).url()
            : output;
      }
      
      setResult(finalResult);
    } catch (err: any) { setError(err.message); } finally { setIsGenerating(false); setStatus("idle"); }
  };

  if (loadingError) {
      return (
          <div className="flex flex-col min-h-[50vh] items-center justify-center space-y-4 p-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Failed to Load Configuration</h3>
                  <p className="text-muted-foreground max-w-md">{loadingError}</p>
              </div>
              <Button onClick={() => loadData()} variant="outline" className="mt-4">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Retry Connection
              </Button>
          </div>
      );
  }

  if (!lists) {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-24 lg:pb-32">
      <div className="text-center space-y-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8"
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
        <TattooVisuals 
            lists={lists} // PASSING DYNAMIC LISTS HERE
            style={style} setStyle={setStyle} 
            placement={placement} setPlacement={setPlacement} 
            color={color} setColor={setColor} 
            mood={mood} setMood={setMood} 
            aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} 
        />

        {!showQuestions && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto px-12 text-lg font-bold min-w-[200px]"
              onClick={() => setShowQuestions(true)}
            >
              Next
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {showQuestions && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border shadow-2xl backdrop-blur-sm"
            >
              <button
                onClick={() => setShowQuestions(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <QuestionSection q1={q1} setQ1={setQ1} q2={q2} setQ2={setQ2} questions={questions} />
              <div className="text-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg sm:text-xl font-black shadow-xl rounded-xl uppercase hover:scale-[1.02] transition-transform py-8 px-12"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                >
                  <span className="truncate">
                    {isGenerating ? (
                      <>{status === "baddie" ? UI_TEXT.generating : UI_TEXT.inking}</>
                    ) : (
                      "Create My Unique Tat"
                    )}
                  </span>
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin ml-3 flex-shrink-0" />
                  ) : (
                    <Sparkles className="w-6 h-6 ml-3 flex-shrink-0 group-hover:animate-pulse" />
                  )}
                </Button>
                {error && <p className="mt-6 text-destructive text-xs sm:text-sm text-center font-black uppercase tracking-widest animate-pulse">{error}</p>}
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-foreground mb-6 sm:mb-8">Your Unique Image</h2>
            </div>
            
            {Array.isArray(result) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
                    {result.map((img, idx) => (
                        <div key={idx} className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-8 sm:border-12 lg:border-16 border-muted shadow-2xl ring-1 sm:ring-2 ring-border">
                            <MediaModal imgSrc={img} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative max-w-sm sm:max-w-xl lg:max-w-2xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-8 sm:border-12 lg:border-16 border-muted shadow-2xl ring-1 sm:ring-2 ring-border">
                  <MediaModal imgSrc={result as string} />
                </div>
            )}

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
