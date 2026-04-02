/**
 * Candle Tier & Sample Data
 * Separated from the page component to reduce bundle size and prevent chunking errors.
 */

import { Flame, Crown, Star, Sparkles } from 'lucide-react';

export type CandleTier = 'free' | 'basic' | 'standard' | 'premium';

export interface Candle {
    id: string;
    userName: string;
    intention: string;
    remainingHours: number;
    prayerCount: number;
    tier: CandleTier;
    litAt: string;
    duration: string;
    country?: string;
}

export const TIER_CONFIG: Record<string, { 
    label: string; 
    days: number; 
    color: string; 
    icon: any; 
    badge: string; 
    image: string; 
    tierLabel: string; 
    spiritualMessage: string 
}> = {
    '30_days': {
        label: 'Divine Cathedral',
        days: 30,
        color: 'from-amber-500 to-yellow-600',
        icon: Crown,
        badge: '🕊️ Heavenly',
        image: '/images/candles/divine.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Your prayer ascends to Heaven'
    },
    '14_days': {
        label: 'Blessed Marian',
        days: 14,
        color: 'from-blue-400 to-blue-600',
        icon: Crown,
        badge: '✨ Blessed',
        image: '/images/candles/marian_glow.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Under Our Lady\'s protection'
    },
    '7_days': {
        label: 'Sacred Altar',
        days: 7,
        color: 'from-amber-300 to-amber-500',
        icon: Star,
        badge: '⛪ Sacred',
        image: '/images/candles/altar.png',
        tierLabel: 'Premium',
        spiritualMessage: 'Carried to the altar of God'
    },
    '3_days': {
        label: 'Devotion Votive',
        days: 3,
        color: 'from-red-400 to-red-600',
        icon: Sparkles,
        badge: '',
        image: '/images/candles/devotion_glow.png',
        tierLabel: 'Standard',
        spiritualMessage: 'A sincere offering'
    },
    '1_day': {
        label: 'Humble Prayer',
        days: 1,
        color: 'from-gray-400 to-gray-500',
        icon: Flame,
        badge: '',
        image: '/images/candles/humble.png',
        tierLabel: 'Free',
        spiritualMessage: 'A simple prayer'
    },
};

export const SAMPLE_CANDLES: Candle[] = [
    // 30-day Divine Cathedral
    { id: 'sample-1', userName: 'Maria S.', intention: "For my mother's healing from cancer", remainingHours: 720, prayerCount: 342, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'US' },
    { id: 'sample-2', userName: 'Anonymous', intention: 'Thanksgiving for answered prayers', remainingHours: 650, prayerCount: 289, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'MX' },
    { id: 'sample-1c', userName: 'Elena R.', intention: 'For the souls of my departed grandparents', remainingHours: 710, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'IT' },
    { id: 'sample-2c', userName: 'Joseph K.', intention: 'Blessing for our new parish building', remainingHours: 690, prayerCount: 204, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS', country: 'PH' },
    { id: 'sample-3c', userName: 'Anonymous', intention: 'For the global return to faith', remainingHours: 680, prayerCount: 188, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
    { id: 'sample-4c', userName: 'Theresa L.', intention: 'In honor of the Sacred Heart', remainingHours: 720, prayerCount: 95, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
    { id: 'sample-5c', userName: 'Anonymous', intention: 'For all holy priests', remainingHours: 715, prayerCount: 42, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },
    { id: 'sample-6c', userName: 'Mark A.', intention: 'Preparation for my pilgrimage', remainingHours: 705, prayerCount: 77, tier: 'premium', litAt: new Date().toISOString(), duration: 'THIRTY_DAYS' },

    // 14-day Blessed Marian
    { id: 'sample-3', userName: 'John M.', intention: 'Guidance for my family during difficult times', remainingHours: 310, prayerCount: 156, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'CA' },
    { id: 'sample-4', userName: 'Sarah K.', intention: 'For peace in our troubled world', remainingHours: 280, prayerCount: 198, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'GB' },
    { id: 's-m-1', userName: 'Catherine B.', intention: "Under Mary's mantle for my children", remainingHours: 330, prayerCount: 45, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'IE' },
    { id: 's-m-2', userName: 'Anonymous', intention: 'To overcome my current anxiety', remainingHours: 320, prayerCount: 67, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
    { id: 's-m-3', userName: 'Paul S.', intention: 'For a successful surgery next week', remainingHours: 315, prayerCount: 32, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'US' },
    { id: 's-m-4', userName: 'Mary L.', intention: 'In honor of the Immaculate Heart', remainingHours: 300, prayerCount: 89, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'PT' },
    { id: 's-m-5', userName: 'Anonymous', intention: 'For the conversion of my spouse', remainingHours: 290, prayerCount: 54, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS' },
    { id: 's-m-6', userName: 'Robert T.', intention: 'Safe travel for my daughter', remainingHours: 270, prayerCount: 23, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'AU' },
    { id: 's-m-7', userName: 'Sofia G.', intention: 'For all expectant mothers', remainingHours: 260, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'FOURTEEN_DAYS', country: 'AR' },

    // 7-day Sacred Altar
    { id: 'sample-6', userName: 'Anonymous', intention: 'Blessings for my new job', remainingHours: 120, prayerCount: 64, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 'sample-7', userName: 'Emily W.', intention: 'For the souls in purgatory', remainingHours: 98, prayerCount: 112, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-1', userName: 'Mark D.', intention: 'In reparation for sins', remainingHours: 160, prayerCount: 22, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-2', userName: 'Anne P.', intention: "For my godchildren's faith", remainingHours: 155, prayerCount: 34, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-3', userName: 'Anonymous', intention: 'For the holy souls of priests', remainingHours: 150, prayerCount: 56, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-4', userName: 'Francis X.', intention: 'Success of the local mission', remainingHours: 145, prayerCount: 18, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-5', userName: 'Teresa M.', intention: 'For the terminally ill', remainingHours: 140, prayerCount: 92, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-6', userName: 'Anonymous', intention: 'For the Unity of the Church', remainingHours: 130, prayerCount: 41, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },
    { id: 's-a-7', userName: 'Benedict L.', intention: 'For holy vocations', remainingHours: 125, prayerCount: 120, tier: 'premium', litAt: new Date().toISOString(), duration: 'SEVEN_DAYS' },

    // 3-day Devotion Votive
    { id: 's-v1', userName: 'Michael P.', intention: 'Help with finding employment', remainingHours: 65, prayerCount: 43, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },
    { id: 's-v2', userName: 'Lisa T.', intention: "For my father's surgery tomorrow", remainingHours: 58, prayerCount: 71, tier: 'standard', litAt: new Date().toISOString(), duration: 'THREE_DAYS' },

    // 1-day Humble Prayer
    { id: 's-h1', userName: 'Grace L.', intention: "Today's challenges at work", remainingHours: 18, prayerCount: 12, tier: 'free', litAt: new Date().toISOString(), duration: 'ONE_DAY' },
];
