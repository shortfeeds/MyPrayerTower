import Link from 'next/link';
import { ChevronLeft, Download, Monitor, Smartphone, Tablet, Image as ImageIcon } from 'lucide-react';

export const metadata = {
    title: 'Liturgical Wallpapers | MyPrayerTower',
    description: 'Download beautiful Catholic wallpapers for your phone, tablet, or desktop. Featuring sacred art, saints, and liturgical themes.',
};

// Wallpaper collections by liturgical season
const collections = [
    {
        id: 'advent',
        name: 'Advent',
        description: 'Prepare the way of the Lord',
        color: 'from-violet-600 to-purple-700',
        count: 12
    },
    {
        id: 'christmas',
        name: 'Christmas',
        description: 'Celebrate the Nativity',
        color: 'from-red-600 to-rose-700',
        count: 15
    },
    {
        id: 'lent',
        name: 'Lent',
        description: 'Journey to Easter',
        color: 'from-purple-700 to-violet-800',
        count: 18
    },
    {
        id: 'easter',
        name: 'Easter',
        description: 'He is Risen!',
        color: 'from-gold-500 to-amber-600',
        count: 14
    },
    {
        id: 'ordinary',
        name: 'Ordinary Time',
        description: 'Grow in faith daily',
        color: 'from-emerald-600 to-green-700',
        count: 20
    },
    {
        id: 'marian',
        name: 'Marian',
        description: 'Blessed Virgin Mary',
        color: 'from-sky-500 to-blue-600',
        count: 16
    },
    {
        id: 'saints',
        name: 'Saints',
        description: 'Holy men and women',
        color: 'from-amber-600 to-orange-700',
        count: 25
    },
    {
        id: 'sacred-art',
        name: 'Sacred Art',
        description: 'Masterpiece devotionals',
        color: 'from-sacred-600 to-sacred-700',
        count: 30
    }
];

// Sample wallpapers
const featuredWallpapers = [
    { id: '1', name: 'Divine Mercy', category: 'easter', preview: '/api/og?title=Divine+Mercy' },
    { id: '2', name: 'Our Lady of Guadalupe', category: 'marian', preview: '/api/og?title=Guadalupe' },
    { id: '3', name: 'Sacred Heart', category: 'sacred-art', preview: '/api/og?title=Sacred+Heart' },
    { id: '4', name: 'St. Michael', category: 'saints', preview: '/api/og?title=St+Michael' },
    { id: '5', name: 'Nativity Scene', category: 'christmas', preview: '/api/og?title=Nativity' },
    { id: '6', name: 'Crown of Thorns', category: 'lent', preview: '/api/og?title=Lent' },
];

export default function WallpapersPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero */}
            <section className="bg-gradient-to-b from-sacred-700 to-sacred-800 text-white pt-28 pb-16 md:pt-32 md:pb-20">
                <div className="container mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <ImageIcon className="w-4 h-4 text-gold-400" />
                            <span className="text-sm font-medium text-gold-200">Free Downloads</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Liturgical <span className="text-gold-400">Wallpapers</span>
                        </h1>
                        <p className="text-xl text-blue-100/80">
                            Beautiful Catholic wallpapers for your devices. Keep your faith visible throughout the day.
                        </p>
                    </div>
                </div>
            </section>

            {/* Device Types */}
            <section className="py-8 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center gap-8">
                        {[
                            { icon: Smartphone, label: 'Phone', size: '1080x1920' },
                            { icon: Tablet, label: 'Tablet', size: '2048x2732' },
                            { icon: Monitor, label: 'Desktop', size: '1920x1080' },
                        ].map((device, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-600">
                                <device.icon className="w-5 h-5" />
                                <span className="font-medium">{device.label}</span>
                                <span className="text-xs text-gray-400">{device.size}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collections */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
                        Collections
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className={`group relative bg-gradient-to-br ${collection.color} rounded-2xl p-6 text-white overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <h3 className="font-display text-xl font-bold mb-1">{collection.name}</h3>
                                <p className="text-white/80 text-sm mb-4">{collection.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/70">{collection.count} wallpapers</span>
                                    <span className="text-white/60 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Wallpapers */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
                        Featured Wallpapers
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredWallpapers.map((wallpaper) => (
                            <div
                                key={wallpaper.id}
                                className="group relative aspect-[9/16] md:aspect-video bg-gray-100 rounded-2xl overflow-hidden"
                            >
                                {/* Placeholder - in production this would be real images */}
                                <div className="absolute inset-0 bg-gradient-to-br from-sacred-600 to-sacred-800 flex items-center justify-center">
                                    <span className="text-white/50 font-medium">{wallpaper.name}</span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                        <Download className="w-5 h-5" />
                                        Download
                                    </button>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                    <p className="text-white font-medium">{wallpaper.name}</p>
                                    <p className="text-white/70 text-sm capitalize">{wallpaper.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Attribution Note */}
            <section className="py-8 bg-cream-50">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm text-gray-500">
                        All wallpapers are free for personal use. Some images are in the public domain; others are licensed for non-commercial use.
                    </p>
                </div>
            </section>
        </div>
    );
}
