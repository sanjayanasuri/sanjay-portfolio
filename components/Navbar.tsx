"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Posts", href: "/posts" },
    { label: "Gallery", href: "/gallery" },
    { label: "For Friends", href: "/for-friends" },
    { label: "Employers", href: "/for-employers" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-6 z-50 px-4 sm:px-0">
            <nav className="mx-auto max-w-4xl glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-brain-sm border-white/20">
                <Link
                    href="/"
                    className="text-sm font-bold text-ink hover:text-accent transition-colors"
                >
                    Home
                </Link>

                <ul className="flex gap-1 items-center">
                    {navItems.map((item) => {
                        const label = item.label === "Employers" ? "Projects" : item.label;
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href as any}
                                    className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                        ? "text-accent bg-accent/5"
                                        : "text-muted hover:text-ink hover:bg-black/5"
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Mobile menu could go here, but keeping it minimal for now */}
                <div className="md:hidden hidden">
                    <button className="w-10 h-10 flex items-center justify-center glass-panel rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
}
