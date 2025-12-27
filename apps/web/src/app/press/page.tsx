import { Download, FileText, Image } from 'lucide-react';

export default function PressPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-950 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Press & Media</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Latest news, brand assets, and media resources for MyPrayerTower.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Brand Assets */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Brand Assets</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card-premium p-6 flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                                    <Image className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Logo Pack</h3>
                                    <p className="text-sm text-gray-500 mb-2">SVG, PNG, EPS formats</p>
                                    <button className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                                        Download <Download className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-premium p-6 flex items-center gap-4">
                                <div className="w-16 h-16 bg-gold-100 rounded-xl flex items-center justify-center text-gold-600 flex-shrink-0">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Media Kit</h3>
                                    <p className="text-sm text-gray-500 mb-2">Fact sheet & Guidelines</p>
                                    <button className="text-gold-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                                        Download PDF <Download className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Latest News */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Latest News</h2>
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <article key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <span className="text-sm text-gold-600 font-semibold mb-2 block">December 15, 2024</span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                                        MyPrayerTower Reaches 1 Million Monthly Active Users
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        The world's leading Catholic app celebrates a major milestone in connecting believers worldwide...
                                    </p>
                                    <button className="text-primary-600 font-medium hover:underline">Read Full Story →</button>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
