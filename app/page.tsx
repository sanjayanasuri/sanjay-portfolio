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
              Hello! 
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto sm:mx-0">
            Welcome to my portfolio. I'm Sanjay - a senior studying Data Science at Purdue University. I'm passionate about Agentic AI and how autonomous systems can collaborate and self-improve. I write about what I'm learning and build tools that make knowledge more accessible. 
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider letter-spacing-[0.08em]">
            Here's what I'm working on
          </p>
          <div className="h-px w-16 bg-gradient-to-r from-accent to-accent-2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Graph Theory Post Block */}
          {graphTheoryPost && (
            <Link 
              href={`/posts/${encodeURIComponent(graphTheoryPost.slug)}`}
              className="group block"
            >
              <div className="glass-panel rounded-xl overflow-hidden shadow-brain hover:shadow-accent transition-all duration-300 border border-border hover:border-accent">
                {graphTheoryPost.cover && (
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={graphTheoryPost.cover}
                      alt={graphTheoryPost.title}
                      width={400}
                      height={128}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                    {graphTheoryPost.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2">
                    {graphTheoryPost.excerpt || "Exploring graph neural networks and their applications in knowledge representation and AI systems."}
                  </p>
                  <div className="inline-flex items-center text-xs font-medium text-accent group-hover:text-accent-2 transition-colors pt-1">
                    Read post
                    <svg className="ml-1.5 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Brain Web Project Block */}
          <Link 
            href="/for-employers"
            className="group block"
          >
            <div className="glass-panel rounded-xl overflow-hidden shadow-brain hover:shadow-accent transition-all duration-300 border border-border hover:border-accent">
              {/* Brain Web Preview Visual */}
              <div className="relative h-32 bg-gradient-to-br from-accent/10 via-accent-2/10 to-accent/5 p-4 overflow-hidden">
                <div className="relative w-full h-full">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 shadow-accent flex items-center justify-center z-10">
                    <span className="text-white font-bold text-[10px]">Brain</span>
                  </div>
                  
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="30%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-accent/20" />
                    <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className="text-accent/20" />
                  </svg>
                  
                  {/* Surrounding Nodes */}
                  <div className="absolute top-[30%] left-[30%] w-6 h-6 rounded-full glass-panel border border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-[8px] font-semibold text-ink">AI</span>
                  </div>
                  <div className="absolute top-[30%] right-[30%] w-6 h-6 rounded-full glass-panel border border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-[8px] font-semibold text-ink">Graph</span>
                  </div>
                  <div className="absolute top-[70%] left-[30%] w-6 h-6 rounded-full glass-panel border border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-[8px] font-semibold text-ink">Knowledge</span>
                  </div>
                  <div className="absolute top-[70%] right-[30%] w-6 h-6 rounded-full glass-panel border border-accent/30 flex items-center justify-center shadow-brain-sm">
                    <span className="text-[8px] font-semibold text-ink">Research</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                  Brain Web
                </h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  An interactive knowledge graph platform that visualizes and connects concepts through an AI-powered interface. Build on your knowledge, identify gaps, and discover research opportunities.
                </p>
                <div className="inline-flex items-center text-xs font-medium text-accent group-hover:text-accent-2 transition-colors pt-1">
                  Try demo
                  <svg className="ml-1.5 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
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
