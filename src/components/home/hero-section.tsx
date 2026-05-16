import Image from "next/image";
import Link from "next/link";

import {
  LANDING_SECTION_CONTENT,
  LANDING_SECTION_SHELL,
} from "@/components/home/landing-layout";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  ctaHref: string;
}

export function HeroSection({ ctaHref }: HeroSectionProps) {
  return (
    <section
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        LANDING_SECTION_SHELL,
      )}
    >
      <Image
        src="/hero/hero-section.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30"
        aria-hidden
      />

      <ScrollReveal
        className={cn(
          LANDING_SECTION_CONTENT,
          "max-w-none px-5 pb-8 sm:px-10 lg:px-14 xl:px-20",
        )}
      >
        <HeroInner ctaHref={ctaHref} />
      </ScrollReveal>
    </section>
  );
}

function HeroInner({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-4 xl:gap-8">
      <div className="flex flex-col items-start justify-center gap-6 lg:gap-8 lg:pr-4">
        <h1 className="animate-hero-title-in font-lost-tumbler text-[clamp(4rem,16vw,5.5rem)] leading-[0.9] tracking-tight text-[#57B55D] sm:text-[clamp(4.5rem,14vw,6.5rem)] lg:text-[7.25rem] lg:leading-[0.88] xl:text-[8.25rem]">
          TWINLY
        </h1>

        <p className="animate-hero-copy-in font-poppins max-w-[36rem] text-[0.9375rem] italic leading-[1.45] text-white sm:text-base lg:text-[1.125rem] lg:leading-[1.5] xl:text-[1.25rem]">
          More than just a disease scanner. Twinly remembers your plant&apos;s
          <br />
          journey, tracks its health, and predicts its future using advanced AI.
        </p>

        <Link
          href={ctaHref}
          className="animate-hero-cta-in font-poppins inline-flex rounded-full bg-[#9CA3AF] px-9 py-3.5 text-base font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all hover:scale-[1.03] hover:bg-[#a8afb8] hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)] active:scale-[0.98] lg:px-10 lg:py-4"
        >
          Track my Plants
        </Link>
      </div>

      <div className="flex items-center justify-center lg:justify-end">
        <div className="animate-hero-buddies-float w-full max-w-[min(100%,420px)] lg:max-w-[min(100%,560px)] xl:max-w-[600px]">
          <Image
            src="/hero/herobuddies.png"
            alt="Twinly plant mascots"
            width={600}
            height={720}
            priority
            className="animate-hero-buddies-in h-auto w-full object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
