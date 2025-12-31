
import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { parse } from 'node-html-parser';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const date = dateParam ? new Date(dateParam) : new Date();

    // USCCB URL format: https://bible.usccb.org/bible/readings/MMDDYY.cfm
    const month = format(date, 'MM');
    const day = format(date, 'dd');
    const year = format(date, 'yy');
    const usccbUrl = `https://bible.usccb.org/bible/readings/${month}${day}${year}.cfm`;

    try {
        const response = await fetch(usccbUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from USCCB: ${response.status}`);
        }

        const html = await response.text();
        const root = parse(html);

        // 1. Extract Title (Season/Feast) - typically in h2.name or similar
        const titleEl = root.querySelector('h2.name') || root.querySelector('.name');
        const title = titleEl?.text.trim() || 'Daily Readings';

        // 2. Find all reading blocks
        // USCCB uses class "b-verse" for verse blocks and "content-body" as wrapper
        // But the actual readings are in ".node-section" or similar
        // Each reading section starts with an h3 header

        const readings: { type: string; citation: string; text: string }[] = [];

        // Find the main content area - look for the readings container
        // Try multiple selectors
        const contentArea = root.querySelector('.region-content')
            || root.querySelector('.content-body')
            || root.querySelector('main');

        if (contentArea) {
            // Find all h3 headers which represent reading types
            const allElements = contentArea.querySelectorAll('h3, h4, p, .address, .poetry, .prose, .b-verse');

            let currentReading: { type: string; citation: string; text: string } | null = null;
            let textParts: string[] = [];

            for (const el of allElements) {
                const tagName = el.tagName?.toUpperCase();

                if (tagName === 'H3' || tagName === 'H4') {
                    // Save previous reading if exists
                    if (currentReading && textParts.length > 0) {
                        currentReading.text = textParts.join('\n\n');
                        readings.push(currentReading);
                    }

                    // Start new reading
                    currentReading = {
                        type: el.text.trim(),
                        citation: '',
                        text: ''
                    };
                    textParts = [];
                } else if (currentReading) {
                    // Check if this is a citation/address
                    if (el.classNames?.includes('address') || el.tagName === 'A') {
                        const citationText = el.text.trim();
                        if (citationText && !currentReading.citation) {
                            currentReading.citation = citationText;
                        }
                    } else {
                        // Collect text content
                        const text = el.text.trim();
                        if (text && text.length > 10) { // Filter out tiny fragments
                            textParts.push(text);
                        }
                    }
                }
            }

            // Don't forget the last reading
            if (currentReading && textParts.length > 0) {
                currentReading.text = textParts.join('\n\n');
                readings.push(currentReading);
            }
        }

        // Fallback: Try extracting from specific USCCB classes
        if (readings.length === 0) {
            // Look for .b-reading blocks directly
            const readingBlocks = root.querySelectorAll('.b-reading, .node--type-reading');

            readingBlocks.forEach((block, idx) => {
                const header = block.querySelector('h3, h4, .field--name-title');
                const citation = block.querySelector('.address, .field--name-field-reading');
                const content = block.querySelector('.poetry, .prose, .field--name-body');

                readings.push({
                    type: header?.text.trim() || `Reading ${idx + 1}`,
                    citation: citation?.text.trim() || '',
                    text: content?.text.trim() || block.text.trim()
                });
            });
        }

        // Ultimate fallback
        if (readings.length === 0) {
            // Just grab the main text content
            const mainText = contentArea?.text.trim() || root.querySelector('body')?.text.trim() || '';
            readings.push({
                type: "Daily Readings",
                citation: "Source: USCCB",
                text: mainText.substring(0, 5000) // Limit to prevent huge responses
            });
        }

        return NextResponse.json({
            date: format(date, 'yyyy-MM-dd'),
            season: title,
            title: title,
            readings,
            sourceUrl: usccbUrl
        });

    } catch (error) {
        console.error('Scraper Error:', error);
        return NextResponse.json({
            date: format(date, 'yyyy-MM-dd'),
            season: "Error",
            title: "Error fetching readings",
            readings: [{
                type: "Error",
                citation: "",
                text: "Unable to load readings at this time. Please try again later or visit USCCB.org directly."
            }],
            sourceUrl: usccbUrl
        }, { status: 500 });
    }
}
