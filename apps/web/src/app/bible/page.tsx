
'use client';

import { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, BibleResponse } from '@/lib/bible-api';

export default function BiblePage() {
    const [book, setBook] = useState('Genesis');
    const [chapter, setChapter] = useState(1);

    // Data
    const [latinData, setLatinData] = useState<BibleResponse | null>(null);
    const [englishData, setEnglishData] = useState<BibleResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const books = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

    useEffect(() => {
        fetchData();
    }, [book, chapter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [latinRes, englishRes] = await Promise.all([
                fetch(`/api/bible?book=${book}&chapter=${chapter}&translation=clementine`),
                fetch(`/api/bible?book=${book}&chapter=${chapter}&translation=web`) // World English Bible
            ]);

            const latin = await latinRes.json();
            const english = await englishRes.json();

            setLatinData(latin);
            setEnglishData(english);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const nextChapter = () => setChapter(c => c + 1);
    const prevChapter = () => setChapter(c => Math.max(1, c - 1));

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header / Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-20 z-10">
                    <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-blue-600" />
                        <span className="font-serif font-bold text-xl">DuoBiblia</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={book}
                            onChange={(e) => { setBook(e.target.value); setChapter(1); }}
                            className="p-2 border rounded-lg bg-gray-50"
                        >
                            {books.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <span className="text-gray-400">Ch</span>
                        <input
                            type="number"
                            value={chapter}
                            onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
                            className="w-16 p-2 border rounded-lg bg-gray-50 text-center"
                            min="1"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={prevChapter} disabled={chapter <= 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextChapter} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading Scriptures...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Latin Column */}
                        <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
                            <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex justify-between items-center">
                                <h2 className="font-serif font-bold text-amber-900">Vulgata Clementina</h2>
                                <span className="text-xs font-mono text-amber-700 uppercase">Latin</span>
                            </div>
                            <div className="p-6 font-serif text-lg leading-relaxed text-gray-800 space-y-4">
                                {latinData?.verses?.map((verse) => (
                                    <div key={verse.verse} className="flex gap-2 group">
                                        <span className="text-xs font-bold text-amber-500 mt-1 select-none">{verse.verse}</span>
                                        <p>{verse.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* English Column */}
                        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center">
                                <h2 className="font-serif font-bold text-blue-900">English Translation</h2>
                                <span className="text-xs font-mono text-blue-700 uppercase">WEB</span>
                            </div>
                            <div className="p-6 font-sans text-lg leading-relaxed text-gray-800 space-y-4">
                                {englishData?.verses?.map((verse) => (
                                    <div key={verse.verse} className="flex gap-2 group">
                                        <span className="text-xs font-bold text-blue-500 mt-1 select-none">{verse.verse}</span>
                                        <p>{verse.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
