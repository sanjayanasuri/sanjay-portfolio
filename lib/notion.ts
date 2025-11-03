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

// Helper to remove hyphens from Notion ID (for Notion API)
function unformatNotionId(id: string): string {
  return id.replace(/-/g, '');
}

// NEW: return a full recordMap that react-notion-x expects
export async function getPostRecordMap(pageId: string): Promise<any> {
  // notion-client often fails, so let's use Notion API fallback as primary
  // Try notion-client first, but don't fail if it doesn't work
  try {
    const formattedId = formatNotionId(pageId);
    console.log(`[getPostRecordMap] Trying notion-client with formatted ID: ${formattedId}`);
    const recordMap = await notionApi.getPage(formattedId);
    console.log(`[getPostRecordMap] ✅ Successfully fetched using notion-client`);
    return recordMap;
  } catch (notionClientError: any) {
    console.log(`[getPostRecordMap] notion-client failed: ${notionClientError?.message}`);
    // Continue to fallback
  }
  
  // Fallback: Build recordMap using Notion API directly (more reliable)
  console.log(`[getPostRecordMap] Using fallback: building recordMap with Notion API for page: ${pageId}`);
  try {
    const recordMap = await buildRecordMapWithNotionAPI(pageId);
    console.log(`[getPostRecordMap] ✅ Successfully built recordMap using Notion API fallback`);
    return recordMap;
  } catch (fallbackError: any) {
    console.error(`[getPostRecordMap] ❌ Fallback failed:`, {
      message: fallbackError?.message,
      code: fallbackError?.code,
      status: fallbackError?.status,
      pageId: pageId,
    });
    throw fallbackError;
  }
}

// Fallback: Build recordMap using @notionhq/client
async function buildRecordMapWithNotionAPI(pageId: string): Promise<any> {
  // Notion API needs ID without hyphens
  const apiPageId = unformatNotionId(pageId);
  console.log(`[buildRecordMapWithNotionAPI] Using API page ID: ${apiPageId}`);
  
  // Fetch the page
  const page = await notion.pages.retrieve({ page_id: apiPageId });
  console.log(`[buildRecordMapWithNotionAPI] Retrieved page: ${page.id}`);
  
  // Fetch all blocks recursively
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    const response = await notion.blocks.children.list({ 
      block_id: apiPageId, 
      start_cursor: cursor 
    });
    blocks.push(...response.results);
    if (!response.has_more) break;
    cursor = response.next_cursor as string | undefined;
  }
  console.log(`[buildRecordMapWithNotionAPI] Fetched ${blocks.length} blocks`);
  
  // Build recordMap structure that react-notion-x expects
  const recordMap: any = {
    block: {},
    collection: {},
    collection_view: {},
    discussion: {},
    comment: {},
    signed_urls: {},
  };
  
  // Add the page itself - use both formatted and unformatted IDs as keys
  // Some parts of react-notion-x might expect different formats
  const formattedPageId = formatNotionId(apiPageId);
  recordMap.block[formattedPageId] = {
    value: {
      ...page,
      id: formattedPageId, // Ensure ID matches the key
    },
    role: 'reader',
  };
  
  // Also add with original page ID format if different
  if (formattedPageId !== pageId) {
    recordMap.block[pageId] = recordMap.block[formattedPageId];
  }
  
  // Add all blocks with proper structure
  blocks.forEach((block: any) => {
    if (block?.id) {
      // Format block ID to UUID format
      const blockId = formatNotionId(block.id);
      recordMap.block[blockId] = {
        value: {
          ...block,
          id: blockId, // Ensure ID matches the key
          parent_id: block.parent?.page_id ? formatNotionId(block.parent.page_id) : formattedPageId,
        },
        role: 'reader',
      };
    }
  });
  
  // Ensure the page has children reference
  if (recordMap.block[formattedPageId]) {
    const pageValue = recordMap.block[formattedPageId].value;
    if (!pageValue.content) {
      pageValue.content = blocks.map(b => formatNotionId(b.id));
    }
  }
  
  console.log(`[buildRecordMapWithNotionAPI] Built recordMap with ${Object.keys(recordMap.block).length} blocks`);
  return recordMap;
}
