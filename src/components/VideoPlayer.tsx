"use client";

import React, { useState, useMemo } from "react";

interface VideoPlayerProps {
  /** Full Cloudinary secure_url or a video public_id (folder/name). */
  url: string;
  className?: string;
}

/**
 * Cloudinary hosted embed player — works well on iOS Safari vs raw <video> edge cases.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);

  /** Raw public_id path (unencoded) for query params. */
  const publicIdRaw = useMemo(() => {
    if (!url?.trim()) return "";
    if (!url.includes("res.cloudinary.com")) {
      return url.replace(/^\/+/, "");
    }
    const match = url.match(/\/video\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
    return match ? match[1] : url;
  }, [url]);

  const embedUrl = useMemo(() => {
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "adohealthicmr";

    if (!publicIdRaw) return "";

    const params = new URLSearchParams({
      cloud_name: cloudName,
      public_id: publicIdRaw,
      profile: "Adohealth Video Player",
    });

    return `https://player.cloudinary.com/embed/?${params.toString()}`;
  }, [publicIdRaw]);

  if (!url?.trim() || !embedUrl) {
    return (
      <div
        className={`flex items-center justify-center aspect-video bg-gray-900 text-gray-400 text-sm rounded-lg ${className}`}
      >
        No video URL
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}

      <iframe
        title="Video player"
        src={embedUrl}
        width={640}
        height={360}
        className="w-full h-full min-h-[200px] border-0"
        style={{ aspectRatio: "16 / 9" }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default VideoPlayer;
