"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FONT_STYLES, UI_TEXT } from "@/app/tattty/fonts/constants";

export const FontVisuals = ({ text, setText, color, setColor, style, setStyle, customization, setCustomization }: any) => (
  <div className="space-y-12">

    <section className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{UI_TEXT.selectColorLabel}</label>
        <div className="flex gap-6 w-full">
          {['black', 'colors'].map((c) => (
            <Button 
              key={c} 
              variant={color === c ? "default" : "outline"}
              className={cn("flex-1 h-20 rounded-4xl font-black uppercase text-lg transition-all", color === c && "shadow-xl shadow-primary/20")}
              onClick={() => setColor(c as any)}
            >
              {c === 'black' ? UI_TEXT.black : UI_TEXT.colors}
            </Button>
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{UI_TEXT.selectStyleLabel}</label>
        <div className="flex flex-wrap gap-3 justify-center">
          {FONT_STYLES.map((s) => (
            <Badge 
              key={s} 
              variant={style === s ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-8 py-4 text-[11px] font-black uppercase tracking-widest rounded-full transition-all",
                style === s ? "shadow-lg shadow-primary/20" : "hover:bg-primary/5"
              )}
              onClick={() => setStyle(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{UI_TEXT.customizeLabel}</label>
        <Textarea 
          placeholder={UI_TEXT.customizePlaceholder} 
          className="min-h-32 rounded-4xl bg-muted/30 border-border/50 text-center font-medium p-6"
          value={customization}
          onChange={(e) => setCustomization(e.target.value)}
        />
      </div>
    </section>
  </div>
);
