import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await db.appSettings.findFirst({
            where: { id: 'app_settings' }
        });

        if (!settings) {
            // Return default settings if none exist
            return NextResponse.json({
                settings: {
                    siteName: 'MyPrayerTower',
                    siteTagline: 'All-in-One Catholic Services',

                    // Features
                    maintenanceMode: false,
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
                    syncEnabled: true,
                    syncSchedule: '0 2 * * 0',

                    // Subscription Pricing
                    plusMonthlyPrice: 499,
                    plusYearlyPrice: 3999,
                    premiumMonthlyPrice: 999,
                    premiumYearlyPrice: 7999,
                    lifetimePrice: 14999,

                    // Candle Pricing
                    candleOneDayPrice: 100,
                    candleThreeDayPrice: 300,
                    candleSevenDayPrice: 500,
                    candleThirtyDayPrice: 1500,

                    // Mass Offering Pricing
                    massRegularPrice: 1500,
                    massExpeditedPrice: 2500,
                    massNovenaPrice: 7500,
                    massGregorianPrice: 25000,
                    massPerpetualPrice: 10000,

                    // Spiritual Bouquet Pricing
                    bouquetBasePrice: 1000,
                    bouquetMassAddOn: 500,
                    bouquetCandleAddOn: 200,
                }
            });
        }

        return NextResponse.json({ settings });
    } catch (error: any) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { settings } = body;

        // Extract and validate all fields
        const validFields = {
            // General
            siteName: settings.siteName || 'MyPrayerTower',
            siteTagline: settings.siteTagline || 'All-in-One Catholic Services',

            // Features
            maintenanceMode: settings.maintenanceMode ?? false,
            registrationEnabled: settings.registrationEnabled ?? true,
            prayerWallEnabled: settings.prayerWallEnabled ?? true,
            candlesEnabled: settings.candlesEnabled ?? true,
            massOfferingsEnabled: settings.massOfferingsEnabled ?? true,
            donationsEnabled: settings.donationsEnabled ?? true,
            spiritualBouquetsEnabled: settings.spiritualBouquetsEnabled ?? true,
            challengesEnabled: settings.challengesEnabled ?? true,
            leaderboardEnabled: settings.leaderboardEnabled ?? true,
            nativeAdsEnabled: settings.nativeAdsEnabled ?? true,
            rewardedAdsEnabled: settings.rewardedAdsEnabled ?? true,
            syncEnabled: settings.syncEnabled ?? true,
            syncSchedule: settings.syncSchedule || '0 2 * * 0',

            // Subscription Pricing
            plusMonthlyPrice: settings.plusMonthlyPrice ?? 499,
            plusYearlyPrice: settings.plusYearlyPrice ?? 3999,
            premiumMonthlyPrice: settings.premiumMonthlyPrice ?? 999,
            premiumYearlyPrice: settings.premiumYearlyPrice ?? 7999,
            lifetimePrice: settings.lifetimePrice ?? 14999,

            // Candle Pricing
            candleOneDayPrice: settings.candleOneDayPrice ?? 100,
            candleThreeDayPrice: settings.candleThreeDayPrice ?? 300,
            candleSevenDayPrice: settings.candleSevenDayPrice ?? 500,
            candleThirtyDayPrice: settings.candleThirtyDayPrice ?? 1500,

            // Mass Offering Pricing
            massRegularPrice: settings.massRegularPrice ?? 1500,
            massExpeditedPrice: settings.massExpeditedPrice ?? 2500,
            massNovenaPrice: settings.massNovenaPrice ?? 7500,
            massGregorianPrice: settings.massGregorianPrice ?? 25000,
            massPerpetualPrice: settings.massPerpetualPrice ?? 10000,

            // Spiritual Bouquet Pricing
            bouquetBasePrice: settings.bouquetBasePrice ?? 1000,
            bouquetMassAddOn: settings.bouquetMassAddOn ?? 500,
            bouquetCandleAddOn: settings.bouquetCandleAddOn ?? 200,

            updatedAt: new Date()
        };

        const updatedSettings = await db.appSettings.upsert({
            where: { id: 'app_settings' },
            update: validFields,
            create: {
                id: 'app_settings',
                ...validFields
            }
        });

        // Revalidate all pages that might use these settings
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, settings: updatedSettings });
    } catch (error: any) {
        console.error('Settings PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update settings', message: error.message }, { status: 500 });
    }
}
