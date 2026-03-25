"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: (error: Error) => void;
  showControls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  className = '',
  onError,
  showControls = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * iOS is picky with formats. 
   * vc_h264: Forces the H.264 codec (Universal Apple support)
   * f_mp4: Ensures it's an MP4 container
   */
  const getOptimizedUrl = (videoUrl: string): string => {
    if (!videoUrl || !videoUrl.includes('res.cloudinary.com')) return videoUrl;
    
    let cleanUrl = videoUrl;

    // 1. Remove common image/thumbnail markers that cause video load failures
    cleanUrl = cleanUrl.replace(/\/(w_|h_|c_|f_jpg|f_png)[^\/]+/g, '');
    cleanUrl = cleanUrl.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

    // 2. Ensure we are using the /video/upload path
    if (!cleanUrl.includes('/video/upload/')) {
      cleanUrl = cleanUrl.replace('/upload/', '/video/upload/');
    }

    // 3. Apply iOS-friendly transformations
    // We remove any existing transformations to avoid conflicts
    const transformationBase = 'f_mp4,vc_h264,q_auto';
    
    if (cleanUrl.includes('/upload/')) {
      // Remove existing transform segments (e.g., /upload/v1234/ -> /upload/)
      cleanUrl = cleanUrl.replace(/\/upload\/v\d+\//, '/upload/');
      cleanUrl = cleanUrl.replace(/\/upload\/[^\/]+\//, '/upload/');
      
      // Inject our optimized string
      cleanUrl = cleanUrl.replace('/upload/', `/upload/${transformationBase}/`);
    }

    return cleanUrl;
  };

  const optimizedUrl = getOptimizedUrl(url);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsProcessing(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      const error = video.error;
      let message = 'Failed to load video';

      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_NETWORK:
            message = 'Network error. The video might still be processing.';
            setIsProcessing(true);
            break;
          case MediaError.MEDIA_ERR_DECODE:
            message = 'Video decoding error. Try a different browser.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            message = 'Format not supported by iOS/Safari.';
            break;
        }
        setErrorMessage(message);
        if (onError) onError(new Error(message));
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Re-load the video when the URL changes because we are using <source> tags
    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [optimizedUrl, onError, url]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg aspect-video ${className}`}>
        <p className="text-gray-500 text-sm">No video source found</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
        
        {/* Overlays */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-20 p-4 text-center">
            <p className="text-white text-sm font-bold">⚠️ {errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-xs text-white underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* IMPORTANT FOR iOS:
          1. DO NOT put 'src' on the <video> tag if using <source> children.
          2. 'playsInline' is camelCase in React.
          3. 'muted' is often required for videos to load on Low Power Mode.
        */}
        <video
          ref={videoRef}
          poster={poster}
          controls={showControls}
          controlsList="nodownload"
          className="w-full h-full object-contain"
          preload="metadata"
          playsInline
          autoPlay={false}
          muted={false} 
          crossOrigin="anonymous"
        >
          {/* Primary Optimized Source */}
          <source src={optimizedUrl} type="video/mp4" />
          
          {/* Fallback to Original URL */}
          <source src={url} type="video/mp4" />
          
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;