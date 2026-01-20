import Link from 'next/link';
import { ChevronRight, Heart, Sparkles, Flame, Moon, Sun, ArrowRight, Cross } from 'lucide-react';

const JOURNEYS = [
    {
        id: 'rosary',
        title: 'The Holy Rosary',
        description: 'Meditate on the mysteries of Christ\'s life with the Blessed Mother.',
        icon: Sparkles,
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-100',
        href: '/rosary',
        duration: '20 min',
        prayers: 4
    },
    {
        id: 'healing',
        title: 'Path to Healing',
        description: 'Prayers for physical, emotional, and spiritual restoration.',
        icon: Heart,
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-100',
        href: '/prayers?category=Healing',
        duration: '15 min',
        prayers: 7
    },
    {
        id: 'examen',
        title: 'Daily Examen',
        description: 'Review your day with God in gratitude and reflection.',
        icon: Moon,
        color: 'from-indigo-500 to-purple-600',
        textColor: 'text-indigo-100',
        href: '/examen',
        duration: '10 min',
        prayers: 5
    },
    {
        id: 'novena',
        title: 'Novena Center',
        description: 'Nine days of powerful prayer for urgent intentions.',
        icon: Flame,
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-100',
        href: '/novenas',
        duration: '9 days',
        prayers: 9
    },
    {
        id: 'morning',
        title: 'Morning Offering',
        description: 'Consecrate your day to the Sacred Heart of Jesus.',
        icon: Sun,
        color: 'from-orange-400 to-red-500',
        textColor: 'text-orange-100',
        href: '/prayers/morning-offering',
        duration: '3 min',
        prayers: 1
    },
    {
        id: 'stations',
        title: 'Stations of the Cross',
        description: 'Walk with Jesus on His journey to Calvary.',
        icon: Cross,
        color: 'from-slate-600 to-slate-800',
        textColor: 'text-slate-200',
        href: '/stations',
        duration: '30 min',
        prayers: 14
    }
];

export function DevotionalJourneys() {
    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                            Devotional Journeys
                        </h2>
                        <p className="text-gray-500 mt-2 text-lg">
                            Curated paths to deepen your spiritual life.
                        </p>
                    </div>
                    {/* Optional: View All link if list grows */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {JOURNEYS.map((journey) => (
                        <Link
                            key={journey.id}
                            href={journey.href}
                            className="group relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${journey.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

                            {/* Decorative Circles */}
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-black/5 rounded-full blur-xl" />

                            <div className="relative p-8 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                                        <journey.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${journey.textColor} bg-black/10 px-2 py-1 rounded-full`}>
                                            {journey.duration}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                    {journey.title}
                                </h3>
                                <p className="text-white/80 font-medium leading-relaxed mb-8 line-clamp-2">
                                    {journey.description}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-white font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Start Journey</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
