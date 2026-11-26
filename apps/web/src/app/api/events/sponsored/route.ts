import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SETTING_KEY = 'sponsored_events_config';

const DEFAULT_CONFIG = {
    tonightSponsor: {
        family: 'The Rodriguez Family',
        dedication: 'In loving memory of Grandma Rosa',
        faithfulCount: 2847,
        eventTitle: "Tonight's Rosary Marathon",
    },
    automation: {
        dailyGospelPush: true,
        angelusBellsPush: true,
        divineMercyPush: true,
        candleExpiryAlerts: true,
        sponsoredEventAlerts: true,
        abandonedCartRecovery: true,
    },
    recentSponsors: [
        {
            id: 'sp_1',
            family: 'The Rodriguez Family',
            dedication: 'In loving memory of Grandma Rosa',
            packageTitle: 'Nightly Rosary Stream',
            amount: 25,
            createdAt: new Date().toISOString(),
        },
    ],
};

export async function GET() {
    try {
        const record = await db.systemSetting.findUnique({
            where: { key: SETTING_KEY },
        });
        if (record?.value) {
            const parsed = JSON.parse(record.value);
            return NextResponse.json({ success: true, config: { ...DEFAULT_CONFIG, ...parsed } });
        }
    } catch (err) {
        console.error('Failed to read sponsored events config:', err);
    }
    return NextResponse.json({ success: true, config: DEFAULT_CONFIG });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const existingRecord = await db.systemSetting.findUnique({
            where: { key: SETTING_KEY },
        }).catch(() => null);

        const current = existingRecord?.value
            ? { ...DEFAULT_CONFIG, ...JSON.parse(existingRecord.value) }
            : { ...DEFAULT_CONFIG };

        if (body.action === 'admin_update') {
            const updated = {
                ...current,
                tonightSponsor: body.tonightSponsor || current.tonightSponsor,
                automation: body.automation || current.automation,
            };
            await db.systemSetting.upsert({
                where: { key: SETTING_KEY },
                update: { value: JSON.stringify(updated) },
                create: { key: SETTING_KEY, value: JSON.stringify(updated) },
            });
            return NextResponse.json({ success: true, config: updated });
        }

        // Public new sponsorship submission (from Website or Android App)
        const newEntry = {
            id: `sp_${Date.now()}`,
            family: body.family || 'Faithful Family',
            dedication: body.dedication || 'In thanksgiving & protection of our family',
            packageTitle: body.packageTitle || 'Nightly Rosary Stream',
            amount: Number(body.amount || 25),
            createdAt: new Date().toISOString(),
        };

        const updated = {
            ...current,
            tonightSponsor: {
                ...current.tonightSponsor,
                family: newEntry.family,
                dedication: newEntry.dedication,
                faithfulCount: (current.tonightSponsor.faithfulCount || 2847) + 1,
            },
            recentSponsors: [newEntry, ...(current.recentSponsors || [])].slice(0, 25),
        };

        await db.systemSetting.upsert({
            where: { key: SETTING_KEY },
            update: { value: JSON.stringify(updated) },
            create: { key: SETTING_KEY, value: JSON.stringify(updated) },
        });

        return NextResponse.json({ success: true, config: updated });
    } catch (err: any) {
        console.error('Failed to update sponsored events:', err);
        return NextResponse.json({ success: false, message: err?.message || 'Error' }, { status: 500 });
    }
}
