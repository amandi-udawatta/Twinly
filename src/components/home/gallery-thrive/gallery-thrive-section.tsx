import Image from "next/image";

import {
  GALLERY_ASSETS,
  GALLERY_COPY,
} from "@/components/home/gallery-thrive/data";
import {
  LANDING_SECTION_CONTENT,
  LANDING_SECTION_SHELL,
} from "@/components/home/landing-layout";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function GalleryThriveSection() {
  return (
    <section
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        LANDING_SECTION_SHELL,
      )}
      aria-labelledby="gallery-thrive-heading"
    >
      <Image
        src={GALLERY_ASSETS.background}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />

      <ScrollReveal
        className={cn(
          LANDING_SECTION_CONTENT,
          "max-w-none flex flex-1 flex-col justify-end px-0 py-0 sm:px-0 lg:px-0",
        )}
      >
        <div className="relative flex w-full flex-col items-center">
          <div className="relative z-20 flex w-full justify-center px-4">
            <Image
              src={GALLERY_ASSETS.mascot}
              alt="Twinly mascot with magnifying glass"
              width={280}
              height={320}
              className="h-auto w-[min(52vw,200px)] translate-y-[18%] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)] sm:w-[220px] sm:translate-y-[20%] lg:w-[260px] lg:translate-y-[22%]"
            />
          </div>

          <div className="relative z-10 w-full bg-black/60 px-5 pb-10 pt-14 text-center sm:px-8 sm:pb-12 sm:pt-16 lg:px-12 lg:pb-14 lg:pt-20">
            <h2
              id="gallery-thrive-heading"
              className="font-lost-tumbler text-[clamp(1.75rem,6vw,3.25rem)] uppercase leading-tight tracking-tight text-[#A3E635] sm:text-4xl lg:text-5xl"
            >
              {GALLERY_COPY.title}
            </h2>
            <p className="font-poppins mx-auto mt-4 max-w-4xl text-sm italic leading-relaxed text-white sm:mt-5 sm:text-base lg:text-lg">
              {GALLERY_COPY.body}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
