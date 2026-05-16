import Link from "next/link";

import { RegisterPlantWizard } from "@/components/plants/register-plant-wizard";
import { QrDisplay } from "@/components/plants/qr-display";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewPlantPageProps {
  searchParams: Promise<{ step?: string; plantId?: string }>;
}

export default async function NewPlantPage({ searchParams }: NewPlantPageProps) {
  const params = await searchParams;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (params.step === "qr" && params.plantId) {
    return (
      <PageShell
        title="Your plant QR code"
        description="Print or save this code to check in quickly from your phone."
      >
        <QrDisplay plantId={params.plantId} appUrl={appUrl} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/plants/${params.plantId}`}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            View plant
          </Link>
          <Link
            href="/plants"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            My Plants
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Register a plant"
      description="Upload a photo — Twinly will help fill in species and care details."
    >
      <RegisterPlantWizard />
    </PageShell>
  );
}
