'use client';

import { useState, useEffect } from 'react';
import { getBiblePassage, BibleResponse, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '@/lib/bible-api';
import { ChevronLeft, ChevronRight, Book, Loader2, Search } from 'lucide-react';

export function BibleReader() {
    const [currentBook, setCurrentBook] = useState('Genesis');
    const [currentChapter, setCurrentChapter] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<BibleResponse | null>(null);
    const [error, setError] = useState('');
    const [showBookSelector, setShowBookSelector] = useState(false);

    // Fetch passage when book/chapter changes
    useEffect(() => {
        let isMounted = true;
        const fetchChapter = async () => {
            try {
                setLoading(true);
                setError('');
                console.log('Fetching Bible passage:', currentBook, currentChapter);
                const response = await getBiblePassage(`${currentBook} ${currentChapter}`);
                console.log('Bible response:', response);
                if (isMounted) {
                    setData(response);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Bible fetch error:', err);
                    setError('Failed to load scripture. Please check your connection.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchChapter();
        // Scroll to top on change
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return () => { isMounted = false; };
    }, [currentBook, currentChapter]);

    const handleNextChapter = () => {
        setCurrentChapter(p => p + 1);
    };

    const handlePrevChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(p => p - 1);
        }
    };

    const handleBookSelect = (book: string) => {
        setCurrentBook(book);
        setCurrentChapter(1);
        setShowBookSelector(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 sticky top-20 z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setShowBookSelector(!showBookSelector)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-900 font-serif font-bold transition-colors flex-1 md:flex-none text-left md:text-center justify-between md:justify-start"
                        >
                            <span className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-gold-600" />
                                {currentBook} {currentChapter}
                            </span>
                            <span className="text-gray-400 text-xs">▼</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                        <button
                            onClick={handlePrevChapter}
                            disabled={currentChapter <= 1 || loading}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                            aria-label="Previous Chapter"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-400 font-medium">
                            Chapter {currentChapter}
                        </span>
                        <button
                            onClick={handleNextChapter}
                            disabled={loading}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                            aria-label="Next Chapter"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Book Selector Dropdown */}
                {showBookSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-20 max-h-[70vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Old Testament</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {OLD_TESTAMENT_BOOKS.map(book => (
                                        <button
                                            key={book}
                                            onClick={() => handleBookSelect(book)}
                                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentBook === book ? 'bg-gold-50 text-gold-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            {book}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">New Testament</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {NEW_TESTAMENT_BOOKS.map(book => (
                                        <button
                                            key={book}
                                            onClick={() => handleBookSelect(book)}
                                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentBook === book ? 'bg-gold-50 text-gold-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            {book}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[500px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading scripture...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => setCurrentChapter(currentChapter)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="prose prose-lg max-w-none font-serif">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            {data?.reference}
                        </h2>

                        <div className="leading-loose text-gray-800">
                            {data?.verses.map((verse) => (
                                <span key={verse.verse} className="group relative">
                                    <sup className="text-[10px] text-gray-400 font-sans mr-1 select-none group-hover:text-gold-500 font-medium">
                                        {verse.verse}
                                    </sup>
                                    <span className="hover:bg-gold-50/50 transition-colors rounded px-0.5">
                                        {verse.text}{' '}
                                    </span>
                                </span>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400 font-sans">
                            {data?.translation_name}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
