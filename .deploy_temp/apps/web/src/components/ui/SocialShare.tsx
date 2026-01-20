'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Copy, X, Link2, MessageCircle } from 'lucide-react';

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
    variant?: 'button' | 'inline' | 'icons';
    className?: string;
}

export function SocialShare({ url, title, description = '', variant = 'button', className = '' }: SocialShareProps) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareText = description || title;
    const fullUrl = url.startsWith('http') ? url : `https://myprayertower.com${url}`;

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = fullUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url: fullUrl,
                });
            } catch (err) {
                // User cancelled or share failed
                setShowShareModal(true);
            }
        } else {
            setShowShareModal(true);
        }
    };

    if (variant === 'icons') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-lg transition-colors"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="w-4 h-4" />
                </a>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1da1f2] hover:bg-[#1a94da] text-white rounded-lg transition-colors"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="w-4 h-4" />
                </a>
                <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                    aria-label="Share on WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </a>
                <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    aria-label="Copy link"
                >
                    {copied ? <span className="text-xs font-medium">Copied!</span> : <Link2 className="w-4 h-4" />}
                </button>
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className={`flex flex-wrap items-center gap-2 ${className}`}>
                <span className="text-sm text-gray-500 mr-1">Share:</span>
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-medium rounded-full transition-colors"
                >
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook
                </a>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1da1f2] hover:bg-[#1a94da] text-white text-xs font-medium rounded-full transition-colors"
                >
                    <Twitter className="w-3.5 h-3.5" />
                    Twitter
                </a>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors"
                >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        );
    }

    // Default button variant
    return (
        <>
            <button
                onClick={handleNativeShare}
                className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-sacred-600 hover:bg-sacred-50 rounded-xl transition-colors ${className}`}
            >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
            </button>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowShareModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Share</h3>
                            <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shareText}</p>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <a
                                href={shareLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-[#1877f2] hover:text-white rounded-xl transition-colors group"
                            >
                                <Facebook className="w-6 h-6 text-[#1877f2] group-hover:text-white" />
                                <span className="text-xs font-medium">Facebook</span>
                            </a>
                            <a
                                href={shareLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-[#1da1f2] hover:text-white rounded-xl transition-colors group"
                            >
                                <Twitter className="w-6 h-6 text-[#1da1f2] group-hover:text-white" />
                                <span className="text-xs font-medium">Twitter</span>
                            </a>
                            <a
                                href={shareLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-[#25d366] hover:text-white rounded-xl transition-colors group"
                            >
                                <MessageCircle className="w-6 h-6 text-[#25d366] group-hover:text-white" />
                                <span className="text-xs font-medium">WhatsApp</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl">
                            <input
                                type="text"
                                value={fullUrl}
                                readOnly
                                className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-sacred-600 hover:bg-sacred-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
