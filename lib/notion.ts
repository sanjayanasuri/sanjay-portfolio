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

// Helper to format Notion ID with hyphens (UUID format)
function formatNotionId(id: string): string {
  // Remove existing hyphens and reformat
  const cleanId = id.replace(/-/g, '');
  if (cleanId.length !== 32) return id; // Return as-is if not standard format
  // Format as 8-4-4-4-12
  return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`;
}

// NEW: return a full recordMap that react-notion-x expects
export async function getPostRecordMap(pageId: string): Promise<any> {
  try {
    // Try with formatted UUID first
    const formattedId = formatNotionId(pageId);
    console.log(`[getPostRecordMap] Fetching page - Original ID: ${pageId}, Formatted: ${formattedId}`);
    
    try {
      const recordMap = await notionApi.getPage(formattedId);
      console.log(`[getPostRecordMap] Successfully fetched recordMap using formatted ID`);
      return recordMap;
    } catch (formattedError: any) {
      // If formatted ID fails, try original
      if (formattedId !== pageId) {
        console.log(`[getPostRecordMap] Formatted ID failed, trying original ID`);
        const recordMap = await notionApi.getPage(pageId);
        console.log(`[getPostRecordMap] Successfully fetched recordMap using original ID`);
        return recordMap;
      }
      throw formattedError;
    }
  } catch (error: any) {
    console.error(`[getPostRecordMap] Error fetching recordMap for page ${pageId}:`, {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusCode: error?.statusCode,
      name: error?.name,
      response: error?.response ? JSON.stringify(error.response).substring(0, 500) : undefined,
      stack: process.env.NODE_ENV === 'development' ? error?.stack?.substring(0, 500) : undefined,
    });
    
    // Fallback: Build recordMap using Notion API directly
    console.log(`[getPostRecordMap] Attempting fallback: building recordMap with Notion API`);
    try {
      return await buildRecordMapWithNotionAPI(pageId);
    } catch (fallbackError: any) {
      console.error(`[getPostRecordMap] Fallback also failed:`, fallbackError?.message);
      throw error; // Throw original error
    }
  }
}

// Fallback: Build recordMap using @notionhq/client
async function buildRecordMapWithNotionAPI(pageId: string): Promise<any> {
  // Fetch the page
  const page = await notion.pages.retrieve({ page_id: pageId });
  
  // Fetch all blocks
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    const { results, next_cursor, has_more } = await notion.blocks.children.list({ 
      block_id: pageId, 
      start_cursor: cursor 
    });
    blocks.push(...results);
    if (!has_more) break;
    cursor = next_cursor as string | undefined;
  }
  
  // Build recordMap structure
  const recordMap: any = {
    block: {
      [pageId]: page as any,
    },
    collection: {},
    collection_view: {},
    discussion: {},
    comment: {},
    signed_urls: {},
  };
  
  // Add all blocks
  blocks.forEach((block: any) => {
    if (block?.id) {
      recordMap.block[block.id] = block;
    }
  });
  
  return recordMap;
}
