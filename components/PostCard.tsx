import Link from "next/link";
import Image from "next/image";

export function PostCard({ post }: { post: { slug: string; title: string; excerpt?: string; cover?: string } }) {
  return (
    <article className="rounded-2xl border p-4 hover:shadow">
      {post.cover && (
        <Image src={post.cover} alt={post.title} width={800} height={480} className="mb-3 h-40 w-full rounded-xl object-cover" />
      )}
      <h3 className="mb-1 font-medium"><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
      {post.excerpt && <p className="text-sm text-zinc-600 line-clamp-2">{post.excerpt}</p>}
    </article>
  );
}
