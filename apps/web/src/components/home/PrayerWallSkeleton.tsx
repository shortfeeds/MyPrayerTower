import { Users } from 'lucide-react';

export function PrayerWallSkeleton() {
    return (
        <div className="bg-indigo-900/5 rounded-2xl p-6 relative overflow-hidden h-[200px] border border-indigo-100 flex flex-col justify-between animate-pulse">
            <div className="space-y-3 z-10 relative">
                <div className="h-6 w-32 bg-indigo-200/50 rounded"></div>
                <div className="h-4 w-48 bg-indigo-200/30 rounded"></div>
                <div className="h-8 w-24 bg-gold-200/50 rounded mt-4"></div>
            </div>

            <div className="absolute bottom-[-10px] right-[-10px]">
                <Users className="w-24 h-24 text-indigo-100" />
            </div>
        </div>
    );
}
