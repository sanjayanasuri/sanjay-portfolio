import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sanjay Anasuri | Agentic AI & Knowledge Graphs",
  description: "Portfolio and artifacts of Sanjay Anasuri, focused on autonomous systems and graph neural networks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-accent/30 selection:text-ink">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <Navbar />
          <main className="py-12 pb-20">{children}</main>
          <footer className="border-t border-border py-12 text-sm text-muted">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1">
                <p className="font-semibold text-ink">Sanjay Anasuri</p>
                <p>© {new Date().getFullYear()}</p>
              </div>
              <div className="flex gap-6">
                <a href="https://github.com" className="hover:text-accent font-medium">GitHub</a>
                <a href="https://linkedin.com" className="hover:text-accent font-medium">LinkedIn</a>
                <a href="mailto:contact@sanjayanasuri.com" className="hover:text-accent font-medium">Email</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
