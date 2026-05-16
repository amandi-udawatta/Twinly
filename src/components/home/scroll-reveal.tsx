"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const revealTransition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={revealTransition}
    >
      {children}
    </motion.div>
  );
}
