"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster, className = '', onError }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Optimized Cloudinary URL logic
  const getUrl = (originalUrl: string, type: 'hls' | 'mp4') => {
    if (!originalUrl.includes('res.cloudinary.com')) return originalUrl;
    
    // Clean the URL of existing transformations
    let base = originalUrl.replace(/\/upload\/[^\/]+\//, '/upload/');
    
    if (type === 'hls') {
      // Best for iOS: sp_hls profile + .m3u8 extension
      return base.replace('/upload/', '/upload/sp_hls/').replace(/\.[^/.]+$/, '.m3u8');
    }
    // Reliable MP4 for everyone else
    return base.replace('/upload/', '/upload/f_mp4,vc_h264,q_auto/');
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Forces Safari to re-scan sources
    }
  }, [url]);

  return (
    <div className={`relative overflow-hidden rounded-lg bg-black ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        webkit-playsinline="true"
        preload="metadata"
        className="w-full h-full"
        crossOrigin="anonymous"
        onError={() => {
          setHasError(true);
          onError?.(new Error('Video failed to load'));
        }}
      >
        {/* 1. HLS: The iOS favorite */}
        <source src={getUrl(url, 'hls')} type="application/x-mpegURL" />
        
        {/* 2. MP4: The universal fallback */}
        <source src={getUrl(url, 'mp4')} type="video/mp4" />
        
        {/* 3. Original: The "just in case" fallback */}
        <source src={url} />
      </video>

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 text-white text-xs p-4 text-center">
          Tap to play or check connection.
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;