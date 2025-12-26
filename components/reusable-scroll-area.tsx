import ScrollFade from "@/components/ui/scroll-fade";


interface ReusableScrollAreaProps {
  items: number;
  label: string;
}

const ReusableScrollArea = ({ items, label }: ReusableScrollAreaProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="font-(family-name:--font-orbitron) after:to-foreground relative max-w-[12ch] text-xl uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-linear-to-b after:from-transparent after:content-['']">
          {label}
        </span>
      </div>
      <div className="rounded-xl border">
        <ScrollFade className="w-62 h-72 rounded-xl" axis="vertical">
          <div className="space-y-1 p-1">
            {Array.from({ length: items }, (_, index) => index).map((index) => (
              <div
                key={`item-${index}`}
                className="text-foreground/30 hover:bg-foreground/10 bg-foreground/5 flex h-10 w-full items-center gap-2 rounded-lg px-4"
              >
                00{index} <div className="bg-foreground/10 h-px flex-1"></div>
              </div>
            ))}
          </div>
        </ScrollFade>
      </div>
    </div>
  );
};

export { ReusableScrollArea };
