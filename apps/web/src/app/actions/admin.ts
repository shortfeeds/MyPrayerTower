'use server';

import { PrismaClient } from '@mpt/database';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateAppSetting(key: string, value: boolean | string | number) {
    try {
        // Find or create settings document
        // Since we defined AppSettings with a fixed ID in schema, let's use that
        const id = 'app_settings';

        // We need to use dynamic update object
        const data: any = {};
        data[key] = value;

        await prisma.appSettings.upsert({
            where: { id },
            create: {
                id,
                ...data
            },
            update: data,
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update setting:', error);
        return { success: false, error: 'Database update failed' };
    }
}

export async function getAppSettings() {
    try {
        const settings = await prisma.appSettings.findUnique({
            where: { id: 'app_settings' },
        });

        // Return defaults if not found
        if (!settings) {
            return {
                maintenanceMode: false,
                registrationEnabled: true,
                prayerWallEnabled: true,
                syncEnabled: true,
                siteName: 'MyPrayerTower',
            };
        }

        return settings;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}
