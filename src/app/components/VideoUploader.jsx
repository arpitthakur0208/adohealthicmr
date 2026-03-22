'use client';

import { useState, useRef } from 'react';

export default function VideoUploader({ moduleId, videoType, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

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

      console.log('Signature response:', data);

      if (!res.ok || !data.signature) {
        throw new Error(data.error || 'Failed to get upload signature');
      }

      const { signature, timestamp, apiKey, cloudName } = data;

      // ✅ Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);
      formData.append('resource_type', 'video');
      formData.append('format', 'mp4');

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText || '{}');

        if (xhr.status >= 200 && xhr.status < 300) {
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

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedFile && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? `Uploading ${uploadProgress}%` : 'Upload Video'}
        </button>
      )}
    </div>
  );
}