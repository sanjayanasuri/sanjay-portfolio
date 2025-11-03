import { notFound } from "next/navigation";
import { getPostBySlug, getPostRecordMap } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";
import NotionContent from "@/components/NotionContent";

export const revalidate = 60;

export default async function PostPage({ params }: { params: { slug: string } }) {
  let page;
  try {
    page = await getPostBySlug(params.slug);
    if (!page) {
      console.error(`[PostPage] Post not found for slug: ${params.slug}`);
      notFound();
    }
  } catch (error: any) {
    console.error(`[PostPage] Error fetching post by slug "${params.slug}":`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
    });
    notFound();
  }

  let meta, recordMap;
  try {
    meta = mapPostMeta(page);
    console.log(`[PostPage] 📄 Slug: "${params.slug}" → Page ID: ${page.id}, Title: "${meta.title}"`);
    recordMap = await getPostRecordMap(page.id);
    console.log(`[PostPage] ✅ Successfully loaded: "${meta.title}" (slug: ${params.slug}, ID: ${page.id})`);
  } catch (error: any) {
    // Log detailed error information
    console.error(`[PostPage] Error loading content for slug "${params.slug}":`, {
      pageId: page?.id,
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusCode: error?.statusCode,
      response: error?.response ? JSON.stringify(error.response).substring(0, 200) : undefined,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
    
    // In development, throw the error to see it in the UI
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    
    // In production, show 404 instead of exposing error details
    // But log the error so you can see it in Vercel logs
    notFound();
  }

  return (
    <article className="prose prose-zinc max-w-none">
      <h1>{meta.title}</h1>
      {meta.publishedAt && (
        <p className="text-sm text-zinc-500">
          {new Date(meta.publishedAt).toLocaleDateString()}
        </p>
      )}
      <div className="mt-6">
        <NotionContent key={page.id} recordMap={recordMap} />
      </div>
    </article>
  );
}
