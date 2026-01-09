'use client';

import { useState, useEffect } from 'react';
import { Heart, Minus, Plus, Type } from 'lucide-react';
import { ShareButtons } from '@/components/social/ShareButtons';
import { generatePrayerSchema } from '@/lib/seo/structuredData';

const TEXT_SIZES = [
    { label: 'S', class: 'text-base leading-relaxed' },
    { label: 'M', class: 'text-lg leading-relaxed' },
    { label: 'L', class: 'text-xl leading-loose' },
    { label: 'XL', class: 'text-2xl leading-loose' },
];

interface PrayerContentProps {
    prayerId: number;
    prayerTitle: string;
    prayerContent: string;
    categoryLabel?: string;
    category: string;
}

export function PrayerContent({ prayerId, prayerTitle, prayerContent, categoryLabel, category }: PrayerContentProps) {
    const [textSizeIndex, setTextSizeIndex] = useState(1); // Default M

    useEffect(() => {
        const saved = localStorage.getItem('mpt-text-size');
        if (saved) setTextSizeIndex(parseInt(saved, 10) || 1);
    }, []);

    const handleTextSize = (delta: number) => {
        const newIndex = Math.max(0, Math.min(TEXT_SIZES.length - 1, textSizeIndex + delta));
        setTextSizeIndex(newIndex);
        localStorage.setItem('mpt-text-size', String(newIndex));
    };

    return (
        <article className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Text Size Controls */}
            <div className="flex items-center justify-end gap-2 px-8 pt-6 md:px-12">
                <Type className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 mr-2">Text Size</span>
                <button
                    onClick={() => handleTextSize(-1)}
                    disabled={textSizeIndex === 0}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-8 text-center">{TEXT_SIZES[textSizeIndex].label}</span>
                <button
                    onClick={() => handleTextSize(1)}
                    disabled={textSizeIndex === TEXT_SIZES.length - 1}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Prayer Content */}
            <div className="p-8 md:p-12 lg:p-16">
                <div className="relative">
                    {/* Decorative Quote */}
                    <div className="absolute -top-4 -left-4 text-8xl text-blue-100 font-serif select-none">"</div>

                    <div className={`relative font-serif ${TEXT_SIZES[textSizeIndex].class} text-gray-700 whitespace-pre-wrap`}>
                        {prayerContent}
                    </div>

                    <div className="absolute -bottom-8 -right-4 text-8xl text-blue-100 font-serif select-none rotate-180">"</div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 md:px-12 py-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full">
                        <ShareButtons
                            url={`https://myprayertower.com/prayers/${prayerId}`}
                            title={prayerTitle}
                            description={prayerContent.substring(0, 100) + '...'}
                            variant="default"
                        />
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium ml-auto">
                            <Heart size={18} />
                            <span>Save</span>
                        </button>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(generatePrayerSchema({
                                    id: prayerId,
                                    title: prayerTitle,
                                    content: prayerContent,
                                    category: category,
                                    category_label: categoryLabel
                                }))
                            }}
                        />
                    </div>
                    <span className="text-sm text-gray-400">
                        Prayer #{prayerId.toString()}
                    </span>
                </div>
            </div>
        </article>
    );
}
