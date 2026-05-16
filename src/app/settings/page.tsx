import { redirect } from "next/navigation";

import { updateLocationCity } from "@/app/auth/actions";
import {
  dashboardMuted,
  dashboardPanel,
  dashboardPanelTitle,
} from "@/components/dashboard/dashboard-theme";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";
import { getUserLocationCity } from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const locationCity = await getUserLocationCity(user.id);

  return (
    <PageShell
      variant="twinly"
      title="Profile & settings"
      description="Manage your account preferences for Twinly."
    >
      <div className="mx-auto max-w-lg space-y-6">
        <section className={dashboardPanel}>
          <h2 className={dashboardPanelTitle}>Account</h2>
          <p className={cn("mt-2", dashboardMuted)}>
            Signed in as{" "}
            <span className="font-medium text-white">{user.email}</span>
          </p>
        </section>
        <SettingsForm
          action={updateLocationCity}
          initialCity={locationCity ?? ""}
        />
      </div>
    </PageShell>
  );
}
