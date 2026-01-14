import { Metadata } from 'next';
import MemorialsClient from './MemorialsClient';

export const metadata: Metadata = {
    title: 'Digital Chapels | Sacred Remembrance',
    description: 'Create a lasting tribute for your loved ones. Light candles, offer prayers, and share memories in a sacred digital sanctuary.',
    openGraph: {
        title: 'Digital Chapels | Sacred Remembrance - MyPrayerTower',
        description: 'Create a lasting tribute for your loved ones. Light candles, offer prayers, and share memories in a sacred digital sanctuary.',
        type: 'website',
    },
};

export default function MemorialsPage() {
    return <MemorialsClient />;
}
