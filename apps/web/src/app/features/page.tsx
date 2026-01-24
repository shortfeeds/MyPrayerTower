import { MapPin, Search, Calendar, Heart, Shield, Globe, BookOpen, Flame, Star, Sparkles, Book, User, ScrollText } from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-900 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Features Overview</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        A comprehensive suite of spiritual tools designed for the modern Catholic life.
                    </p>
                </div>
            </section>

            {/* Feature Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* --- PRAYER & DEVOTION --- */}
                    
                    {/* Prayer Wall */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-xl flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Global Prayer Wall</h3>
                        <p className="text-gray-600">
                            A real-time community of prayer. Post intentions safely and anonymously, and receive notifications when others pray for you.
                        </p>
                    </div>

                    {/* Rosary */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Holy Rosary</h3>
                        <p className="text-gray-600">
                            Interactive beads and guided meditations for all mysteries (Joyful, Sorrowful, Glorious, Luminous).
                        </p>
                    </div>

                    {/* Novenas & Stations */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <ScrollText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Novenas & Stations</h3>
                        <p className="text-gray-600">
                            Track 9-day novenas with reminders, and walk the Stations of the Cross with beautiful reflections.
                        </p>
                    </div>

                    {/* --- SCRIPTURE & STUDY --- */}

                    {/* Bible & Readings */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Book className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Bible & Daily Readings</h3>
                        <p className="text-gray-600">
                            Read the full Catholic Bible and follow the daily Mass readings, Gospel, and Psalms.
                        </p>
                    </div>

                    {/* Liturgical Calendar */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Liturgical Calendar</h3>
                        <p className="text-gray-600">
                            Stay in sync with the Church seasons. Automated feast days, fasting reminders, and saint celebrations.
                        </p>
                    </div>

                    {/* Catechism & Library */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Library & Catechism</h3>
                        <p className="text-gray-600">
                            Access the Catechism of the Catholic Church, encyclicals, and a vast library of prayers.
                        </p>
                    </div>

                     {/* --- SACRAMENTAL LIFE --- */}

                    {/* Church Finder */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Church Finder</h3>
                        <p className="text-gray-600">
                            Find nearby Masses, Confession times, and Adoration. Filter by rite and language.
                        </p>
                    </div>

                    {/* Candles */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                            <Flame className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Light a Candle</h3>
                        <p className="text-gray-600">
                            Light a virtual candle for your intentions. A tangible way to offer prayer from anywhere.
                        </p>
                    </div>

                    {/* Confession Guide */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Confession Guide</h3>
                        <p className="text-gray-600">
                            Step-by-step preparation with Examination of Conscience based on the Ten Commandments.
                        </p>
                    </div>

                     {/* --- COMMUNITY & GIVING --- */}

                    {/* Memorials */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <Star className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Eternal Memorials</h3>
                        <p className="text-gray-600">
                            Create lasting digital tributes for your departed loved ones and request prayers for their souls.
                        </p>
                    </div>

                    {/* Parish Dashboard */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Parish Dashboard</h3>
                        <p className="text-gray-600">
                            For parishes to manage Mass times, events, and communicate with their flock.
                        </p>
                    </div>

                    {/* Multi-Language */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Language</h3>
                        <p className="text-gray-600">
                            Fully localized content in English, Spanish, French, Portuguese, and more.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
