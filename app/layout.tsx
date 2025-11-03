import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css"; // if you have code blocks in posts

import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Sanjay Anasuri",
  description: "Portfolio, posts, and artifacts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900 antialiased">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-200/50 -mx-6 sm:-mx-8 px-6 sm:px-8">
            <nav className="flex items-center justify-between py-4">
              <a href="/" className="font-semibold text-lg text-zinc-900 hover:text-zinc-700 transition-colors">Sanjay</a>
              <ul className="flex gap-8 text-sm text-zinc-600">
                <li><a className="hover:text-zinc-900 transition-colors" href="/posts">Posts</a></li>
                <li><a className="hover:text-zinc-900 transition-colors" href="/gallery">Gallery</a></li>
                <li><a className="hover:text-zinc-900 transition-colors" href="/about">About</a></li>
                <li><a className="hover:text-zinc-900 transition-colors" href="/contact">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main className="py-12 pb-20">{children}</main>
          <footer className="border-t border-zinc-200/50 py-12 text-sm text-zinc-500 text-center">
            © {new Date().getFullYear()} Sanjay Anasuri
          </footer>
        </div>
      </body>
    </html>
  );
}
