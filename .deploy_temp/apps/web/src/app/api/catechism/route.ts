/**
 * Catechism API Endpoint
 * Provides search and browse functionality for the Catechism of the Catholic Church
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Catechism structure outline for browsing
const CCC_STRUCTURE = {
    parts: [
        {
            number: 1,
            title: "The Profession of Faith",
            sections: [
                { number: 1, title: "I Believe - We Believe", paragraphs: "26-184" },
                { number: 2, title: "The Profession of the Christian Faith", paragraphs: "185-1065" },
            ],
        },
        {
            number: 2,
            title: "The Celebration of the Christian Mystery",
            sections: [
                { number: 1, title: "The Sacramental Economy", paragraphs: "1066-1209" },
                { number: 2, title: "The Seven Sacraments of the Church", paragraphs: "1210-1690" },
            ],
        },
        {
            number: 3,
            title: "Life in Christ",
            sections: [
                { number: 1, title: "Man's Vocation: Life in the Spirit", paragraphs: "1691-2051" },
                { number: 2, title: "The Ten Commandments", paragraphs: "2052-2557" },
            ],
        },
        {
            number: 4,
            title: "Christian Prayer",
            sections: [
                { number: 1, title: "Prayer in the Christian Life", paragraphs: "2558-2758" },
                { number: 2, title: "The Lord's Prayer", paragraphs: "2759-2865" },
            ],
        },
    ],
};

// Common catechism topics for quick access
const POPULAR_TOPICS = [
    { topic: "Eucharist", paragraphs: "1322-1419" },
    { topic: "Baptism", paragraphs: "1213-1284" },
    { topic: "Confirmation", paragraphs: "1285-1321" },
    { topic: "Confession", paragraphs: "1420-1498" },
    { topic: "Marriage", paragraphs: "1601-1666" },
    { topic: "Holy Orders", paragraphs: "1536-1600" },
    { topic: "Anointing of the Sick", paragraphs: "1499-1535" },
    { topic: "Trinity", paragraphs: "232-267" },
    { topic: "Creation", paragraphs: "279-354" },
    { topic: "Angels", paragraphs: "328-336" },
    { topic: "Original Sin", paragraphs: "385-421" },
    { topic: "Mary", paragraphs: "484-511, 963-975" },
    { topic: "The Mass", paragraphs: "1322-1419" },
    { topic: "Ten Commandments", paragraphs: "2052-2557" },
    { topic: "Prayer", paragraphs: "2558-2865" },
    { topic: "Our Father", paragraphs: "2759-2865" },
    { topic: "Beatitudes", paragraphs: "1716-1729" },
    { topic: "Mortal Sin", paragraphs: "1854-1864" },
    { topic: "Heaven", paragraphs: "1023-1029" },
    { topic: "Purgatory", paragraphs: "1030-1032" },
    { topic: "Hell", paragraphs: "1033-1037" },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const paragraph = searchParams.get('paragraph');
    const part = searchParams.get('part');
    const browse = searchParams.get('browse');
    const topics = searchParams.get('topics');

    try {
        // Get structure for browsing
        if (browse === 'true') {
            return NextResponse.json({
                structure: CCC_STRUCTURE,
                totalParagraphs: 2865,
            });
        }

        // Get popular topics
        if (topics === 'true') {
            return NextResponse.json({
                topics: POPULAR_TOPICS,
            });
        }

        // Get specific paragraph
        if (paragraph) {
            const paragraphNum = parseInt(paragraph);
            if (isNaN(paragraphNum) || paragraphNum < 1 || paragraphNum > 2865) {
                return NextResponse.json(
                    { error: 'Invalid paragraph number. Must be 1-2865.' },
                    { status: 400 }
                );
            }

            // Try to get from database
            try {
                const dbParagraph = await db.catechismParagraph.findUnique({
                    where: { number: paragraphNum },
                });

                if (dbParagraph) {
                    return NextResponse.json(dbParagraph);
                }
            } catch {
                // Database might not have catechism data yet
            }

            // Return placeholder with link to Vatican source
            return NextResponse.json({
                number: paragraphNum,
                content: null,
                message: "Catechism data is being imported. Please check back later.",
                sourceUrl: `https://www.vatican.va/archive/ENG0015/__P${Math.floor(paragraphNum / 100) + 1}.HTM`,
            });
        }

        // Search catechism
        if (query) {
            // Try database search
            try {
                const results = await db.catechismParagraph.findMany({
                    where: {
                        content: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    take: 20,
                    orderBy: { number: 'asc' },
                });

                if (results.length > 0) {
                    return NextResponse.json({
                        query,
                        count: results.length,
                        results,
                    });
                }
            } catch {
                // Database might not have catechism data yet
            }

            // Find relevant topics based on query
            const matchingTopics = POPULAR_TOPICS.filter(t =>
                t.topic.toLowerCase().includes(query.toLowerCase())
            );

            return NextResponse.json({
                query,
                count: 0,
                message: "Full text search will be available after catechism data import.",
                relatedTopics: matchingTopics,
                searchUrl: `https://www.vatican.va/archive/ENG0015/_INDEX.HTM`,
            });
        }

        // Get paragraphs by part
        if (part) {
            const partNum = parseInt(part);
            if (isNaN(partNum) || partNum < 1 || partNum > 4) {
                return NextResponse.json(
                    { error: 'Invalid part number. Must be 1-4.' },
                    { status: 400 }
                );
            }

            const partData = CCC_STRUCTURE.parts.find(p => p.number === partNum);
            return NextResponse.json({
                part: partNum,
                ...partData,
            });
        }

        // Default: return overview
        return NextResponse.json({
            title: "Catechism of the Catholic Church",
            description: "The official summary of Catholic doctrine on faith and morals.",
            structure: CCC_STRUCTURE,
            popularTopics: POPULAR_TOPICS.slice(0, 10),
            totalParagraphs: 2865,
        });

    } catch (error) {
        console.error('Catechism API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch catechism data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
