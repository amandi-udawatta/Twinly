"use client";

import { useEffect, useState } from "react";

import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { cn } from "@/lib/utils";

interface SiteHeaderClientProps {
  className?: string;
  isAuthenticated: boolean;
  profileHref: string;
}

export function SiteHeaderClient({
  className,
  isAuthenticated,
  profileHref,
}: SiteHeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-[100] w-full transition-all duration-300 ease-in-out",
        isScrolled
          ? "h-16 bg-black/40 shadow-lg backdrop-blur-md"
          : "h-24 bg-transparent",
        className,
      )}
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center gap-10 px-6 md:px-12">
        <SiteHeaderNav
          isAuthenticated={isAuthenticated}
          profileHref={profileHref}
        />
      </div>
    </header>
  );
}
