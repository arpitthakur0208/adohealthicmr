'use client';

import { useState, useRef, useEffect } from 'react';

/** H.264 + AAC MP4 for in-browser preview (Safari / Chrome). */
function toBrowserPlayableCloudinaryUrl(secureUrl) {
  if (!secureUrl || typeof secureUrl !== 'string') return '';
  if (!secureUrl.includes('res.cloudinary.com') || !secureUrl.includes('/upload/')) {
    return secureUrl;
  }
  if (secureUrl.includes('vc_h264') && secureUrl.includes('f_mp4')) {
    return secureUrl;
  }
  return secureUrl.replace(
    '/upload/',
    '/upload/f_mp4,vc_h264,ac_aac,q_auto/'
  );
}

export default function VideoUploader({ moduleId, videoType, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const fileInputRef = useRef(null);

  const folder = `adohealthicmr/videos/${moduleId}/${videoType}`;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // ✅ Get signature
      const res = await fetch('/api/cloudinary-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      const data = await res.json();

      console.log('[VideoUploader] Cloudinary signature API response:', data);

      if (!res.ok || !data.signature) {
        throw new Error(data.error || 'Failed to get upload signature');
      }

      const { signature, timestamp, apiKey, cloudName } = data;

      // ✅ Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        console.log(
          '[VideoUploader] Cloudinary upload raw response:',
          xhr.status,
          xhr.responseText
        );
        const response = JSON.parse(xhr.responseText || '{}');

        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadResult(response);
          setUploading(false);
          if (onUploadSuccess) {
            onUploadSuccess(
              response.secure_url,
              response.public_id,
              response.bytes
            );
          }
        } else {
          setError(response.error?.message || 'Upload failed');
          setUploading(false);
        }
      };

      xhr.onerror = () => {
        setError('Network error');
        setUploading(false);
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      );
      xhr.send(formData);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  const videoUrl = toBrowserPlayableCloudinaryUrl(uploadResult?.secure_url);

  useEffect(() => {
    if (videoUrl) console.log('Final Video URL:', videoUrl);
  }, [videoUrl]);

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedFile && !uploadResult && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? `Uploading ${uploadProgress}%` : 'Upload Video'}
        </button>
      )}

      {uploadResult?.secure_url && videoUrl && (
        <div style={{ marginTop: '12px' }}>
          <video
            key={videoUrl}
            controls
            playsInline
            style={{
              width: '100%',
              borderRadius: '5px',
              backgroundColor: '#000',
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}