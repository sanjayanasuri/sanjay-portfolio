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
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
              Sanjay Anasuri
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              I'm a senior at Purdue studying Data Science. Currently focusing on autonomous systems and knowledge representation. I build tools to help organize and discover information.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/for-employers" className="text-ink hover:text-accent transition-colors">Projects</Link>
            <Link href="/posts" className="text-ink hover:text-accent transition-colors">Writing</Link>
            <Link href="/gallery" className="text-ink hover:text-accent transition-colors">Visuals</Link>
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
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="relative space-y-3">
              <h3 className="text-2xl font-semibold text-ink">Brain Web</h3>
              <p className="text-muted max-w-sm leading-relaxed">
                A platform for visualizing interconnected knowledge and identifying research opportunities.
              </p>
            </div>
          </Link>

          {/* Featured Post */}
          {graphTheoryPost && (
            <Link
              href={`/posts/${encodeURIComponent(graphTheoryPost.slug)}`}
              className="md:col-span-2 group glass-panel rounded-2xl overflow-hidden flex flex-col animate-reveal delay-200 border-border/40"
            >
              {graphTheoryPost.cover && (
                <div className="h-32 relative grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <Image src={graphTheoryPost.cover} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-medium text-ink">
                  {graphTheoryPost.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Gallery */}
          <Link
            href="/gallery"
            className="md:col-span-2 group glass-panel rounded-2xl p-6 min-h-[120px] flex items-center animate-reveal delay-300 border-border/40"
          >
            <div>
              <h3 className="text-lg font-medium text-ink">Gallery</h3>
              <p className="text-sm text-muted">Technical visuals and captures.</p>
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
