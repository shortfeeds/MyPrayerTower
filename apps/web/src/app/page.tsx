export const revalidate = 3600; // 1 hour
import { HomeSessionWrapper } from '@/components/home/HomeSessionWrapper';
import { SanctuaryHero } from '@/components/home/SanctuaryHero';
import { SanctuaryGateways } from '@/components/home/SanctuaryGateways';
import { SponsoredEventsShowcase } from '@/components/home/SponsoredEventsShowcase';
import { PerpetualAndSeasonalOfferings } from '@/components/home/PerpetualAndSeasonalOfferings';
import { CompleteCatholicDirectory } from '@/components/home/CompleteCatholicDirectory';
import { AppDownloadSection } from '@/components/home/AppDownloadSection';
import { MemorialsBanner } from '@/components/home/MemorialsBanner';
import { UpcomingNovenaCountdown } from '@/components/home/UpcomingNovenaCountdown';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { YouTubeChannelSection } from '@/components/home/YouTubeChannelSection';
import { SanctuaryMemorialsWall } from '@/components/offerings/SanctuaryMemorialsWall';
import { SeoContentSection } from '@/components/home/SeoContentSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { fetchYouTubeVideos } from '@/lib/youtube';

/**
 * LoggedOutHomePage — Style A: Candlelit Basilica Sanctuary
 *
 * Prayer-first Catholic architecture with:
 * 1. Sanctuary Hero + Interactive Intention Selector + Golden Candle & Crimson Mass CTAs
 * 2. 4 Gothic Arch Sacred Gateways
 * 3. Sponsored Sacred Events ("Presented By" Patronage)
 * 4. Perpetual Vigil Lamp & Seasonal Catholic Gift Packages
 * 5. Eternal Memorials & Upcoming Novena Countdown
 * 6. YouTube Sacred Media & Sanctuary Memorials Wall
 * 7. Google Play App Download Showcase (with Desktop QR)
 * 8. Complete 6-Pillar Catholic Directory + Parish Finder (Added Advantage)
 * 9. Testimonials, Benediction & SEO Foundation
 */
async function LoggedOutHomePage() {
    let youtubeVideos: any[] = [];
    try {
        youtubeVideos = await fetchYouTubeVideos(6);
    } catch (error) {
        console.error('Failed to fetch YouTube videos for homepage:', error);
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#120E0A] text-[#FAF6EE] selection:bg-gold-500/30 selection:text-gold-200">
            {/* 1. Candlelit Basilica Hero & Intention Selector */}
            <SanctuaryHero />

            {/* 2. 4 Gothic Arch Sacred Gateways */}
            <SanctuaryGateways />

            {/* 3. Sponsored Online Prayer Events ("Presented By") */}
            <SponsoredEventsShowcase />

            {/* 4. Perpetual Vigil Lamp & Seasonal Gift Packages */}
            <PerpetualAndSeasonalOfferings />

            {/* 5. Eternal Memorials & Novena Countdown */}
            <MemorialsBanner />
            <div className="bg-[#120E0A] py-8">
                <div className="container mx-auto px-4">
                    <UpcomingNovenaCountdown />
                </div>
            </div>

            {/* 6. Sacred Media & Live Sanctuary Wall */}
            <YouTubeChannelSection videos={youtubeVideos} />
            <SanctuaryMemorialsWall />

            {/* 7. Google Play App Download Showcase */}
            <AppDownloadSection />

            {/* 8. Complete 6-Pillar Catholic Directory + Parish Finder Advantage */}
            <CompleteCatholicDirectory />

            {/* 9. Faithful Testimonials */}
            <div className="bg-[#18120D] py-16 border-t border-gold-500/15">
                <TestimonialsSection />
            </div>

            {/* Closing Benediction */}
            <div className="py-12 text-center bg-[#120E0A] border-t border-gold-500/10">
                <p className="font-serif text-xl italic text-[#CFC5B4] font-light">
                    &ldquo;May peace remain with you.&rdquo;
                </p>
            </div>

            {/* SEO Content for Search Engines */}
            <SeoContentSection />
        </div>
    );
}

export default async function Home() {
    return (
        <HomeSessionWrapper>
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'MyPrayerTower',
                alternateName: ['My Prayer Tower', 'MyPrayerTower Catholic Sanctuary'],
                url: 'https://www.myprayertower.com',
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://www.myprayertower.com/search?q={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                }
            }} />
            <JsonLd<any> data={{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'Can I request a Catholic Holy Mass online?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. MyPrayerTower allows you to request Holy Masses for your intentions, the departed, or special thanksgiving. Ordained priests celebrate these Masses.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'How do virtual prayer candles work?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'You can light a virtual candle for an intention starting from free. It burns on our sanctuary altar for your chosen duration, allowing the global community to pray with you.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I sponsor an online Rosary or Novena event?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Families can sponsor nightly Rosary streams, Saint Feast celebrations, First Friday Adoration, or 9-day Novenas with their family name and dedication displayed.'
                        }
                    }
                ]
            }} />
            <LoggedOutHomePage />
        </HomeSessionWrapper>
    );
}
