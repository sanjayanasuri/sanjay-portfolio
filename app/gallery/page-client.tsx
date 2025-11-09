"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

type GalleryItem = {
  id: string;
  image?: string;
  title?: string;
  caption?: string;
  tags?: string[];
  date?: string;
};

export default function GalleryPageClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title?: string;
    caption?: string;
  } | null>(null);

  // Extract all unique tags and sort items by date (newest first)
  const { tags, sortedItems } = useMemo(() => {
    const tagSet = new Set<string>();
    
    // Sort by date if available, otherwise keep original order
    const sorted = [...initialItems].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    sorted.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag));
    });

    return {
      tags: Array.from(tagSet).sort(),
      sortedItems: sorted,
    };
  }, [initialItems]);

  // Filter items by selected tag
  const filteredItems = useMemo(() => {
    if (!selectedTag) return sortedItems;
    return sortedItems.filter((item) => item.tags?.includes(selectedTag));
  }, [sortedItems, selectedTag]);

  const handleImageClick = (item: GalleryItem) => {
    if (item.image) {
      setLightboxImage({
        url: item.image,
        title: item.title,
        caption: item.caption,
      });
    }
  };

  return (
    <section className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4 text-zinc-900">Gallery</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          A collection of moments, projects, and visual experiments.
        </p>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {selectedTag && (
        <p className="text-sm text-zinc-500 text-center">
          Showing {filteredItems.length} {filteredItems.length === 1 ? "image" : "images"} tagged "{selectedTag}"
        </p>
      )}

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-500 mb-4">
            {selectedTag ? `No images found with tag "${selectedTag}"` : "No images in gallery yet."}
          </p>
          {!selectedTag && (
            <p className="text-sm text-zinc-400">
              Add <code className="bg-zinc-100 px-2 py-1 rounded">NOTION_GALLERY_DB_ID</code> to your <code className="bg-zinc-100 px-2 py-1 rounded">.env.local</code> and create a Gallery database in Notion.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 cursor-pointer"
              onClick={() => handleImageClick(item)}
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
              {(item.title || item.caption || item.tags) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {item.title && (
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                    )}
                    {item.caption && (
                      <p className="text-sm text-white/90 line-clamp-2 mb-2">{item.caption}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          imageUrl={lightboxImage.url}
          title={lightboxImage.title}
          caption={lightboxImage.caption}
        />
      )}
    </section>
  );
}

