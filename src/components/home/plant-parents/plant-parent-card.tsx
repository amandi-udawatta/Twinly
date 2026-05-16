import Image from "next/image";

import type { PlantParentCardData } from "@/components/home/plant-parents/data";
import { cn } from "@/lib/utils";

interface PlantParentCardProps {
  card: PlantParentCardData;
  className?: string;
}

export function PlantParentCard({ card, className }: PlantParentCardProps) {
  return (
    <article
      className={cn(
        "flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl bg-[#E8E8E8] shadow-[0_4px_24px_rgba(0,0,0,0.12)] sm:min-h-[300px] sm:flex-row lg:min-h-[320px]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-center px-4 pb-2 pt-5 sm:w-[44%] sm:px-5 sm:py-6 lg:w-[42%]">
        <Image
          src={card.mascotSrc}
          alt=""
          width={280}
          height={280}
          className="h-auto max-h-[200px] w-full max-w-[240px] object-contain sm:max-h-[240px] lg:max-h-[260px]"
        />
      </div>

      <div
        className="mx-5 hidden w-px shrink-0 self-stretch bg-gray-400/80 sm:mx-0 sm:my-6 sm:block"
        aria-hidden
      />

      <div className="flex flex-1 flex-col justify-center gap-3 border-t border-gray-400/50 px-5 pb-6 pt-4 sm:border-t-0 sm:gap-4 sm:px-6 sm:py-6 sm:pr-8">
        <h3 className="font-lost-tumbler text-xl uppercase leading-tight tracking-wide text-black sm:text-2xl lg:text-[1.65rem]">
          {card.title}
        </h3>
        <p className="font-poppins text-sm leading-relaxed text-black/90 sm:text-[0.9375rem] lg:text-base">
          {card.body}
        </p>
      </div>
    </article>
  );
}
