function text(prop: any): string | undefined {
  try { return prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || undefined; } catch { return undefined; }
}
function fileUrl(prop: any): string | undefined {
  const f = prop?.files?.[0];
  if (!f) return undefined;
  return f.type === "external" ? f.external.url : f.file.url;
}

export function mapPostMeta(page: any) {
  const p = page.properties || {};
  return {
    id: page.id,
    slug: text(p.Slug) || page.id,
    title: text(p.Title) || "Untitled",
    excerpt: text(p.Excerpt) || "",
    cover: fileUrl(p.Cover),
    publishedAt: p.PublishedAt?.date?.start || undefined,
    tags: (p.Tags?.multi_select || []).map((t: any) => t.name),
  } as {
    id: string; slug: string; title: string; excerpt?: string; cover?: string; publishedAt?: string; tags?: string[];
  };
}
