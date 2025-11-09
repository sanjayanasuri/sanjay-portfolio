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

export function mapGalleryItem(page: any) {
  const p = page.properties || {};
  return {
    id: page.id,
    image: fileUrl(p.Media) || fileUrl(p.Image) || fileUrl(p.Photo) || fileUrl(p.Picture) || fileUrl(p.Cover),
    title: text(p.Title) || text(p.Name) || text(p.Caption) || undefined,
    caption: text(p.Caption) || text(p.Description) || text(p.Alt) || undefined,
    category: p.Category?.select?.name || p.Category?.multi_select?.[0]?.name || undefined,
    tags: (p.Tags?.multi_select || []).map((t: any) => t.name),
    date: p.Date?.date?.start || p.Created?.created_time || p.PublishedAt?.date?.start || undefined,
  } as {
    id: string;
    image?: string;
    title?: string;
    caption?: string;
    category?: string;
    tags?: string[];
    date?: string;
  };
}

function url(prop: any): string | undefined {
  try {
    return prop?.url || prop?.rich_text?.[0]?.plain_text || undefined;
  } catch {
    return undefined;
  }
}

export function mapForFriendsItem(page: any) {
  const p = page.properties || {};
  return {
    id: page.id,
    title: text(p.Title) || text(p.Name) || "Untitled",
    type: p.Type?.select?.name || p.Category?.select?.name || "Other",
    url: url(p.URL) || url(p.Link) || url(p.Spotify) || url(p.YouTube) || undefined,
    description: text(p.Description) || text(p.Why) || text(p.Notes) || undefined,
    image: fileUrl(p.Image) || fileUrl(p.Cover) || fileUrl(p.Photo) || undefined,
    date: p.Date?.date?.start || p.Created?.created_time || undefined,
    tags: (p.Tags?.multi_select || []).map((t: any) => t.name),
  } as {
    id: string;
    title: string;
    type: string;
    url?: string;
    description?: string;
    image?: string;
    date?: string;
    tags?: string[];
  };
}
