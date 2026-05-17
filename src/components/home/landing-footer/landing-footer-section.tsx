import Image from "next/image";
import Link from "next/link";

import {
  FOOTER_ASSETS,
  FOOTER_NAV_LINKS,
  FOOTER_TAGLINE,
} from "@/components/home/landing-footer/data";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function LandingFooterSection() {
  return (
    <footer
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        "relative w-full overflow-hidden",
      )}
    >
      <div className="relative min-h-[480px] w-full sm:min-h-[520px]">
        <Image
          src={FOOTER_ASSETS.background}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />

        <FooterOverlay />

        <div className="relative z-10 flex w-full flex-col items-center px-4 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
          <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="font-lost-tumbler text-[clamp(3.5rem,14vw,7rem)] uppercase leading-none tracking-tight text-[#4ADE80] transition-opacity hover:opacity-90 lg:text-[7.5rem]"
            >
              Twinly
            </Link>

            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-12"
            >
              {FOOTER_NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-lost-tumbler text-sm uppercase tracking-[0.08em] text-white/95 transition-colors hover:text-green-400 sm:text-base md:text-lg"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <FooterTaglines />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-black/40"
      aria-hidden
    />
  );
}

function FooterTaglines() {
  return (
    <div className="font-poppins flex w-full max-w-md flex-col items-center gap-3 text-center sm:max-w-lg sm:gap-4">
      <p className="text-sm italic leading-relaxed text-white sm:text-base lg:text-lg">
        {FOOTER_TAGLINE.primary}
      </p>
      <p className="max-w-[28ch] text-xs italic leading-relaxed text-white/80 sm:max-w-none sm:text-sm lg:text-base">
        {FOOTER_TAGLINE.secondary}
      </p>
      <Image
        src={FOOTER_ASSETS.mascot}
        alt=""
        width={120}
        height={100}
        className="mt-1 h-auto w-[72px] object-contain drop-shadow-md sm:mt-2 sm:w-[88px] lg:w-[100px]"
      />
    </div>
  );
}
