import { redirect } from "next/navigation";

interface ScanPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: ScanPageProps) {
  const { id } = await params;
  redirect(`/plants/${id}/checkin`);
}
