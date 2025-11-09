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
    <section className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4 text-zinc-900">For Friends</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Things I'm into, stuff I like, and recommendations for friends.
        </p>
      </div>

      {/* Type Filters */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === null
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {getTypeIcon(type)} {type}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {selectedType && (
        <p className="text-sm text-zinc-500 text-center">
          Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} of type "{selectedType}"
        </p>
      )}

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-zinc-500 mb-4">
            {selectedType ? `No items found of type "${selectedType}"` : "No items yet."}
          </p>
          {!selectedType && (
            <p className="text-sm text-zinc-400">
              Add <code className="bg-zinc-100 px-2 py-1 rounded">NOTION_FOR_FRIENDS_DB_ID</code> to your <code className="bg-zinc-100 px-2 py-1 rounded">.env.local</code> and create a "For Friends" database in Notion.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const embedInfo = getEmbedInfo(item.url);
            
            return (
              <div
                key={item.id}
                className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image or Embed Preview */}
                {item.image ? (
                  <div className="relative w-full aspect-video overflow-hidden bg-zinc-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : embedInfo?.type === "spotify" ? (
                  <div className="w-full aspect-video bg-zinc-900">
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
                  <div className="relative w-full aspect-video bg-zinc-900">
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
                ) : null}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                    {item.date && (
                      <time className="text-xs text-zinc-400">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-zinc-900 mb-3 group-hover:text-zinc-700 transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
                    >
                      {embedInfo?.type === "spotify" ? "Listen on Spotify" :
                       embedInfo?.type === "youtube" ? "Watch on YouTube" :
                       "View Link"}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

