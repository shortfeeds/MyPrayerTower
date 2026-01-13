import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowRight, Users } from 'lucide-react';
import { OfferingsGrid } from '@/components/home/OfferingsGrid';
import { DailyFocus } from '@/components/home/DailyFocus';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { TrustBar } from '@/components/home/TrustBar';
import { StatisticsBand } from '@/components/home/StatisticsBand';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PromotionalBanner, AppDownloadBanner } from '@/components/home/PromotionalBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PersonalizedHome } from '@/components/dashboard/PersonalizedHome';
import { getLiturgicalData, getDailyReading, getSaintOfTheDay } from '@/app/actions/home';

async function AsyncDailyFocus() {
    try {
        const liturgicalData = await getLiturgicalData();
        const [reading, saint] = await Promise.all([
            getDailyReading(),
            getSaintOfTheDay(liturgicalData.celebrations?.[0]?.name)
        ]);

        return (
            <DailyFocus
                reading={reading || undefined}
                saint={saint || undefined}
                date={liturgicalData.date}
                liturgicalColor={liturgicalData.seasonColor}
            />
        );
    } catch (error) {
        console.error('Failed to load Daily Focus:', error);
        return null;
    }
}

function LoggedOutHomePage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-gold-500/30 selection:text-gold-200">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-800 via-sacred-900 to-gray-950 text-white pb-32">
                {/* Subtle Animated Background - Calmer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-sacred-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold-600/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Reduced Particles for Calmness */}
                <div className="opacity-20">
                    <ParticleBackground count={3} opacity={0.2} />
                </div>

                <div className="absolute inset-0 opacity-[0.03] bg-[url('/pattern.svg')] pointer-events-none mix-blend-overlay"></div>

                <div className="container mx-auto px-4 relative z-10 pt-20 md:pt-28 text-center">

                    {/* Main Headline - Spiritual Focus */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up tracking-tight drop-shadow-2xl">
                        Lift Your Heart<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100">
                            to God
                        </span>
                    </h1>

                    {/* Sub-headline - Purpose Driven */}
                    <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light delay-100">
                        Join a global community in faith, prayer, and devotion.
                        Sanctify your day, every day.
                    </p>

                    {/* Simplified CTAs - Action Oriented */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up mb-16 delay-200">
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/20 group"
                        >
                            Pray Now
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/candles"
                            className="inline-flex items-center justify-center px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30"
                        >
                            Light a Candle
                        </Link>
                    </div>

                    {/* Trust Signal - Subtle & Integrated */}
                    <div className="inline-flex items-center justify-center gap-2 opacity-60 animate-fade-in delay-300">
                        <Users className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-medium text-blue-100 tracking-wide">Praying with 10,000+ Catholics Worldwide</span>
                    </div>
                </div>
            </section>

            {/* Daily Focus Dashboard - Overlapping Hero */}
            <div className="relative z-30 -mt-24">
                <Suspense fallback={
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto h-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl animate-pulse" />
                    </div>
                }>
                    <AsyncDailyFocus />
                </Suspense>
            </div>

            {/* Reorganized Content Flow - Secondary Features pushed lower */}
            <div className="py-16">
                <TrustBar />
            </div>

            <div className="bg-white py-12 border-t border-gray-50">
                <TestimonialsSection />
            </div>

            {/* Moved Offerings & Stats Below the Fold */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 mb-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Ways to Participate</h2>
                        <p className="text-gray-600">Engage deeply with your faith through our community offerings.</p>
                    </div>
                    <OfferingsGrid />
                </div>
                <StatisticsBand />
            </div>

            <div className="py-8 bg-white border-t border-gray-100">
                <HowItWorks />
            </div>

            <div className="py-8 bg-cream-50">
                <PromotionalBanner />
            </div>

            <AppDownloadBanner />
        </div>
    );
}

export default async function Home() {
    const session = cookies().get('user_session');

    if (session) {
        return <PersonalizedHome />;
    }

    return <LoggedOutHomePage />;
}
