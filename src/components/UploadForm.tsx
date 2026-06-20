import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Link as LinkIcon } from 'lucide-react';

interface UploadFormProps {
  onAnalyze: (file: File | null, url: string, caption: string, platform: string) => void;
}

const PLATFORMS = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
  'LinkedIn',
  'Twitter/X'
];

export const UploadForm: React.FC<UploadFormProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setUrl(''); // clear url if file is uploaded

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  }, []);

  useEffect(() => {
    // cleanup object urls to prevent memory leaks
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.webm'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) {
      alert('Please select a platform');
      return;
    }
    if (!file && !url) {
      alert('Please upload a file or provide a URL');
      return;
    }
    onAnalyze(file, url, caption, platform);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-6 bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">

      {/* File Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-400 hover:bg-gray-800'
        }`}
      >
        <input {...getInputProps()} />
        {file && previewUrl ? (
          <div className="flex flex-col items-center">
            {file.type.startsWith('video') ? (
              <video
                src={previewUrl}
                controls
                className="max-h-64 rounded-lg shadow-md border border-gray-700 mb-3"
              />
            ) : (
              <div className="relative w-32 h-[227px] mx-auto overflow-hidden rounded-lg border border-gray-700 shadow-md">
                 <img
                   src={previewUrl}
                   alt="Preview"
                   className="object-cover w-full h-full"
                 />
              </div>
            )}
            <span className="text-gray-300 font-medium text-sm">{file.name}</span>
            <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            <button
              type="button"
              className="mt-3 text-purple-400 text-sm hover:text-purple-300 underline"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreviewUrl(null);
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-800 rounded-full">
              <UploadCloud className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-200">Drag & drop your video or image here</p>
              <p className="text-sm text-gray-500 mt-1">MP4, MOV, WebM, JPG, PNG up to 100MB</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Paste Content URL</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFile(null);
              setPreviewUrl(null);
            }}
            placeholder="TikTok, Reel, or Shorts URL"
            className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Caption Input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Caption & Hashtags</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Paste your caption here (including hashtags) — this affects your score"
          className="w-full p-4 bg-gray-950 border border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all h-32 resize-none"
        />
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3">Target Platform</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PLATFORMS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPlatform(p)}
              className={`py-2 px-4 rounded-lg border transition-all ${
                platform === p
                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                  : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-0.5"
      >
        Analyze Content
      </button>

    </form>
  );
};
