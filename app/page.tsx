import Image from "next/image";
import Link from "next/link";
import { listPosts, listGalleryItems } from "@/lib/notion";
import { mapPostMeta, mapGalleryItem } from "@/lib/mapNotion";
import ProfileImage from "@/components/ProfileImage";
import GalleryCarousel from "@/components/GalleryCarousel";

export const revalidate = 60; // ISR

export default async function Home() {
  const raw = await listPosts({ limit: 6 });
  const posts = raw.map(mapPostMeta);
  
  // Ensure posts are sorted by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0;
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Get gallery items for carousel
  const galleryRaw = await listGalleryItems({ limit: 20 });
  const galleryItems = galleryRaw.map(mapGalleryItem).filter(item => item.image);

  return (
    <div className="space-y-24">
      {/* Hero / Profile Section */}
      <section className="flex flex-col sm:flex-row items-center sm:items-center gap-8 text-center sm:text-left">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-accent/20 to-accent-2/20 border-4 border-surface shadow-brain-sm">
            <ProfileImage />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink mb-3">
              Hello! Welcome to my portfolio
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto sm:mx-0">
              I'm Sanjay - a senior studying Data Science at Purdue University. 
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider letter-spacing-[0.08em]">
            Here's what I'm working on
          </p>
          <div className="h-px w-16 bg-gradient-to-r from-accent to-accent-2"></div>
        </div>
        
        <ul className="space-y-12">
          {sortedPosts.map((p, index) => (
            <li key={p.slug}>
              <Link 
                href={`/posts/${encodeURIComponent(p.slug)}`}
                className="group block"
              >
                <article className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  {/* Image on left (or top on mobile) */}
                  {p.cover && (
                    <div className={`flex-shrink-0 w-full sm:w-64 ${index % 2 === 1 ? 'sm:order-2' : ''}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl glass-panel shadow-brain-sm">
                        <Image
                          src={p.cover}
                          alt={p.title}
                          width={600}
                          height={375}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${index % 2 === 1 ? 'sm:order-1' : ''}`}>
                    {p.publishedAt && (
                      <time className="text-xs text-muted mb-2 block uppercase tracking-wider">
                        {new Date(p.publishedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </time>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-3 group-hover:text-accent transition-colors leading-tight">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-base text-muted leading-relaxed line-clamp-3">
                        {p.excerpt}
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-accent group-hover:text-accent-2 transition-colors">
                      Read more
                      <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
              
              {/* Separator line */}
              {index < sortedPosts.length - 1 && (
                <div className="mt-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Gallery Carousel Section */}
      {galleryItems.length > 0 && (
        <section>
          <GalleryCarousel items={galleryItems} />
        </section>
      )}
    </div>
  );
}
