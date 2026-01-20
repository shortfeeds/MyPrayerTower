'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
    memorialId?: string;
    onUploadComplete: (url: string) => void;
    className?: string;
}

export function PhotoUpload({ memorialId, onUploadComplete, className = '' }: PhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a JPEG, PNG, WebP, or GIF image.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB.');
            return;
        }

        setError(null);
        setUploading(true);

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (memorialId) {
                formData.append('memorialId', memorialId);
            }

            const res = await fetch('/api/upload/memorial-photo', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.url) {
                onUploadComplete(data.url);
            } else {
                setError(data.error || 'Upload failed. Please try again.');
                setPreview(null);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed. Please try again.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="sr-only"
                id="memorial-photo-upload"
            />

            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                    />
                    {uploading ? (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={clearPreview}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ) : (
                <label
                    htmlFor="memorial-photo-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to upload photo</span>
                    <span className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF (max 5MB)</span>
                </label>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}
