import { LivePrayerSessions, DailySessionSchedule } from '@/components/community/LivePrayerSessions';
import Link from 'next/link';
import { ChevronLeft, Video, Users, Calendar, Clock } from 'lucide-react';

export const metadata = {
    title: 'Live Prayer Sessions | MyPrayerTower',
    description: 'Join live community prayer sessions. Pray the Rosary, Divine Mercy Chaplet, and more with Catholics around the world.',
};

export default function SessionsPage() {
    return (
        <div className="min-h-screen bg-cream-50 dark:bg-gray-950">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-rose-600 to-rose-700 text-white pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Video className="w-4 h-4 text-rose-200" />
                            <span className="text-sm font-medium text-rose-100">Live Community</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Live Prayer <span className="text-rose-200">Sessions</span>
                        </h1>
                        <p className="text-xl text-rose-100/80">
                            Join fellow Catholics in scheduled prayer sessions. Experience the power of praying together in a global community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                                <Users size={20} className="text-rose-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">10,000+</p>
                                <p className="text-xs text-gray-500">Monthly Participants</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                <Calendar size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">5+</p>
                                <p className="text-xs text-gray-500">Daily Sessions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                <Clock size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
                                <p className="text-xs text-gray-500">Prayer Coverage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-8">
                            {/* Sessions List */}
                            <div className="lg:col-span-3">
                                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Today&apos;s Sessions
                                </h2>
                                <LivePrayerSessions />
                            </div>

                            {/* Schedule */}
                            <div className="lg:col-span-2">
                                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Weekly Schedule
                                </h2>
                                <DailySessionSchedule />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                            How It Works
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    step: '1',
                                    title: 'Choose a Session',
                                    desc: 'Browse upcoming prayer sessions and pick one that fits your schedule.',
                                },
                                {
                                    step: '2',
                                    title: 'Set a Reminder',
                                    desc: 'Enable notifications so you never miss a session you want to join.',
                                },
                                {
                                    step: '3',
                                    title: 'Pray Together',
                                    desc: 'Join at the scheduled time and pray with Catholics worldwide.',
                                },
                            ].map((item) => (
                                <div key={item.step} className="text-center p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="w-10 h-10 bg-sacred-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Want to Host a Session?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Lead a prayer session and help others grow in faith. We&apos;re looking for dedicated prayer leaders.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sacred-600 text-white font-semibold rounded-xl hover:bg-sacred-700 transition-colors"
                        >
                            Apply to Host
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
