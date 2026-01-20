
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const book = searchParams.get('book') || 'The Way';
    const number = searchParams.get('number');
    const daily = searchParams.get('daily') === 'true';
    const all = searchParams.get('all') === 'true';

    try {
        if (daily) {
            // Get a rotating daily point based on today's date
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 0);
            const diff = (today.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
            const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

            // We have 50 points currently, so we'll mod by 50
            const pointNumber = (dayOfYear % 50) + 1;

            const point = await db.devotionalPoint.findUnique({
                where: {
                    book_number: {
                        book,
                        number: pointNumber
                    }
                }
            });

            return NextResponse.json(point);
        }

        if (all) {
            const points = await db.devotionalPoint.findMany({
                where: { book },
                orderBy: { number: 'asc' }
            });
            return NextResponse.json(points);
        }

        if (number) {
            const num = parseInt(number);
            const point = await db.devotionalPoint.findUnique({
                where: {
                    book_number: {
                        book,
                        number: num
                    }
                }
            });
            return NextResponse.json(point);
        }

        // Default: return list or info
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    } catch (error) {
        console.error('Devotionals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
