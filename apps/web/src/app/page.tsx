import Link from 'next/link';
import { Church, Heart, BookOpen, Star, MapPin, ArrowRight, Shield, Clock, Sparkles, Users } from 'lucide-react';
import { TodaysReadingCard, SaintOfTheDayCard, QuickPrayerButtons, PersonalizedGreeting, ChurchSearchWidget, TestimonialsSection } from '@/components/home';
import { getLiturgicalData, getDailyReading, getSaintOfTheDay, getUserHomeStreamData } from '@/app/actions/home';
import { Suspense } from 'react';
import { MassOfferingCTA, DonationFAB } from '@/components/giving/MassOfferingCTA';

export const dynamic = 'force-dynamic';

// --- Async Wrappers for Suspense ---

async function AsyncPersonalizedGreeting() {
    const [user, liturgicalDay] = await Promise.all([
        getUserHomeStreamData(),
        getLiturgicalData()
    ]);

    return (
        <PersonalizedGreeting
            userName={user?.firstName}
            streak={user?.streak}
            prayedToday={user?.prayedToday}
            liturgicalDate={liturgicalDay?.celebrations[0]?.name || liturgicalDay?.date}
        />
    );
}

async function AsyncTodaysReadingCard() {
    const [liturgicalDay, reading] = await Promise.all([
        getLiturgicalData(),
        getDailyReading()
    ]);
    return <TodaysReadingCard liturgical={liturgicalDay} reading={reading} />;
}

async function AsyncSaintOfTheDayCard() {
    // Ideally we'd get liturgical day first to match by name, but for speed we can also just rely on date fallback
    // inside the generic matching logic if we want pure parallelism.
    // However, to match the original logic perfectly:
    const liturgicalDay = await getLiturgicalData();
    const saint = await getSaintOfTheDay(liturgicalDay.celebrations[0]?.name);

    return <SaintOfTheDayCard saint={saint} />;
}

// --- Loading Skeletons ---

