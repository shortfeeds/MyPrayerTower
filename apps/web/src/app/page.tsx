import Link from 'next/link';
import { Church, Heart, BookOpen, Star, MapPin, ArrowRight, Shield, Clock, Sparkles, Users, Flame, Smartphone, Apple } from 'lucide-react';
import {
    TodaysReadingCard,
    SaintOfTheDayCard,
    QuickPrayerButtons,
    PersonalizedGreeting,
    ChurchSearchWidget,
    TestimonialsSection,
    PrayerOfTheDayWidget,
    ActiveChallengesWidget,
} from '@/components/home';
import { VerseOfTheDay } from '@/components/home/VerseOfTheDay';
import { LiveStatsBar, LiveStatsCompact } from '@/components/home/LiveStatsBar';
import { QuickAccessBar } from '@/components/home/QuickAccessBar';
import { TrendingPrayers } from '@/components/home/TrendingPrayers';
import { getLiturgicalData, getDailyReading, getSaintOfTheDay, getUserHomeStreamData } from '@/app/actions/home';
import { Suspense } from 'react';
import { MassOfferingCTA, DonationFAB } from '@/components/giving/MassOfferingCTA';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Check if user is logged in
async function getIsLoggedIn() {
    const user = await getUserFromCookie();
    return !!user;
}

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
            prayersCompletedToday={1}
            dailyGoal={3}
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
        <div className="animate-pulse h-[200px] bg-white rounded-2xl shadow-sm border border-gray-100"></div>
    );
}

// --- Logged-in Dashboard View ---
function LoggedInHomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-cream-50">
            {/* Live Stats Bar */}
            <LiveStatsBar />

            {/* Compact Header with Gradient */}
            <section className="bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-700 text-white pt-10 pb-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <Suspense fallback={<GreetingSkeleton />}>
                            <AsyncPersonalizedGreeting />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* Quick Actions & Widgets */}
            <section className="py-8 bg-cream-50 -mt-4">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Quick Access Bar - NEW */}
                        <QuickAccessBar />

                        {/* Verse of the Day (Banner) - NEW */}
                        <VerseOfTheDay variant="banner" />

                        {/* Prayer of the Day */}
                        <PrayerOfTheDayWidget />
                    </div>
                </div>
            </section>

            {/* Today's Content Grid */}
            <section className="py-4 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-xl font-bold text-gray-900">Today&apos;s Highlights</h2>
                            <Link href="/readings" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                                View All →
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5">
                            {/* Reorganized Grid: Verse Card + Reading */}
                            <VerseOfTheDay variant="card" />
                            <Suspense fallback={<CardSkeleton />}>
                                <AsyncTodaysReadingCard />
                            </Suspense>
                            <Suspense fallback={<CardSkeleton />}>
                                <AsyncSaintOfTheDayCard />
                            </Suspense>
                            <div className="bg-gradient-to-br from-gold-50 to-orange-50 rounded-2xl border border-gold-100 p-6 flex flex-col justify-center items-center text-center">
                                <Flame className="w-10 h-10 text-gold-500 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-1">Join a Challenge</h3>
                                <p className="text-sm text-gray-600 mb-4">Boost your prayer life with a 7-day journey.</p>
                                <Link href="/challenges" className="px-4 py-2 bg-gold-500 text-white text-sm font-bold rounded-lg hover:bg-gold-600 transition-colors">
                                    Browse Challenges
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Prayers - NEW */}
            <section className="py-8 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <TrendingPrayers />
                    </div>
                </div>
            </section>

            {/* Active Challenges */}
            <section className="py-8 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <ActiveChallengesWidget />
                    </div>
                </div>
            </section>

            {/* Find Mass - Compact */}
            <section className="py-8 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <ChurchSearchWidget />
                    </div>
                </div>
            </section>

            {/* Mass Offering CTA */}
            <section className="py-8 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <MassOfferingCTA variant="banner" context="general" />
                    </div>
                </div>
            </section>

            {/* Floating Action Button for Mobile */}
            <DonationFAB />
        </div>
    );
}

