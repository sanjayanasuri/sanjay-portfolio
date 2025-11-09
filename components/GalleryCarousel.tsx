"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type GalleryItem = {
  id: string;
  image?: string;
  title?: string;
  caption?: string;
};

export default function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = items.filter((item) => item.image).slice(0, 20); // Limit to 20 images

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full mt-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-zinc-900">Gallery</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden bg-zinc-100">
        {images.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.title || item.caption || "Gallery image"}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === currentIndex}
              />
            )}
            {(item.title || item.caption) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
                {item.title && (
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                )}
                {item.caption && (
                  <p className="text-white/90 text-sm line-clamp-2">{item.caption}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-zinc-900 w-8"
                  : "bg-zinc-300 hover:bg-zinc-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

