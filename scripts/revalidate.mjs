// scripts/revalidate.mjs
// Uses built-in fetch (Node 18+)

const secret = process.env.REVALIDATE_SECRET;
const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Accept paths from CLI: `npm run revalidate -- / /posts /posts/hello-world`
const paths = process.argv.slice(2);
const payload = { secret, paths: paths.length ? paths : ["/", "/posts"] };

const res = await fetch(`${base}/api/revalidate`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});
console.log("Status:", res.status);
console.log(await res.text());

