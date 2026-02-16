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
    <section className="space-y-16 animate-reveal">
      <div className="relative pt-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-mint/5 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl font-semibold mb-6 text-ink tracking-tight relative">Gallery</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed relative">
          Technical captures, visual artifacts, and moments from the field.
        </p>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center relative z-10">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTag === null
                ? "text-mint bg-mint/5 shadow-sm"
                : "text-muted hover:text-ink hover:bg-black/5"
              }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                  ? "text-mint bg-mint/5 shadow-sm"
                  : "text-muted hover:text-ink hover:bg-black/5"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-3xl border-dashed border-border/40">
          <p className="text-muted italic">
            {selectedTag ? `No artifact found with signature "${selectedTag}"` : "The archive is currently empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl glass-panel cursor-pointer border-border/40 transition-all duration-500 hover:shadow-mint-sm"
              onClick={() => handleImageClick(item)}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title || item.caption || "Gallery image"}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title && (
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                  )}
                  {item.caption && (
                    <p className="text-white/80 text-sm line-clamp-2">{item.caption}</p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest font-bold text-mint bg-mint/10 backdrop-blur-md px-2 py-0.5 rounded border border-mint/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
