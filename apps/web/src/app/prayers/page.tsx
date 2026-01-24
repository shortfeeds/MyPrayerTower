import { Book, Heart, Sun, Moon, Calendar, ChevronRight, Sparkles, Anchor, Feather, Flame } from 'lucide-react';
import Link from 'next/link';

// Mock data for Suggested Section
const SUGGESTED_TODAY = [
    {
        title: "Morning Offering",
        description: "Offer your day to the Lord.",
        icon: Sun,
        color: "text-amber-500 bg-amber-50",
        href: "/prayers/morning-offering"
    },
    {
        title: "The Angelus",
        description: "Recall the Incarnation at noon.",
        icon: Book,
        color: "text-blue-500 bg-blue-50",
        href: "/prayers/angelus"
    },
    {
        title: "Evening Reflection",
        description: "Review your day with gratitude.",
        icon: Moon,
        color: "text-indigo-500 bg-indigo-50",
        href: "/examen"
    }
];

// Prayer Paths (formerly Categories) with pastoral names
const PRAYER_PATHS = [
    {
        name: "Healing & Comfort",
        description: "Prayers for physical and spiritual healing.",
        icon: Heart,
        count: 12,
        href: "/prayers/healing",
        color: "from-rose-500 to-pink-600"
    },
    {
        name: "Peace & Anxiety",
        description: "Find calm in the storm.",
        icon: Anchor, // or CloudRain
        count: 8,
        href: "/prayers/peace",
        color: "from-sky-500 to-blue-600"
    },
    {
        name: "Gratitude & Praise",
        description: "Give thanks for His blessings.",
        icon: Sparkles,
        count: 15,
        href: "/prayers/thanksgiving",
        color: "from-amber-400 to-orange-500"
    },
    {
        name: "Grief & Loss",
        description: "Prayers for the departed and those who mourn.",
        icon: Feather,
        count: 6,
        href: "/prayers/grief",
        color: "from-slate-500 to-gray-600"
    },
    {
        name: "Strength & Courage",
        description: "For times of trial and difficulty.",
        icon: Flame,
        count: 10,
        href: "/prayers/strength",
        color: "from-red-500 to-rose-600"
    },
    {
        name: "Daily Devotions",
        description: "Essential prayers for every day.",
        icon: Calendar,
        count: 24,
        href: "/prayers/daily",
        color: "from-emerald-500 to-green-600"
    }
];

export default function PrayerLibraryPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Elegant Hero */}
            <div className="relative bg-sacred-900 text-white overflow-hidden pt-32 pb-24">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-gold-200 text-xs font-medium tracking-widest uppercase mb-6">
                        Sacred Treasury
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Prayer Library
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Draw from the deep wells of tradition. Find words for every season of the soul.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                {/* Suggested for Today */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
                    <h2 className="font-serif text-2xl text-gray-900 mb-8 flex items-center gap-3">
                        <Sun className="w-6 h-6 text-gold-500" />
                        Suggested for Today
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {SUGGESTED_TODAY.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                            >
                                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-sacred-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Prayer Paths */}
                <div className="mb-20">
                    <h2 className="font-serif text-3xl text-gray-900 text-center mb-12">Prayer Paths</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRAYER_PATHS.map((path) => (
                            <Link
                                key={path.name}
                                href={path.href}
                                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 hover:-translate-y-1"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${path.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <path.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sacred-600 transition-colors">
                                    {path.name}
                                </h3>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    {path.description}
                                </p>

                                <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-sacred-600 transition-colors">
                                    <span>Explore Collection</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Common Devotions */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <Link href="/rosary" className="relative h-64 rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-rose-700"></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-3xl font-serif font-bold text-white mb-2">Holy Rosary</h3>
                            <p className="text-rose-100">Meditate on the mysteries of Christ.</p>
                        </div>
                    </Link>
                    <Link href="/stations" className="relative h-64 rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-600"></div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="text-3xl font-serif font-bold text-white mb-2">Stations of the Cross</h3>
                            <p className="text-stone-200">Walk the Via Dolorosa.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
