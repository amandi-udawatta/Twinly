"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const menuMotion = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

const heroTriggerClass =
  "flex h-8 w-8 items-center justify-center rounded-full bg-[#E8E4D9] transition-all duration-300 hover:scale-105 hover:bg-[#4ADE80] hover:shadow-[0_0_16px_rgba(74,222,128,0.45)] sm:h-9 sm:w-9";

const heroMenuPanelClass =
  "absolute top-full z-50 mt-2 min-w-[12.5rem] overflow-hidden rounded-2xl border border-white/10 bg-black/50 py-1.5 font-poppins shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md";

const heroMenuItemClass =
  "block w-full px-4 py-2.5 text-left text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80]";

const defaultMenuPanelClass =
  "absolute top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card py-1 font-poppins shadow-lg";

const defaultMenuItemClass =
  "block w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function useDismissOnOutsideClick(
  rootRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [rootRef, onClose]);
}

function AnimatedMenuPanel({
  open,
  align,
  isHero,
  children,
}: {
  open: boolean;
  align: "left" | "right";
  isHero: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="menu"
          {...menuMotion}
          className={cn(
            isHero ? heroMenuPanelClass : defaultMenuPanelClass,
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

interface UserMenuProps {
  variant?: "default" | "hero";
}

export function UserMenu({ variant = "default" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isHero = variant === "hero";

  useDismissOnOutsideClick(rootRef, () => setOpen(false));

  const itemClass = isHero ? heroMenuItemClass : defaultMenuItemClass;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          isHero
            ? heroTriggerClass
            : "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {isHero ? (
          <Image
            src="/hero/user-svgrepo-com.svg"
            alt=""
            width={22}
            height={22}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
        ) : (
          <UserIcon className="h-5 w-5" />
        )}
      </button>
      <AnimatedMenuPanel open={open} align={isHero ? "right" : "left"} isHero={isHero}>
        <Link
          href="/settings"
          role="menuitem"
          className={itemClass}
          onClick={() => setOpen(false)}
        >
          Profile &amp; settings
        </Link>
        <form action={signOut}>
          <button type="submit" role="menuitem" className={itemClass}>
            Log out
          </button>
        </form>
      </AnimatedMenuPanel>
    </div>
  );
}

interface GuestAccountMenuProps {
  signInHref?: string;
}

/** Sign-in icon with animated Sign in / Sign up menu (logged-out header). */
export function GuestAccountMenu({ signInHref = "/auth" }: GuestAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useDismissOnOutsideClick(rootRef, () => setOpen(false));

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={heroTriggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Sign in"
      >
        <Image
          src="/hero/user-svgrepo-com.svg"
          alt=""
          width={22}
          height={22}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
      </button>
      <AnimatedMenuPanel open={open} align="right" isHero>
        <Link
          href={signInHref}
          role="menuitem"
          className={heroMenuItemClass}
          onClick={() => setOpen(false)}
        >
          Sign in
        </Link>
        <Link
          href={`${signInHref}${signInHref.includes("?") ? "&" : "?"}tab=signup`}
          role="menuitem"
          className={heroMenuItemClass}
          onClick={() => setOpen(false)}
        >
          Sign up
        </Link>
      </AnimatedMenuPanel>
    </div>
  );
}
