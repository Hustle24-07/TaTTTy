"use client";

import { TATTTY_UI_TEXT } from "@/app/tattty/constants";
import { ReusableScrollArea } from "@/components/reusable-scroll-area";
import { TextWordCarousel } from "@/components/word-carousel";


export default function Ai02() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8 gap-24">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8">
          INK'D MEMORIES
        </h2>
        <p className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-muted-foreground space-x-2 mt-8">
          <span>Your</span>
          <TextWordCarousel 
            words={TATTTY_UI_TEXT.carouselWords} 
            interval={2}
            duration={0.3}
            className="text-white font-bold"
          />
          <span>Our Ink</span>
        </p>
      </div>

      <div className="flex gap-12 w-full justify-center items-stretch">
        <ReusableScrollArea items={11} label="Styles" />
        <ReusableScrollArea items={11} label="Collors" />
      </div>
    </div>
  );
}
