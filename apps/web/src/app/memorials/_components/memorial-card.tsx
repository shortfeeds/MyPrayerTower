'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Flame, Flower, Star, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Memorial } from '@/lib/types/memorials';

interface MemorialCardProps {
    memorial: Memorial;
    index: number;
}

export function MemorialCard({ memorial, index }: MemorialCardProps) {
    const isPremium = memorial.tier === 'PREMIUM';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
        >
            <Link href={`/memorials/${memorial.id}`}>
                <div
                    className={`rounded-2xl overflow-hidden hover:shadow-xl transition-all group h-full flex flex-col ${
                        isPremium
                            ? 'bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border-2 border-amber-400 shadow-md shadow-amber-500/10'
                            : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800'
                    }`}
                >
                    <div className="h-52 bg-gray-200 dark:bg-slate-800 relative overflow-hidden">
                        {memorial.photoUrl ? (
                            <img
                                src={memorial.photoUrl}
                                alt={`${memorial.firstName} ${memorial.lastName}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-rose-50 dark:bg-rose-900/10">
                                <Heart className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        {/* Premium Golden Altar Badge */}
                        {isPremium && (
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/50 text-[10px] font-bold shadow-lg">
                                <Flame className="w-3 h-3 fill-amber-400 text-amber-400 animate-pulse" />
                                <span>PERPETUAL ALTAR</span>
                            </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                            <span className="text-[10px] uppercase font-serif tracking-widest text-amber-200">
                                In Sacred Memoriam
                            </span>
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {memorial.firstName} {memorial.lastName}
                            </h3>
                            <p className="text-xs text-gray-500 font-mono mb-3">
                                {memorial.birthDate && new Date(memorial.birthDate).getFullYear()} — {memorial.deathDate && new Date(memorial.deathDate).getFullYear()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic font-serif leading-relaxed mb-4">
                                {memorial.biography || 'Remembered with love, honor, and perpetual prayer before the Blessed Sacrament.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                                    <Flame className="w-3.5 h-3.5 fill-current" /> {memorial.totalCandles}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                                    <Flower className="w-3.5 h-3.5" /> {memorial.totalFlowers}
                                </span>
                                {memorial.totalPrayers !== undefined && (
                                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                                        🙏 {memorial.totalPrayers}
                                    </span>
                                )}
                            </div>

                            {memorial.owner && (
                                <div className="flex items-center gap-1.5" title={`Guardian: ${memorial.owner.displayName || memorial.owner.firstName}`}>
                                    <Avatar className="w-5 h-5 ring-1 ring-amber-300">
                                        <AvatarImage src={memorial.owner.avatarUrl} />
                                        <AvatarFallback className="text-[9px] bg-amber-100 text-amber-800 font-bold">
                                            {memorial.owner.firstName?.[0]}{memorial.owner.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
