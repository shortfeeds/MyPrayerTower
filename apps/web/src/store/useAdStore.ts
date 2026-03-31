import { create } from 'zustand';

export interface AdUnit {
    sectionKey: string;
    adType: 'BANNER' | 'NATIVE' | 'INTERSTITIAL' | 'REWARDED' | 'APP_OPEN' | 'NEWSLETTER' | 'FEATURED';
    androidUnitId?: string;
    iosUnitId?: string;
    webUnitId?: string;
}

interface AdState {
    ads: AdUnit[];
    loading: boolean;
    fetched: boolean;
    fetchAds: () => Promise<void>;
    getAdForSection: (sectionKey: string) => AdUnit | undefined;
}

export const useAdStore = create<AdState>((set, get) => ({
    ads: [],
    loading: false,
    fetched: false,
    fetchAds: async () => {
        if (get().fetched || get().loading) return;
        
        set({ loading: true });
        try {
            const response = await fetch('/api/ads');
            const data = await response.json();
            set({ ads: data.ads || [], fetched: true });
        } catch (error) {
            console.error('Failed to fetch ads:', error);
            set({ ads: [] });
        } finally {
            set({ loading: false });
        }
    },
    getAdForSection: (sectionKey: string) => {
        return get().ads.find(ad => ad.sectionKey === sectionKey);
    }
}));
