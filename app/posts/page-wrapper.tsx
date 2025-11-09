import { listPosts } from "@/lib/notion";
import { mapPostMeta } from "@/lib/mapNotion";
import PostsPage from "./page";

export const revalidate = 60;

export default async function PostsPageWrapper() {
  const raw = await listPosts({});
  const posts = raw.map(mapPostMeta);
  
  // Ensure posts are sorted by date (newest first) - fallback in case Notion sort fails
  const sortedPosts = posts.sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0;
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return <PostsPage initialPosts={sortedPosts} />;
}

