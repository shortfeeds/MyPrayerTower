import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowRight } from 'lucide-react';
import { CoreActions } from '@/components/home/CoreActions';
import { SocialReassurance } from '@/components/home/SocialReassurance';
import { WhyWeExist } from '@/components/home/WhyWeExist';
import { FeatureDiscovery } from '@/components/home/FeatureDiscovery';
import { InvitationToReturn } from '@/components/home/InvitationToReturn';
import { DailyFocus } from '@/components/home/DailyFocus';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { AppDownloadBanner } from '@/components/home/PromotionalBanner';
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

/**
 * LoggedOutHomePage
 * 
 * Redesigned following Faith-Based UX wireframe:
 * 1. Hero - Emotional safety + clarity
 * 2. Core Actions - 3 choices only
 * 3. Social Reassurance - Gentle belonging
 * 4. Why We Exist - Meaning first
 * 5. Feature Discovery - Soft exploration
 * 6. Invitation to Return - Gentle retention
 */
function LoggedOutHomePage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-gold-500/30 selection:text-gold-200">
            {/* ============================================
                SECTION 1: HERO (Above the Fold)
                Goal: Immediate emotional safety + clarity
            ============================================ */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sacred-800 via-sacred-900 to-gray-950 text-white pb-32">
                {/* Subtle Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-sacred-600/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold-600/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="opacity-20">
                    <ParticleBackground count={3} opacity={0.2} />
                </div>

                <div className="container mx-auto px-4 relative z-10 pt-20 md:pt-28 text-center">
                    {/* Mission-Driven Headline */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up tracking-tight drop-shadow-2xl">
                        A global Catholic community
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-100">
                            united in prayer.
                        </span>
                    </h1>

                    {/* Supportive Sub-line */}
                    <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light delay-100">
                        Pray together, light candles of hope, and offer intentions in faith.
                    </p>

                    {/* Two Primary CTAs Only */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up mb-16 delay-200">
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/20 group"
                        >
                            Start Praying
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/candles"
                            className="inline-flex items-center justify-center px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30"
                        >
                            Light a Candle
                        </Link>
                    </div>

                    {/* NO stats, NO feature lists, NO secondary links */}
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

            {/* ============================================
                SECTION 2: CORE ACTIONS (3 Only)
                Goal: Reduce decision fatigue
            ============================================ */}
            <CoreActions />

            {/* ============================================
                SECTION 3: SOCIAL REASSURANCE
                Goal: Belonging, not persuasion
            ============================================ */}
            <SocialReassurance />

            {/* ============================================
                SECTION 4: WHY WE EXIST
                Goal: Meaning before monetization
            ============================================ */}
            <WhyWeExist />

            {/* ============================================
                SECTION 5: FEATURE DISCOVERY
                Goal: Exploration, not conversion
            ============================================ */}
            <FeatureDiscovery />

            {/* Testimonials - Social Proof (Soft) */}
            <div className="bg-slate-50 py-16 border-t border-gray-100">
                <TestimonialsSection />
            </div>

            {/* ============================================
                SECTION 6: INVITATION TO RETURN
                Goal: Retention without pressure
            ============================================ */}
            <InvitationToReturn />

            {/* App Download */}
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
