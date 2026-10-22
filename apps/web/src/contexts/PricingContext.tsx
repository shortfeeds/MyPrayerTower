'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CurrencyOption {
    code: string;
    symbol: string;
    label: string;
    rate: number; // approximate rate relative to USD
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
    { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0 },
    { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
    { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79 },
    { code: 'CAD', symbol: 'C$', label: 'CAD (C$)', rate: 1.38 },
    { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', rate: 1.54 },
    { code: 'PHP', symbol: '₱', label: 'PHP (₱)', rate: 58.0 },
    { code: 'BRL', symbol: 'R$', label: 'BRL (R$)', rate: 5.40 },
    { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 84.0 },
];

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
    currency: string;
    setCurrency: (code: string) => void;
    currencies: CurrencyOption[];
    formatPrice: (cents: number, overrideCurrency?: string) => string;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
    const [prices, setPrices] = useState<PricingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrencyState] = useState<string>('USD');

    useEffect(() => {
        fetchPrices();
        try {
            const saved = localStorage.getItem('mpt-currency');
            if (saved && SUPPORTED_CURRENCIES.some(c => c.code === saved)) {
                setCurrencyState(saved);
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    const setCurrency = (code: string) => {
        setCurrencyState(code);
        try {
            localStorage.setItem('mpt-currency', code);
        } catch {
            // Ignore
        }
    };

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
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (cents: number, overrideCurrency?: string) => {
        if (cents === 0) return 'Free';
        const targetCode = overrideCurrency || currency;
        const curr = SUPPORTED_CURRENCIES.find(c => c.code === targetCode) || SUPPORTED_CURRENCIES[0];
        
        const converted = (cents / 100) * curr.rate;

        // If whole or standard numbers, format cleanly
        if (curr.code === 'PHP' || curr.code === 'INR') {
            return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${curr.symbol}${converted.toFixed(2)}`;
    };

    return (
        <PricingContext.Provider value={{
            prices,
            loading,
            error,
            currency,
            setCurrency,
            currencies: SUPPORTED_CURRENCIES,
            formatPrice
        }}>
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
