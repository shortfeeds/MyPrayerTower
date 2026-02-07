
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Try to fetch scheduled content for today
        const dailyContent = await db.dailyContent.findUnique({
            where: { date: today }
        });

        if (dailyContent && (dailyContent.readingTitle || dailyContent.readingText)) {
            return NextResponse.json({
                reading: {
                    title: dailyContent.readingTitle || 'Daily Gospel',
                    reference: dailyContent.readingReference || '',
                    text: dailyContent.readingText || ''
                }
            });
        }

        // 2. Fallback: Return a generic or rotating reading
        // In a real app we might fetch from a 3rd party API (USCCB) for liturgical correctness.
        // For now, we return a fallback placeholder that the frontend handles gracefully or fetches externally.

        return NextResponse.json({
            reading: {
                title: 'Gospel of the Day',
                reference: 'Matthew 5:1-12', // Beatitudes as a nice default
                text: 'Seeing the crowds, he went up on the mountain, and when he sat down, his disciples came to him...'
            }
        });

    } catch (error) {
        console.error('Error fetching reading of the day:', error);
        return NextResponse.json({
            reading: {
                title: 'Gospel of the Day',
                reference: 'Matthew 5:3-10',
                text: 'Blessed are the poor in spirit...'
            }
        });
    }
}
