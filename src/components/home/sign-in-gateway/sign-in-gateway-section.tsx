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
      <Image
        src={SIGN_IN_ASSETS.background}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />

      <ScrollReveal
        className={cn(
          LANDING_SECTION_CONTENT,
          "relative z-10 flex min-h-[min(85vh,720px)] w-full max-w-none flex-col justify-center px-6 py-16 sm:px-10 lg:min-h-[min(80vh,640px)] lg:px-16 xl:px-20",
        )}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 lg:max-w-2xl">
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
      </ScrollReveal>
    </section>
  );
}
