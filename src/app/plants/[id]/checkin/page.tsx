import { RoutePlaceholder } from "@/components/ui/route-placeholder";

interface CheckinPageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title="Daily check-in"
      description={`Photo upload and Gemini analysis for plant ${id}.`}
    />
  );
}
