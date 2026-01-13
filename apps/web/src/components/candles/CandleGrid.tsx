'use client';

import { Candle, CandleCard } from './CandleCard';

interface CandleGridProps {
    candles: Candle[];
    onPray: (id: string) => void;
}

export function CandleGrid({ candles, onPray }: CandleGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {candles.map((candle) => (
                <CandleCard key={candle.id} candle={candle} onPray={onPray} />
            ))}
        </div>
    );
}
