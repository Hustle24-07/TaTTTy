"use client";

import * as React from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    MotionValue,
    AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ReactionDockProps {
    items: {
        icon: React.ReactNode;
        label: string;
        onClick?: () => void;
    }[];
    className?: string;
    orientation?: "horizontal" | "vertical";
}

export function ReactionDock({ items, className, orientation = "horizontal" }: ReactionDockProps) {
    const mouseValue = useMotionValue(Infinity);
    const isVertical = orientation === "vertical";

    return (
        <motion.div
            onMouseMove={(e) => mouseValue.set(isVertical ? e.pageY : e.pageX)}
            onMouseLeave={() => mouseValue.set(Infinity)}
            className={cn(
                "mx-auto flex gap-4 rounded-2xl p-3",
                "bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl",
                isVertical ? "flex-col w-16 items-center h-auto" : "h-16 items-end px-4",
                className
            )}
        >
            {items.map((item, i) => (
                <DockItem 
                    key={i} 
                    mouseValue={mouseValue} 
                    onClick={item.onClick} 
                    label={item.label}
                    orientation={orientation}
                >
                    {item.icon}
                </DockItem>
            ))}
        </motion.div>
    );
}

function DockItem({
    mouseValue,
    children,
    onClick,
    label,
    orientation,
}: Readonly<{
    mouseValue: MotionValue;
    children: React.ReactNode;
    onClick?: () => void;
    label: string;
    orientation: "horizontal" | "vertical";
}>) {
    const ref = React.useRef<HTMLDivElement>(null);
    const isVertical = orientation === "vertical";

    const distance = useTransform(mouseValue, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
        if (isVertical) {
            return val - bounds.y - bounds.height / 2;
        } else {
            return val - bounds.x - bounds.width / 2;
        }
    });

    const sizeSync = useTransform(distance, [-150, 0, 150], [40, 90, 40]);
    const size = useSpring(sizeSync, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [isHovered, setHovered] = React.useState(false);
    const [hasReacted, setHasReacted] = React.useState(false);

    const handleClick = () => {
        setHasReacted(!hasReacted);
        if (onClick) onClick();
    };

    return (
        <div className={cn("relative flex items-center", isVertical ? "flex-row" : "flex-col")}>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: isVertical ? -10 : "-50%", y: isVertical ? "-50%" : 10 }}
                        animate={{ opacity: 1, x: isVertical ? -50 : "-50%", y: isVertical ? "-50%" : 0 }}
                        exit={{ opacity: 0, x: isVertical ? -10 : "-50%", y: isVertical ? "-50%" : 2 }}
                        className={cn(
                            "absolute w-fit whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-900 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
                            isVertical ? "right-full mr-2 top-1/2" : "-top-10 left-1/2"
                        )}
                    >
                        {label}
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                ref={ref}
                style={{ 
                    width: isVertical ? 40 : size,
                    height: isVertical ? size : 40,
                }}
                className="aspect-square rounded-full flex items-center justify-center relative"
                onClick={handleClick}
            >
                <AnimatePresence>
                    {hasReacted && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-full z-0"
                        />
                    )}
                </AnimatePresence>
                <motion.div
                    className={cn(
                        "w-full h-full flex items-center justify-center relative z-20 transition-colors duration-200",
                    )}
                    whileTap={{ scale: 0.8 }}
                >
                    {React.isValidElement(children)
                        ? React.cloneElement(children as React.ReactElement<any>, {
                            fill: hasReacted ? "currentColor" : "none",
                            stroke: hasReacted ? "white" : "currentColor",
                            strokeWidth: hasReacted ? 1.5 : 2,
                            className: cn((children as React.ReactElement<any>).props.className, "transition-all duration-300")
                        })
                        : children}
                </motion.div>
            </motion.div>
        </div>
    );
}
