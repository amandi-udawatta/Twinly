import { RoutePlaceholder } from "@/components/ui/route-placeholder";

interface PlantPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantPage({ params }: PlantPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title="Plant profile"
      description={`Individual plant dashboard for ${id}.`}
    />
  );
}
