
import { Metadata } from 'next';
import { BookOpen, Disc, Calendar, Star, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'How to Pray the Rosary | MyPrayerTower',
    description: 'A step-by-step guide to praying the Holy Rosary, including all Mysteries and prayers.',
};

const MYSTERIES = [
    {
        name: 'Joyful Mysteries',
        days: ['Monday', 'Saturday'],
        events: [
            'The Annunciation',
            'The Visitation',
            'The Nativity',
            'The Presentation',
            'The Finding in the Temple'
        ],
        icon: Star,
        color: 'text-yellow-600 bg-yellow-100'
    },
    {
        name: 'Sorrowful Mysteries',
        days: ['Tuesday', 'Friday'],
        events: [
            'The Agony in the Garden',
            'The Scourging at the Pillar',
            'The Crowning with Thorns',
            'The Carrying of the Cross',
            'The Crucifixion'
        ],
        icon: Heart,
        color: 'text-red-600 bg-red-100'
    },
    {
        name: 'Glorious Mysteries',
        days: ['Wednesday', 'Sunday'],
        events: [
            'The Resurrection',
            'The Ascension',
            'The Descent of the Holy Spirit',
            'The Assumption of Mary',
            'The Coronation of Mary'
        ],
        icon: Disc,
        color: 'text-gold-600 bg-gold-100'
    },
    {
        name: 'Luminous Mysteries',
        days: ['Thursday'],
        events: [
            'The Baptism in the Jordan',
            'The Wedding at Cana',
            'The Proclamation of the Kingdom',
            'The Transfiguration',
            'The Institution of the Eucharist'
        ],
        icon: Star,
        color: 'text-blue-600 bg-blue-100'
    }
];

export default function RosaryPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-700 to-sacred-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Disc className="w-4 h-4 text-rose-300" />
                        <span>Daily Devotion</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Holy Rosary</h1>
                    <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                        Meditate on the life of Jesus through the eyes of Mary. A powerful prayer for peace and grace.
                    </p>
                </div>
            </div>

            {/* Guide Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">How to Pray</h2>
                        <p className="text-gray-600">The Rosary is a Scripture-based prayer. It begins with the Apostles' Creed, which summarizes the great mysteries of the Catholic faith.</p>
                    </div>

                    {/* Mysteries Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {MYSTERIES.map((m) => (
                            <div key={m.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                                        <m.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {m.days.join(' • ')}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{m.name}</h3>
                                <ul className="space-y-2">
                                    {m.events.map((e, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                                {i + 1}
                                            </span>
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* App CTA */}
                    <div className="bg-sacred-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pray with Community</h2>
                            <p className="text-sacred-100 mb-8 max-w-xl mx-auto">
                                Join our daily live Rosary sessions or track your personal streaks in the app.
                            </p>
                            <Link
                                href="/journey"
                                className="inline-flex items-center px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-full transition-colors"
                            >
                                Start Your Journey
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
