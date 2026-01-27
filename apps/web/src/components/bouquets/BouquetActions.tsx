
'use client';

import { useState } from 'react';
import { Share } from 'lucide-react';
import { BouquetShareModal } from './BouquetShareModal';

interface BouquetActionsProps {
    bouquet: {
        id: string;
        recipientName: string;
        senderName: string;
        occasion: string;
        massesCount: number;
        rosariesCount: number;
        prayersCount: number;
        candlesCount: number;
    };
}

export function BouquetActions({ bouquet }: BouquetActionsProps) {
    const [showShare, setShowShare] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowShare(true)}
                className="mt-6 w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all hover:scale-105 active:scale-95"
            >
                <Share className="w-5 h-5" />
                Share Bouquet
            </button>

            <BouquetShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                bouquet={bouquet}
            />
        </>
    );
}
