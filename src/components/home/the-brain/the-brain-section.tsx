"use client";

import { useState } from "react";

import { BrainTimeline } from "@/components/home/the-brain/brain-timeline";
import { THE_BRAIN_BODY } from "@/components/home/the-brain/data";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function TheBrainSection() {
  const [pulseToken, setPulseToken] = useState(0);

  return (
    <section
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        "relative flex min-h-screen items-center overflow-x-hidden bg-[url('/the-brain/herobackground.png')] bg-cover bg-center",
      )}
      aria-labelledby="the-brain-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 py-20 lg:grid-cols-2">
        <div className="w-full min-w-0 overflow-visible pr-4 sm:pr-8">
          <BrainTimeline pulseToken={pulseToken} />
        </div>

        <div className="flex flex-col items-start justify-center gap-6 lg:items-end lg:text-right">
          <div className="lg:ml-auto">
            <p className="font-lost-tumbler text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-none tracking-tight text-[#57B55D] lg:text-right">
              The
            </p>
            <h2
              id="the-brain-heading"
              className="font-lost-tumbler -mt-1 text-[clamp(3.5rem,12vw,5.5rem)] uppercase leading-[0.85] tracking-tight text-[#57B55D] lg:text-[5.5rem] xl:text-[6.25rem]"
            >
              Brain
            </h2>
          </div>

          <p className="font-poppins max-w-md text-sm italic leading-relaxed text-white/95 sm:text-base lg:ml-auto lg:max-w-sm lg:text-lg">
            {THE_BRAIN_BODY}
          </p>

          <button
            type="button"
            onClick={() => setPulseToken((n) => n + 1)}
            className="font-poppins rounded-full bg-gray-400/50 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:text-base lg:ml-auto"
          >
            Click the Paths
          </button>
        </div>
      </div>
    </section>
  );
}
