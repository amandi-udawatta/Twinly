import { redirect } from "next/navigation";

import { updateLocationCity } from "@/app/auth/actions";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageShell } from "@/components/layout/page-shell";
import { getUserLocationCity } from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth");

  const locationCity = await getUserLocationCity(user.id);

  return (
    <PageShell
      title="Profile & settings"
      description="Manage your account preferences for Twinly."
    >
      <div className="mx-auto max-w-lg space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{user.email}</span>
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
