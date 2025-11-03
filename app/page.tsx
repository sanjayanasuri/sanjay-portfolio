import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";

export const revalidate = 60; // ISR

export default async function Home() {
  const raw = await listPosts({ limit: 6 });
  const posts = raw.map(mapPostMeta);
  return (
    <section className="space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900">Sanjay Anasuri</h1>
        <p className="text-lg text-zinc-600 max-w-2xl">Data science, product design, and artifacts from the road.</p>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-8 text-zinc-900">Latest posts</h2>
        <ul className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link 
                href={`/posts/${encodeURIComponent(p.slug)}`}
                className="group block h-full"
              >
                <article className="h-full rounded-2xl bg-white border border-zinc-200/60 overflow-hidden hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
                  {p.cover && (
                    <div className="relative aspect-video overflow-hidden bg-zinc-100">
                      <Image
                        src={p.cover}
                        alt={p.title}
                        width={800}
                        height={480}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
