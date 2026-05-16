"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { BrainGlassCard } from "@/components/home/the-brain/brain-glass-card";
import {
  BRAIN_DIAGRAM,
  DIAGRAM_BASELINE,
  THE_BRAIN_ASSETS,
  type BrainPathId,
} from "@/components/home/the-brain/data";
import { cn } from "@/lib/utils";

type RevealedState = Record<BrainPathId, boolean>;

const INITIAL_REVEALED: RevealedState = { 1: false, 2: false, 3: false };

function CheckeredNode() {
  return (
    <div
      className="relative z-10 h-11 w-11 rounded-full border-[3px] border-[#3d8f44] sm:h-12 sm:w-12"
      style={{
        backgroundColor: "#4ADE80",
        backgroundImage: `
          linear-gradient(0deg, rgba(22,60,28,0.6) 50%, transparent 50%),
          linear-gradient(90deg, rgba(22,60,28,0.6) 50%, transparent 50%)
        `,
        backgroundSize: "8px 8px",
      }}
      aria-hidden
    />
  );
}

interface BrainDiagramProps {
  pulseToken?: number;
}

export function BrainDiagram({ pulseToken = 0 }: BrainDiagramProps) {
  const [revealed, setRevealed] = useState<RevealedState>(INITIAL_REVEALED);
  const [pulseHints, setPulseHints] = useState(false);

  useEffect(() => {
    if (pulseToken > 0) {
      setPulseHints(true);
      const timer = window.setTimeout(() => setPulseHints(false), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [pulseToken]);

  const revealPath = useCallback((id: BrainPathId) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  }, []);

  const showMascot = (path: (typeof BRAIN_DIAGRAM)[number]) =>
    path.mascotInitiallyVisible || revealed[path.id];

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[720px] sm:h-[480px] lg:h-[500px]">
      {/* Green baseline */}
      <div
        className="absolute left-0 right-0 z-[2] bg-[#4ADE80]"
        style={{
          top: DIAGRAM_BASELINE.top,
          height: DIAGRAM_BASELINE.height,
          transform: "translateY(-50%)",
        }}
        aria-hidden
      />

      {/* Connector paths */}
      <svg
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {BRAIN_DIAGRAM.map((path) => (
          <path
            key={`line-${path.id}`}
            d={path.pathD}
            fill="none"
            stroke="rgba(190,190,190,0.65)"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Nodes + mascots */}
      {BRAIN_DIAGRAM.map((path) => (
        <div
          key={`node-${path.id}`}
          className="absolute z-[5] -translate-x-1/2 -translate-y-1/2"
          style={{ left: path.node.left, top: path.node.top }}
        >
          <AnimatePresence>
            {showMascot(path) ? (
              <motion.div
                initial={
                  path.mascotInitiallyVisible
                    ? false
                    : { opacity: 0, y: 16, scale: 0.85 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className="pointer-events-none absolute bottom-[calc(100%-2px)] left-1/2 w-[76px] -translate-x-1/2 sm:w-[88px] lg:w-[96px]"
              >
                <Image
                  src={THE_BRAIN_ASSETS[path.mascot]}
                  alt=""
                  width={110}
                  height={130}
                  className="h-auto w-full object-contain drop-shadow-lg"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <CheckeredNode />
        </div>
      ))}

      {/* Glow buttons */}
      {BRAIN_DIAGRAM.map((path) => (
        <motion.button
          key={`glow-${path.id}`}
          type="button"
          onClick={() => revealPath(path.id)}
          className={cn(
            "absolute z-[15] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] sm:h-4 sm:w-4",
            revealed[path.id] && "ring-2 ring-white/60",
          )}
          style={{ left: path.glow.left, top: path.glow.top }}
          aria-label={`Reveal ${path.title}`}
          aria-pressed={revealed[path.id]}
          animate={
            pulseHints && !revealed[path.id]
              ? { scale: [1, 1.45, 1], opacity: [1, 0.75, 1] }
              : { scale: 1 }
          }
          transition={
            pulseHints
              ? { duration: 0.55, repeat: 2, ease: "easeInOut" }
              : undefined
          }
          whileTap={{ scale: 0.85 }}
        />
      ))}

      {/* Glass cards — fixed absolute slots */}
      {BRAIN_DIAGRAM.map((path) => (
        <AnimatePresence key={`card-${path.id}`}>
          {revealed[path.id] ? (
            <motion.div
              className="absolute z-20"
              style={{ left: path.card.left, top: path.card.top }}
              initial={false}
            >
              <BrainGlassCard config={path} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      ))}
    </div>
  );
}
