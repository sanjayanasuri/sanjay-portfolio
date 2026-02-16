"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ImageLightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  caption?: string;
};

export default function ImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  title,
  caption,
}: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true); // Reset loading state when opened
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image container */}
      <div
        className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-mint/20 border-t-mint rounded-full animate-spin" />
            </div>
          )}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Standard img for maximum compatibility with proxied URLs */}
            <img
              src={imageUrl}
              alt={title || caption || "Gallery image"}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onLoad={() => setIsLoading(false)}
              style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
            />
          </div>
        </div>

        {/* Title and caption */}
        {(title || caption) && (
          <div className="mt-6 text-center text-white bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            {title && <h3 className="text-2xl font-semibold mb-2 text-mint group-hover:text-mint transition-colors">{title}</h3>}
            {caption && <p className="text-white/80 leading-relaxed font-light">{caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

