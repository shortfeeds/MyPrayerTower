import { NextResponse } from 'next/server';
import { BIBLE_BOOKS, getAllBooks } from '@/data/bible-books';

export async function GET() {
    return NextResponse.json({
        oldTestament: BIBLE_BOOKS.oldTestament,
        newTestament: BIBLE_BOOKS.newTestament,
        all: getAllBooks()
    });
}
