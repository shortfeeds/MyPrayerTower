'use client';

import Link from 'next/link';
import { Heart, Flame, Flower } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Memorial } from '@/lib/types/memorials';
import Image from 'next/image';

interface MemorialCardProps {
    memorial: Memorial;
    index: number;
}

export function MemorialCard({ memorial, index }: MemorialCardProps) {
    return (
        <Link href={`/memorials/${memorial.id}`}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                <div className="h-48 bg-gray-200 dark:bg-slate-800 relative">
                    {memorial.photoUrl ? (
                        <Image
                            src={memorial.photoUrl}
                            alt={`${memorial.firstName} ${memorial.lastName}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-rose-50 dark:bg-rose-900/10">
                            <Heart className="w-12 h-12 opacity-20" />
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1 group-hover:text-rose-600 transition-colors">
                        {memorial.firstName} {memorial.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {memorial.birthDate && new Date(memorial.birthDate).getFullYear()} - {memorial.deathDate && new Date(memorial.deathDate).getFullYear()}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-amber-500" /> {memorial.totalCandles} Candles</span>
                            <span className="flex items-center gap-1" title="Flowers Given"><Flower className="w-4 h-4 text-rose-500" /> {memorial.totalFlowers}</span>
                        </div>

                        {memorial.owner && (
                            <div className="flex items-center gap-2" title={`Created by ${memorial.owner.displayName || memorial.owner.firstName}`}>
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={memorial.owner.avatarUrl} />
                                    <AvatarFallback className="text-[10px] bg-rose-100 text-rose-600">
                                        {memorial.owner.firstName?.[0]}{memorial.owner.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
