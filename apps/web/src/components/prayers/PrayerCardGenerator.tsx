'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Share2, Image as ImageIcon, Palette, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

interface PrayerCardProps {
    title: string;
    content: string;
    onClose: () => void;
}

const BACKGROUNDS = [
    { id: 'classic', name: 'Classic', classes: 'bg-white text-gray-900' },
    { id: 'midnight', name: 'Midnight', classes: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white' },
    { id: 'sunset', name: 'Sunset', classes: 'bg-gradient-to-br from-orange-100 via-amber-100 to-rose-100 text-gray-900' },
    { id: 'ocean', name: 'Ocean', classes: 'bg-gradient-to-br from-cyan-900 via-blue-800 to-indigo-900 text-white' },
    { id: 'sacred', name: 'Sacred', classes: 'bg-gradient-to-br from-purple-900 via-fuchsia-900 to-slate-900 text-white' },
    { id: 'paper', name: 'Parchment', classes: 'bg-[#f5e6d3] text-[#5c4033]' },
];

export function PrayerCardGenerator({ title, content, onClose }: PrayerCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[1]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            setIsGenerating(true);
            const dataUrl = await toPng(cardRef.current, {
                quality: 0.95,
                pixelRatio: 2, // High res for mobile
                cacheBust: true,
            });

            const link = document.createElement('a');
            link.download = `${title.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}-prayer-card.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Preview Area */}
                <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto min-h-[400px]">
                    <div
                        ref={cardRef}
                        className={`w-[350px] aspect-[4/5] rounded-xl p-8 flex flex-col items-center justify-center text-center relative shadow-2xl transition-all duration-300 ${selectedBg.classes}`}
                    >
                        {/* Watermark/Logo */}
                        <div className="absolute top-6 left-0 right-0 flex justify-center opacity-50">
                            <span className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
                                <Share2 className="w-3 h-3" /> MyPrayerTower
                            </span>
                        </div>

                        <div className="my-auto">
                            <h2 className="text-2xl font-serif font-bold mb-6 leading-tight">
                                {title}
                            </h2>
                            {/* Line Clamp for long prayers to fit card */}
                            <p className="font-medium leading-relaxed italic text-sm opacity-90 line-clamp-[12]">
                                "{content}"
                            </p>
                        </div>

                        <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-40">
                            <span className="text-[10px]">myprayertower.com/prayers</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-80 bg-white p-6 border-l border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                            Customize Card
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                                <Palette className="w-4 h-4" /> Theme
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setSelectedBg(bg)}
                                        className={`relative h-12 rounded-lg border-2 transition-all overflow-hidden ${selectedBg.id === bg.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <div className={`w-full h-full ${bg.classes}`} />
                                        {selectedBg.id === bg.id && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                        <span className="sr-only">{bg.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Image
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-3">
                            Perfect for Instagram Stories & WhatsApp
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
