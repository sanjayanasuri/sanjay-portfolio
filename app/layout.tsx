import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Sanjay Anasuri",
  description: "Portfolio, posts, and artifacts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <div className="mx-auto max-w-4xl px-4">
          <header className="py-6">
            <nav className="flex items-center justify-between">
              <a href="/" className="font-semibold">Sanjay</a>
              <ul className="flex gap-6 text-sm text-zinc-600">
                <li><a className="hover:underline" href="/posts">Posts</a></li>
                <li><a className="hover:underline" href="/gallery">Gallery</a></li>
                <li><a className="hover:underline" href="/about">About</a></li>
                <li><a className="hover:underline" href="/contact">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main className="pb-16">{children}</main>
          <footer className="border-t py-8 text-sm text-zinc-500">© {new Date().getFullYear()} Sanjay Anasuri</footer>
        </div>
      </body>
    </html>
  );
}
