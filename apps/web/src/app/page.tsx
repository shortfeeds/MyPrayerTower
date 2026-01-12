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
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-600 via-sacred-700 to-sacred-800 text-white pb-32">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-15"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-10"></div>
                </div>

                <ParticleBackground count={5} opacity={0.3} />

                <div className="absolute inset-0 opacity-5 bg-[url('/pattern.svg')] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 pt-20 md:pt-24 text-center">
                    {/* Trust Signal */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in shadow-lg">
                        <Users className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-semibold text-gold-200 tracking-wide">Joined by 10,000+ Catholics Worldwide</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up tracking-tight drop-shadow-2xl">
                        Your Daily<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
                            Catholic Companion
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light">
                        Grow in faith with daily readings, saint biographies, and a global community of prayer.
                        Sanctify your day, every day.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up mb-20">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/30 group"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center justify-center px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50 hover:shadow-lg"
                        >
                            <Users className="w-5 h-5 mr-2 text-gold-400" />
                            Visit Prayer Wall
                        </Link>
                    </div>
                </div>
            </section>

            {/* Daily Focus Dashboard - Overlapping Hero */}
            <div className="relative z-30">
                <Suspense fallback={<div className="container mx-auto px-4 -mt-20"><CardSkeleton className="max-w-6xl mx-auto" /></div>}>
                    <AsyncDailyFocus />
                </Suspense>
            </div>

            <TrustBar />

            <OfferingsGrid />

            <StatisticsBand />

            <div className="bg-white py-8">
                <TestimonialsSection />
            </div>

            <div className="py-8 bg-cream-50">
                <PromotionalBanner />
            </div>

            <div className="py-8 bg-white border-t border-gray-100">
                <HowItWorks />
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
