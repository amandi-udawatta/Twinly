"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import {
  BRAIN_TIMELINE_STEPS,
  THE_BRAIN_ASSETS,
  THE_BRAIN_ROBOT,
} from "@/components/home/the-brain/data";
import { cn } from "@/lib/utils";

const TRACK_LEFT = "left-[15%] lg:left-[25%]";
const CONTENT_AREA =
  "absolute left-[20%] lg:left-[30%] right-0 h-full md:right-[-10%]";

const NODE_POSITIONS = ["top-[15%]", "top-[50%]", "top-[85%]"] as const;

const cardMotion = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, filter: "blur(10px)" },
  transition: { duration: 0.4 },
};

interface BrainTimelineProps {
  pulseToken?: number;
}

export function BrainTimeline({ pulseToken = 0 }: BrainTimelineProps) {
  const [revealed, setRevealed] = useState<number[]>([]);

  useEffect(() => {
    if (pulseToken > 0) {
      setRevealed([1, 2, 3]);
    }
  }, [pulseToken]);

  const revealNode = useCallback((id: number) => {
    setRevealed((prev) => (prev.includes(id) ? prev : [...prev, id].sort((a, b) => a - b)));
  }, []);

  const showRobot = revealed.length === 0;

  return (
    <div className="relative h-[600px] w-full">
      {/* Glow nodes */}
      {BRAIN_TIMELINE_STEPS.map((step, index) => {
        const isRevealed = revealed.includes(step.id);
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => revealNode(step.id)}
            className={cn(
              "absolute z-10 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-white/50 bg-gray-600 shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57B55D]",
              TRACK_LEFT,
              NODE_POSITIONS[index],
              isRevealed &&
                "border-white bg-white/30 shadow-[0_0_22px_rgba(255,255,255,1)]",
            )}
            aria-label={`Reveal ${step.title}`}
            aria-pressed={isRevealed}
          />
        );
      })}

      <AnimatePresence mode="wait">
        {showRobot ? (
          <motion.div
            key="brain-robot"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className={cn(
              CONTENT_AREA,
              "flex translate-x-12 items-center justify-center lg:translate-x-24",
            )}
          >
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={THE_BRAIN_ROBOT}
                alt="Twinly brain mascot"
                width={640}
                height={740}
                className="h-auto w-full max-w-[500px] -scale-x-100 object-contain drop-shadow-2xl lg:max-w-[640px]"
                priority={false}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="brain-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              CONTENT_AREA,
              "flex flex-col justify-center gap-8 overflow-visible",
            )}
          >
            <AnimatePresence mode="popLayout">
              {revealed.map((id) => {
                const step = BRAIN_TIMELINE_STEPS.find((s) => s.id === id);
                if (!step) return null;

                return (
                  <motion.div
                    key={id}
                    layout
                    {...cardMotion}
                    className="relative w-full max-w-[500px] shrink-0 rounded-[2rem] border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md"
                  >
                    <h3 className="font-lost-tumbler pr-28 text-base uppercase leading-tight tracking-wide md:pr-32 sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="font-poppins mt-2 pr-24 text-xs leading-relaxed text-white/90 md:pr-28 sm:text-sm">
                      {step.description}
                    </p>
                    <Image
                      src={THE_BRAIN_ASSETS[step.mascotKey]}
                      alt=""
                      width={192}
                      height={192}
                      className="pointer-events-none absolute -right-16 top-1/2 z-20 h-auto w-40 -translate-y-1/2 object-contain drop-shadow-2xl md:-right-24 md:w-48"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
