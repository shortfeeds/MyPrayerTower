import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Cache for 60 seconds to reduce DB load but allow reasonably fast updates
export const revalidate = 60;

export async function GET() {
    try {
        const settings = await db.appSettings.findFirst({
            where: { id: 'app_settings' },
            select: {
                maintenanceMode: true,
                registrationEnabled: true,
                prayerWallEnabled: true,
                candlesEnabled: true,
                massOfferingsEnabled: true,
                donationsEnabled: true,
                spiritualBouquetsEnabled: true,
                challengesEnabled: true,
                leaderboardEnabled: true,
                nativeAdsEnabled: true,
                rewardedAdsEnabled: true,
                bannerAdUnitIdAndroid: true,
                bannerAdUnitIdiOS: true,
                interstitialAdUnitIdAndroid: true,
                interstitialAdUnitIdiOS: true,
                nativeAdUnitIdAndroid: true,
                nativeAdUnitIdiOS: true,
                rewardedAdUnitIdAndroid: true,
                rewardedAdUnitIdiOS: true,
                plusMonthlyPrice: true,
                plusYearlyPrice: true,
                premiumMonthlyPrice: true,
                premiumYearlyPrice: true,
                lifetimePrice: true,
                candleOneDayPrice: true,
                candleThreeDayPrice: true,
                candleSevenDayPrice: true,
                candleThirtyDayPrice: true,
                massRegularPrice: true,
                massExpeditedPrice: true,
                massNovenaPrice: true,
                massGregorianPrice: true,
                massPerpetualPrice: true,
                bouquetBasePrice: true,
                bouquetMassAddOn: true,
                bouquetCandleAddOn: true,
                siteName: true,
                siteTagline: true
            }
        });

        if (!settings) {
            return NextResponse.json({
                settings: {
                    siteName: 'MyPrayerTower',
                    maintenanceMode: false,
                    // Minimal defaults
                    plusMonthlyPrice: 499,
                    plusYearlyPrice: 3999,
                    premiumMonthlyPrice: 999,
                    premiumYearlyPrice: 7999,
                    candleOneDayPrice: 100,
                    massRegularPrice: 1500,
                    bouquetBasePrice: 1000,
                    candlesEnabled: true,
                    massOfferingsEnabled: true,
                    donationsEnabled: true,
                    spiritualBouquetsEnabled: true,
                    version: '1.0.0'
                }
            });
        }

        // Return public safe settings suitable for mobile app config
        return NextResponse.json({
            settings: {
                // Feature Flags
                maintenanceMode: settings.maintenanceMode,
                registrationEnabled: settings.registrationEnabled,
                prayerWallEnabled: settings.prayerWallEnabled,
                candlesEnabled: settings.candlesEnabled,
                massOfferingsEnabled: settings.massOfferingsEnabled,
                donationsEnabled: settings.donationsEnabled,
                spiritualBouquetsEnabled: settings.spiritualBouquetsEnabled,
                challengesEnabled: settings.challengesEnabled,
                leaderboardEnabled: settings.leaderboardEnabled,
                nativeAdsEnabled: settings.nativeAdsEnabled,
                rewardedAdsEnabled: settings.rewardedAdsEnabled,

                // AdMob Configuration
                adMob: {
                    android: {
                        banner: (settings as any).bannerAdUnitIdAndroid,
                        interstitial: (settings as any).interstitialAdUnitIdAndroid,
                        native: (settings as any).nativeAdUnitIdAndroid,
                        rewarded: (settings as any).rewardedAdUnitIdAndroid
                    },
                    ios: {
                        banner: (settings as any).bannerAdUnitIdiOS,
                        interstitial: (settings as any).interstitialAdUnitIdiOS,
                        native: (settings as any).nativeAdUnitIdiOS,
                        rewarded: (settings as any).rewardedAdUnitIdiOS
                    }
                },

                // Pricing Configuration
                prices: {
                    subscription: {
                        plusMonthly: settings.plusMonthlyPrice,
                        plusYearly: settings.plusYearlyPrice,
                        premiumMonthly: settings.premiumMonthlyPrice,
                        premiumYearly: settings.premiumYearlyPrice,
                        lifetime: settings.lifetimePrice
                    },
                    candles: {
                        oneDay: settings.candleOneDayPrice,
                        threeDay: settings.candleThreeDayPrice,
                        sevenDay: settings.candleSevenDayPrice,
                        thirtyDay: settings.candleThirtyDayPrice
                    },
                    masses: {
                        regular: settings.massRegularPrice,
                        expedited: settings.massExpeditedPrice,
                        novena: settings.massNovenaPrice,
                        gregorian: settings.massGregorianPrice,
                        perpetual: settings.massPerpetualPrice
                    },
                    bouquets: {
                        base: settings.bouquetBasePrice,
                        massAddOn: settings.bouquetMassAddOn,
                        candleAddOn: settings.bouquetCandleAddOn
                    }
                },

                // App Info
                appName: settings.siteName,
                tagline: settings.siteTagline
            }
        });
    } catch (error: any) {
        console.error('Public Settings API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