function GreetingSkeleton() {
    return (
        <div className="animate-pulse flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gold-100/50">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="animate-pulse h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100"></div>
    );
}

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Emotional Hook Design */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-800 text-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-20 animate-pulse-soft"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px] opacity-15 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-10 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Cross Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 bg-hero-pattern"></div>

                <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-32">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-semibold text-gold-200">The #1 Catholic Faith Companion</span>
                        </div>

                        {/* Main Headline - Emotional Hook */}
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
                            Draw Closer to God,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300">
                                One Prayer at a Time
                            </span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Daily prayers, Mass readings, 10,000+ church locations, and a global prayer community —
                            everything you need to deepen your Catholic faith journey.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/30 group"
                            >
                                <Heart className="w-5 h-5 mr-2 group-hover:fill-current" />
                                Start Praying — It&apos;s Free
                            </Link>
                            <Link
                                href="/churches"
                                className="inline-flex items-center justify-center px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Find Mass Near Me
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center gap-2 text-blue-100/80">
                                <Users className="w-5 h-5 text-gold-400" />
                                <span className="font-semibold">1M+ Faithful Users</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100/80">
                                <Church className="w-5 h-5 text-gold-400" />
                                <span className="font-semibold">10,000+ Churches</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100/80">
                                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                                <span className="font-semibold">4.9 App Store Rating</span>
                            </div>
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

            {/* Quick Access Section */}
            <section className="py-12 bg-cream-50 relative -mt-6 z-20 rounded-t-[2.5rem]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto mb-8">
                        <Suspense fallback={<GreetingSkeleton />}>
                            <AsyncPersonalizedGreeting />
                        </Suspense>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <QuickPrayerButtons />
                    </div>
                </div>
            </section>

            {/* Today&apos;s Content Grid */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-display text-2xl font-bold text-gray-900">Today&apos;s Highlights</h2>
                            <Link href="/readings" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                                View All →
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Suspense fallback={<CardSkeleton />}>
                                <AsyncTodaysReadingCard />
                            </Suspense>
                            <Suspense fallback={<CardSkeleton />}>
                                <AsyncSaintOfTheDayCard />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </section>

            {/* Find Mass Section */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <ChurchSearchWidget />
                    </div>
                </div>
            </section>

            {/* Mass Offering CTA Section */}
            <section className="py-12 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <MassOfferingCTA variant="banner" context="general" />
                    </div>
                </div>
            </section>

            {/* Floating Action Button for Mobile */}
            <DonationFAB />

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4 block">
                            Your Complete Catholic Companion
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need to{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">Grow in Faith</span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-gold-200/60 -rotate-1 rounded-full z-0"></span>
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            A comprehensive suite of tools designed to support every aspect of your spiritual life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Church,
                                title: 'Church Finder',
                                desc: 'Find Mass times, confession schedules, and adoration chapels at 10,000+ Catholic churches worldwide.',
                                link: '/churches',
                                iconBg: 'from-sacred-500 to-sacred-600',
                            },
                            {
                                icon: Heart,
                                title: 'Prayer Wall',
                                desc: 'Share your intentions and join a global community of believers praying for each other daily.',
                                link: '/prayer-wall',
                                iconBg: 'from-rose-500 to-rose-600',
                            },
                            {
                                icon: BookOpen,
                                title: 'Prayer Library',
                                desc: 'Access 4,000+ traditional and contemporary prayers for every occasion, need, and time of day.',
                                link: '/prayers',
                                iconBg: 'from-emerald-500 to-emerald-600',
                            },
                            {
                                icon: Star,
                                title: 'Daily Saints',
                                desc: 'Read inspiring biographies of saints, their lives, patronage, and prayers for each feast day.',
                                link: '/saints',
                                iconBg: 'from-purple-500 to-purple-600',
                            },
                            {
                                icon: BookOpen,
                                title: 'Daily Readings',
                                desc: 'Follow the liturgical calendar with daily Mass readings, psalms, and Gospel reflections.',
                                link: '/readings',
                                iconBg: 'from-gold-500 to-gold-600',
                            },
                            {
                                icon: Shield,
                                title: 'Confession Guide',
                                desc: 'Prepare for the Sacrament of Reconciliation with our examination of conscience tool.',
                                link: '/confession',
                                iconBg: 'from-blue-500 to-blue-600',
                            }
                        ].map((feature, i) => (
                            <Link key={i} href={feature.link} className="group">
                                <div className="card-premium p-8 h-full group-hover:-translate-y-2 transition-all duration-300">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {feature.desc}
                                    </p>
                                    <div className="inline-flex items-center text-primary-600 font-semibold group-hover:text-gold-600 transition-colors">
                                        Explore
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Prayer Wall Preview */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-sacred-800 skew-y-2 scale-105 origin-top-left -z-10"></div>
                <div className="absolute inset-0 opacity-5 bg-hero-pattern -z-10"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-5/12 text-white">
                            <span className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-widest text-sm mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Community
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                                The Power of{' '}
                                <span className="text-gold-400">United Prayer</span>
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                                When you share a prayer intention, believers around the world lift you up in prayer. Experience the strength of a global faith community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/prayer-wall"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-sacred-800 font-bold rounded-full hover:bg-gold-50 transition-colors shadow-lg"
                                >
                                    <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500" />
                                    Join Prayer Wall
                                </Link>
                                <Link
                                    href="/prayer-wall/submit"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
                                >
                                    Submit a Request
                                </Link>
                            </div>
                        </div>

                        <div className="lg:w-7/12 w-full">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-sacred-800/0 via-sacred-800/0 to-sacred-800 z-10 pointer-events-none h-full"></div>

                                <div className="space-y-5 max-h-[550px] overflow-hidden relative opacity-95">
                                    {[
                                        { name: 'Maria S.', text: "Please pray for my mother's surgery tomorrow. We trust in God's healing power.", category: 'Health', time: '2m ago', prayers: 124 },
                                        { name: 'John D.', text: "For guidance in finding a new job opportunity that aligns with His will.", category: 'Work', time: '5m ago', prayers: 45 },
                                        { name: 'Sarah M.', text: "Thanksgiving for a safe delivery of our baby boy! God is good.", category: 'Thanksgiving', time: '12m ago', prayers: 289 },
                                        { name: 'Anonymous', text: "Pray for peace in my family and reconciliation with my brother.", category: 'Family', time: '15m ago', prayers: 67 },
                                    ].map((prayer, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                        {prayer.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{prayer.name}</div>
                                                        <div className="text-xs text-blue-200 flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-white/10 rounded-full">{prayer.category}</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prayer.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-blue-50 text-lg mb-4">&quot;{prayer.text}&quot;</p>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gold-400">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(j => (
                                                        <div key={j} className="w-6 h-6 rounded-full bg-white/20 border-2 border-sacred-800"></div>
                                                    ))}
                                                </div>
                                                <span>🙏 {prayer.prayers} people are praying</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-cream-50">
                <div className="container mx-auto px-4">
                    <TestimonialsSection />
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-sacred-600 via-sacred-700 to-sacred-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-15 translate-y-1/2 -translate-x-1/3"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                                <Sparkles className="w-4 h-4 text-gold-400" />
                                <span className="text-sm font-medium text-gold-200">100% Free to Start</span>
                            </div>

                            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your<br />Prayer Life?
                            </h2>
                            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                                Join over 1 million Catholics who are deepening their faith with MyPrayerTower.
                                Start your spiritual journey today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:from-gold-400 hover:to-gold-500 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-white/10 border border-white/30 text-white font-bold text-lg rounded-full transition-all duration-300 hover:bg-white/20"
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
