import Image from "next/image";

interface GalleryItem {
  id: string;
  date: string;
  urls: string[];
}

interface PlantGalleryProps {
  items: GalleryItem[];
}

export function PlantGallery({ items }: PlantGalleryProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No photos from check-ins yet.</p>
    );
  }

  return (
    <div className="space-y-8">
      {items.map((group) => (
        <section key={group.id}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {group.date}
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {group.urls.map((url, i) => (
              <li
                key={`${group.id}-${i}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={url}
                  alt={`Plant photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
