import { BibleReader } from '@/components/bible/BibleReader';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Holy Bible | MyPrayerTower',
    description: 'Read the Holy Bible online. Catholic Edition (Douay-Rheims / Clementine Vulgate). Daily scripture for reflection and prayer.',
    keywords: ['Catholic Bible', 'Douay Rheims', 'Online Bible', 'Scripture', 'Daily Readings']
};

export default function BiblePage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <span className="text-gold-400 font-serif">Verbum Domini</span>
                        <span className="text-slate-300">The Word of the Lord</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Holy Bible</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        "Your word is a lamp to my feet and a light to my path." — Psalm 119:105
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <BibleReader />
            </div>

            {/* Bottom Ad */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <SmartAdSlot page="bible" position="bottom" />
            </div>
        </div>
    );
}
