import { GalleryThriveSection } from "@/components/home/gallery-thrive/gallery-thrive-section";
import { LandingFooterSection } from "@/components/home/landing-footer/landing-footer-section";
import { HeroSection } from "@/components/home/hero-section";
import { PlantParentsSection } from "@/components/home/plant-parents/plant-parents-section";
import { SignInGatewaySection } from "@/components/home/sign-in-gateway/sign-in-gateway-section";
import { TheBrainSection } from "@/components/home/the-brain/the-brain-section";
import { SiteHeader } from "@/components/layout/site-header";
import { getSessionUser } from "@/lib/auth/get-user";
import { lostTumbler, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await getSessionUser();
  const ctaHref = user ? "/plants" : "/auth";

  return (
    <main
      className={cn(
        lostTumbler.variable,
        poppins.variable,
        "bg-[#0d0d0d]",
      )}
    >
      <SiteHeader />
      <HeroSection ctaHref={ctaHref} />
      <PlantParentsSection />
      <TheBrainSection />
      {!user ? <SignInGatewaySection /> : null}
      <GalleryThriveSection />
      <LandingFooterSection />
    </main>
  );
}
