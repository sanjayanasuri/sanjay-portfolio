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
  // Debug: log the first block ID to verify we're getting different content
  const firstBlockId = recordMap?.block ? Object.keys(recordMap.block)[0] : 'none';
  console.log(`[NotionContent] Rendering with first block ID: ${firstBlockId}`);
  
  return (
    <NotionRenderer 
      key={firstBlockId}
      recordMap={recordMap} 
      fullPage={false} 
      darkMode={false} 
    />
  );
}

