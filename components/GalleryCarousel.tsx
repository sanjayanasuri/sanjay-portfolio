"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type GalleryItem = {
  id: string;
  image?: string;
  title?: string;
  caption?: string;
};

export default function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const images = items.filter((item) => item.image).slice(0, 20); // Limit to 20 images

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    if (!scrollContainerRef.current || isPaused || images.length === 0) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame (slow and smooth)

    const scroll = () => {
      if (isPaused) return;
      
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through one set of images
      const containerWidth = container.scrollWidth / 2; // Since we duplicated
      if (scrollPosition >= containerWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full mt-24">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-zinc-900">Gallery</h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedImages.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 relative rounded-lg overflow-hidden bg-zinc-100 group cursor-pointer"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    </section>
  );
}
