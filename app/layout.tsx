import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css"; // if you have code blocks in posts

import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Sanjay Anasuri",
  description: "Portfolio, posts, and artifacts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <header className="sticky top-0 z-50 glass-panel border-b border-border/50 -mx-6 sm:-mx-8 px-6 sm:px-8 shadow-brain-sm">
            <nav className="flex items-center justify-between py-4">
              <a href="/" className="font-semibold text-lg text-ink hover:text-accent transition-colors">Sanjay Anasuri</a>
              <ul className="flex gap-8 text-sm text-muted">
                <li><a className="hover:text-accent transition-colors font-medium" href="/posts">Posts</a></li>
                <li><a className="hover:text-accent transition-colors font-medium" href="/gallery">Gallery</a></li>
                <li><a className="hover:text-accent transition-colors font-medium" href="/for-friends">For Friends</a></li>
                <li><a className="hover:text-accent transition-colors font-medium" href="/for-employers">For Employers</a></li>
                <li><a className="hover:text-accent transition-colors font-medium" href="/contact">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main className="py-12 pb-20">{children}</main>
          <footer className="border-t border-border/50 py-12 text-sm text-muted text-center">
            © {new Date().getFullYear()} Sanjay Anasuri
          </footer>
        </div>
      </body>
    </html>
  );
}
