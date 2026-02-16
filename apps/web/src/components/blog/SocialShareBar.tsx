'use client';

import { Facebook, Twitter, Link2, Mail, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareBarProps {
    title: string;
    url: string;
    description?: string;
}

export function SocialShareBar({ title, url, description }: SocialShareBarProps) {
    const [copied, setCopied] = useState(false);
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const encodedDesc = encodeURIComponent(description || '');

    const shareLinks = [
        {
            label: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
        },
        {
            label: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]',
        },
        {
            label: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
            color: 'hover:bg-gray-700 hover:text-white hover:border-gray-700',
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className="flex items-center gap-2">
            {shareLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${link.label}`}
                    className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-200 ${link.color}`}
                >
                    <link.icon className="w-4 h-4" />
                </a>
            ))}
            <button
                onClick={copyLink}
                aria-label="Copy link"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${copied
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-200 text-gray-400 hover:bg-gray-700 hover:text-white hover:border-gray-700'
                    }`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>
        </div>
    );
}
