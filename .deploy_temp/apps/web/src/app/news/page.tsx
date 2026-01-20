'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, RefreshCw, Globe, Rss, ChevronRight } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    description?: string;
}

// Static curated news sources (since RSS feeds require server-side fetching)
const NEWS_SOURCES = [
    {
        name: 'Vatican News',
        url: 'https://www.vaticannews.va/en.html',
        feed: 'https://www.vaticannews.va/en.rss.xml',
        logo: '🇻🇦',
        description: 'Official news portal of the Holy See'
    },
    {
        name: 'Catholic News Agency',
        url: 'https://www.catholicnewsagency.com/',
        feed: 'https://www.catholicnewsagency.com/rss',
        logo: '📰',
        description: 'Breaking Catholic news & analysis'
    },
    {
        name: 'EWTN News',
        url: 'https://www.ncregister.com/',
        feed: 'https://www.ncregister.com/rss',
        logo: '📺',
        description: 'National Catholic Register - In-depth Catholic journalism'
    },
    {
        name: 'Catholic Herald',
        url: 'https://catholicherald.co.uk/',
        feed: 'https://catholicherald.co.uk/feed/',
        logo: '🇬🇧',
        description: 'UK-based Catholic news and commentary'
    },
    {
        name: 'Crux Now',
        url: 'https://cruxnow.com/',
        feed: 'https://cruxnow.com/feed',
        logo: '✝️',
        description: 'Taking the Catholic pulse'
    },
    {
        name: 'America Magazine',
        url: 'https://www.americamagazine.org/',
        feed: 'https://www.americamagazine.org/rss.xml',
        logo: '🇺🇸',
        description: 'Jesuit review of faith and culture'
    }
];

export default function NewsPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-red-700 via-red-800 to-rose-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Newspaper className="w-4 h-4 text-red-300" />
                        <span>Catholic News Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic News</h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto">
                        Stay informed with news from the Vatican, Catholic agencies, and faith-based journalism worldwide.
                    </p>
                </div>
            </div>

            {/* News Sources Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Rss className="w-6 h-6 text-red-600" />
                        News Sources
                    </h2>
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {NEWS_SOURCES.length} sources
                    </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {NEWS_SOURCES.map((source) => (
                        <a
                            key={source.name}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{source.logo}</div>
                                <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-red-600 transition-colors" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                {source.name}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-4">
                                {source.description}
                            </p>

                            <div className="flex items-center text-red-600 text-sm font-medium">
                                Visit Site
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* RSS Feed Info */}
                <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 text-center">
                    <Rss className="w-12 h-12 text-orange-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribe via RSS</h3>
                    <p className="text-gray-600 max-w-xl mx-auto mb-8">
                        Many of these sources offer RSS feeds for your favorite reader. 
                        Click on any source and look for their RSS/feed option.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {NEWS_SOURCES.slice(0, 3).map(source => (
                            <a
                                key={source.feed}
                                href={source.feed}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
                            >
                                {source.name} RSS
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
