import { Metadata } from 'next';
import { BlessingsClient } from './BlessingsClient';

export const metadata: Metadata = {
    title: 'Sacred Blessings & Occasion Rituals | Digital Catholic Ceremonies - MyPrayerTower',
    description: 'Conduct authentic Catholic rituals and blessings for your home, travel, critical surgery, student examinations, and anniversaries. Receive personalized digital consecration certificates.',
    keywords: [
        'Catholic home blessing',
        'Epiphany chalk blessing 2026',
        'St Christopher car blessing',
        'St Peregrine cancer prayer blessing',
        'St Joseph Cupertino exam blessing',
        'anniversary mass blessing',
        'Christian rituals for occasions',
        'house warming prayer catholic'
    ],
    openGraph: {
        title: 'Sacred Blessings & Occasion Rituals - MyPrayerTower',
        description: 'Conduct traditional Catholic occasion blessings and receive downloadable digital consecration certificates.',
        url: 'https://www.myprayertower.com/blessings',
        type: 'website',
    }
};

export default function BlessingsPage() {
    return (
        <main className="min-h-screen bg-[#0a0612] text-white">
            <BlessingsClient />
        </main>
    );
}
