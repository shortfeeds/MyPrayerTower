'use client';

import { PrayerCornerHero } from '@/components/dashboard/prayer-corner/PrayerCornerHero';
import { MyCandlesCard } from '@/components/dashboard/prayer-corner/MyCandlesCard';
import { PrayerJournal } from '@/components/dashboard/prayer-corner/PrayerJournal';
import { MemorialsCard } from '@/components/dashboard/prayer-corner/MemorialsCard';

export default function PrayerCornerPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
            <PrayerCornerHero />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Column 1: Active Vigils & Memorials */}
                <div className="space-y-6">
                    <MyCandlesCard />
                    <MemorialsCard />
                </div>

                {/* Column 2: Prayer Journal (Wider/Taller focus) */}
                <div className="xl:col-span-2">
                    <PrayerJournal />
                </div>
            </div>
        </div>
    );
}
