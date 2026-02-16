function text(prop: any): string | undefined {
  try { return prop?.rich_text?.[0]?.plain_text || prop?.title?.[0]?.plain_text || undefined; } catch { return undefined; }
}
function fileUrl(prop: any): string | undefined {
  const f = prop?.files?.[0];
  if (!f) return undefined;
  return f.type === "external" ? f.external.url : f.file.url;
}

function getProxyUrl(pageId: string, prop: string, originalUrl?: string) {
  if (!originalUrl) return undefined;
  // If it's a Notion S3 URL, use our stable proxy
  if (originalUrl.includes('s3.us-west-2.amazonaws.com') || originalUrl.includes('secure.notion-static.com')) {
    return `/api/image?pageId=${pageId}&prop=${encodeURIComponent(prop)}`;
  }
  return originalUrl;
}

export function mapPostMeta(page: any) {
  const p = page.properties || {};
  return {
    id: page.id,
    slug: text(p.Slug) || page.id,
    title: text(p.Title) || "Untitled",
    excerpt: text(p.Excerpt) || "",
    cover: getProxyUrl(page.id, 'Cover', fileUrl(p.Cover)),
    publishedAt: p.PublishedAt?.date?.start || undefined,
    tags: (p.Tags?.multi_select || []).map((t: any) => t.name),
  } as {
    id: string; slug: string; title: string; excerpt?: string; cover?: string; publishedAt?: string; tags?: string[];
  };
}

export function mapGalleryItem(page: any) {
  const p = page.properties || {};

  // Find which property contains the image
  const imagePropName = p.Media ? 'Media' : p.Image ? 'Image' : p.Photo ? 'Photo' : p.Picture ? 'Picture' : 'Cover';
  const originalUrl = fileUrl(p[imagePropName]);

  return {
    id: page.id,
    image: getProxyUrl(page.id, imagePropName, originalUrl),
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

  // Find which property contains the image
  const imagePropName = p.Image ? 'Image' : p.Cover ? 'Cover' : p.Photo ? 'Photo' : undefined;
  const originalUrl = imagePropName ? fileUrl(p[imagePropName]) : undefined;

  return {
    id: page.id,
    title: text(p.Title) || text(p.Name) || "Untitled",
    type: p.Type?.select?.name || p.Category?.select?.name || "Other",
    url: url(p.URL) || url(p.Link) || url(p.Spotify) || url(p.YouTube) || undefined,
    description: text(p.Description) || text(p.Why) || text(p.Notes) || undefined,
    image: imagePropName ? getProxyUrl(page.id, imagePropName, originalUrl) : undefined,
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
  const findPropName = (names: string[]) => {
    const propKeys = Object.keys(p);
    for (const name of names) {
      if (p[name]) return name;
      const found = propKeys.find(key => key.toLowerCase() === name.toLowerCase());
      if (found) return found;
      const foundNoSpaces = propKeys.find(key => key.replace(/\s+/g, '').toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
      if (foundNoSpaces) return foundNoSpaces;
    }
    return null;
  };

  // Find name/title property
  const namePropName = findPropName(['Name', 'Title', 'Project Name', 'Project']);
  const projectName = text(p[namePropName || '']) || "Untitled Project";

  // Find repository property
  const repoPropName = findPropName(['Repository', 'Repo', 'GitHub', 'URL', 'Link', 'Github URL', 'Repository URL']);
  const repoUrl = url(p[repoPropName || '']) || undefined;

  // Find demo property
  const demoPropName = findPropName(['Demo', 'Live', 'DemoURL', 'Live Demo', 'Demo URL']);
  const demoUrl = url(p[demoPropName || '']) || undefined;

  // Find screenshot property
  const screenshotPropName = findPropName(['Screenshot', 'Image', 'Cover', 'Thumbnail', 'Screenshot Image']);
  const screenshotUrl = screenshotPropName ? fileUrl(p[screenshotPropName]) : undefined;
  const screenshot = screenshotPropName ? getProxyUrl(page.id, screenshotPropName, screenshotUrl) : undefined;

  // Find video property
  const videoPropName = findPropName(['Video', 'Demo Video', 'Video URL']);
  const video = url(p[videoPropName || '']) || fileUrl(p[videoPropName || '']) || undefined;

  // Find description property
  const descPropName = findPropName(['Description', 'About', 'Summary', 'Project Description']);
  const description = text(p[descPropName || '']) || undefined;

  // Find order property
  const orderPropName = findPropName(['Order', 'Sort', 'Display Order']);
  const order = p[orderPropName || '']?.number || undefined;

  // Find tags property
  const tagsPropName = findPropName(['Tags', 'Tag', 'Categories', 'Category']);
  const tagsProp = p[tagsPropName || ''];
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
