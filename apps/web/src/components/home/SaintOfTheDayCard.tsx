'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';

interface Saint {
    name: string;
    slug?: string | null;
    feastDay?: string | null;
    title?: string | null;
    shortBio?: string | null;
    imageUrl?: string | null;
    // Map from DB model fields if different
    biography?: string | null;
}

interface SaintOfTheDayCardProps {
    saint?: Saint | null;
}

export function SaintOfTheDayCard({ saint }: SaintOfTheDayCardProps) {
    // Determine info to display
    const displayName = saint?.name || 'Saint of the Day';
    const displayTitle = saint?.title || 'Pray for us';
    const displayBio = saint?.shortBio || saint?.biography?.substring(0, 150) + '...' || 'Learn more about this holy saint.';
    const displayImage = saint?.imageUrl;

    if (!saint) {
        return (
            <div className="bg-cream-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gold-100 rounded-lg">
                        <Star className="w-5 h-5 text-gold-600 fill-gold-400" />
                    </div>
                    <span className="text-sm font-medium text-gold-700 uppercase tracking-wide">Saint of the Day</span>
                </div>
                <div className="text-center py-4">
                    <p className="text-gray-500 italic">No specific saint feast today.</p>
                    <Link href="/saints" className="text-sacred-600 font-medium text-sm mt-2 inline-block hover:underline">
                        Browse All Saints
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/saints/${saint.slug || saint.name.toLowerCase().replace(/ /g, '-')}`} className="group block" aria-label={`Read more about the life and feast of ${displayName}`}>
            <div className="relative overflow-hidden bg-gradient-to-br from-gold-50 to-cream-100 rounded-2xl p-6 border border-gold-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Decorative Cross */}
                <div className="absolute top-4 right-4 text-gold-300/30">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 2v7H4v4h7v9h2v-9h7V9h-7V2z" />
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-gold-100 rounded-lg">
                            <Star className="w-5 h-5 text-gold-600 fill-gold-400" />
                        </div>
                        <span className="text-sm font-medium text-gold-700 uppercase tracking-wide">Saint of the Day</span>
                    </div>

                    <div className="flex gap-4 items-start">
                        {/* Saint Image */}
                        <div className="flex-shrink-0 relative">
                            {displayImage ? (
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-200 shadow-md relative">
                                    <Image src={displayImage} alt={displayName} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white text-3xl font-display shadow-md">
                                    {displayName.replace('St. ', '').charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Saint Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display text-xl font-bold text-sacred-700 mb-1 truncate">
                                {displayName}
                            </h3>
                            <p className="text-sm text-gold-600 font-medium mb-2">
                                {displayTitle}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {displayBio}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-gold-600 font-semibold text-sm mt-4 group-hover:text-gold-700 transition-colors">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
