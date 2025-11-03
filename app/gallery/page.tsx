import Image from "next/image";
import { listGalleryItems } from "@/lib/notion";
import { mapGalleryItem } from "@/lib/mapNotion";

export const revalidate = 60;

export default async function GalleryPage() {
  const raw = await listGalleryItems({ limit: 100 });
  const items = raw.map(mapGalleryItem).filter(item => item.image); // Only show items with images

  return (
    <section className="space-y-12">
      <div>
        <h1 className="text-4xl font-semibold mb-4 text-zinc-900">Gallery</h1>
        <p className="text-lg text-zinc-600 max-w-2xl">
          A collection of moments, projects, and visual experiments.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-500 mb-4">No images in gallery yet.</p>
          <p className="text-sm text-zinc-400">
            Add <code className="bg-zinc-100 px-2 py-1 rounded">NOTION_GALLERY_DB_ID</code> to your <code className="bg-zinc-100 px-2 py-1 rounded">.env.local</code> and create a Gallery database in Notion.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 cursor-pointer"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title || item.caption || "Gallery image"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              {(item.title || item.caption) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {item.title && (
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                    )}
                    {item.caption && (
                      <p className="text-sm text-white/90 line-clamp-2">{item.caption}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
