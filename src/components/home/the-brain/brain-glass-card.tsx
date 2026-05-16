"use client";

import { motion } from "framer-motion";

import type { BrainDiagramLayout } from "@/components/home/the-brain/data";
import { cn } from "@/lib/utils";

interface BrainGlassCardProps {
  config: BrainDiagramLayout;
  className?: string;
}

export function BrainGlassCard({ config, className }: BrainGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 480, damping: 28 }}
      className={cn(
        "pointer-events-none z-20 w-[300px] max-w-[min(300px,calc(100vw-2rem))] rounded-[1.5rem] border border-white/20 bg-white/10 p-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md",
        className,
      )}
    >
      <h3 className="font-lost-tumbler text-base uppercase leading-tight tracking-wide sm:text-lg">
        {config.title}
      </h3>
      <p className="font-poppins mt-2 text-xs leading-relaxed text-white/90 sm:text-sm">
        {config.description}
      </p>
    </motion.div>
  );
}
