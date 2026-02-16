import Image from "next/image";
import Link from "next/link";
import { listPosts, listGalleryItems } from "@/lib/notion";
import { mapPostMeta, mapGalleryItem } from "@/lib/mapNotion";
import ProfileImage from "@/components/ProfileImage";
import GalleryCarousel from "@/components/GalleryCarousel";

export const revalidate = 60; // ISR

export default async function Home() {
  const raw = await listPosts({ limit: 50 });
  const posts = raw.map(mapPostMeta);

  // Find graph theory post (case-insensitive search)
  const graphTheoryPost = posts.find(p =>
    p.title.toLowerCase().includes('graph theory') ||
    p.tags?.some(tag => tag.toLowerCase().includes('graph theory'))
  );

  // Get gallery items for carousel
  const galleryRaw = await listGalleryItems({ limit: 20 });
  const galleryItems = galleryRaw.map(mapGalleryItem).filter(item => item.image);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Zen Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 animate-reveal">
        <div className="absolute -top-24 -left-20 w-64 h-64 bg-accent/20 blur-[100px] rounded-full pointer-events-none animate-pulse" />
        <div className="max-w-3xl space-y-8 relative">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
                Sanjay Anasuri
              </h1>
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0 shadow-md">
                <ProfileImage />
              </div>
            </div>
            <p className="text-lg text-muted leading-relaxed">
              I'm a senior at Purdue studying Data Science. Currently focusing on autonomous systems and knowledge representation. I build tools to help organize and discover information.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/for-employers" className="text-ink hover:text-accent transition-colors underline decoration-accent/30 underline-offset-4">Projects</Link>
            <Link href="/posts" className="text-ink hover:text-accent transition-colors underline decoration-accent-2/30 underline-offset-4">Writing</Link>
            <Link href="/gallery" className="text-ink hover:text-accent transition-colors underline decoration-mint/30 underline-offset-4">Gallery</Link>
          </div>
        </div>
      </section>

      {/* Clean Bento Grid */}
      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-min">
          {/* Brain Web */}
          <Link
            href="/for-employers"
            className="md:col-span-4 md:row-span-2 group relative glass-panel rounded-2xl p-8 flex flex-col justify-end min-h-[360px] animate-reveal delay-100 border-border/40 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.25] group-hover:opacity-[0.4] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent group-hover:from-accent/20 transition-all duration-500" />
            <div className="relative space-y-3">
              <h3 className="text-2xl font-semibold text-ink group-hover:text-accent transition-colors">Brain Web</h3>
              <p className="text-muted max-w-sm leading-relaxed">
                A platform for visualizing interconnected knowledge and identifying research opportunities.
              </p>
            </div>
          </Link>

          {/* Lecture Series (Featured Post) */}
          {graphTheoryPost && (
            <Link
              href={`/posts/${encodeURIComponent(graphTheoryPost.slug)}`}
              className="md:col-span-2 group relative glass-panel rounded-2xl overflow-hidden flex flex-col animate-reveal delay-200 border-border/40 min-h-[160px]"
            >
              <div className="absolute inset-0 opacity-[0.2] group-hover:opacity-[0.35] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-2/10 via-transparent to-transparent group-hover:from-accent-2/20 transition-all duration-500" />

              <div className="relative p-6 mt-auto">
                <h3 className="text-lg font-medium text-ink group-hover:text-accent-2 transition-colors">
                  Lecture Series
                </h3>
                <p className="text-xs text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore system foundations</p>
              </div>
            </Link>
          )}

          {/* Photography (Gallery) */}
          <Link
            href="/gallery"
            className="md:col-span-2 group relative glass-panel rounded-2xl p-6 min-h-[160px] flex flex-col justify-end animate-reveal delay-300 border-border/40 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.2] group-hover:opacity-[0.35] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-bl from-mint/10 via-transparent to-transparent group-hover:from-mint/20 transition-all duration-500" />

            <div className="relative">
              <h3 className="text-lg font-medium text-ink group-hover:text-mint transition-colors">Check out my photography</h3>
              <p className="text-sm text-muted">A collection of technical captures.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Integrated Media */}
      {galleryItems.length > 0 && (
        <section className="animate-reveal delay-400 pt-8 border-t border-border/30">
          <GalleryCarousel items={galleryItems} />
        </section>
      )}
    </div>
  );
}
