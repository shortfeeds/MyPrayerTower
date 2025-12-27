import Link from 'next/link';
import { Church, Heart, BookOpen, User, Star, MapPin, ArrowRight, Shield, Globe, Clock, Quote } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-primary-950 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                {/* Gradient Orb */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-30 animate-pulse-soft"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gold-500 rounded-full blur-[120px] opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-sm font-medium text-blue-100">The #1 Catholic App Worldwide</span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
                            Deepen Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">Spiritual Journey</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Find churches, join a global prayer community, and grow in faith with daily devotionals and readings.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Link
                                href="/churches"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/30 group"
                            >
                                <MapPin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                                Find Churches Near Me
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white relative -mt-10 z-20 rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-gray-100">
                        {[
                            { value: '50k+', label: 'Churches Listed', color: 'text-primary-600' },
                            { value: '2k+', label: 'Daily Prayers', color: 'text-gold-600' },
                            { value: '150+', label: 'Countries', color: 'text-primary-600' },
                            { value: '1M+', label: 'Faithful Users', color: 'text-gold-600' }
                        ].map((stat, i) => (
                            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className={`text-4xl md:text-5xl font-serif font-bold ${stat.color} mb-2`}>{stat.value}</div>
                                <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4 block">Holistic Catholic Services</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need to <br />
                            <span className="relative inline-block">
                                <span className="relative z-10">Grow in Faith</span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-gold-200/50 -rotate-1 rounded-full z-0"></span>
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            A comprehensive suite of tools designed to support your spiritual life, from daily prayer to finding your local community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Church,
                                title: 'Church Finder',
                                desc: 'Locate Mass times, confession schedules, and adoration chapels anywhere in the world.',
                                link: '/churches',
                                color: 'bg-primary-100 text-primary-600'
                            },
                            {
                                icon: Heart,
                                title: 'Prayer Wall',
                                desc: 'Submit prayer intentions and join a global community of prayer warriors interceding for each other.',
                                link: '/prayer-wall',
                                color: 'bg-gold-100 text-gold-600'
                            },
                            {
                                icon: BookOpen,
                                title: 'Prayer Library',
                                desc: 'Access over 2,000 traditional and contemporary prayers for every occasion and need.',
                                link: '/prayers',
                                color: 'bg-green-100 text-green-600'
                            },
                            {
                                icon: Star,
                                title: 'Daily Saints',
                                desc: 'Read inspiring biographies of saints and learn about their lives and patronage.',
                                link: '/saints',
                                color: 'bg-purple-100 text-purple-600'
                            },
                            {
                                icon: BookOpen,
                                title: 'Daily Readings',
                                desc: 'Follow the liturgical calendar with daily Mass readings, psalms, and Gospel reflections.',
                                link: '/readings',
                                color: 'bg-rose-100 text-rose-600'
                            },
                            {
                                icon: Shield,
                                title: 'Verified Listings',
                                desc: 'Church administrators can claim and verify their listings to keep information up-to-date.',
                                link: '/claim',
                                color: 'bg-indigo-100 text-indigo-600'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="card-premium p-10 group hover:-translate-y-2 transition-all duration-300">
                                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-8 min-h-[80px]">
                                    {feature.desc}
                                </p>
                                <Link
                                    href={feature.link}
                                    className="inline-flex items-center text-primary-700 font-bold group-hover:text-gold-600 transition-colors"
                                >
                                    Explore Feature
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Prayer Wall Preview */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900 skew-y-3 scale-110 origin-top-left -z-10"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 -z-10"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-5/12 text-white">
                            <span className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-widest text-sm mb-6">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Now
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                                The Power of <br />
                                <span className="text-gold-400">Community Prayer</span>
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                                Join thousands of believers lifting each other up. When you share a prayer request, our global community prays with you.
                            </p>
                            <Link
                                href="/prayer-wall"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-900 font-bold rounded-full hover:bg-gold-50 transition-colors shadow-lg"
                            >
                                <Heart className="w-5 h-5 mr-2 text-red-500 fill-current" />
                                Join Prayer Wall
                            </Link>
                        </div>

                        <div className="lg:w-7/12 w-full">
                            <div className="relative">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/0 via-primary-900/0 to-primary-900 z-10 pointer-events-none h-full"></div>

                                <div className="space-y-6 max-h-[600px] overflow-hidden relative opacity-90">
                                    {[
                                        { name: 'Maria S.', text: "Please pray for my mother's surgery tomorrow. We trust in God's healing power.", category: 'Health', time: '2m ago', prayers: 124 },
                                        { name: 'John D.', text: "For guidance in finding a new job opportunity that aligns with His will.", category: 'Work', time: '5m ago', prayers: 45 },
                                        { name: 'Sarah M.', text: "Thanksgiving for a safe delivery of our baby boy! God is good.", category: 'Thanksgiving', time: '12m ago', prayers: 289 },
                                        { name: 'Anonymous', text: "Pray for peace in my family and reconciliation.", category: 'Family', time: '15m ago', prayers: 67 },
                                    ].map((prayer, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {prayer.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{prayer.name}</div>
                                                        <div className="text-xs text-blue-200 flex items-center gap-2">
                                                            <span>{prayer.category}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prayer.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-blue-50 text-lg italic mb-4">"{prayer.text}"</p>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gold-400">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(j => (
                                                        <div key={j} className="w-6 h-6 rounded-full bg-white/20 border border-primary-900"></div>
                                                    ))}
                                                </div>
                                                <span>{prayer.prayers} people are praying</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Faith Life?
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                                Join our rapidly growing community today. It's completely free to start knowing, loving, and serving God better.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary-900 font-bold rounded-full transition-all duration-300 hover:bg-gold-50 shadow-lg"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:bg-white/10"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
