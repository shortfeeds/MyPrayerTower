'use client';

import { useState } from 'react';
import { MessageCircle, ThumbsUp, Flag, MoreVertical, Share2, Heart, Calendar, MapPin, UserCheck } from 'lucide-react';
import Link from 'next/link';

// Prayer Partner Card
interface PrayerPartner {
    id: string;
    name: string;
    avatar?: string;
    prayerCount: number;
    joinedAt: Date;
    lastActive?: Date;
}

export function PrayerPartnerCard({ partner, onMessage }: { partner: PrayerPartner; onMessage?: () => void }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-400 to-sacred-600 flex items-center justify-center text-white font-bold">
                    {partner.avatar ? (
                        <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        partner.name.charAt(0)
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{partner.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.prayerCount} prayers together
                    </p>
                </div>
                <button
                    onClick={onMessage}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <MessageCircle className="w-5 h-5 text-primary-600" />
                </button>
            </div>
        </div>
    );
}

// Testimony Card
interface Testimony {
    id: string;
    author: string;
    authorAvatar?: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    createdAt: Date;
    isLiked?: boolean;
}

export function TestimonyCard({ testimony, onLike, onShare }: {
    testimony: Testimony;
    onLike?: () => void;
    onShare?: () => void;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold">
                    {testimony.authorAvatar ? (
                        <img src={testimony.authorAvatar} alt={testimony.author} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        testimony.author.charAt(0)
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimony.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {testimony.createdAt.toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">{testimony.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{testimony.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={onLike}
                    className={`flex items-center gap-1.5 text-sm ${testimony.isLiked
                            ? 'text-rose-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'
                        } transition-colors`}
                >
                    <Heart className={`w-4 h-4 ${testimony.isLiked ? 'fill-current' : ''}`} />
                    {testimony.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {testimony.comments}
                </button>
                <button
                    onClick={onShare}
                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors ml-auto"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    );
}

// Find Partners component
export function FindPrayerPartners() {
    return (
        <div className="bg-gradient-to-br from-sacred-600 to-sacred-700 rounded-2xl p-6 text-white">
            <UserCheck className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-2">Find a Prayer Partner</h3>
            <p className="text-sacred-100 text-sm mb-4">
                Connect with fellow Catholics for accountability, support, and shared prayer intentions.
            </p>
            <button className="w-full py-3 bg-white text-sacred-700 font-medium rounded-xl hover:bg-sacred-50 transition-colors">
                Get Matched
            </button>
        </div>
    );
}

// Leaderboard Component
interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    avatar?: string;
    score: number;
    streak: number;
}

export function Leaderboard({ entries, title = "Top Prayers" }: { entries: LeaderboardEntry[]; title?: string }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
            <div className="space-y-3">
                {entries.map((entry) => (
                    <div
                        key={entry.userId}
                        className={`flex items-center gap-3 p-3 rounded-xl ${entry.rank <= 3
                                ? 'bg-gradient-to-r from-gold-50 to-transparent dark:from-gold-900/20'
                                : 'bg-gray-50 dark:bg-gray-800'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank === 1 ? 'bg-gold-500 text-white' :
                                entry.rank === 2 ? 'bg-gray-400 text-white' :
                                    entry.rank === 3 ? 'bg-amber-700 text-white' :
                                        'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            {entry.rank}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                            {entry.avatar ? (
                                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                entry.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{entry.streak} day streak</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">{entry.score.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">prayers</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
