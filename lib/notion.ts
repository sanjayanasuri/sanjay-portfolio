import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI({
  authToken: process.env.NOTION_TOKEN, // allows access to private pages you shared to the integration
});

export type NotionListOptions = { limit?: number };

// Gallery functions
export async function listGalleryItems({ limit = 100 }: NotionListOptions = {}) {
  const db = process.env.NOTION_GALLERY_DB_ID;
  if (!db) {
    console.warn("NOTION_GALLERY_DB_ID not set, returning empty gallery");
    return [];
  }
  try {
    const res = await notion.databases.query({
      database_id: db,
      page_size: limit,
    });
    return res.results as any[];
  } catch (error: any) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

// For Friends functions
export async function listForFriendsItems({ limit = 100 }: NotionListOptions = {}) {
  const db = process.env.NOTION_FOR_FRIENDS_DB_ID;
  if (!db) {
    console.warn("NOTION_FOR_FRIENDS_DB_ID not set, returning empty list");
    return [];
  }
  try {
    // Try with Date sort first (newest first)
    const res = await notion.databases.query({
      database_id: db,
      page_size: limit,
      sorts: [{ property: "Date", direction: "descending" }],
    });
    return res.results as any[];
  } catch (error: any) {
    // If Date property doesn't exist, try without sort
    if (error?.code === 'validation_error' && error?.message?.includes('Date')) {
      console.log("Date property not found, fetching without sort");
      try {
        const res = await notion.databases.query({
          database_id: db,
          page_size: limit,
        });
        return res.results as any[];
      } catch (fallbackError: any) {
        console.error("Error fetching For Friends items (fallback):", {
          message: fallbackError?.message,
          code: fallbackError?.code,
          status: fallbackError?.status,
        });
        return [];
      }
    }
    // Log detailed error for other issues
    console.error("Error fetching For Friends items:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      databaseId: db,
    });
    return [];
  }
}

// For Employers / Projects functions
export async function listProjects({ limit = 100 }: NotionListOptions = {}) {
  const db = process.env.NOTION_PROJECTS_DB_ID;
  if (!db) {
    console.warn("NOTION_PROJECTS_DB_ID not set, returning empty list");
    return [];
  }
  try {
    // First, try to get database schema to see what properties exist
    try {
      const dbInfo = await notion.databases.retrieve({ database_id: db });
      console.log("[listProjects] Database properties:", Object.keys(dbInfo.properties || {}));
    } catch (schemaError) {
      // Ignore schema errors, just log
      console.log("[listProjects] Could not retrieve database schema");
    }
    
    // Try with Order sort first
    try {
      const res = await notion.databases.query({
        database_id: db,
        page_size: limit,
        sorts: [{ property: "Order", direction: "ascending" }],
      });
      console.log(`[listProjects] Successfully fetched ${res.results.length} projects with Order sort`);
      return res.results as any[];
    } catch (orderError: any) {
      // If Order property doesn't exist, try without sort
      if (orderError?.code === 'validation_error' && orderError?.message?.includes('Order')) {
        console.log("[listProjects] Order property not found, fetching without sort");
        const res = await notion.databases.query({
          database_id: db,
          page_size: limit,
        });
        console.log(`[listProjects] Successfully fetched ${res.results.length} projects without sort`);
        return res.results as any[];
      }
      throw orderError;
    }
  } catch (error: any) {
    // Log detailed error
    console.error("[listProjects] Error fetching Projects:", {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      statusCode: error?.statusCode,
      databaseId: db,
    });
    
    // Check if it's a permission/access error
    if (error?.code === 'object_not_found' || error?.status === 404) {
      console.error("[listProjects] Database not found or integration doesn't have access. Make sure:");
      console.error("  1. Database ID is correct:", db);
      console.error("  2. Database is shared with your Notion integration");
      console.error("  3. Integration has proper permissions");
    }
    
    return [];
  }
}

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
  // Decode URL-encoded slug (handles %20, etc.)
  const decodedSlug = decodeURIComponent(slug);
  console.log(`[getPostBySlug] Looking for post with slug: "${slug}" (decoded: "${decodedSlug}")`);
  try {
    // Try with decoded slug first
    let res = await notion.databases.query({
      database_id: db,
      filter: { property: "Slug", rich_text: { equals: decodedSlug } },
      page_size: 1,
    });
    let page = (res.results[0] as any) || null;
    
    // If not found, try with original encoded slug
    if (!page && decodedSlug !== slug) {
      res = await notion.databases.query({
        database_id: db,
        filter: { property: "Slug", rich_text: { equals: slug } },
        page_size: 1,
      });
      page = (res.results[0] as any) || null;
    }
    if (page) {
      const title = page.properties?.Title?.title?.[0]?.plain_text || page.properties?.Title?.rich_text?.[0]?.plain_text || 'Untitled';
      console.log(`[getPostBySlug] ✅ Found post "${title}" with ID: ${page.id} for slug: "${decodedSlug}"`);
    } else {
      console.log(`[getPostBySlug] ❌ No post found for slug: "${decodedSlug}"`);
    }
    return page;
  } catch (error: any) {
    // If Slug property doesn't exist, try without filter and match manually
    if (error?.code === 'validation_error' && error?.message?.includes('Slug')) {
      console.log(`[getPostBySlug] Slug property error, trying manual match for: "${slug}"`);
      const res = await notion.databases.query({
        database_id: db,
        page_size: 100,
      });
      // Try to find by matching slug in title or ID (compare both encoded and decoded)
      const match = res.results.find((page: any) => {
        const pageSlug = page.properties?.Slug?.rich_text?.[0]?.plain_text || 
                        page.properties?.slug?.rich_text?.[0]?.plain_text ||
                        page.id.replace(/-/g, '');
        return pageSlug === slug || pageSlug === decodedSlug || page.id === slug || page.id === decodedSlug;
      });
      if (match) {
        const matchAny = match as any;
        const title = matchAny.properties?.Title?.title?.[0]?.plain_text || matchAny.properties?.Title?.rich_text?.[0]?.plain_text || 'Untitled';
        console.log(`[getPostBySlug] ✅ Found post "${title}" with ID: ${matchAny.id} for slug: "${slug}"`);
      }
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
