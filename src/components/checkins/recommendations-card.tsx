interface RecommendationsCardProps {
  recommendations: string[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-medium">Recommendations</h3>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
        {recommendations.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
