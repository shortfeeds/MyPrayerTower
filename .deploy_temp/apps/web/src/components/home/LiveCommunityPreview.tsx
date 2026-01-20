'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrayerIntention {
    id: number;
    name: string;
    location: string;
    intention: string;
    prayerCount: number;
    timeAgo: string;
}

const MOCK_INTENTIONS: PrayerIntention[] = [
    {
        id: 1,
        name: "Maria",
        location: "Brazil",
        intention: "Please pray for my mother's health. She is undergoing surgery next week.",
        prayerCount: 147,
        timeAgo: "2 min ago"
    },
    {
        id: 2,
        name: "Anonymous",
        location: "USA",
        intention: "For strength during a difficult time in my marriage. We need God's grace.",
        prayerCount: 89,
        timeAgo: "5 min ago"
    },
    {
        id: 3,
        name: "Patrick",
        location: "Ireland",
        intention: "For my son to return to the faith. He has been away from the Church.",
        prayerCount: 234,
        timeAgo: "8 min ago"
    },
    {
        id: 4,
        name: "Teresa",
        location: "Philippines",
        intention: "Thanksgiving for answered prayers! My daughter got the job she prayed for.",
        prayerCount: 312,
        timeAgo: "12 min ago"
    }
];

function IntentionCard({ intention }: { intention: PrayerIntention }) {
    const [prayed, setPrayed] = useState(false);
    const [count, setCount] = useState(intention.prayerCount);

    const handlePray = () => {
        if (!prayed) {
            setPrayed(true);
            setCount(c => c + 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-sacred-100 transition-all duration-300"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sacred-50 to-sacred-100 flex items-center justify-center text-sacred-600 font-bold text-lg flex-shrink-0 shadow-inner">
                    {intention.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-gray-900">{intention.name}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-sacred-600 bg-sacred-50 px-2 py-0.5 rounded-full font-medium">{intention.location}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{intention.intention}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{intention.timeAgo}</span>
                <button
                    onClick={handlePray}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${prayed
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-600'
                        }`}
                >
                    <Heart className={`w-4 h-4 transition-transform ${prayed ? 'fill-rose-600 scale-110' : 'group-hover:scale-110'}`} />
                    {prayed ? 'Prayed' : 'Pray'} <span className="opacity-60 font-normal">({count})</span>
                </button>
            </div>
        </motion.div>
    );
}

/**
 * LiveCommunityPreview - Shows real-time prayer wall activity
 */
export function LiveCommunityPreview() {
    const [activeUsers, setActiveUsers] = useState(2847);

    // Simulate live user count fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-bold rounded-full mb-4">
                        LIVE COMMUNITY
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Join the <span className="text-sacred-600">Global Prayer Community</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        See what Catholics around the world are praying for right now.
                    </p>
                </motion.div>

                {/* Live Stats Bar */}
                <div className="flex items-center justify-center gap-6 mb-12">
                    <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="font-bold text-gray-900 text-lg">{activeUsers.toLocaleString()}</span>
                        <span className="text-emerald-700 font-medium">praying right now</span>
                    </div>
                </div>

                {/* Prayer Intentions Grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
                    {MOCK_INTENTIONS.slice(0, 4).map(intention => (
                        <IntentionCard key={intention.id} intention={intention} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center bg-gray-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Have a prayer request?</h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Share your intention and let our global community pray for you. It's free, anonymous, and powerful.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors border-2 border-gray-200 shadow-sm"
                        >
                            <MessageCircle className="w-5 h-5" />
                            View Prayer Wall
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-sacred-600 text-white font-bold rounded-full hover:bg-sacred-700 transition-colors shadow-lg shadow-sacred-600/30"
                        >
                            Share Your Intention
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
