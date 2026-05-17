import Link from "next/link";
import { redirect } from "next/navigation";

import {
  dashboardCtaPrimary,
  dashboardCtaSecondary,
} from "@/components/dashboard/dashboard-theme";
import { RegisterPlantWizard } from "@/components/plants/register-plant-wizard";
import { QrDisplay } from "@/components/plants/qr-display";
import { PageShell } from "@/components/layout/page-shell";
import { getSessionUser } from "@/lib/auth/get-user";
import { cn } from "@/lib/utils";

interface NewPlantPageProps {
  searchParams: Promise<{ step?: string; plantId?: string }>;
}

export default async function NewPlantPage({ searchParams }: NewPlantPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/auth?next=/plants/new");

  const params = await searchParams;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (params.step === "qr" && params.plantId) {
    return (
      <PageShell
        variant="twinly"
        titleFont="poppins"
        title="Your plant QR code"
        description="Print or save this code to check in quickly from your phone."
      >
        <div className="mx-auto max-w-xl">
          <QrDisplay
            plantId={params.plantId}
            appUrl={appUrl}
            appearance="twinly"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/plants/${params.plantId}`}
              className={cn(dashboardCtaPrimary, "px-8 py-3 text-base")}
            >
              View plant
            </Link>
            <Link
              href="/plants"
              className={cn(dashboardCtaSecondary, "px-8 py-3 text-base")}
            >
              My Plants
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      variant="twinly"
      titleFont="poppins"
      title="Register a plant"
      description="Upload a photo — Twinly will help fill in species and care details."
    >
      <RegisterPlantWizard appearance="twinly" />
    </PageShell>
  );
}
