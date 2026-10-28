import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const results: Record<string, any> = {};

        // 1. Clean test/dummy candles
        const deletedCandles = await db.prayerCandle.deleteMany({
            where: {
                OR: [
                    { intention: { contains: 'test', mode: 'insensitive' } },
                    { intention: { contains: 'dummy', mode: 'insensitive' } },
                    { intention: { contains: 'sample', mode: 'insensitive' } },
                    { name: { contains: 'test', mode: 'insensitive' } },
                    { email: { contains: 'test', mode: 'insensitive' } },
                    { email: { contains: 'example', mode: 'insensitive' } },
                ]
            }
        });
        results.deletedCandles = deletedCandles.count;

        // 2. Clean test/dummy donations
        const deletedDonations = await db.platformDonation.deleteMany({
            where: {
                OR: [
                    { donorName: { contains: 'test', mode: 'insensitive' } },
                    { donorName: { contains: 'dummy', mode: 'insensitive' } },
                    { donorEmail: { contains: 'test', mode: 'insensitive' } },
                    { donorEmail: { contains: 'example', mode: 'insensitive' } },
                    { message: { contains: 'test', mode: 'insensitive' } },
                ]
            }
        });
        results.deletedDonations = deletedDonations.count;

        // 3. Clean test/dummy Mass offerings
        const deletedMassOfferings = await db.massOffering.deleteMany({
            where: {
                OR: [
                    { intention: { contains: 'test', mode: 'insensitive' } },
                    { intention: { contains: 'dummy', mode: 'insensitive' } },
                    { intention: { contains: 'sample', mode: 'insensitive' } },
                    { donorEmail: { contains: 'test', mode: 'insensitive' } },
                    { donorEmail: { contains: 'example', mode: 'insensitive' } },
                ]
            }
        });
        results.deletedMassOfferings = deletedMassOfferings.count;

        // 4. Clean test/dummy prayer requests
        const deletedPrayers = await db.prayerRequest.deleteMany({
            where: {
                OR: [
                    { title: { contains: 'test', mode: 'insensitive' } },
                    { title: { contains: 'dummy', mode: 'insensitive' } },
                    { title: { contains: 'sample', mode: 'insensitive' } },
                    { content: { contains: 'test', mode: 'insensitive' } },
                ]
            }
        });
        results.deletedPrayers = deletedPrayers.count;

        // 5. Clean test users (NEVER delete admin users)
        const deletedUsers = await db.user.deleteMany({
            where: {
                AND: [
                    { email: { notIn: ['myprayertower2@gmail.com', 'admin@myprayertower.com'] } },
                    {
                        OR: [
                            { email: { contains: 'test', mode: 'insensitive' } },
                            { email: { contains: 'dummy', mode: 'insensitive' } },
                            { email: { contains: 'example.com', mode: 'insensitive' } },
                            { firstName: { contains: 'test', mode: 'insensitive' } },
                        ]
                    }
                ]
            }
        });
        results.deletedUsers = deletedUsers.count;

        return NextResponse.json({
            success: true,
            message: 'All dummy and test data successfully removed from database',
            results
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const counts = {
            candles: await db.prayerCandle.count(),
            donations: await db.platformDonation.count(),
            massOfferings: await db.massOffering.count(),
            prayers: await db.prayerRequest.count(),
            users: await db.user.count(),
            adminUsers: await db.adminUser.count(),
            churches: await db.church.count(),
            saints: await db.saint.count(),
        };
        return NextResponse.json({ success: true, counts });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
