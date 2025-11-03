import Link from "next/link";
import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";

export const revalidate = 60;

export default async function PostsPage() {
  const raw = await listPosts({});
  const posts = raw.map(mapPostMeta);
  return (
    <section className="py-2">
      <h1 className="mb-6 text-2xl font-semibold">Posts</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link className="underline" href={`/posts/${encodeURIComponent(p.slug)}`}>{p.title}</Link>
            {p.publishedAt && <span className="ml-2 text-xs text-zinc-500">{new Date(p.publishedAt).toLocaleDateString()}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
