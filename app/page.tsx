import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";

export const revalidate = 60; // ISR

export default async function Home() {
  const raw = await listPosts({ limit: 6 });
  const posts = raw.map(mapPostMeta);
  return (
    <section className="space-y-10">
      <div className="pt-6 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Sanjay Anasuri</h1>
        <p className="text-zinc-600">Data science, product design, and artifacts from the road.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Latest posts</h2>
        <ul className="grid sm:grid-cols-2 gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-2xl border p-4 hover:shadow">
              {p.cover && (
                <Image
                  src={p.cover}
                  alt={p.title}
                  width={800}
                  height={480}
                  className="mb-3 h-40 w-full rounded-xl object-cover"
                />
              )}
              <h3 className="mb-1 font-medium">
                <Link href={`/posts/${p.slug}`}>{p.title}</Link>
              </h3>
              {p.excerpt && <p className="text-sm text-zinc-600 line-clamp-2">{p.excerpt}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
