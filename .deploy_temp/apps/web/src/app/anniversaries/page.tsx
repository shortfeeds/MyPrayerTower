import { Calendar, Search } from 'lucide-react';
import Link from 'next/link';

export default function AnniversariesPage() {
    return (
        <div className="min-h-screen bg-sacred-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>

                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
                        Remembrance Calendar
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        We are currently building a dedicated space for you to track and remember the anniversaries of your loved ones. Soon, you will be able to receive reminders for death anniversaries, birthdays, and special dates to offer prayers and light candles.
                    </p>

                    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Coming Features</h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li className="flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Annual Prayer Reminders
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Family Anniversary Calendar
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Auto-schedule Mass Offerings
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/memorials" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] h-10 rounded-md px-4 py-2 font-medium transition-colors">
                            <Search className="w-4 h-4 mr-2" />
                            Search Memorials
                        </Link>
                        <Link href="/" className="inline-flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 min-w-[200px] h-10 rounded-md px-4 py-2 font-medium transition-colors">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
