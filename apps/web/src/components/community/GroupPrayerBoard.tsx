
'use client';

import { useState } from 'react';
import { Send, User } from 'lucide-react';
import Image from 'next/image';

interface GroupPrayerBoardProps {
    groupId: string;
    initialPrayers: any[];
}

export function GroupPrayerBoard({ groupId, initialPrayers }: GroupPrayerBoardProps) {
    const [prayers, setPrayers] = useState(initialPrayers);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    async function handlePost(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/prayers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                const newPrayer = await res.json();
                setPrayers([newPrayer, ...prayers]);
                setContent('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Input */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                <form onSubmit={handlePost}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share a prayer intention or encouragement..."
                        className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all resize-none min-h-[100px] text-gray-900 dark:text-white placeholder:text-gray-500"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isPosting || !content.trim()}
                            className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isPosting ? 'Posting...' : 'Post Prayer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {prayers.map((prayer) => (
                    <div key={prayer.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-sacred-100 dark:bg-sacred-900/50 flex items-center justify-center overflow-hidden shrink-0">
                                {prayer.user.avatarUrl ? (
                                    <Image src={prayer.user.avatarUrl} alt={prayer.user.displayName || 'User'} width={40} height={40} />
                                ) : (
                                    <User className="w-5 h-5 text-sacred-600 dark:text-sacred-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {prayer.user.displayName || 'Anonymous Member'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(prayer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {prayer.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {prayers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No prayers shared yet. Be the first to break the silence.
                    </div>
                )}
            </div>
        </div>
    );
}
