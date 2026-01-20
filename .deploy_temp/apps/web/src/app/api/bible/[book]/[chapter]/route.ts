import { NextRequest, NextResponse } from 'next/server';
import { getBookById } from '@/data/bible-books';

const BIBLE_API_BASE = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';

export async function GET(
    request: NextRequest,
    { params }: { params: { book: string; chapter: string } }
) {
    try {
        const book = params.book;
        const chapter = params.chapter;
        const version = request.nextUrl.searchParams.get('version') || 'en-kjv';

        console.log('Bible API called:', { book, chapter, version });

        // Validate book exists
        const bookInfo = getBookById(book);
        if (!bookInfo) {
            console.log('Book not found:', book);
            return NextResponse.json({ error: 'Book not found', book }, { status: 404 });
        }

        // Validate chapter number
        const chapterNum = parseInt(chapter);
        if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookInfo.chapters) {
            console.log('Invalid chapter:', chapter);
            return NextResponse.json({
                error: `Invalid chapter. ${bookInfo.name} has ${bookInfo.chapters} chapters.`,
            }, { status: 400 });
        }

        // Fetch from wldeh/bible-api CDN
        const url = `${BIBLE_API_BASE}/${version}/books/${book}/chapters/${chapter}.json`;
        console.log('Fetching:', url);

        const response = await fetch(url);
        console.log('CDN response status:', response.status);

        if (!response.ok) {
            return NextResponse.json({
                error: `CDN returned ${response.status}`,
                url
            }, { status: 502 });
        }

        const rawData = await response.json();
        console.log('Raw data keys:', Object.keys(rawData));

        // Extract verses from the data array
        const versesArray = rawData.data || rawData;

        // Format and deduplicate verses
        const seen = new Set<number>();
        const verses = (Array.isArray(versesArray) ? versesArray : [])
            .map((v: any) => ({
                verse: parseInt(v.verse) || 1,
                text: String(v.text || '')
            }))
            .filter((v: any) => {
                if (seen.has(v.verse)) return false;
                seen.add(v.verse);
                return true;
            })
            .sort((a: any, b: any) => a.verse - b.verse);

        console.log('Parsed verses count:', verses.length);

        return NextResponse.json({
            book,
            bookName: bookInfo.name,
            chapter: chapterNum,
            totalChapters: bookInfo.chapters,
            version,
            verses,
            hasPrevious: chapterNum > 1,
            hasNext: chapterNum < bookInfo.chapters,
            previousChapter: chapterNum > 1 ? chapterNum - 1 : null,
            nextChapter: chapterNum < bookInfo.chapters ? chapterNum + 1 : null
        });

    } catch (error: any) {
        console.error('Bible API Error:', error);
        return NextResponse.json({
            error: 'Server error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
