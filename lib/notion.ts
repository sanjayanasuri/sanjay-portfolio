import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

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
  const res = await notion.databases.query({
    database_id: db,
    filter: { property: "Slug", rich_text: { equals: slug } },
    page_size: 1,
  });
  return (res.results[0] as any) || null;
}

export async function getPostBlocks(pageId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;
  // @ts-ignore notion types
  while (true) {
    // @ts-ignore
    const { results, next_cursor, has_more } = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor });
    blocks.push(...results);
    if (!has_more) break;
    cursor = next_cursor as string | undefined;
  }
  return { blocks } as any;
}
