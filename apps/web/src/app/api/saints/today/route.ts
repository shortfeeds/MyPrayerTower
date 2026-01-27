
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Try to fetch scheduled content for today
        const dailyContent = await db.dailyContent.findUnique({
            where: { date: today },
            include: { saint: true }
        });

        if (dailyContent?.saint) {
            return NextResponse.json({ saint: dailyContent.saint });
        }

        // 2. Fallback: Get a random saint or specific logic (e.g. based on Feast Day matches in DB if we had that field)
        // For now, let's get a random saint or the first one.
        const count = await db.saint.count();
        const skip = Math.floor(Math.random() * count);

        const [randomSaint] = await db.saint.findMany({
            take: 1,
            skip: skip
        });

        if (randomSaint) {
            return NextResponse.json({ saint: randomSaint });
        }

        // 3. Last Resort
        return NextResponse.json({
            saint: {
                name: 'St. Therese of Lisieux',
                feastDay: 'October 1',
                slug: 'st-therese'
            }
        });

    } catch (error) {
        console.error('Error fetching saint of the day:', error);
        return NextResponse.json({
            saint: {
                name: 'St. Therese of Lisieux',
                feastDay: 'October 1',
                slug: 'st-therese'
            }
        });
    }
}