// --- Marketing Hero for Logged-out Users ---
function LoggedOutHomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Live Stats Bar - NEW */}
            <LiveStatsBar />

            {/* Hero Section - Compact Version */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-800 text-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-20 animate-pulse-soft"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px] opacity-15 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Cross Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 bg-hero-pattern"></div>

                <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-semibold text-gold-200">The #1 Catholic Faith Companion</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                            Draw Closer to God,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300">
                                One Prayer at a Time
                            </span>
                        </h1>

                        {/* Verse of the Day Compact - NEW */}
                        <div className="max-w-lg mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <VerseOfTheDay variant="compact" />
                        </div>

                        {/* Sub-headline */}
                        <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Daily prayers, Mass readings, 10,000+ churches, and a global prayer community.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/30 group"
                            >
                                <Heart className="w-5 h-5 mr-2 group-hover:fill-current" />
                                Start Praying — It&apos;s Free
                            </Link>
                            <Link
                                href="/churches"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full transition-all duration-300 backdrop-blur-md border border-white/30"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Find Mass Near Me
                            </Link>
                        </div>

                        {/* Social Proof & Live Stats Compact */}
                        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center gap-2 text-blue-100/80 text-sm">
                                <Users className="w-4 h-4 text-gold-400" />
                                <span className="font-semibold">1M+ Faithful Users</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-white/20"></div>
                            {/* Live Stats Compact - NEW */}
                            <LiveStatsCompact />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Demo Section */}
            <section className="py-12 bg-cream-50 relative -mt-4 z-20 rounded-t-[2rem]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center mb-8">
                        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Experience It Now</h2>
                        <p className="text-gray-600">Try today&apos;s prayer — no signup needed</p>
                    </div>
                    <div className="max-w-xl mx-auto">
                        <PrayerOfTheDayWidget />
                    </div>
                </div>
            </section>

            {/* Trending Prayers Section - NEW */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <TrendingPrayers />
                    </div>
                </div>
            </section>

            {/* Features Grid - Compact */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to <span className="text-sacred-600">Grow in Faith</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: Church, title: 'Church Finder', desc: 'Find Mass times at 10,000+ Catholic churches.', link: '/churches', color: 'from-sacred-500 to-sacred-600' },
                            { icon: Heart, title: 'Prayer Wall', desc: 'Share intentions and pray with a global community.', link: '/prayer-wall', color: 'from-rose-500 to-rose-600' },
                            { icon: BookOpen, title: 'Prayer Library', desc: 'Access 4,000+ traditional and modern prayers.', link: '/prayers', color: 'from-emerald-500 to-emerald-600' },
                            { icon: Star, title: 'Daily Saints', desc: 'Inspiring biographies for each feast day.', link: '/saints', color: 'from-purple-500 to-purple-600' },
                            { icon: Flame, title: 'Challenges', desc: 'Build prayer habits with guided challenges.', link: '/challenges', color: 'from-orange-500 to-orange-600' },
                            { icon: Shield, title: 'Confession Guide', desc: 'Prepare for Reconciliation with our tool.', link: '/confession', color: 'from-blue-500 to-blue-600' },
                        ].map((feature, i) => (
                            <Link key={i} href={feature.link} className="group">
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                                    <span className="inline-flex items-center text-primary-600 font-semibold text-sm group-hover:text-gold-600 transition-colors">
                                        Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Prayer Wall Preview - Compact */}
            <section className="py-16 bg-sacred-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-hero-pattern"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="flex items-center justify-center gap-2 text-gold-400 font-bold uppercase tracking-widest text-sm mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Community
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                            Join <span className="text-gold-400">20,000+</span> People Praying Right Now
                        </h2>
                        <LiveStatsCompact />
                        <p className="text-blue-100 mt-4">Share your intentions and experience the power of united prayer.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-sacred-800 font-bold rounded-full hover:bg-gold-50 transition-colors shadow-lg"
                        >
                            <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500" />
                            Join Prayer Wall
                        </Link>
                        <Link
                            href="/prayer-wall/submit"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
                        >
                            Submit a Request
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4">
                    <TestimonialsSection />
                </div>
            </section>

            {/* Final CTA with App Download */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-sacred-600 via-sacred-700 to-sacred-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-20"></div>
                        <div className="relative z-10">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Transform Your Prayer Life?
                            </h2>
                            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                                Join over 1 million Catholics deepening their faith with MyPrayerTower.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-lg rounded-full transition-all hover:from-gold-400 hover:to-gold-500 shadow-lg"
                                >
                                    Create Free Account
                                </Link>
                                <div className="flex items-center gap-3">
                                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md border border-white/20">
                                        <Apple className="w-6 h-6 text-white" />
                                    </button>
                                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md border border-white/20">
                                        <Smartphone className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Action Button for Mobile */}
            <DonationFAB />
        </div>
    );
}

// --- Main Homepage Component ---
export default async function HomePage() {
    const isLoggedIn = await getIsLoggedIn();

    if (isLoggedIn) {
        return <LoggedInHomePage />;
    }

    return <LoggedOutHomePage />;
}
