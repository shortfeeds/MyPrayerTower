import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sanctuary Hub | MyPrayerTower',
    description: 'Your complete Catholic digital sanctuary — prayer, mass, candles, saints and 60+ spiritual tools in one place.',
};

/**
 * App Layout — strips the website Header/Footer for TWA/android users.
 * The root layout still provides Providers, fonts, etc.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
