import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Cache for 60 seconds to reduce DB load but allow reasonably fast updates
export const revalidate = 60;

export async function GET() {
    try {
        const settings = await db.appSettings.findFirst({
            where: { id: 'app_settings' }
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
