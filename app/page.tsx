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
      {/* Immersive Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 animate-reveal">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-ink">
              Building the next era of <span className="text-accent">Agentic AI</span>.
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              I'm Sanjay — a senior at Purdue specializing in autonomous systems and knowledge graphs. Creating tools that make information dynamic and self-evolving.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Link href="/for-employers" className="px-8 py-3 bg-ink text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-ink/20">
              View Projects
            </Link>
            <Link href="/posts" className="px-8 py-3 glass-panel rounded-full font-semibold hover:bg-white/50 transition-colors">
              Read Blog
            </Link>
          </div>
        </div>
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-125 animate-pulse" />
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-white/50 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
            <ProfileImage />
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-ink">Artifacts & Ideas</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent-2 rounded-full" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-none md:grid-rows-2 gap-4 auto-rows-min">
          {/* Main Feature: Brain Web (Large) */}
          <Link 
            href="/for-employers"
            className="md:col-span-4 md:row-span-2 group relative overflow-hidden glass-panel rounded-3xl p-8 flex flex-col justify-end min-h-[400px] animate-reveal delay-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent-2/5 to-transparent group-hover:scale-110 transition-transform duration-1000" />
            
            {/* Visual background element */}
            <div className="absolute top-8 right-8 w-64 h-64 opacity-20 group-hover:opacity-40 transition-opacity">
               <div className="relative w-full h-full">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent animate-pulse shadow-[0_0_40px_rgba(17,138,178,0.5)]" />
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-accent-2"
                      style={{
                        transform: `rotate(${i * 60}deg) translate(80px)`,
                      }}
                    />
                  ))}
               </div>
            </div>

            <div className="relative space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold text-accent uppercase tracking-wider">Project</span>
                <span className="px-3 py-1 bg-mint/10 border border-mint/20 rounded-full text-[10px] font-bold text-mint uppercase tracking-wider">Live</span>
              </div>
              <h3 className="text-4xl font-bold text-ink">Brain Web</h3>
              <p className="text-lg text-muted max-w-md leading-relaxed">
                An interactive knowledge graph platform that visualizes and connects concepts through an AI-powered interface.
              </p>
              <div className="flex items-center text-accent font-semibold pt-2 group-hover:gap-2 transition-all">
                Launch Platform <span className="ml-2">→</span>
              </div>
            </div>
          </Link>

          {/* Secondary: Featured Post (Medium) */}
          {graphTheoryPost && (
            <Link 
              href={`/posts/${encodeURIComponent(graphTheoryPost.slug)}`}
              className="md:col-span-2 group glass-panel rounded-3xl overflow-hidden flex flex-col animate-reveal delay-200"
            >
              {graphTheoryPost.cover ? (
                <div className="h-40 relative">
                  <Image
                    src={graphTheoryPost.cover}
                    alt={graphTheoryPost.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="h-40 bg-accent/5 flex items-center justify-center">
                   <div className="text-4xl">📝</div>
                </div>
              )}
              <div className="p-6 space-y-2 flex-1">
                <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent/30 decoration-2 underline-offset-4">
                  {graphTheoryPost.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {graphTheoryPost.excerpt || "Exploring deep into the foundations of interconnected data systems."}
                </p>
              </div>
            </Link>
          )}

          {/* Third: Gallery Peek (Small) */}
          <Link 
            href="/gallery"
            className="md:col-span-2 group relative glass-panel rounded-3xl p-6 min-h-[180px] flex items-center justify-center animate-reveal delay-300"
          >
             <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-12 h-12 bg-accent rotate-12 rounded-lg" />
                <div className="w-12 h-12 bg-accent-2 -rotate-12 rounded-lg -mt-4" />
                <div className="w-12 h-12 bg-mint rotate-6 rounded-lg" />
             </div>
             <div className="relative text-center">
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Visual Log</p>
                <h3 className="text-xl font-bold text-ink">The Gallery</h3>
                <span className="text-sm text-accent underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity">Browse Collection</span>
             </div>
          </Link>
        </div>
      </section>

      {/* Media Carousel (Integrated smoothly) */}
      {galleryItems.length > 0 && (
        <section className="animate-reveal delay-400">
          <div className="space-y-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <GalleryCarousel items={galleryItems} />
          </div>
        </section>
      )}
    </div>
  );
}
