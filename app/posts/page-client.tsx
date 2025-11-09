"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
};

export default function PostsPageClient({ initialPosts }: { initialPosts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // Extract unique years and months from posts
  const { years, months } = useMemo(() => {
    const yearSet = new Set<string>();
    const monthSet = new Set<string>();
    
    initialPosts.forEach((post) => {
      if (post.publishedAt) {
        const date = new Date(post.publishedAt);
        const year = date.getFullYear().toString();
        const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        yearSet.add(year);
        monthSet.add(month);
      }
    });
    
    return {
      years: Array.from(yearSet).sort((a, b) => Number(b) - Number(a)),
      months: Array.from(monthSet).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
      }),
    };
  }, [initialPosts]);

  // Filter posts based on search and date filters
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Year filter
      if (selectedYear !== "all" && post.publishedAt) {
        const postYear = new Date(post.publishedAt).getFullYear().toString();
        if (postYear !== selectedYear) return false;
      }

      // Month filter
      if (selectedMonth !== "all" && post.publishedAt) {
        const postMonth = new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        if (postMonth !== selectedMonth) return false;
      }

      return true;
    });
  }, [initialPosts, searchQuery, selectedYear, selectedMonth]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-semibold text-zinc-900">Posts</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-sm"
          />
          
          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth("all"); // Reset month when year changes
            }}
            className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-sm bg-white"
            disabled={selectedYear === "all"}
          >
            <option value="all">All Months</option>
            {months
              .filter((month) => {
                if (selectedYear === "all") return true;
                return month.includes(selectedYear);
              })
              .map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {filteredPosts.length !== initialPosts.length && (
        <p className="text-sm text-zinc-500">
          Showing {filteredPosts.length} of {initialPosts.length} posts
        </p>
      )}

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-zinc-500">No posts found matching your criteria.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredPosts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/posts/${encodeURIComponent(p.slug)}`}
                className="group flex items-start justify-between p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-zinc-200/60"
              >
                <div className="flex-1">
                  <h2 className="font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="text-sm text-zinc-600 mt-1 line-clamp-1">
                      {p.excerpt}
                    </p>
                  )}
                </div>
                {p.publishedAt && (
                  <span className="ml-4 text-xs text-zinc-500 whitespace-nowrap">
                    {new Date(p.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
