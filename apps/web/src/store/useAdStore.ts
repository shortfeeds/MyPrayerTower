import { create } from 'zustand';

export interface AdUnit {
    sectionKey: string;
    adType: 'BANNER' | 'NATIVE' | 'INTERSTITIAL' | 'REWARDED' | 'APP_OPEN' | 'NEWSLETTER' | 'FEATURED';
    androidUnitId?: string;
    iosUnitId?: string;
    webUnitId?: string;
}

export interface AdPlacementMatrix {
    [page: string]: {
        [position: string]: boolean;
    };
}

interface AdState {
    ads: AdUnit[];
    placementsMatrix: AdPlacementMatrix;
    loading: boolean;
    fetched: boolean;
    fetchAds: () => Promise<void>;
    getAdForSection: (sectionKey: string) => AdUnit | undefined;
    isAdEnabledForPosition: (page: string, position: string) => boolean;
}

export const useAdStore = create<AdState>((set, get) => ({
    ads: [],
    placementsMatrix: {},
    loading: false,
    fetched: false,
    fetchAds: async () => {
        if (get().fetched || get().loading) return;
        
        set({ loading: true });
        try {
            const response = await fetch('/api/ads');
            const data = await response.json();
            set({ 
                ads: data.ads || [], 
                placementsMatrix: data.placementsMatrix || {},
                fetched: true 
            });
        } catch (error) {
            console.error('Failed to fetch ads:', error);
            set({ ads: [], placementsMatrix: {} });
        } finally {
            set({ loading: false });
        }
    },
    getAdForSection: (sectionKey: string) => {
        return get().ads.find(ad => ad.sectionKey === sectionKey);
    },
    isAdEnabledForPosition: (page: string, position: string) => {
        const matrix = get().placementsMatrix;
        // If the matrix hasn't been configured yet (empty object), default to allowing the ad.
        if (!matrix || Object.keys(matrix).length === 0) return true;
        // If the specific page hasn't been configured, default to not showing.
        if (!matrix[page]) return false;
        return !!matrix[page][position];
    }
}));
