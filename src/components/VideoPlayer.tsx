"use client";

import React, { useEffect, useRef, useState } from "react";

interface SmartVideoPlayerProps {
  // Keep backwards compatibility with existing usages that pass `url`
  url?: string;
  src?: string;               // preferred prop, defaults to /videos/sample.mp4
  poster?: string;            // optional /images/sample-poster.jpg
  className?: string;
  autoPlay?: boolean;         // defaults to true
  loop?: boolean;             // defaults to true
}

const SmartVideoPlayer: React.FC<SmartVideoPlayerProps> = ({
  url,
  src,
  poster,
  className = "",
  autoPlay = true,
  loop = true,
}) => {
  const isiOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/i.test(navigator.userAgent);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [canAutoPlay, setCanAutoPlay] = useState(autoPlay);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prefer explicit src, but fall back to legacy `url` prop, then default path.
  const resolvedSrc = src || url || "/videos/sample.mp4";

  // iOS compatibility: if Cloudinary returns a URL that isn't explicitly H.264/AAC,
  // force the response format/codec with transformations.
  const getOptimizedUrl = (input: string): string => {
    try {
      if (!input) return input;
      if (!input.includes("res.cloudinary.com")) return input;
      if (!input.includes("/video/upload/")) return input;

      const TRANS = "f_mp4,vc_h264,ac_aac,q_auto";
      const lower = input.toLowerCase();

      // If already forced, keep it.
      if (lower.includes("f_mp4") && lower.includes("vc_h264") && lower.includes("ac_aac")) {
        return input;
      }

      const marker = "/video/upload/";
      const idx = input.indexOf(marker);
      if (idx < 0) return input;

      const before = input.slice(0, idx + marker.length);
      const after = input.slice(idx + marker.length); // e.g. v171.../file.mp4 OR old_transforms/v171.../file.mp4

      const parts = after.split("/").filter(Boolean);
      if (parts.length < 2) return input;

      const first = parts[0];
      const isVersion = /^v\d+/.test(first);

      if (isVersion) {
        // Insert transforms before version segment.
        // /video/upload/ + TRANS + / + v123/.../file.mp4
        return `${before}${TRANS}/${after}`;
      }

      // Replace existing transforms segment with ours, preserving version+filename.
      return `${before}${TRANS}/${parts.slice(1).join("/")}`;
    } catch {
      return input;
    }
  };

  const playbackSrc = getOptimizedUrl(resolvedSrc);

  // If we were given a thumbnail URL (e.g. ends with .jpg), force MP4 in the URL path too.
  // This avoids iOS being picky about mismatched extensions.
  const playbackSrcFinal = (() => {
    try {
      const [path, query] = playbackSrc.split("?");
      const updatedPath = path.replace(/\.(jpe?g|png|webp|gif)$/i, ".mp4");
      return query ? `${updatedPath}?${query}` : updatedPath;
    } catch {
      return playbackSrc;
    }
  })();

  // iOS sometimes delays IntersectionObserver / autoplay; initialize video UI immediately on iOS.
  useEffect(() => {
    if (isiOS) setIsInView(true);
  }, [isiOS]);

  // If src changes (e.g. user saves a new upload), reset load/error states.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setHasError(false);
    setErrorText(null);
    setIsPlaying(false);
    setIsLoaded(false);
    // Reload metadata for the new source
    v.load();
  }, [playbackSrcFinal]);

  // Lazy-load: only when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Try autoplay when in view
  useEffect(() => {
    if (!isInView || !canAutoPlay || !videoRef.current) return;

    const video = videoRef.current;

    const tryPlay = async () => {
      try {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
        setIsPlaying(true);
      } catch (err) {
        // Autoplay blocked (iOS / browser policy) – require user interaction
        setCanAutoPlay(false);
        setIsPlaying(false);
      }
    };

    // Only attempt autoplay when metadata is available
    if (isLoaded) {
      void tryPlay();
    }

    return () => {
      video.pause();
      setIsPlaying(false);
    };
  }, [isInView, canAutoPlay, isLoaded]);

  const handleUserPlay = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    try {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        await playPromise;
      }
      setIsPlaying(true);
      setHasError(false);
      setErrorText(null);
    } catch (err) {
      setHasError(true);
      setErrorText("Unable to play video. Please tap again or check your connection.");
    }
  };

  const handleLoadedMetadata = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsPlaying(false);
    const el = videoRef.current;
    const code = el?.error?.code;
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
    let detail =
      "Video could not be loaded. Please ensure the file is MP4 (H.264 video + AAC audio).";
    if (code === 4) {
      // MEDIA_ERR_SRC_NOT_SUPPORTED — browser can't decode (wrong codec, corrupt, or bad URL)
      detail =
        "This video format or codec isn’t supported in your browser. Re-upload after converting to MP4 with H.264 + AAC, or open the playback URL on a desktop browser to verify.";
    } else if (code === 2) {
      detail = "Network error while loading the video. Check your connection and try again.";
    } else if (code === 3) {
      detail = "Video decoding failed. The file may be corrupt or use an unsupported codec.";
    }
    setErrorText(detail);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ maxWidth: 960 }}
    >
      {/* Responsive, no layout shift */}
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        {/* 16:9 aspect ratio box */}
        <div className="pt-[56.25%]" />

        <video
        key={playbackSrcFinal}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          // iOS / mobile friendly attributes
          playsInline
          muted
          loop={loop}
          // Autoplay: we try, but if blocked we fall back to tap-to-play
          autoPlay={false}
          // Performance
          preload="metadata"
          poster={poster}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          // iOS sometimes needs controls for better fallback UX.
          controls={isiOS || !canAutoPlay || hasError}
        >
          <source src={playbackSrcFinal} type="video/mp4" />
          {/* Fallback text if video tag not supported */}
          Your browser does not support the video tag.
        </video>

        {/* Overlay: tap-to-play or error message */}
        {!isPlaying && !hasError && (
          <button
            type="button"
            onClick={handleUserPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition hover:bg-black/40"
            aria-label="Play video"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 px-4 text-center text-sm text-red-100">
            <p className="mb-2 font-semibold">Video error</p>
            <p className="mb-3">{errorText}</p>
            <p className="mb-2 text-[10px] text-red-200/90 break-all">
              Playback URL: {playbackSrcFinal}
            </p>
            <p className="text-xs text-red-200">
              Ensure the video is encoded as MP4 with H.264 video and AAC audio. For example:
              <br />
              <code className="mt-1 inline-block rounded bg-black/40 px-2 py-1">
                ffmpeg -i input.mp4 -c:v libx264 -c:a aac output-ios.mp4
              </code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartVideoPlayer;