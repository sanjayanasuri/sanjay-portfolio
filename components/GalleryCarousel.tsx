"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

type GalleryItem = {
  id: string;
  image?: string;
  title?: string;
  caption?: string;
};

export default function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title?: string;
    caption?: string;
  } | null>(null);

  const images = items.filter((item) => item.image).slice(0, 20); // Limit to 20 images

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Scroll by 300px
    
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleImageClick = (item: GalleryItem) => {
    if (item.image) {
      setLightboxImage({
        url: item.image,
        title: item.title,
        caption: item.caption,
      });
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full mt-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink">Gallery</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full glass-panel hover:shadow-accent transition-all text-ink hover:text-accent"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full glass-panel hover:shadow-accent transition-all text-ink hover:text-accent"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 relative rounded-lg overflow-hidden glass-panel cursor-pointer group shadow-brain-sm"
            onClick={() => handleImageClick(item)}
          >
            {item.image && (
              <>
                <Image
                  src={item.image}
                  alt={item.title || item.caption || "Gallery image"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                />
                {(item.title || item.caption) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {item.title && (
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                      )}
                      {item.caption && (
                        <p className="text-white/90 text-xs line-clamp-2">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
