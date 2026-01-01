import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
                    maintenanceMode: false,
                    registrationEnabled: true,
                    prayerWallEnabled: true,
                    syncEnabled: true,
                    syncSchedule: '0 2 * * 0',
                    plusMonthlyPrice: 499,
                    plusYearlyPrice: 3999,
                    premiumMonthlyPrice: 999,
                    premiumYearlyPrice: 7999,
                    lifetimePrice: 14999
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

        // Only extract fields that exist in AppSettings model
        const validFields = {
            siteName: settings.appName || settings.siteName || 'MyPrayerTower',
            siteTagline: settings.tagline || settings.siteTagline || 'All-in-One Catholic Services',
            maintenanceMode: settings.maintenanceMode ?? false,
            registrationEnabled: settings.registrationEnabled ?? true,
            prayerWallEnabled: settings.enablePrayerWall ?? settings.prayerWallEnabled ?? true,
            syncEnabled: settings.syncEnabled ?? true,
            syncSchedule: settings.syncSchedule || '0 2 * * 0',
            plusMonthlyPrice: settings.plusMonthlyPrice ?? 499,
            plusYearlyPrice: settings.plusYearlyPrice ?? 3999,
            premiumMonthlyPrice: settings.premiumMonthlyPrice ?? 999,
            premiumYearlyPrice: settings.premiumYearlyPrice ?? 7999,
            lifetimePrice: settings.lifetimePrice ?? 14999,
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

        return NextResponse.json({ success: true, settings: updatedSettings });
    } catch (error: any) {
        console.error('Settings PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update settings', message: error.message }, { status: 500 });
    }
}
