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
    <img
      src="/profile.jpg"
      alt="Sanjay Anasuri"
      className="w-full h-full object-cover"
      style={{ objectPosition: 'center 20%' }}
      onError={() => setImageError(true)}
    />
  );
}

