/**
 * Liturgical Calendar API Endpoint
 * Returns liturgical calendar data for a given date or date range
 * Supports both Ordinary Form (OF) and Extraordinary Form (EF/1962) rites
 */

import { NextResponse } from 'next/server';
import { getLiturgicalDay, getLiturgicalRange } from '@/lib/romcal';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    const rite = searchParams.get('rite') || 'OF'; // OF = Ordinary Form, EF = Extraordinary Form (1962)

    try {
        // If date range is specified
        if (startParam && endParam) {
            const startDate = new Date(startParam);
            const endDate = new Date(endParam);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return NextResponse.json(
                    { error: 'Invalid date range format. Use YYYY-MM-DD.' },
                    { status: 400 }
                );
            }

            // Limit range to 31 days
            const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 31) {
                return NextResponse.json(
                    { error: 'Date range cannot exceed 31 days.' },
                    { status: 400 }
                );
            }

            const days = await getLiturgicalRange(startDate, endDate);
            return NextResponse.json({
                range: {
                    start: startParam,
                    end: endParam,
                },
                days,
            });
        }

        // Single date (default to today)
        const date = dateParam ? new Date(dateParam) : new Date();

        if (isNaN(date.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD.' },
                { status: 400 }
            );
        }

        const liturgicalDay = await getLiturgicalDay(date);

        // Note: Full EF (1962) calendar support requires integration with a dedicated library
        // For now, we return OF data with a rite indicator
        return NextResponse.json({
            ...liturgicalDay,
            rite: rite,
            riteLabel: rite === 'EF' ? 'Extraordinary Form (1962)' : 'Ordinary Form',
        }, {
            headers: {
                // Cache for 1 hour (liturgical data is static per day)
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });

    } catch (error) {
        console.error('Liturgical Calendar API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch liturgical data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
