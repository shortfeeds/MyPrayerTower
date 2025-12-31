import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

/**
 * AdMob Banner Component for React Native
 * 
 * This component wraps react-native-google-mobile-ads for displaying banner ads.
 * Install the package first: npm install react-native-google-mobile-ads
 * 
 * Usage:
 * ```tsx
 * import { AdBanner } from '@/components/AdBanner';
 * 
 * // In your component:
 * <AdBanner size="BANNER" adUnitId="ca-app-pub-xxx/yyy" />
 * ```
 */

// Ad sizes available
export type AdSize = 'BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE' | 'FULL_BANNER' | 'LEADERBOARD';

interface AdBannerProps {
    /** AdMob ad unit ID - use TestIds.BANNER for development */
    adUnitId?: string;
    /** Size of the banner ad */
    size?: AdSize;
    /** Additional container style */
    style?: any;
    /** Called when ad fails to load */
    onAdFailedToLoad?: (error: any) => void;
}

// Test IDs for development
export const TestAdUnitIds = {
    BANNER: Platform.select({
        ios: 'ca-app-pub-3940256099942544/2934735716',
        android: 'ca-app-pub-3940256099942544/6300978111',
    }) || 'ca-app-pub-3940256099942544/6300978111',
};

// Ad size dimensions
const AD_DIMENSIONS: Record<AdSize, { width: number; height: number }> = {
    BANNER: { width: 320, height: 50 },
    LARGE_BANNER: { width: 320, height: 100 },
    MEDIUM_RECTANGLE: { width: 300, height: 250 },
    FULL_BANNER: { width: 468, height: 60 },
    LEADERBOARD: { width: 728, height: 90 },
};

/**
 * AdMob Banner Component
 * 
 * Note: Requires react-native-google-mobile-ads to be installed and configured.
 * This is a placeholder that shows ad dimensions until the package is installed.
 */
export function AdBanner({
    adUnitId,
    size = 'BANNER',
    style,
    onAdFailedToLoad,
}: AdBannerProps) {
    const dimensions = AD_DIMENSIONS[size];
    const isTest = __DEV__;
    const unitId = adUnitId || TestAdUnitIds.BANNER;

    // Try to import the actual AdMob component
    try {
        // This will be replaced with actual implementation once the package is installed
        const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');

        const adSize = {
            BANNER: BannerAdSize.BANNER,
            LARGE_BANNER: BannerAdSize.LARGE_BANNER,
            MEDIUM_RECTANGLE: BannerAdSize.MEDIUM_RECTANGLE,
            FULL_BANNER: BannerAdSize.FULL_BANNER,
            LEADERBOARD: BannerAdSize.LEADERBOARD,
        }[size];

        return (
            <View style={[styles.container, style]}>
                <BannerAd
                    unitId={unitId}
                    size={adSize}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                    onAdFailedToLoad={onAdFailedToLoad}
                />
            </View>
        );
    } catch (e) {
        // Fallback placeholder when package not installed
        return (
            <View style={[styles.placeholder, { width: dimensions.width, height: dimensions.height }, style]}>
                <Text style={styles.placeholderText}>Ad ({size})</Text>
                <Text style={styles.placeholderSubtext}>
                    {isTest ? 'Install react-native-google-mobile-ads' : 'Loading...'}
                </Text>
            </View>
        );
    }
}

/**
 * Home screen bottom banner
 */
export function HomeBannerAd({ style }: { style?: any }) {
    return (
        <AdBanner
            size="BANNER"
            adUnitId={process.env.EXPO_PUBLIC_ADMOB_HOME_BANNER || TestAdUnitIds.BANNER}
            style={style}
        />
    );
}

/**
 * Inline ad for lists (every N items)
 */
export function InlineListAd({ style }: { style?: any }) {
    return (
        <AdBanner
            size="LARGE_BANNER"
            adUnitId={process.env.EXPO_PUBLIC_ADMOB_INLINE || TestAdUnitIds.BANNER}
            style={style}
        />
    );
}

/**
 * Content detail page ad
 */
export function ContentAd({ style }: { style?: any }) {
    return (
        <AdBanner
            size="MEDIUM_RECTANGLE"
            adUnitId={process.env.EXPO_PUBLIC_ADMOB_CONTENT || TestAdUnitIds.BANNER}
            style={style}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
    },
    placeholderSubtext: {
        fontSize: 10,
        color: '#d1d5db',
        marginTop: 2,
    },
});

export default AdBanner;
