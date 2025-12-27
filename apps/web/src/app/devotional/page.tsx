'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Volume2, Calendar, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

interface Devotional {
    id: string;
    title: string;
    date: string;
    scripture: string;
    scriptureReference: string;
    reflection: string;
    prayer: string;
    saint?: { name: string; feastDay: string };
    hasAudio?: boolean;
}

export default function DevotionalPage() {
    const [devotional, setDevotional] = useState<Devotional | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock devotional
    useEffect(() => {
        setDevotional({
            id: '1',
            title: 'Feast of the Holy Family',
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
            scripture: '"Children, obey your parents in the Lord, for this is right. Honor your father and mother—this is the first commandment with a promise: so that it may be well with you and you may live long on the earth."',
            scriptureReference: 'Ephesians 6:1-3',
            reflection: 'Today we celebrate the Holy Family of Jesus, Mary, and Joseph. This feast reminds us of the importance of family in God\'s plan. The Holy Family shows us how to love, sacrifice, and support one another through life\'s challenges.\n\nJoseph, a just man, protected his family through uncertainty. Mary pondered God\'s will in her heart. Jesus grew in wisdom and grace. Together, they model the virtues every family can strive for: faith, patience, and unconditional love.',
            prayer: 'Heavenly Father, bless all families today. Help us to love one another as You love us. Give us patience in difficulty, joy in togetherness, and faith in Your providence. Holy Family of Nazareth, pray for us. Amen.',
            saint: { name: 'Holy Family', feastDay: 'December 29' },
            hasAudio: true,
        });
    }, []);

    if (!devotional) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800">
            {/* Header */}
            <div className="relative py-12 text-center text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-primary-300" />
                        <p className="text-primary-300">{devotional.date}</p>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{devotional.title}</h1>
                    {devotional.saint && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                            <span className="text-gold-400">⛪</span>
                            <span>Feast of {devotional.saint.name}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-4 pb-12">
                {/* Audio Player */}
                {devotional.hasAudio && (
                    <div className="bg-white rounded-xl p-4 shadow-lg mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700"
                            >
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <div>
                                <p className="font-medium text-gray-900">Listen to Today's Devotional</p>
                                <p className="text-sm text-gray-500">5 min • Audio meditation</p>
                            </div>
                        </div>
                        <Volume2 className="w-6 h-6 text-gray-400" />
                    </div>
                )}

                {/* Scripture Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="flex items-center gap-2 text-primary-600 mb-4">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">Today's Scripture</span>
                    </div>
                    <blockquote className="text-xl italic text-gray-700 leading-relaxed border-l-4 border-primary-400 pl-4">
                        {devotional.scripture}
                    </blockquote>
                    <p className="text-right text-primary-600 font-medium mt-4">— {devotional.scriptureReference}</p>
                </div>

                {/* Reflection */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reflection</h2>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {devotional.reflection}
                    </div>
                </div>

                {/* Closing Prayer */}
                <div className="bg-gradient-to-r from-primary-100 to-purple-100 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-primary-800 mb-4">🙏 Closing Prayer</h2>
                    <p className="text-primary-900 italic leading-relaxed">
                        {devotional.prayer}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-white rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                        <ChevronLeft className="w-5 h-5" />
                        Yesterday
                    </button>
                    <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-700">
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>
                    <button className="flex-1 py-3 bg-white rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                        Tomorrow
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
