
import { NextResponse } from 'next/server';
import {
    searchKnowledgeBase,
    getCatechismParagraph,
    getCanonLaw
} from '@/lib/knowledge-base';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const source = searchParams.get('source'); // CCC, Canon, GIRM
    const id = searchParams.get('id'); // Number

    try {
        // Search
        if (query) {
            const results = await searchKnowledgeBase(query);
            return NextResponse.json({
                query,
                count: results.length,
                results
            });
        }

        // Fetch Specific Item
        if (source && id) {
            const num = parseInt(id);
            if (isNaN(num)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

            let data;
            if (source === 'CCC') {
                data = await getCatechismParagraph(num);
            } else if (source === 'Canon') {
                data = await getCanonLaw(num);
            } else {
                return NextResponse.json({ error: 'Invalid Source' }, { status: 400 });
            }

            if (!data) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });

    } catch (error) {
        console.error('Documents API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
