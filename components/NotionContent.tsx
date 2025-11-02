"use client";

import dynamic from "next/dynamic";

// Import styles
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css";

const NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { 
    ssr: false,
    loading: () => <div className="py-8 text-center text-zinc-500">Loading content...</div>
  }
);

interface NotionContentProps {
  recordMap: any;
}

export default function NotionContent({ recordMap }: NotionContentProps) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      fullPage={false} 
      darkMode={false} 
    />
  );
}

