'use client';

import { Facebook, Twitter, Link2, Check, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingShareBarProps {
    title: string;
    url: string;
}

export function FloatingShareBar({ title, url }: FloatingShareBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = [
        {
            label: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:bg-[#1877F2]'
        },
        {
            label: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-[#1DA1F2]'
        }
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    return (
        <div className={`blog-floating-share ${isVisible ? 'visible' : ''}`}>
            <div className="flex flex-col gap-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-2xl border border-gold-100">
                <div className="w-10 h-10 flex items-center justify-center text-sacred-400">
                    <Share2 className="w-4 h-4" />
                </div>

                <div className="w-6 h-px bg-gold-100 mx-auto" />

                {shareLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-500 transition-all duration-300 hover:text-white ${link.color}`}
                    >
                        <link.icon className="w-4 h-4" />
                    </a>
                ))}

                <button
                    onClick={copyLink}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${copied ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-sacred-900 hover:text-white'
                        }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
