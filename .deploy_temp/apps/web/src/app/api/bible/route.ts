
import { NextResponse } from 'next/server';
import { getBiblePassage } from '@/lib/bible-api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const book = searchParams.get('book');
    const chapter = searchParams.get('chapter');
    const translation = searchParams.get('translation') as 'clementine' | 'web';

    if (!book || !chapter) {
        return NextResponse.json({ error: 'Book and Chapter are required' }, { status: 400 });
    }

    try {
        const reference = `${book} ${chapter}`;
        const data = await getBiblePassage(reference, translation || 'clementine');

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        console.error('Bible API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch bible passage' }, { status: 500 });
    }
}
