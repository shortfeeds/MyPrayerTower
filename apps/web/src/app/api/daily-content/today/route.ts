
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const dailyContent = await db.dailyContent.findUnique({
            where: { date: today },
            include: { saint: true }
        });

        if (dailyContent) {
            return NextResponse.json({
                saint: dailyContent.saint,
                reading: {
                    title: dailyContent.readingTitle,
                    reference: dailyContent.readingReference,
                    text: dailyContent.readingText
                },
                quote: {
                    text: dailyContent.quoteText,
                    author: dailyContent.quoteAuthor
                }
            });
        }

        return NextResponse.json({ error: 'No content for today' }, { status: 404 });

    } catch (error) {
        console.error('Error fetching daily content:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
