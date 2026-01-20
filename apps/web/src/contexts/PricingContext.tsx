'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PricingConfig {
    subscription: {
        plusMonthly: number;
        plusYearly: number;
        premiumMonthly: number;
        premiumYearly: number;
        lifetime: number;
    };
    candles: {
        oneDay: number;
        threeDay: number;
        sevenDay: number;
        thirtyDay: number;
    };
    masses: {
        regular: number;
        expedited: number;
        novena: number;
        gregorian: number;
        perpetual: number;
    };
    bouquets: {
        base: number;
        massAddOn: number;
        candleAddOn: number;
    };
}

interface PricingContextType {
    prices: PricingConfig | null;
    loading: boolean;
    error: string | null;
    formatPrice: (cents: number) => string;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
    const [prices, setPrices] = useState<PricingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Failed to fetch settings');
            const data = await res.json();

            if (data.settings?.prices) {
                setPrices(data.settings.prices);
            } else {
                throw new Error('Invalid settings format');
            }
        } catch (err) {
            console.error('Failed to load pricing:', err);
            setError('Failed to load pricing configuration');
            // Fallback to defaults if needed, but for now we expose the error
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (cents: number) => {
        if (cents === 0) return 'Free';
        return `$${(cents / 100).toFixed(2)}`;
    };

    return (
        <PricingContext.Provider value={{ prices, loading, error, formatPrice }}>
            {children}
        </PricingContext.Provider>
    );
}

export function usePricing() {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
}
