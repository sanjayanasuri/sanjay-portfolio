import { listForFriendsItems } from "@/lib/notion";
import { mapForFriendsItem } from "@/lib/mapNotion";
import ForFriendsPageClient from "./page-client";

export const revalidate = 60;

export default async function ForFriendsPage() {
  const raw = await listForFriendsItems({ limit: 100 });
  const items = raw.map(mapForFriendsItem);
  
  return <ForFriendsPageClient initialItems={items} />;
}

