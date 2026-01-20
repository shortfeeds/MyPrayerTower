import { LivePrayerSessions, DailySessionSchedule } from '@/components/community/LivePrayerSessions';
import Link from 'next/link';
import { ChevronLeft, Video, Users, Calendar, Clock, Sparkles, Play, Bell, Heart } from 'lucide-react';

export const metadata = {
    title: 'Live Prayer Sessions | MyPrayerTower',
    description: 'Join live community prayer sessions. Pray the Rosary, Divine Mercy Chaplet, and more with Catholics around the world.',
};

export default function SessionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Section - Enhanced */}
            <section className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 via-purple-900/30 to-indigo-900/40" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                                style={{
                                    left: `${15 + i * 15}%`,
                                    top: `${20 + (i % 3) * 25}%`,
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: `${4 + i}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                            <span className="text-sm font-medium text-white/90">Live Community</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Live Prayer <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">Sessions</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                            Join fellow Catholics in scheduled prayer sessions. Experience the power of praying together in a global community.
                        </p>

                        {/* Live indicator badge */}
                        <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm">
                            <Play className="w-5 h-5 text-rose-400 fill-current" />
                            <span className="text-white font-medium">Sessions available 24/7</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner - Enhanced */}
            <section className="relative bg-white/5 backdrop-blur-sm border-y border-white/10 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { icon: Users, value: '10,000+', label: 'Monthly Participants', color: 'text-rose-400' },
                            { icon: Calendar, value: '5+', label: 'Daily Sessions', color: 'text-amber-400' },
                            { icon: Clock, value: '24/7', label: 'Prayer Coverage', color: 'text-emerald-400' },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <stat.icon size={22} className={stat.color} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-gray-400">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-8">
                            {/* Sessions List */}
                            <div className="lg:col-span-3">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h2 className="font-display text-2xl font-bold text-white">
                                        Today&apos;s Sessions
                                    </h2>
                                </div>
                                <LivePrayerSessions />
                            </div>

                            {/* Schedule */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="font-display text-2xl font-bold text-white">
                                        Weekly Schedule
                                    </h2>
                                </div>
                                <DailySessionSchedule />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Enhanced */}
            <section className="py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-2xl font-bold text-white text-center mb-10">
                            How It Works
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    step: '1',
                                    title: 'Choose a Session',
                                    desc: 'Browse upcoming prayer sessions and pick one that fits your schedule.',
                                    icon: Calendar,
                                    color: 'from-rose-500 to-pink-500',
                                },
                                {
                                    step: '2',
                                    title: 'Set a Reminder',
                                    desc: 'Enable notifications so you never miss a session you want to join.',
                                    icon: Bell,
                                    color: 'from-amber-500 to-orange-500',
                                },
                                {
                                    step: '3',
                                    title: 'Pray Together',
                                    desc: 'Join at the scheduled time and pray with Catholics worldwide.',
                                    icon: Heart,
                                    color: 'from-purple-500 to-indigo-500',
                                },
                            ].map((item) => (
                                <div key={item.step} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - Enhanced */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl p-10 border border-white/10 backdrop-blur-sm">
                            <Video className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                            <h2 className="font-display text-2xl font-bold text-white mb-4">
                                Want to Host a Session?
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Lead a prayer session and help others grow in faith. We&apos;re looking for dedicated prayer leaders.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-rose-500/25"
                            >
                                Apply to Host
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
