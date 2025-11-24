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
    // Handle Notion URL property type
    if (prop?.type === 'url') {
      return prop.url || undefined;
    }
    // Handle URL as direct property
    if (prop?.url) {
      return prop.url;
    }
    // Handle rich_text that might contain a URL
    if (prop?.rich_text?.[0]?.plain_text) {
      const text = prop.rich_text[0].plain_text;
      // Check if it looks like a URL
      if (text.startsWith('http://') || text.startsWith('https://')) {
        return text;
      }
    }
    return undefined;
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

export function mapProject(page: any) {
  const p = page.properties || {};
  
  // Helper to find property by name (case-insensitive, handles spaces)
  const findProp = (names: string[]) => {
    const propKeys = Object.keys(p);
    for (const name of names) {
      // Exact match
      if (p[name]) return p[name];
      // Case-insensitive match
      const found = propKeys.find(key => key.toLowerCase() === name.toLowerCase());
      if (found) return p[found];
      // Match with spaces removed
      const foundNoSpaces = propKeys.find(key => key.replace(/\s+/g, '').toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
      if (foundNoSpaces) return p[foundNoSpaces];
    }
    return null;
  };
  
  // Find name/title property
  const nameProp = findProp(['Name', 'Title', 'Project Name', 'Project']);
  const projectName = text(nameProp) || "Untitled Project";
  
  // Find repository property
  const repoProp = findProp(['Repository', 'Repo', 'GitHub', 'URL', 'Link', 'Github URL', 'Repository URL']);
  const repoUrl = url(repoProp) || undefined;
  
  // Find demo property
  const demoProp = findProp(['Demo', 'Live', 'DemoURL', 'Live Demo', 'Demo URL']);
  const demoUrl = url(demoProp) || undefined;
  
  // Find screenshot property
  const screenshotProp = findProp(['Screenshot', 'Image', 'Cover', 'Thumbnail', 'Screenshot Image']);
  const screenshot = fileUrl(screenshotProp) || undefined;
  
  // Find video property
  const videoProp = findProp(['Video', 'Demo Video', 'Video URL']);
  const video = url(videoProp) || fileUrl(videoProp) || undefined;
  
  // Find description property
  const descProp = findProp(['Description', 'About', 'Summary', 'Project Description']);
  const description = text(descProp) || undefined;
  
  // Find order property
  const orderProp = findProp(['Order', 'Sort', 'Display Order']);
  const order = orderProp?.number || undefined;
  
  // Find tags property
  const tagsProp = findProp(['Tags', 'Tag', 'Categories', 'Category']);
  const tags = (tagsProp?.multi_select || tagsProp?.select ? [tagsProp.select || tagsProp.multi_select].flat() : []).map((t: any) => t?.name || t).filter(Boolean);
  
  return {
    id: page.id,
    name: projectName,
    repoUrl,
    demoUrl,
    screenshot,
    video,
    description,
    order,
    tags: tags.length > 0 ? tags : undefined,
  } as {
    id: string;
    name: string;
    repoUrl?: string;
    demoUrl?: string;
    screenshot?: string;
    video?: string;
    description?: string;
    order?: number;
    tags?: string[];
  };
}
