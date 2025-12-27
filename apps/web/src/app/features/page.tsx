import { MapPin, Search, Calendar, Heart, Shield, Globe } from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-900 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Features Overview</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Powerful tools designed to connect the Catholic world.
                    </p>
                </div>
            </section>

            {/* Feature Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Church Finder */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Church Finder</h3>
                        <p className="text-gray-600">
                            More than just a map. Filter by Mass times, language, rite (Roman, Byzantine, etc.), and confession availability.
                        </p>
                    </div>

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

                    {/* Parish Management */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Parish Dashboard</h3>
                        <p className="text-gray-600">
                            Claim your church listing to update Mass times, manage events, and communicate directly with your parishioners.
                        </p>
                    </div>

                    {/* Smart Search */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Search</h3>
                        <p className="text-gray-600">
                            Find specific prayers, saints, or feast days instantly with our comprehensive Catholic database search.
                        </p>
                    </div>

                    {/* Liturgical Calendar */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Liturgical Calendar</h3>
                        <p className="text-gray-600">
                            Stay in sync with the Church seasons. Automated daily readings, feast days, and fasting reminders.
                        </p>
                    </div>

                    {/* Multi-Language */}
                    <div className="card-premium p-8">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Language Support</h3>
                        <p className="text-gray-600">
                            Access tailored content in English, Spanish, French, Portuguese, and more (coming soon).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
