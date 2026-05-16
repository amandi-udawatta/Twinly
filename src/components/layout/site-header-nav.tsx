"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plants", label: "My Plants" },
] as const;

interface SiteHeaderNavProps {
  className?: string;
  isAuthenticated: boolean;
  profileHref: string;
}

function getActiveIndex(pathname: string) {
  const index = NAV_LINKS.findIndex(({ href }) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`),
  );
  return index === -1 ? 0 : index;
}

export function SiteHeaderNav({
  className,
  isAuthenticated,
  profileHref,
}: SiteHeaderNavProps) {
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname);
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    const link = linkRefs.current[activeIndex];
    if (!list || !link) return;

    setIndicator({
      left: link.offsetLeft,
      width: link.offsetWidth,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, pathname]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(list);
    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <nav
      className={cn(
        "animate-hero-nav-in mx-auto flex w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-white/25 bg-white/[0.08] px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl backdrop-saturate-150 sm:gap-4 sm:px-6 sm:py-2.5",
        className,
      )}
      aria-label="Main"
    >
      <ul
        ref={listRef}
        className="relative flex flex-1 items-center justify-center gap-3 sm:gap-6 md:gap-10"
      >
        {NAV_LINKS.map(({ href, label }, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={href}>
              <Link
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                href={href}
                className={cn(
                  "font-lost-tumbler relative block pb-1 text-xs uppercase tracking-[0.1em] transition-colors duration-300 sm:text-sm md:text-base",
                  isActive ? "text-white" : "text-white/75 hover:text-white/95",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}

        <span
          className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[#57B55D] transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
          aria-hidden
        />
      </ul>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C518] transition-transform hover:scale-105 sm:h-9 sm:w-9"
          aria-label="Dashboard"
        >
          <Image
            src="/hero/alert-circle-svgrepo-com.svg"
            alt=""
            width={20}
            height={20}
            className="h-3.5 w-3.5 brightness-0 sm:h-4 sm:w-4"
          />
        </Link>

        {isAuthenticated ? (
          <UserMenu variant="hero" />
        ) : (
          <Link
            href={profileHref}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8E4D9] transition-transform hover:scale-105 sm:h-9 sm:w-9"
            aria-label="Sign in"
          >
            <Image
              src="/hero/user-svgrepo-com.svg"
              alt=""
              width={22}
              height={22}
              className="h-4 w-4 sm:h-5 sm:w-5"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
