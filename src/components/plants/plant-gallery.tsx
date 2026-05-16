import Image from "next/image";

interface GalleryItem {
  id: string;
  date: string;
  urls: string[];
}

interface PlantGalleryProps {
  items: GalleryItem[];
}

function groupByDate(items: GalleryItem[]): Array<{ date: string; urls: string[] }> {
  const byDate = new Map<string, string[]>();

  for (const item of items) {
    const existing = byDate.get(item.date) ?? [];
    byDate.set(item.date, [...existing, ...item.urls]);
  }

  return Array.from(byDate.entries()).map(([date, urls]) => ({ date, urls }));
}

export function PlantGallery({ items }: PlantGalleryProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No photos from check-ins yet.</p>
    );
  }

  const groups = groupByDate(items);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.date}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {group.date}
          </h3>
          <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <ul className="flex gap-3">
              {group.urls.map((url, i) => (
                <li
                  key={`${group.date}-${url}-${i}`}
                  className="relative h-36 w-36 shrink-0 overflow-hidden rounded-lg border border-border sm:h-40 sm:w-40"
                >
                  <Image
                    src={url}
                    alt={`Plant photo on ${group.date}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
