import Link from "next/link";
import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";

export const revalidate = 60;

export default async function PostsPage() {
  const raw = await listPosts({});
  const posts = raw.map(mapPostMeta);
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-12 text-zinc-900">Posts</h1>
      <ul className="space-y-3">
        {posts.map((p) => (
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
                  {new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
