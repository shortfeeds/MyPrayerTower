import { Metadata } from 'next';
import { Suspense } from 'react';
import { getUserSanctuaryVigils } from '@/app/actions/spiritual';
import { MyVigilsClient } from './MyVigilsClient';

export const metadata: Metadata = {
    title: 'My Sacred Vigils | Active Sanctuary Lamps & Prayer Keepsakes - MyPrayerTower',
    description: 'View your active burning prayer vigils, Holy Mass offerings, sealed prayers, and commemorative digital votive certificates before the Lord.',
    robots: {
        index: false, // Personal user sanctuary
        follow: true
    }
};

export default async function MyVigilsPage() {
    // Attempt to load server records if user is logged in
    const initialData = await getUserSanctuaryVigils();

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <MyVigilsClient initialData={initialData} />
            </Suspense>
        </main>
    );
}
