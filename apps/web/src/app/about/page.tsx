import { Heart, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-primary-950 text-white py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Mission</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        To build the world's most comprehensive digital platform for the Catholic faith,
                        connecting believers with their parishes and each other.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    MyPrayerTower started with a simple observation: while technology connects us in many ways,
                                    it often fails to support our spiritual lives meaningfully.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    We are a team of Catholic developers, designers, and creatives dedicated to using
                                    technology to serve the Church. We believe that digital tools, when built with intention,
                                    can help deepen faith and foster community.
                                </p>
                            </div>
                            <div className="bg-gray-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                                {/* Placeholder for Team Image */}
                                <div className="text-center text-gray-400">
                                    <Globe className="w-16 h-16 mx-auto mb-4" />
                                    <span className="font-medium">Global Team</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Faith First</h3>
                                <p className="text-gray-600 text-sm">Every feature is designed to support legitimate Catholic teaching and tradition.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Universal</h3>
                                <p className="text-gray-600 text-sm">Serving the global Church with support for multiple languages and rites.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Privacy Focused</h3>
                                <p className="text-gray-600 text-sm">We don't sell your data. Your spiritual journey is personal and protected.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
