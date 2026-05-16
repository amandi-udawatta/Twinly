"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  LANDING_SECTION_CONTENT,
  LANDING_SECTION_SHELL,
} from "@/components/home/landing-layout";
import { PlantParentCard } from "@/components/home/plant-parents/plant-parent-card";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import {
  PLANT_PARENTS_ASSETS,
  PLANT_PARENT_CARDS,
  PLANT_PARENTS_SUBHEADER,
} from "@/components/home/plant-parents/data";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}

export function PlantParentsSection() {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const maxPage = isDesktop ? 1 : PLANT_PARENT_CARDS.length - 1;
  const isLastPage = page >= maxPage;

  const desktopSlides = useMemo(
    () => [
      PLANT_PARENT_CARDS.slice(0, 2),
      PLANT_PARENT_CARDS.slice(2, 4),
    ],
    [],
  );

  useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [maxPage, page]);

  const goNext = useCallback(() => {
    setDirection(1);
    setPage((current) => Math.min(current + 1, maxPage));
  }, [maxPage]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setPage((current) => Math.max(current - 1, 0));
  }, []);

  const handleNavClick = () => {
    if (isLastPage) goBack();
    else goNext();
  };

  const slideVariants = prefersReducedMotion
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (navDirection: number) => ({
          x: navDirection > 0 ? "100%" : "-100%",
          opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (navDirection: number) => ({
          x: navDirection > 0 ? "-100%" : "100%",
          opacity: 0,
        }),
      };

  const transition = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.85 };

  return (
    <section
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        LANDING_SECTION_SHELL,
        "isolate",
      )}
      aria-labelledby="plant-parents-heading"
    >
      <Image
        src={PLANT_PARENTS_ASSETS.background}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-black/45"
        aria-hidden
      />

      <ScrollReveal className={cn(LANDING_SECTION_CONTENT, "max-w-[1280px]")}>
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 lg:mb-12">
          <h2
            id="plant-parents-heading"
            className="font-lost-tumbler text-[clamp(2.5rem,8vw,4.5rem)] uppercase leading-none tracking-tight text-[#57B55D] lg:text-[4.75rem]"
          >
            Plant Parents
          </h2>
          <p className="font-poppins mt-4 text-sm italic leading-relaxed text-white/95 sm:text-base lg:text-lg">
            {PLANT_PARENTS_SUBHEADER}
          </p>
        </header>

        <div className="relative pb-16 sm:pb-20">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {isDesktop ? (
                <motion.div
                  key={`desktop-${page}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8"
                >
                  {desktopSlides[page]?.map((card) => (
                    <PlantParentCard key={card.id} card={card} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`mobile-${page}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full"
                >
                  <PlantParentCard card={PLANT_PARENT_CARDS[page]!} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <CarouselNavButton isLastPage={isLastPage} onClick={handleNavClick} />
        </div>
      </ScrollReveal>
    </section>
  );
}

function CarouselNavButton({
  isLastPage,
  onClick,
}: {
  isLastPage: boolean;
  onClick: () => void;
}) {
  const iconSrc = isLastPage
    ? PLANT_PARENTS_ASSETS.back
    : PLANT_PARENTS_ASSETS.next;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
      aria-label={
        isLastPage ? "Previous plant parent cards" : "Next plant parent cards"
      }
      whileTap={{ scale: 0.94 }}
    >
      <Image
        src={iconSrc}
        alt=""
        width={28}
        height={28}
        className="h-6 w-6 sm:h-7 sm:w-7"
      />
    </motion.button>
  );
}
