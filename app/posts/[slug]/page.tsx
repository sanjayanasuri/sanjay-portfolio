import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getPostBySlug, getPostRecordMap } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";

// Styles for react-notion-x (global, safe to import here)
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css";

const NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
);

export const revalidate = 60;

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const page = await getPostBySlug(params.slug);
    if (!page) {
      console.error(`Post not found for slug: ${params.slug}`);
      notFound();
    }

    const meta = mapPostMeta(page);
    const recordMap = await getPostRecordMap(page.id);

    return (
      <article className="prose prose-zinc max-w-none">
        <h1>{meta.title}</h1>
        {meta.publishedAt && (
          <p className="text-sm text-zinc-500">
            {new Date(meta.publishedAt).toLocaleDateString()}
          </p>
        )}
        <div className="mt-6">
          <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />
        </div>
      </article>
    );
  } catch (error: any) {
    // Log detailed error information
    console.error("Error in PostPage:", {
      slug: params.slug,
      message: error?.message,
      code: error?.code,
      status: error?.status,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
    
    // In development, throw the error to see it in the UI
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    
    // In production, show 404 instead of exposing error details
    notFound();
  }
}
