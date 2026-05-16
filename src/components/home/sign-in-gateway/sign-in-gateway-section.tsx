import Image from "next/image";
import Link from "next/link";

import {
  SIGN_IN_ASSETS,
  SIGN_IN_COPY,
} from "@/components/home/sign-in-gateway/data";
import {
  LANDING_SECTION_CONTENT,
  LANDING_SECTION_SHELL,
} from "@/components/home/landing-layout";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function SignInGatewaySection() {
  return (
    <section
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        LANDING_SECTION_SHELL,
      )}
      aria-labelledby="sign-in-gateway-heading"
    >
      <ScrollReveal
        className={cn(
          LANDING_SECTION_CONTENT,
          "max-w-none px-0 py-0 sm:px-0 lg:px-0",
        )}
      >
        <div className="grid w-full min-h-[min(85vh,720px)] grid-cols-1 lg:min-h-[min(80vh,640px)] lg:grid-cols-[3fr_2fr]">
          <LeftColumn />
          <RightColumn />
        </div>
      </ScrollReveal>
    </section>
  );
}

function LeftColumn() {
  return (
    <div className="relative flex flex-col justify-between px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
      <Image
        src={SIGN_IN_ASSETS.leftBackground}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority={false}
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-8">
        <div>
          <p className="font-lost-tumbler text-[clamp(1.75rem,5.5vw,2.75rem)] uppercase leading-[0.95] tracking-tight text-[#57B55D] lg:text-[2.5rem] xl:text-[3rem]">
            Welcome back
          </p>
          <p className="font-lost-tumbler text-[clamp(1.75rem,5.5vw,2.75rem)] uppercase leading-[0.95] tracking-tight text-[#57B55D] lg:text-[2.5rem] xl:text-[3rem]">
            to the
          </p>
          <h2
            id="sign-in-gateway-heading"
            className="font-lost-tumbler text-[clamp(2.25rem,7vw,3.5rem)] uppercase leading-[0.9] tracking-tight text-[#57B55D] lg:text-[3.25rem] xl:text-[4rem]"
          >
            Greenhouse
          </h2>
        </div>

        <div className="font-poppins max-w-md space-y-2 text-sm italic leading-relaxed text-white/95 sm:text-base lg:text-lg">
          {SIGN_IN_COPY.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="!mt-5 pt-1">{SIGN_IN_COPY.footer}</p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link
            href="/auth"
            className="font-poppins rounded-full bg-[#9CA3AF] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-base"
          >
            Sign In
          </Link>
          <Link
            href="/auth?tab=signup"
            className="font-poppins rounded-full bg-[#6B8F5C] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-[0.98] sm:px-8 sm:py-3 sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

function RightColumn() {
  return (
    <div className="relative min-h-[280px] lg:min-h-0">
      <Image
        src={SIGN_IN_ASSETS.rightBackground}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />

      <div className="relative z-10 flex h-full min-h-[280px] items-end justify-center lg:min-h-full lg:justify-end lg:pr-4">
        <Image
          src={SIGN_IN_ASSETS.mascot}
          alt="Twinly mascot"
          width={420}
          height={520}
          className="relative h-auto w-[min(85vw,320px)] max-w-none -translate-x-[8%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:w-[min(70vw,380px)] lg:-ml-[28%] lg:w-[min(110%,420px)] lg:max-w-[480px] lg:translate-x-0 xl:-ml-[32%] xl:w-[480px]"
          priority={false}
        />
      </div>
    </div>
  );
}
