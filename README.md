# Sanjay Portfolio (Next.js + Notion)

A minimal, production-ready personal site using Next.js (App Router) with Notion as the CMS. Deployed on Vercel. Domain via AWS Route 53.

## 1) Local setup
```bash
npm i # or pnpm i / yarn
cp .env.example .env.local
# fill NOTION_TOKEN, NOTION_POSTS_DB_ID, REVALIDATE_SECRET
npm run dev
```

## 2) Notion setup
1. Create a **Posts** database with properties: Title, Slug (Text), Published (Checkbox), PublishedAt (Date), Excerpt (Text), Tags (Multi-select), Cover (File/URL).
2. Create a Notion **internal integration** and copy its secret → `NOTION_TOKEN`.
3. Share the Posts database with the integration.
4. Copy the database ID → `NOTION_POSTS_DB_ID`.

## 3) Deploy to Vercel
- Import the GitHub repo into Vercel.
- Add env vars in Project Settings → Environment Variables:
  - `NOTION_TOKEN`
  - `NOTION_POSTS_DB_ID`
  - `REVALIDATE_SECRET`
- Deploy.

## 4) Revalidate after edits
- GET `https://YOURDOMAIN/api/revalidate?secret=REVALIDATE_SECRET&path=/`
- Or POST `{ "secret": "REVALIDATE_SECRET", "paths": ["/", "/posts"] }` to the same endpoint.

## 5) AWS Route 53 (Domain)
Add DNS records in your hosted zone:
- `A @` → `76.76.21.21`
- `CNAME www` → `cname.vercel-dns.com.`
- Any verification TXT/CNAME Vercel asks for.

## Notes
- This starter renders Notion content via `react-notion-x`. For large sites, consider a full recordMap via notion-client + notion-utils.
- `revalidate = 60` provides ISR; tune this as you like.
