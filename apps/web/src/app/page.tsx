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
import { MemorialsBanner } from '@/components/home/MemorialsBanner';
import { getLiturgicalData, getDailyReading, getSaintOfTheDay } from '@/app/actions/home';
import { WelcomeGreeting } from '@/components/home/WelcomeGreeting';
import { GlobalPerpetualFlame } from '@/components/novenas/GlobalPerpetualFlame';

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



                <div className="container mx-auto px-4 relative z-10 pt-32 md:pt-40 text-center">

                    {/* Time-Aware Greeting (Subtle) */}
                    <div className="mb-8 flex flex-col items-center gap-6">
                        <WelcomeGreeting />
                        <GlobalPerpetualFlame />
                    </div>

                    {/* Mission-Driven Headline (Hero) */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-8 leading-[1.1] animate-fade-in-up tracking-tight drop-shadow-2xl text-white">
                        A global Catholic community
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 font-bold">
                            united in prayer.
                        </span>
                    </h1>

                    {/* Supportive Sub-line */}
                    <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light delay-100">
                        Pray together, light candles of hope, and offer intentions in faith.
                    </p>

                    {/* Primary CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up mb-16 delay-200 px-4 sm:px-0">
                        <Link
                            href="/prayer-wall"
                            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/20 group"
                        >
                            Start Praying
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/candles"
                            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30"
                        >
                            Light a Candle
                        </Link>
                    </div>

                    {/* Emotional Reassurance - Sacred UX */}
                    <div className="flex flex-col items-center gap-4 animate-fade-in-up delay-300">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                            <svg className="w-3.5 h-3.5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-widest text-blue-100/60 font-bold">Sacred Privacy & Security</span>
                        </div>
                        <p className="text-blue-100/60 text-base font-light italic">
                            You are welcome here.
                        </p>
                        <p className="text-sm md:text-base text-blue-200/60 font-medium tracking-wider">
                            A global spiritual sanctuary, open to all.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 2: CORE ACTIONS (4 actions)
                Goal: Reduce decision fatigue
            ============================================ */}
            <CoreActions />

            {/* ============================================
                SECTION 2.5: ETERNAL MEMORIALS BANNER
                Goal: Promote key feature
            ============================================ */}
            <MemorialsBanner />

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
            <div className="bg-slate-50 dark:bg-slate-900 py-16 border-t border-gray-100 dark:border-slate-800">
                <TestimonialsSection />
            </div>

            {/* ============================================
                SECTION 6: INVITATION TO RETURN
                Goal: Retention without pressure
            ============================================ */}
            <InvitationToReturn />

            {/* App Download */}
            <AppDownloadBanner />

            {/* Closing Benediction */}
            <div className="py-12 text-center">
                <p className="font-serif text-xl italic text-neutral-400 font-light">
                    "May peace remain with you."
                </p>
            </div>
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
