"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProfileImage() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-zinc-600 bg-gradient-to-br from-zinc-200 to-zinc-300">
        SA
      </div>
    );
  }

  return (
    <Image
      src="/profile.jpg"
      alt="Sanjay Anasuri"
      width={160}
      height={160}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

