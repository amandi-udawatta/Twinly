"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

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

interface UserMenuProps {
  variant?: "default" | "hero";
}

export function UserMenu({ variant = "default" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const isHero = variant === "hero";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          isHero
            ? "flex h-8 w-8 items-center justify-center rounded-full bg-[#E8E4D9] transition-transform hover:scale-105 sm:h-9 sm:w-9"
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
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg",
            isHero ? "right-0" : "left-0",
          )}
        >
          <Link
            href="/settings"
            role="menuitem"
            className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Profile &amp; settings
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
            >
              Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
