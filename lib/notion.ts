import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI({
  authToken: process.env.NOTION_TOKEN, // allows access to private pages you shared to the integration
});

export type NotionListOptions = { limit?: number };

export async function listPosts({ limit = 50 }: NotionListOptions) {
  const db = process.env.NOTION_POSTS_DB_ID!;
  try {
    // Try with Published filter and PublishedAt sort
    const res = await notion.databases.query({
      database_id: db,
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ property: "PublishedAt", direction: "descending" }],
      page_size: limit,
    });
    return res.results as any[];
  } catch (error: any) {
    if (error?.code === 'validation_error') {
      if (error?.message?.includes('PublishedAt')) {
        // Fallback: PublishedAt doesn't exist - try without sort
        try {
          const res = await notion.databases.query({
            database_id: db,
            filter: { property: "Published", checkbox: { equals: true } },
            page_size: limit,
          });
          return res.results as any[];
        } catch (filterError: any) {
          if (filterError?.message?.includes('Published')) {
            // Fallback: Published doesn't exist - return all posts
            const res = await notion.databases.query({
              database_id: db,
              page_size: limit,
            });
            return res.results as any[];
          }
          throw filterError;
        }
      } else if (error?.message?.includes('Published')) {
        // Fallback: Published doesn't exist - return all posts
        const res = await notion.databases.query({
          database_id: db,
          page_size: limit,
        });
        return res.results as any[];
      }
    }
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  const db = process.env.NOTION_POSTS_DB_ID!;
  try {
    const res = await notion.databases.query({
      database_id: db,
      filter: { property: "Slug", rich_text: { equals: slug } },
      page_size: 1,
    });
    return (res.results[0] as any) || null;
  } catch (error: any) {
    // If Slug property doesn't exist, try without filter and match manually
    if (error?.code === 'validation_error' && error?.message?.includes('Slug')) {
      const res = await notion.databases.query({
        database_id: db,
        page_size: 100,
      });
      // Try to find by matching slug in title or ID
      const match = res.results.find((page: any) => {
        const pageSlug = page.properties?.Slug?.rich_text?.[0]?.plain_text || 
                        page.properties?.slug?.rich_text?.[0]?.plain_text ||
                        page.id.replace(/-/g, '');
        return pageSlug === slug || page.id === slug;
      });
      return (match as any) || null;
    }
    throw error;
  }
}

// NEW: return a full recordMap that react-notion-x expects
export async function getPostRecordMap(pageId: string): Promise<any> {
  // notion-client builds the exact structure react-notion-x needs
  const recordMap = await notionApi.getPage(pageId);
  return recordMap;
}
