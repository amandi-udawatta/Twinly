import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { getSessionUser } from "@/lib/auth/get-user";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

export async function SiteHeader({ className }: SiteHeaderProps) {
  const user = await getSessionUser();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-[100] w-full border-b border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300",
        "px-4 pt-3 pb-2 sm:px-6 sm:pt-4",
        className,
      )}
    >
      <SiteHeaderNav
        isAuthenticated={!!user}
        profileHref={user ? "/settings" : "/auth"}
      />
    </header>
  );
}
