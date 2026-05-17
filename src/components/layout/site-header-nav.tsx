"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GuestAccountMenu, UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "DASHBOARD", href: "/dashboard" },
  { name: "MY PLANTS", href: "/plants" },
] as const;

function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SiteHeaderNavProps {
  className?: string;
  isAuthenticated: boolean;
  profileHref: string;
}

export function SiteHeaderNav({
  className,
  isAuthenticated,
  profileHref,
}: SiteHeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "animate-hero-nav-in relative flex h-full w-full items-center",
        className,
      )}
      aria-label="Main"
    >
      <Link
        href="/"
        className="absolute left-0 top-1/2 shrink-0 -translate-y-1/2 transition-opacity duration-300 hover:opacity-80"
        aria-label="Twinly home"
      >
        <Image
          src="/hero/lg.png"
          alt="Twinly Logo"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </Link>

      <ul className="relative mx-auto flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
        {navLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative font-lost-tumbler text-xs font-bold uppercase tracking-wide transition-colors duration-300 ease-in-out sm:text-sm md:text-base",
                  "text-white/90 hover:text-[#4ADE80]",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-[#4ADE80] after:transition-transform after:duration-300 after:content-['']",
                  isActive
                    ? "text-[#4ADE80] after:origin-bottom-left after:scale-x-100"
                    : "after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100",
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="absolute right-0 top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-1.5 sm:gap-2">
        {isAuthenticated ? (
          <UserMenu variant="hero" />
        ) : (
          <GuestAccountMenu signInHref={profileHref} />
        )}
      </div>
    </nav>
  );
}
