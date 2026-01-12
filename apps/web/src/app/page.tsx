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
import { HeroSkeleton, PrayerCardSkeleton as CardSkeleton } from '@/components/ui/SkeletonLoaders'; // Imported Skeletons
import { getLiturgicalData, getDailyReading, getSaintOfTheDay, getUserHomeStreamData } from '@/app/actions/home';
import { Suspense } from 'react';
import { MassOfferingCTA, DonationFAB } from '@/components/giving/MassOfferingCTA';
import { getUserFromCookie } from '@/lib/auth';

// New Smart Homepage Components
import { DailyJourneyWidget } from '@/components/home/DailyJourneyWidget';
import { TrendingPrayersCarousel } from '@/components/home/TrendingPrayersCarousel';
import { SacredMoments } from '@/components/home/SacredMoments';

// Legacy/Shared Components
import { LivePrayerSessions } from '@/components/community/LivePrayerSessions';
import { PrayerRecommendations } from '@/components/personalization/PrayerRecommendations';
import { LiturgicalCalendar } from '@/components/liturgy/LiturgicalCalendar';
import { RecentlyViewed } from '@/components/personalization/RecentlyViewed';
import { StreakBadge } from '@/components/gamification/PrayerStreaks';
import { DailyChallenges } from '@/components/gamification/DailyChallenges';
import { GlobalPrayerStats } from '@/components/engagement/CommunityPrayerCount';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { SeasonBadge } from '@/components/ui/LiturgicalTheme';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { TrustBar } from '@/components/home/TrustBar';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StatisticsBand } from '@/components/home/StatisticsBand';
import { PromotionalBanner, AppDownloadBanner } from '@/components/home/PromotionalBanner';
import { MemorialPreview } from '@/components/home/OfferingsGrid';



export const dynamic = 'force-dynamic';

// Check if user is logged in
async function getIsLoggedIn() {
    const user = await getUserFromCookie();
    return !!user;
}

// --- Async Wrappers for Suspense ---

async function AsyncPersonalizedGreeting() {
    try {
        const [user, liturgicalDay] = await Promise.all([
            getUserHomeStreamData().catch(() => null),
            getLiturgicalData().catch(() => null)
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
    } catch {
        return null;
    }
}

async function AsyncTodaysReadingCard() {
    try {
        const [liturgicalDay, reading] = await Promise.all([
            getLiturgicalData(),
            getDailyReading()
        ]);
        return <TodaysReadingCard liturgical={liturgicalDay} reading={reading} />;
    } catch {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100">Unable to load daily reading.</div>;
    }
}

async function AsyncSaintOfTheDayCard() {
    try {
        const liturgicalDay = await getLiturgicalData();
        const saint = await getSaintOfTheDay(liturgicalDay.celebrations[0]?.name);
        return <SaintOfTheDayCard saint={saint} />;
    } catch {
        return null;
    }
}

async function AsyncDailyJourney() {
    try {
        const [liturgicalDay, reading] = await Promise.all([
            getLiturgicalData(),
            getDailyReading()
        ]);
        const saint = await getSaintOfTheDay(liturgicalDay.celebrations[0]?.name);

        return <DailyJourneyWidget reading={reading} saint={saint} />;
    } catch (error) {
        console.error('Failed to load Daily Journey:', error);
        return null;
    }
}

async function AsyncTrendingPrayers() {
    try {
        // Import here to avoid circular dependencies if any
        const { getRandomTrendingPrayers } = await import('@/app/actions/home');
        const prayers = await getRandomTrendingPrayers(10);
        return <TrendingPrayersCarousel prayers={prayers} />;
    } catch (error) {
        console.error('Failed to load Trending Prayers:', error);
        return null; // Graceful fallback (section disappears)
    }
}

// --- Logged-in Dashboard View ---
function LoggedInHomePage() {
    return (
        <DashboardGrid
            statsBar={<LiveStatsBar />}
            greeting={
                <Suspense fallback={<CardSkeleton />}>
                    <AsyncPersonalizedGreeting />
                </Suspense>
            }
            dailyFocus={
                <div className="space-y-6">
                    <LiturgicalCalendar />
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
                    <Suspense fallback={<div className="h-48 animate-pulse bg-indigo-50 rounded-2xl"></div>}>
                        <LivePrayerSessions />
                    </Suspense>
                    <GlobalPrayerStats />
                    <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden group hover:bg-indigo-800 transition-colors cursor-pointer">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Users className="w-5 h-5 text-gold-400" />
                                Prayer Wall
                            </h3>
                            <p className="text-sm text-blue-100 mb-4">Pray for others or share your own intention.</p>
                            <Link href="/prayer-wall" className="text-sm font-bold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1">
                                Visit Wall <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <Users className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10 group-hover:text-white/20 transition-all" />
                    </div>
                </div>
            }
            recommendations={<PrayerRecommendations />}
            trending={
                <Suspense fallback={<CardSkeleton />}>
                    <TrendingPrayers />
                </Suspense>
            }
            recent={<RecentlyViewed />}
        />
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

// --- Logged-out Landing Page ---
function LoggedOutHomePage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-gold-500/30 selection:text-gold-200">

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-800 text-white pb-32">
                {/* Animated Background Elements - Reduced count/complexity */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-15 animate-pulse-soft"></div>
                </div>

                {/* Floating Particle Background */}
                <ParticleBackground count={3} opacity={0.3} />

                {/* Cross Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 bg-hero-pattern pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 pt-16 md:pt-20">
                    <div className="max-w-4xl mx-auto text-center">

                        {/* Trust Signal - Simplified */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
                            <Users className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-semibold text-gold-200">Join the Global Catholic Community</span>
                        </div>

                        {/* Main Headline - Sharpened & Emotional */}
                        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up tracking-tight drop-shadow-lg">
                            Sanctify Your Day.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                                Unite in Prayer.
                            </span>
                        </h1>

                        {/* Sub-headline - Clearer Value Prop */}
                        <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-medium" style={{ animationDelay: '0.2s' }}>
                            Join a global sanctuary of faith. Light a candle, offer a Mass, and lift up your intentions with thousands of Catholics worldwide.
                        </p>

                        {/* CTAs - Focused */}
                        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up mb-12" style={{ animationDelay: '0.4s' }}>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/20 group"
                            >
                                <Heart className="w-5 h-5 mr-2 fill-white/20 group-hover:fill-white transition-all" />
                                Start Praying
                            </Link>
                            <Link
                                href="/candles"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50"
                            >
                                <Flame className="w-5 h-5 mr-2 text-gold-400" />
                                Light a Candle
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Curved Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-full h-16 sm:h-24 md:h-32 lg:h-40 text-cream-50" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,432.84,37.8c-274.05,4.76-267,71.74-432.84,65C-16.14,101.9-5.71,59.34,0,0v120H1200V0C1175.71,59.34,1186.14,101.9,985.66,92.83Z" className="fill-current"></path>
                    </svg>
                </div>
            </section>

            <TrustBar />

            <div className="bg-cream-50 py-16">
                <HowItWorks />
            </div>

            <StatisticsBand />

            <div className="bg-white py-16">
                <TestimonialsSection />
            </div>

            <div className="py-16 bg-cream-50">
                <PromotionalBanner />
            </div>

            <AppDownloadBanner />
        </div>
    );
}
