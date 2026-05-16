import { redirect } from "next/navigation";

import { CheckinForm } from "@/components/checkins/checkin-form";
import { PageShell } from "@/components/layout/page-shell";
import { getPlantById } from "@/lib/data/plants";
import { getSessionUser } from "@/lib/auth/get-user";

interface CheckinPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ next?: string }>;
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(`/plants/${id}/checkin`)}`);
  }

  const plant = await getPlantById(id, user.id);
  if (!plant) {
    redirect("/dashboard");
  }

  const plantName = plant.nickname || plant.species || "Your plant";

  return (
    <PageShell
      title="Daily check-in"
      description="Upload fresh photos for an AI health analysis."
    >
      <CheckinForm plantId={plant.id} plantName={plantName} />
    </PageShell>
  );
}
