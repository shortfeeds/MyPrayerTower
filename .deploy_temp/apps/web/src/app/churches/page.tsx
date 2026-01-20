import { Metadata } from 'next';
import ChurchesClient from './ChurchesClient';

export const metadata: Metadata = {
    title: 'Places of Prayer Near You | Catholic Church Directory',
    description: 'Find a sacred space for Mass, Confession, and Adoration near you. Connect with local Catholic communities and discover places of prayer.',
    openGraph: {
        title: 'Places of Prayer Near You | Catholic Church Directory - MyPrayerTower',
        description: 'Find a sacred space for Mass, Confession, and Adoration near you. Connect with local Catholic communities and discover places of prayer.',
        type: 'website',
    },
};

export default function ChurchesPage() {
    return <ChurchesClient />;
}
