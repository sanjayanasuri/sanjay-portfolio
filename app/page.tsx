import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";
import ProfileImage from "@/components/ProfileImage";

export const revalidate = 60; // ISR

export default async function Home() {
  const raw = await listPosts({ limit: 6 });
  const posts = raw.map(mapPostMeta);
  return (
    <div className="space-y-24">
      {/* Hero / Profile Section */}
      <section className="flex flex-col sm:flex-row items-center sm:items-center gap-8 text-center sm:text-left">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 border-4 border-white shadow-lg">
            <ProfileImage />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 mb-3">
              Sanjay Anasuri
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
              Hello! I'm Sanjay. I'm in my final year of undergrad at Purdue University,
              where I'm pursuing a B.S in Data Science. I'm interested in the intersection between
              technology and human-centered design. I write about my experiences and learnings.
              Three words to describe me are: curious, creative, and empathetic. 
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Here's what I'm working on
          </p>
          <div className="h-px w-16 bg-zinc-300"></div>
        </div>
        
        <ul className="space-y-12">
          {posts.map((p, index) => (
            <li key={p.slug}>
              <Link 
                href={`/posts/${encodeURIComponent(p.slug)}`}
                className="group block"
              >
                <article className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  {/* Image on left (or top on mobile) */}
                  {p.cover && (
                    <div className={`flex-shrink-0 w-full sm:w-64 ${index % 2 === 1 ? 'sm:order-2' : ''}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100">
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
                      <time className="text-sm text-zinc-500 mb-2 block">
                        {new Date(p.publishedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </time>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mb-3 group-hover:text-zinc-700 transition-colors leading-tight">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-base text-zinc-600 leading-relaxed line-clamp-3">
                        {p.excerpt}
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      Read more
                      <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
              
              {/* Separator line */}
              {index < posts.length - 1 && (
                <div className="mt-12 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
