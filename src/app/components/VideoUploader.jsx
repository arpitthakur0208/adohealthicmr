'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadVideoDirect } from '@/lib/cloudinary-direct-upload';

/**
 * VideoUploader Component
 * - Direct browser upload via unified Cloudinary flow (signed/unsigned)
 * - Notifies parent page.tsx on success to update PostgreSQL
 */
export default function VideoUploader({ moduleId = 0, videoType = 'default', onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    const warnSize = 100 * 1024 * 1024; // 100MB
    const maxSize = 500 * 1024 * 1024; // 500MB hard limit
    if (file.size > warnSize) {
      setError(
        `Large video detected (${(file.size / 1024 / 1024).toFixed(2)}MB). Upload may take longer; compression is recommended.`,
      );
    }
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 500MB. Please compress before upload.`);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadResult(null);
    setUploadProgress(0);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Handle secure upload to Cloudinary
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName?.trim()) {
      setError(
        'Cloud name is undefined. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local and restart the dev server.',
      );
      setUploading(false);
      return;
    }

    console.log("ENV CHECK:", {
      cloud: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });
    console.log("Cloudinary preset:", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const result = await uploadVideoDirect(selectedFile, moduleId, videoType, {
        onProgress: (p) => setUploadProgress(p.progress),
      });

      if (!result.success || !result.video) {
        throw new Error(result.error || 'Upload failed');
      }

      const response = result.video;
      setUploadResult(response);
      setUploading(false);

      if (onUploadSuccess) {
        onUploadSuccess(
          response.secure_url,
          response.publicId,
          response.fileSize,
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Upload failed. Check Cloudinary preset (unsigned), CORS, and account status.';
      setError(message);
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const videoUrl = uploadResult?.secure_url || uploadResult?.url;
  const handleCopyUrl = async () => {
    if (!videoUrl) return;
    try {
      await navigator.clipboard.writeText(videoUrl);
    } catch (err) {
      console.error('Failed to copy uploaded video URL:', err);
    }
  };

  return (
    <div className="video-uploader-container" style={{ width: '100%', padding: '10px' }}>
      {/* File Selection */}
      {!uploadResult && (
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <label
            htmlFor={`video-input-${moduleId}-${videoType}`}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {selectedFile ? 'Change Video' : `Select ${videoType} Video`}
          </label>
          <input
            id={`video-input-${moduleId}-${videoType}`}
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {selectedFile && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '5px', color: '#c00', marginBottom: '15px', fontSize: '13px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Local Preview */}
      {previewUrl && !uploadResult && (
        <div style={{ marginBottom: '15px' }}>
          <video src={previewUrl} controls style={{ width: '100%', maxHeight: '250px', borderRadius: '5px', backgroundColor: '#000' }} />
        </div>
      )}

      {/* Upload Button & Progress */}
      {selectedFile && !uploadResult && (
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: uploading ? '#ccc' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {uploading ? `Uploading video... ${uploadProgress}%` : 'Confirm & Upload Video'}
          </button>

          {uploading && (
            <div style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '8px', fontSize: '12px', color: '#555' }}>
                Uploading video... {uploadProgress}%
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: '#0070f3', transition: 'width 0.2s' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Result - Your full original UI for results */}
      {uploadResult && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '5px', textAlign: 'center' }}>
            <h3 style={{ color: '#2e7d32', marginTop: 0, fontSize: '16px' }}>✅ Upload Successful!</h3>
            <div style={{ marginTop: '10px', fontSize: '12px', textAlign: 'left' }}>
              <div style={{ marginBottom: '5px' }}><strong>Public ID:</strong> {uploadResult.publicId || uploadResult.public_id}</div>
              <div style={{ marginBottom: '5px' }}><strong>Size:</strong> {(((uploadResult.fileSize || uploadResult.bytes || 0) / 1024 / 1024).toFixed(2))} MB</div>
              {uploadResult.width && (
                <div><strong>Resolution:</strong> {uploadResult.width} x {uploadResult.height}</div>
              )}
            </div>
            <button
              onClick={handleReset}
              style={{ marginTop: '15px', fontSize: '12px', color: '#0070f3', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Upload another video
            </button>
          </div>

          {/* Player for the Cloudinary URL */}
          <div style={{ marginTop: '15px' }}>
            <video src={videoUrl} controls style={{ width: '100%', borderRadius: '5px', backgroundColor: '#000' }} />
            {videoUrl && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#333' }}>
                <div style={{ marginBottom: '6px' }}><strong>Uploaded URL:</strong></div>
                <a href={videoUrl} target="_blank" rel="noreferrer" style={{ color: '#0070f3', wordBreak: 'break-all' }}>
                  {videoUrl}
                </a>
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    style={{
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}