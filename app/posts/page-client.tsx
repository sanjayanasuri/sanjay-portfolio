"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  cover?: string;
  tags?: string[];
};

export default function PostsPageClient({ initialPosts }: { initialPosts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [initialPosts, searchQuery]);

  // Group posts by year for a "Library/Archive" feel
  const groupedPosts = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    filteredPosts.forEach(post => {
      const year = post.publishedAt
        ? new Date(post.publishedAt).getFullYear().toString()
        : "Archive";
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredPosts]);

  return (
    <div className="space-y-16 animate-reveal">
      {/* Descriptive Header */}
      <header className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-semibold text-ink">Library</h1>
        <p className="text-lg text-muted leading-relaxed">
          Technical artifacts, research notes, and personal reflections. This is where I document my process in Data Science and Agentic AI.
        </p>
        <div className="pt-4">
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Filter by topic or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modern Collection / Library List */}
      <div className="space-y-20">
        {groupedPosts.length === 0 ? (
          <p className="text-muted italic">No matching records found.</p>
        ) : (
          groupedPosts.map(([year, posts]) => (
            <section key={year} className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-ink/20 tracking-widest uppercase">{year}</span>
                <div className="h-px flex-1 bg-border/30" />
              </div>

              <div className="grid grid-cols-1 gap-12">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${encodeURIComponent(post.slug)}` as any}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                  >
                    {/* Optional Minimal Image */}
                    <div className="md:col-span-3 hidden md:block">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden glass-panel border-border/40 relative grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                        {post.cover ? (
                          <Image src={post.cover} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-border/10 flex items-center justify-center text-border">
                            <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <div className="flex items-center gap-3 text-xs font-medium text-muted">
                        {post.publishedAt && (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span className="text-border">•</span>
                            <span>{post.tags[0]}</span>
                          </>
                        )}
                      </div>

                      <h2 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-muted leading-relaxed line-clamp-2 max-w-2xl">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
