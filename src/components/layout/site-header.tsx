import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { getSessionUser } from "@/lib/auth/get-user";

interface SiteHeaderProps {
  className?: string;
}

export async function SiteHeader({ className }: SiteHeaderProps) {
  const user = await getSessionUser();

  return (
    <SiteHeaderClient
      className={className}
      isAuthenticated={!!user}
      profileHref={user ? "/settings" : "/auth"}
    />
  );
}
