"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

type ForFriendsItem = {
  id: string;
  title: string;
  type: string;
  url?: string;
  description?: string;
  image?: string;
  date?: string;
  tags?: string[];
};

export default function ForFriendsPageClient({ initialItems }: { initialItems: ForFriendsItem[] }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Extract unique types
  const types = useMemo(() => {
    const typeSet = new Set<string>();
    initialItems.forEach((item) => {
      if (item.type) typeSet.add(item.type);
    });
    return Array.from(typeSet).sort();
  }, [initialItems]);

  // Filter items by selected type
  const filteredItems = useMemo(() => {
    if (!selectedType) return initialItems;
    return initialItems.filter((item) => item.type === selectedType);
  }, [initialItems, selectedType]);

  // Helper to extract Spotify/YouTube embed info
  const getEmbedInfo = (url?: string) => {
    if (!url) return null;

    // Spotify
    if (url.includes("open.spotify.com") || url.includes("spotify.com")) {
      const spotifyId = url.match(/spotify\.com\/(?:playlist|album|track)\/([a-zA-Z0-9]+)/)?.[1];
      if (spotifyId) {
        const type = url.includes("/playlist/") ? "playlist" : url.includes("/album/") ? "album" : "track";
        return { type: "spotify", id: spotifyId, spotifyType: type };
      }
    }

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
      if (videoId) {
        return { type: "youtube", id: videoId };
      }
    }

    return { type: "link", url };
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "song":
      case "music":
      case "playlist":
        return "🎵";
      case "video":
        return "🎥";
      case "idea":
        return "💡";
      case "person":
        return "👤";
      case "book":
        return "📚";
      case "article":
        return "📄";
      default:
        return "⭐";
    }
  };

  return (
    <section className="space-y-16 animate-reveal">
      <div className="relative pt-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent-2/5 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl font-semibold mb-6 text-ink tracking-tight relative">For Friends</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed relative">
          Things I'm into, stuff I like, and recommendations for the signal.
        </p>
      </div>

      {/* Type Filters - Simplified */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center relative z-10">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${selectedType === null
                ? "text-ink bg-black/5 shadow-sm"
                : "text-muted hover:text-ink hover:bg-black/5"
              }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${selectedType === type
                  ? "text-ink bg-black/5 shadow-sm"
                  : "text-muted hover:text-ink hover:bg-black/5"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-3xl border-dashed border-border/40">
          <p className="text-muted italic">
            {selectedType ? `No items found for "${selectedType}"` : "This collection is empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const embedInfo = getEmbedInfo(item.url);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col glass-panel rounded-2xl overflow-hidden border-border/40 hover:shadow-brain-sm transition-all duration-500"
              >
                <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

                {/* Image or Embed Preview */}
                <div className="relative">
                  {item.image ? (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : embedInfo?.type === "spotify" ? (
                    <div className="w-full aspect-video bg-black/20">
                      <iframe
                        src={`https://open.spotify.com/embed/${embedInfo.spotifyType}/${embedInfo.id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                  ) : embedInfo?.type === "youtube" ? (
                    <div className="relative w-full aspect-video bg-black/20">
                      <iframe
                        src={`https://www.youtube.com/embed/${embedInfo.id}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-accent-2/5 flex items-center justify-center">
                      <span className="text-4xl opacity-20">{getTypeIcon(item.type)}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-accent-2/60 uppercase tracking-widest bg-accent-2/5 px-2 py-0.5 rounded border border-accent-2/10">
                        {item.type}
                      </span>
                    </div>
                    {item.date && (
                      <time className="text-[10px] font-medium text-muted uppercase tracking-wider">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-ink mb-3 group-hover:text-accent-2 transition-colors leading-tight">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-muted leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-ink hover:text-accent-2 transition-colors uppercase tracking-widest"
                      >
                        {embedInfo?.type === "spotify" ? "Listen" :
                          embedInfo?.type === "youtube" ? "Watch" :
                            "Visit"}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 overflow-hidden">
                        <span className="text-[10px] text-muted whitespace-nowrap">#{item.tags[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

