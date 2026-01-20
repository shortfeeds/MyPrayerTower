import { NextResponse } from 'next/server';
import { getVerseOfTheDay } from '@/data/bible-books';

export async function GET() {
    const verse = getVerseOfTheDay();

    // Format the reference nicely
    const bookName = verse.book.charAt(0).toUpperCase() + verse.book.slice(1);

    return NextResponse.json({
        book: verse.book,
        bookName,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        reference: `${bookName} ${verse.chapter}:${verse.verse}`
    });
}
