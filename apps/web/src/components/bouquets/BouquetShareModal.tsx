
'use client';

import { useState } from 'react';
import { X, Copy, Share, Download, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface BouquetShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    bouquet: {
        id: string;
        recipientName: string;
        senderName: string;
        occasion: string;
        massesCount: number;
        rosariesCount: number;
        prayersCount: number;
        candlesCount: number;
    };
}

export function BouquetShareModal({ isOpen, onClose, bouquet }: BouquetShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // Construct OG Image URL for preview
    const ogParams = new URLSearchParams({
        recipient: bouquet.recipientName,
        sender: bouquet.senderName,
        occasion: bouquet.occasion || 'Spiritual Bouquet',
        masses: bouquet.massesCount.toString(),
        rosaries: bouquet.rosariesCount.toString(),
        prayers: bouquet.prayersCount.toString(),
        candles: bouquet.candlesCount.toString(),
    });

    const ogUrl = `/api/og/bouquets?${ogParams.toString()}`;
    const shareUrl = `${window.location.origin}/bouquets/${bouquet.id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `A Spiritual Bouquet for ${bouquet.recipientName}`,
                    text: `I've sent you a Spiritual Bouquet! ${bouquet.massesCount} Masses, ${bouquet.rosariesCount} Rosaries...`,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or failed
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in relative">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-slate-800">Share Bouquet</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview */}
                <div className="p-6 bg-slate-50 flex justify-center">
                    <div className="relative w-full aspect-[1.91/1] rounded-xl overflow-hidden shadow-lg border border-slate-200 group">
                        <Image
                            src={ogUrl}
                            alt="Spiritual Bouquet Preview"
                            fill
                            className="object-cover"
                            unoptimized // Since it's a dynamic API route
                        />
                        {/* Loading/Fallback could go here */}
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share className="w-5 h-5" />
                            Share Now
                        </button>
                        <button
                            onClick={handleCopy}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
                            title="Copy Link"
                        >
                            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex flex-col gap-1">
                        <span className="font-semibold">What will they see?</span>
                        <span className="opacity-80">They will see this beautiful card and your personal message when they open the link.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
