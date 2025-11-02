import { notFound } from "next/navigation";
import { getPostBySlug, getPostBlocks } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";
import dynamic from "next/dynamic";

const NotionRenderer = dynamic(() => import("react-notion-x").then(m => m.NotionRenderer), { ssr: false });

export const revalidate = 60;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const page = await getPostBySlug(params.slug);
  if (!page) notFound();
  const meta = mapPostMeta(page);
  const blocks = await getPostBlocks(page.id);
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>{meta.title}</h1>
      {meta.publishedAt && <p className="text-sm text-zinc-500">{new Date(meta.publishedAt).toLocaleDateString()}</p>}
      <div className="mt-6">
        <NotionRenderer recordMap={blocks as any} fullPage={false} darkMode={false} />
      </div>
    </article>
  );
}
