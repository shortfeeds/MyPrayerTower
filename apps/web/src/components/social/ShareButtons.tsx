'use client';

import { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Twitter, Facebook, Mail, Link2 } from 'lucide-react';

interface ShareButtonsProps {
    /** URL to share */
    url: string;
    /** Title for the share */
    title: string;
    /** Description/text for the share */
    description?: string;
    /** Variant style */
    variant?: 'default' | 'compact' | 'icons-only';
    /** Show copy link button */
    showCopyLink?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Social sharing buttons for prayers, saints, and content
 */
export function ShareButtons({
    url,
    title,
    description = '',
    variant = 'default',
    showCopyLink = true,
    className = '',
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    const fullText = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${fullText}`,
            color: 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
            color: 'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600',
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-500',
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
            color: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700',
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleNativeShare = async () => {
        if ('share' in navigator) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url,
                });
            } catch (error) {
                // User cancelled or error
                if ((error as Error).name !== 'AbortError') {
                    setShowDropdown(true);
                }
            }
        } else {
            setShowDropdown(!showDropdown);
        }
    };

    // Compact variant - single share button
    if (variant === 'compact') {
        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={handleNativeShare}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Share"
                >
                    <Share2 size={18} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 min-w-[180px] toast-enter">
                            {shareLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${link.color} transition-colors`}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <link.icon size={16} />
                                    {link.name}
                                </a>
                            ))}
                            {showCopyLink && (
                                <button
                                    onClick={() => {
                                        handleCopyLink();
                                        setShowDropdown(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Icons only variant
    if (variant === 'icons-only') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {shareLinks.map(link => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${link.color} transition-colors`}
                        aria-label={`Share on ${link.name}`}
                    >
                        <link.icon size={16} />
                    </a>
                ))}
                {showCopyLink && (
                    <button
                        onClick={handleCopyLink}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Copy link"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                )}
            </div>
        );
    }

    // Default variant - full buttons
    return (
        <div className={`space-y-3 ${className}`}>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share this prayer</p>
            <div className="flex flex-wrap gap-2">
                {shareLinks.map(link => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ${link.color} transition-colors`}
                    >
                        <link.icon size={16} />
                        {link.name}
                    </a>
                ))}
            </div>
            {showCopyLink && (
                <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check size={16} className="text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Copy Link
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

/**
 * Simple share trigger button
 */
export function ShareTrigger({
    url,
    title,
    description,
    className = '',
}: {
    url: string;
    title: string;
    description?: string;
    className?: string;
}) {
    const handleShare = async () => {
        if ('share' in navigator) {
            try {
                await navigator.share({ title, text: description, url });
            } catch (error) {
                // User cancelled
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
        >
            <Share2 size={16} />
            <span>Share</span>
        </button>
    );
}
