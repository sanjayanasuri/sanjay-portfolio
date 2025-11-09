import { listGalleryItems } from "@/lib/notion";
import { mapGalleryItem } from "@/lib/mapNotion";
import GalleryPageClient from "./page-client";

export const revalidate = 60;

export default async function GalleryPage() {
  const raw = await listGalleryItems({ limit: 100 });
  const items = raw.map(mapGalleryItem).filter(item => item.image);
  
  return <GalleryPageClient initialItems={items} />;
}
