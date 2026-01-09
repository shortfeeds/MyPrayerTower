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
import { LiveStatsBar } from '@/components/home/LiveStatsBar';
import { QuickAccessBar } from '@/components/home/QuickAccessBar';
import { TrendingPrayers } from '@/components/home/TrendingPrayers';
import { getLiturgicalData, getDailyReading, getSaintOfTheDay, getUserHomeStreamData } from '@/app/actions/home';
import { Suspense } from 'react';
import { MassOfferingCTA, DonationFAB } from '@/components/giving/MassOfferingCTA';
import { getUserFromCookie } from '@/lib/auth';

// New engagement, community, and personalization components
import { LivePrayerSessions } from '@/components/community/LivePrayerSessions';
import { PrayerRecommendations } from '@/components/personalization/PrayerRecommendations';
import { RecentlyViewed } from '@/components/personalization/RecentlyViewed';
import { StreakBadge } from '@/components/gamification/PrayerStreaks';
import { DailyChallenges } from '@/components/gamification/DailyChallenges';
import { GlobalPrayerStats } from '@/components/engagement/CommunityPrayerCount';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { SeasonBadge } from '@/components/ui/LiturgicalTheme';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { QuickAccessCards } from '@/components/home/QuickAccessCards';
import { TrustBar } from '@/components/home/TrustBar';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StatisticsBand } from '@/components/home/StatisticsBand';
import { LiveCommunityPreview } from '@/components/home/LiveCommunityPreview';
import { ContentPreview } from '@/components/home/ContentPreview';
import { PromotionalBanner, AppDownloadBanner } from '@/components/home/PromotionalBanner';
import { CandleBanner } from '@/components/home/CandleBanner';



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
        <DashboardGrid
            statsBar={<LiveStatsBar />}
            greeting={
                <Suspense fallback={<GreetingSkeleton />}>
                    <AsyncPersonalizedGreeting />
                </Suspense>
            }
            dailyFocus={
                <div className="space-y-6">
                    <Suspense fallback={<CardSkeleton />}>
                        <AsyncTodaysReadingCard />
                    </Suspense>
                    <PrayerOfTheDayWidget />
                    <QuickAccessBar />
                </div>
            }
            journey={
                <div className="bg-cream-50 p-4 rounded-b-3xl space-y-4">
                    <DailyChallenges />
                    <div className="bg-gradient-to-br from-gold-50 to-orange-50 rounded-2xl border border-gold-100 p-6 flex flex-col justify-center items-center text-center">
                        <Flame className="w-10 h-10 text-gold-500 mb-3" />
                        <h3 className="font-bold text-gray-900 mb-1">Weekly Streak</h3>
                        <p className="text-sm text-gray-600 mb-4">You're on fire! Keep it up.</p>
                        <Link href="/journey" className="px-4 py-2 bg-gold-500 text-white text-sm font-bold rounded-lg hover:bg-gold-600 transition-colors">
                            View Full Journey
                        </Link>
                    </div>
                </div>
            }
            community={
                <div className="space-y-6">
                    <LivePrayerSessions />
                    <GlobalPrayerStats />
                    <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2">Prayer Wall</h3>
                            <p className="text-sm text-blue-100 mb-4">Pray for others or share your own intention.</p>
                            <Link href="/prayer-wall" className="text-sm font-bold text-gold-400 hover:text-gold-300">
                                Visit Wall →
                            </Link>
                        </div>
                        <Users className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10" />
                    </div>
                </div>
            }
            recommendations={<PrayerRecommendations />}
            trending={<TrendingPrayers />}
            recent={<RecentlyViewed />}
        />
    );
}


// --- Marketing Hero for Logged-out Users ---
function LoggedOutHomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Live Stats Bar */}
            <LiveStatsBar />

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-800 text-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-20 animate-pulse-soft"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[120px] opacity-15 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Floating Particle Background */}
                <ParticleBackground count={5} opacity={0.3} />

                {/* Cross Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 bg-hero-pattern"></div>

                <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-20 pb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Liturgical Season Badge */}
                        <div className="mb-4 animate-fade-in">
                            <SeasonBadge />
                        </div>

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

                        {/* Verse of the Day Compact */}
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
                                href="/welcome"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full transition-all duration-300 backdrop-blur-md border border-white/30"
                            >
                                <Star className="w-5 h-5 mr-2" />
                                I'm New Here
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-2 mt-12 animate-fade-in-up text-blue-100/80 text-sm" style={{ animationDelay: '0.6s' }}>
                            <Users className="w-4 h-4 text-gold-400" />
                            <span className="font-semibold">1M+ Faithful Users</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar - Social Proof */}
            <TrustBar />

            {/* Daily Content Preview - Moved up for immediate value */}
            <ContentPreview />

            {/* Quick Access to Public Features */}
            <QuickAccessCards />

            {/* How It Works */}
            <HowItWorks />

            {/* Live Community */}
            <LiveCommunityPreview />

            {/* Light a Candle Banner */}
            <CandleBanner />

            {/* Statistics Band */}
            <StatisticsBand />

            {/* Testimonials */}
            <section className="py-16 bg-cream-50">
                <div className="container mx-auto px-4">
                    <TestimonialsSection />
                </div>
            </section>

            {/* App Download Banner */}
            <AppDownloadBanner />


            {/* Final CTA */}
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
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-lg rounded-full transition-all hover:from-gold-400 hover:to-gold-500 shadow-lg"
                            >
                                Create Account
                            </Link>
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
