"use client";

import { motion } from "motion/react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { STYLES, PLACEMENTS, COLORS, MOODS, ASPECT_RATIOS, QUESTIONS } from "@/app/tattty/constants";

export const TattooVisuals = ({ style, setStyle, placement, setPlacement, color, setColor, mood, setMood, aspectRatio, setAspectRatio }: any) => (
  <div className="space-y-16">
    <PillCarouselSection title="Style" items={STYLES} selected={style} onSelect={setStyle} />
    <PillCarouselSection title="Placement" items={PLACEMENTS} selected={placement} onSelect={setPlacement} />
    <PillCarouselSection title="Mood & Theme" items={MOODS.map(m => ({ id: m, label: m }))} selected={mood} onSelect={setMood} />
    
    <div className="space-y-12 pt-8">
      <UniformBadgeSection title="Ink Palette" items={COLORS} selected={color} onSelect={setColor} />
      <UniformBadgeSection title="Frame Aspect" items={ASPECT_RATIOS.map(ar => `${ar.label} (${ar.value})`)} selected={`${ASPECT_RATIOS.find(ar => ar.value === aspectRatio)?.label} (${aspectRatio})`} onSelect={(label: string) => {
        const match = label.match(/(.+) \((.+)\)/);
        if (match) {
          setAspectRatio(match[2]);
        }
      }} />
    </div>
  </div>
);

export const PillCarouselSection = ({ title, items, selected, onSelect }: any) => (
  <section className="space-y-6">
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</h2>
      <Badge variant="outline" className="font-black uppercase rounded-full px-4 py-1 border-primary/20 text-primary bg-primary/5">{items.find((i: any) => i.id === selected)?.label || selected}</Badge>
    </div>
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-2">
        {items.map((item: any) => (
          <CarouselItem key={item.id} className="pl-2 basis-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(item.id)}
              className={cn(
                "cursor-pointer px-6 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap",
                selected === item.id 
                  ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
                  : "border-border/40 bg-muted/5 hover:border-primary/30 hover:bg-muted/10"
              )}
            >
              <span className="text-2xl font-black uppercase tracking-tighter">{item.label}</span>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  </section>
);

export const UniformBadgeSection = ({ title, items, selected, onSelect }: any) => {
  const isColorSection = title === "Ink Palette";

  return (
    <section className="space-y-8">
      <h2 className="text-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 place-items-center">
        {items.map((item: any) => {
          const isSelected = selected === item;

          let colorClass = "";
          let aspectStyle = {};

          if (isColorSection) {
            // Color swatches for palette using global theme colors
            const colorMap: Record<string, string> = {
              "Black & Grey": "bg-black",
              "Full Color": "bg-gradient-to-br from-primary via-secondary to-accent",
              "Red Ink Accents": "bg-destructive",
              "Blue Ink": "bg-primary",
              "Minimalist": "bg-background border-2 border-border",
            };
            colorClass = colorMap[item] || "bg-muted";
          } else {
            // Aspect ratio previews
            const aspectMap: Record<string, string> = {
              "Square": "aspect-square",
              "Portrait": "aspect-[3/4]",
              "Landscape": "aspect-[4/3]",
              "Wide": "aspect-[16/9]",
            };
            aspectStyle = { aspectRatio: aspectMap[item] || "aspect-square" };
          }

          return (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(item)}
              className="cursor-pointer"
            >
              <Button
                variant="outline"
                className={cn(
                  "h-20 rounded-2xl font-black uppercase text-sm transition-all w-full px-4 relative overflow-hidden text-center",
                  isSelected
                    ? "shadow-2xl shadow-primary/30 ring-2 ring-primary/50 border-primary"
                    : "hover:shadow-lg hover:shadow-primary/10 border-border/60 hover:border-primary/40",
                  isColorSection ? `text-white ${colorClass}` : "",
                  !isColorSection ? colorClass : ""
                )}
                style={aspectStyle}
              >
                {!isColorSection && (
                  <div className="absolute inset-2 border-2 border-current opacity-20 rounded-lg" />
                )}
                <span className="truncate relative z-10">{item}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export const SoulSection = ({ q1, setQ1, q2, setQ2 }: any) => (
  <div className="space-y-8">
    {QUESTIONS.map((q, i) => (
      <div key={q.id} className="space-y-4">
        <Label htmlFor={q.id} className="text-sm font-bold text-muted-foreground leading-tight">{q.question}</Label>
        <Textarea id={q.id} placeholder={q.placeholder} className="h-40 bg-muted/50 border-border resize-none overflow-y-auto focus:ring-primary/20 rounded-2xl p-4 text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50" value={i === 0 ? q1 : q2} onChange={(e) => (i === 0 ? setQ1(e.target.value) : setQ2(e.target.value))} />
      </div>
    ))}
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground leading-relaxed">
      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p><strong className="text-foreground">Deep Ink, No Data:</strong> Your answers are processed in real-time and never stored. Once you close this session, your story is gone.</p>
    </div>
  </div>
);
