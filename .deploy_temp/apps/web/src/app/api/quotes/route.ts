/**
 * Daily Quotes API Endpoint
 * Returns the quote of the day or random quotes
 */

import { NextResponse } from 'next/server';
import { getDailyQuote, getRandomQuote, getQuotesByCategory } from '@/lib/motivational';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const category = searchParams.get('category');
    const random = searchParams.get('random');

    try {
        // Random quote
        if (random === 'true') {
            const quote = getRandomQuote();
            return NextResponse.json(quote);
        }

        // Quotes by category
        if (category) {
            const quotes = getQuotesByCategory(category);
            return NextResponse.json({
                category,
                count: quotes.length,
                quotes,
            });
        }

        // Daily quote (default)
        const date = dateParam ? new Date(dateParam) : new Date();

        if (isNaN(date.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD.' },
                { status: 400 }
            );
        }

        const quote = await getDailyQuote(date);

        return NextResponse.json({
            date: date.toISOString().split('T')[0],
            ...quote,
        }, {
            headers: {
                // Cache for 1 hour
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });

    } catch (error) {
        console.error('Quotes API Error:', error);

        // Fallback to random quote
        const fallbackQuote = getRandomQuote();
        return NextResponse.json({
            date: new Date().toISOString().split('T')[0],
            ...fallbackQuote,
            _fallback: true,
        });
    }
}
