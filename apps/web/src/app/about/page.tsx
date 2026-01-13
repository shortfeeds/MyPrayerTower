import { Heart, Globe, Shield, Church, BookOpen, Star, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-primary-950 text-white py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-primary-950"></div>
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-gold-400 text-sm font-medium mb-6">
                        Established 2024
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Serving the <span className="text-gold-400">Global Catholic</span> Community</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        MyPrayerTower is the all-in-one digital companion for your faith journey.
                        Connecting millions of believers to churches, prayers, and the daily rhythm of Catholic life.
                    </p>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-16 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 text-gold-500 font-bold tracking-widest uppercase text-xs mb-4">
                        <Star className="w-4 h-4" /> Our Mission
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                        "To illuminate the digital world with the light of faith, prayer, and authentic Catholic community."
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-serif italic">
                        MyPrayerTower is a Catholic digital ministry dedicated to helping the faithful pray, connect, and grow.
                        We are committed to authentic Catholic teaching, reverent spiritual practice, and the belief that prayer changes things.
                    </p>
                </div>
            </section>

            {/* Content (Existing) */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    {/* Mission Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-gold-400 mb-2">8,500+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Churches Listed</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-gold-400 mb-2">10,000+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Prayers</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-gold-400 mb-2">Global</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Community Reach</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-gold-400 mb-2">24/7</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Prayer Support</div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-20">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Everything You Need to Grow</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
                                We've built a comprehensive ecosystem of tools designed to support every aspect of your spiritual life, from finding Mass times to deep daily devotion.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                        <Church className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Church Finder</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Instantly locate Catholic churches anywhere in the world. Access Mass times, confession schedules, adoration hours, and contact details for parishes near you or while traveling.
                                    </p>
                                </div>

                                <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Living Prayer Wall</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Join a vibrant community of prayer. Submit your intentions, light a virtual candle, and pray for others. Experience the power of collective intercession.
                                    </p>
                                </div>

                                <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 rounded-xl flex items-center justify-center mb-4">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Daily Saints & Feasts</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Walk with the saints. Discover the inspiring lives of holy men and women each day, learn about their patronage, and find inspiration for your own path to holiness.
                                    </p>
                                </div>

                                <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Readings & Devotionals</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stay grounded in the Word. Access daily Mass readings, reflections, and a vast library of traditional Catholic prayers including the Rosary and Divine Mercy Chaplet.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-primary-900 to-sacred-900 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                                <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                                    Start your spiritual journey today. Create an account to track your prayers, save your favorite churches, and connect with believers worldwide.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Link href="/register" className="px-8 py-3 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-gold-500/25">
                                        Join Now
                                    </Link>
                                    <Link href="/contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors backdrop-blur-sm">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theology Note */}
                    <div className="max-w-2xl mx-auto text-center mt-20 pb-12">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            * We humbly serve as a facilitator for your prayer life. We do not claim to guarantee spiritual outcomes, but we promise to unite your intentions with a believing community.
                        </p>
                        <div className="mt-4">
                            <Link href="/guidelines" className="text-sm text-gold-500 hover:text-gold-400 font-medium">
                                Read our Community Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
