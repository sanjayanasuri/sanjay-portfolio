import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ ok: false }, { status: 401 });
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  if (body?.secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ ok: false }, { status: 401 });
  const paths: string[] = Array.isArray(body.paths) ? body.paths : ["/"];
  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ ok: true, revalidated: paths });
}
