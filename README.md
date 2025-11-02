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
  - `NEXT_PUBLIC_SITE_URL` (your domain, e.g., `https://sanjayanasuri.com`)
- Deploy.

## 4) Revalidate after edits
- GET `https://YOURDOMAIN/api/revalidate?secret=REVALIDATE_SECRET&path=/`
- Or POST `{ "secret": "REVALIDATE_SECRET", "paths": ["/", "/posts"] }` to the same endpoint.
- Or use the npm script: `REVALIDATE_SECRET=secret NEXT_PUBLIC_SITE_URL=https://yourdomain.com npm run revalidate:prod`

## 5) AWS Route 53 (Domain)
Add DNS records in your hosted zone:
- `A @` → `76.76.21.21`
- `CNAME www` → `cname.vercel-dns.com.`
- Any verification TXT/CNAME Vercel asks for.

## Debugging Errors

### Where to see error messages:

**1. Local Development:**
- Check your terminal where `npm run dev` is running
- Check browser console (F12) for client-side errors
- Errors will show in the browser UI in development mode

**2. Vercel (Production):**
- Go to your Vercel dashboard
- Click on your project → "Deployments" tab
- Click on a deployment → "Functions" tab
- Click on the function that's failing → See "Logs" tab
- Or go to "Logs" tab at the top to see real-time logs

**3. Vercel CLI (if installed):**
```bash
vercel logs [deployment-url] --follow
```

**4. Check Server Logs:**
All `console.error()` calls will appear in:
- Local: Your terminal running `npm run dev`
- Vercel: Deployment logs (see above)

### Common Error Scenarios:

1. **"Application error: a server-side exception"**
   - Check Vercel logs (see above)
   - Check if `NOTION_TOKEN` and `NOTION_POSTS_DB_ID` are set correctly
   - Verify the Notion integration has access to your database

2. **"Could not find property with name or id: X"**
   - Your Notion database is missing the expected property
   - Add the missing property to your Notion database

3. **404 on post pages**
   - Check if the slug in the URL matches the Slug property in Notion
   - Check Vercel logs for "Post not found for slug: X" messages

## Notes
- This starter renders Notion content via `react-notion-x` using `notion-client` for proper recordMap structure.
- `revalidate = 60` provides ISR; tune this as you like.
- All server-side errors are logged with `console.error()` - check Vercel logs to see details.
