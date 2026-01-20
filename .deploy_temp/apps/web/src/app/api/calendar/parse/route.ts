export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import ICAL from 'ical.js';

interface ParsedEvent {
    uid: string;
    title: string;
    description?: string;
    location?: string;
    start: string;
    end?: string;
    allDay: boolean;
    url?: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const calendarUrl = searchParams.get('url');

        if (!calendarUrl) {
            return NextResponse.json({ error: 'Calendar URL required' }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(calendarUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        // Fetch the iCal data
        const response = await fetch(calendarUrl, {
            headers: {
                'Accept': 'text/calendar, application/ics',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 502 });
        }

        const icalData = await response.text();

        // Parse the iCal data
        const jcalData = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const events: ParsedEvent[] = vevents.map(vevent => {
            const event = new ICAL.Event(vevent);

            const startDate = event.startDate;
            const endDate = event.endDate;

            // Check if it's an all-day event
            const allDay = startDate.isDate;

            return {
                uid: event.uid || '',
                title: event.summary || 'Untitled Event',
                description: event.description || undefined,
                location: event.location || undefined,
                start: startDate.toJSDate().toISOString(),
                end: endDate ? endDate.toJSDate().toISOString() : undefined,
                allDay,
                url: vevent.getFirstPropertyValue('url')?.toString() || undefined,
            };
        });

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error parsing calendar:', error);
        return NextResponse.json(
            { error: 'Failed to parse calendar data' },
            { status: 500 }
        );
    }
}
