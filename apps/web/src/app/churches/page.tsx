import { Metadata } from 'next';
import ChurchesClient from './ChurchesClient';

export const metadata: Metadata = {
    title: 'Find a Sacred Space | Catholic Church Directory',
    description: 'Find a sanctuary for Mass, Confession, and Adoration near you. Connect with local Catholic communities and discover sacred spaces.',
    openGraph: {
        title: 'Find a Sacred Space | Catholic Church Directory - MyPrayerTower',
        description: 'Find a sanctuary for Mass, Confession, and Adoration near you. Connect with local Catholic communities and discover sacred spaces.',
        type: 'website',
    },
};

export default function ChurchesPage() {
    return <ChurchesClient />;
}
