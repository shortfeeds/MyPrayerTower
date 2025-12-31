'use client';

import Link from 'next/link';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { LiturgicalDay } from '@/lib/romcal';

interface TodaysReadingCardProps {
    date?: Date;
    liturgical?: LiturgicalDay;
    reading?: any; // To be typed properly with Prisma generated types
}

export function TodaysReadingCard({ date = new Date(), liturgical, reading }: TodaysReadingCardProps) {
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const celebration = liturgical?.celebrations[0]?.name || 'Daily Mass';
    const season = liturgical?.season || 'Ordinary Time';
    const color = liturgical?.seasonColor || '#008000';

    // Determine card background based on liturgical color
    const getBgGradient = (colorHex: string) => {
        const c = colorHex.toLowerCase();
        if (c === '#ffffff' || c === 'white') return 'bg-gradient-to-br from-gray-500 to-gray-700'; // Darker for white text visibility
        if (c === '#008000' || c === 'green') return 'bg-gradient-to-br from-green-600 to-green-800';
        if (c === '#800080' || c === 'purple' || c === 'violet') return 'bg-gradient-to-br from-purple-600 to-purple-800';
        if (c === '#ff0000' || c === 'red') return 'bg-gradient-to-br from-red-600 to-red-800';
        if (c === '#ffd700' || c === 'gold') return 'bg-gradient-to-br from-amber-500 to-amber-700';
        return 'bg-gradient-to-br from-sacred-500 to-sacred-700'; // Default Sacred
    };

    return (
        <Link href="/readings" className="group block">
            <div className={`relative overflow-hidden ${getBgGradient(color)} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white/80 uppercase tracking-wide">Today's Reading</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-white/80" />
                        <span className="text-sm text-white/90">{formattedDate}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold mb-2 line-clamp-2">
                        {celebration}
                    </h3>

                    <p className="text-sm text-white/70 mb-4">
                        {season} {liturgical?.weekOfSeason ? `- Week ${liturgical.weekOfSeason}` : ''}
                    </p>

                    <div className="flex items-center text-white/90 font-semibold text-sm group-hover:text-white transition-colors">
                        Read Today's Gospel
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
