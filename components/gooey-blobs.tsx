"use client";
import { useId } from "react";
import { motion, type HTMLMotionProps } from "motion/react";



import { cn } from "@/lib/utils";
export interface LoaderGooeyBlobsProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  size?: number;
  color?: string;
  duration?: number;
}
export function LoaderGooeyBlobs({
  className,
  size = 20,
  color = "currentColor",
  duration = 1.5,
  ...props
}: LoaderGooeyBlobsProps) {
  const filterId = useId();
  return (
    <motion.div className={cn("flex items-center gap-2", className)} {...props}>
      <svg width="0" height="0">
        <title>Gooey Filter Definition</title>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
      <div
        style={{ filter: `url(#${filterId})` } as React.CSSProperties}
        className="flex gap-1"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
            animate={{
              x: [0, 15, 0, -15, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{
              duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
