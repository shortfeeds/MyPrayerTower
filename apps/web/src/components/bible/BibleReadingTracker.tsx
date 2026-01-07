'use client';

import { useState, useEffect } from 'react';
import { Book, Check, ChevronRight, Target, Award, Calendar, Flame, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface ReadingProgress {
    book: string;
    chapter: number;
    completed: boolean;
    date?: Date;
}

interface BibleStats {
    totalChapters: number;
    completedChapters: number;
    currentStreak: number;
    percentComplete: number;
    currentBook: string;
    currentChapter: number;
    daysRemaining?: number;
}

// Bible book info (simplified)
const BIBLE_BOOKS = [
    { name: 'Genesis', chapters: 50 },
    { name: 'Exodus', chapters: 40 },
    { name: 'Leviticus', chapters: 27 },
    { name: 'Numbers', chapters: 36 },
    { name: 'Deuteronomy', chapters: 34 },
    { name: 'Psalms', chapters: 150 },
    { name: 'Proverbs', chapters: 31 },
    { name: 'Matthew', chapters: 28 },
    { name: 'Mark', chapters: 16 },
    { name: 'Luke', chapters: 24 },
    { name: 'John', chapters: 21 },
    { name: 'Acts', chapters: 28 },
    { name: 'Romans', chapters: 16 },
    { name: 'Revelation', chapters: 22 },
];

const TOTAL_CHAPTERS = 1189; // Full Bible

/**
 * Bible reading progress tracker
 */
export function BibleReadingTracker() {
    const [stats, setStats] = useState<BibleStats>({
        totalChapters: TOTAL_CHAPTERS,
        completedChapters: 0,
        currentStreak: 0,
        percentComplete: 0,
        currentBook: 'Genesis',
        currentChapter: 1,
    });
    const [recentReadings, setRecentReadings] = useState<ReadingProgress[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-bible-progress');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                const completed = data.readings?.length || 0;
                setStats({
                    totalChapters: TOTAL_CHAPTERS,
                    completedChapters: completed,
                    currentStreak: data.streak || 0,
                    percentComplete: Math.round((completed / TOTAL_CHAPTERS) * 100),
                    currentBook: data.currentBook || 'Genesis',
                    currentChapter: data.currentChapter || 1,
                    daysRemaining: Math.ceil((TOTAL_CHAPTERS - completed) / 3),
                });
                setRecentReadings(data.readings?.slice(-5) || []);
            } catch (e) {
                console.error('Failed to parse Bible progress:', e);
            }
        }
    }, []);

    const markChapterRead = (book: string, chapter: number) => {
        const stored = localStorage.getItem('mpt-bible-progress');
        const data = stored ? JSON.parse(stored) : { readings: [], streak: 0 };

        // Add reading
        data.readings.push({
            book,
            chapter,
            completed: true,
            date: new Date().toISOString(),
        });

        // Update current position
        data.currentBook = book;
        data.currentChapter = chapter + 1;
        data.streak = data.streak + 1;

        localStorage.setItem('mpt-bible-progress', JSON.stringify(data));

        // Update state
        const completed = data.readings.length;
        setStats(prev => ({
            ...prev,
            completedChapters: completed,
            percentComplete: Math.round((completed / TOTAL_CHAPTERS) * 100),
            currentStreak: data.streak,
            currentBook: data.currentBook,
            currentChapter: data.currentChapter,
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header with overall progress */}
            <div className="bg-gradient-to-r from-sacred-600 to-sacred-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Book size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Bible Reading Progress</h3>
                            <p className="text-white/80 text-sm">Your journey through Scripture</p>
                        </div>
                    </div>
                    <Link
                        href="/bible/year"
                        className="flex items-center gap-1 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                        Bible Year Plan <ChevronRight size={14} />
                    </Link>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span>{stats.completedChapters} / {stats.totalChapters} chapters</span>
                        <span className="font-bold">{stats.percentComplete}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                            style={{ width: `${stats.percentComplete}%` }}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <Flame size={20} className="mx-auto mb-1 text-orange-400" />
                        <p className="text-xl font-bold">{stats.currentStreak}</p>
                        <p className="text-xs text-white/70">day streak</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <Target size={20} className="mx-auto mb-1 text-emerald-400" />
                        <p className="text-xl font-bold">{stats.daysRemaining || '—'}</p>
                        <p className="text-xs text-white/70">days left</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <Award size={20} className="mx-auto mb-1 text-amber-400" />
                        <p className="text-xl font-bold">3</p>
                        <p className="text-xs text-white/70">books done</p>
                    </div>
                </div>
            </div>

            {/* Current Reading */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Continue Reading</h4>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {stats.currentBook} {stats.currentChapter}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next up in your reading plan</p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={`/bible/${stats.currentBook.toLowerCase()}/${stats.currentChapter}`}
                            className="px-4 py-2 bg-sacred-600 text-white rounded-lg font-medium hover:bg-sacred-700 transition-colors"
                        >
                            Read Now
                        </Link>
                        <button
                            onClick={() => markChapterRead(stats.currentBook, stats.currentChapter)}
                            className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            title="Mark as read"
                        >
                            <Check size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Readings */}
            {recentReadings.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Recent Readings</h4>
                    <div className="space-y-2">
                        {recentReadings.map((reading, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <Check size={16} className="text-emerald-500" />
                                    <span className="text-gray-900 dark:text-white">
                                        {reading.book} {reading.chapter}
                                    </span>
                                </div>
                                {reading.date && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(reading.date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Book Progress */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Books Progress</h4>
                <div className="space-y-3">
                    {BIBLE_BOOKS.slice(0, 5).map((book, i) => {
                        const progress = Math.floor(Math.random() * 100);
                        return (
                            <div key={book.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 dark:text-gray-300">{book.name}</span>
                                    <span className="text-gray-500">{progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${progress === 100
                                                ? 'bg-emerald-500'
                                                : 'bg-sacred-500'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Link
                    href="/bible/progress"
                    className="inline-flex items-center gap-1 mt-4 text-sm text-sacred-600 hover:text-sacred-700"
                >
                    View all books <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
}

/**
 * Compact Bible progress widget
 */
export function BibleProgressBadge() {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('mpt-bible-progress');
        if (stored) {
            const data = JSON.parse(stored);
            const completed = data.readings?.length || 0;
            setPercent(Math.round((completed / TOTAL_CHAPTERS) * 100));
        }
    }, []);

    return (
        <Link
            href="/bible/progress"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-sacred-100 dark:bg-sacred-900/30 text-sacred-700 dark:text-sacred-300 rounded-full text-sm font-medium hover:bg-sacred-200 dark:hover:bg-sacred-900/50 transition-colors"
        >
            <Book size={14} />
            Bible: {percent}%
        </Link>
    );
}
