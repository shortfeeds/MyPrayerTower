'use client';

import { useState } from 'react';
import { Share, Download } from 'lucide-react';
import { BouquetShareModal } from './BouquetShareModal';
import { CertificateModal } from '@/components/certificates/CertificateModal';

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
        message?: string | null;
    };
}

export function BouquetActions({ bouquet }: BouquetActionsProps) {
    const [showShare, setShowShare] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    return (
        <div className="mt-6 space-y-2.5">
            <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 text-sm"
            >
                <Download className="w-4 h-4" />
                Download Memorabilia Certificate (PNG)
            </button>

            <button
                type="button"
                onClick={() => setShowShare(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 text-sm"
            >
                <Share className="w-4 h-4" />
                Share Digital Bouquet Link
            </button>

            <BouquetShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                bouquet={bouquet}
            />

            <CertificateModal
                isOpen={showCertificate}
                onClose={() => setShowCertificate(false)}
                type="bouquet"
                title="SPIRITUAL BOUQUET OF PRAYERS"
                latinTitle="Corona Precum et Florilegium Sacrum"
                recipientName={bouquet.recipientName}
                donorName={bouquet.senderName}
                dedicatedDetail={`Spiritual Bouquet for ${bouquet.occasion || 'Special Occasion'}`}
                intention={bouquet.message || undefined}
                pledgedItems={{
                    masses: bouquet.massesCount || undefined,
                    rosaries: bouquet.rosariesCount || undefined,
                    prayers: bouquet.prayersCount || undefined,
                    candles: bouquet.candlesCount || undefined,
                }}
                celebrantOrSanctuary="Sanctuary of Perpetual Prayer & Intercession"
            />
        </div>
    );
}
