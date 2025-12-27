import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-950 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                        Tools for every parish size. Start for free, upgrade as you grow.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic */}
                    <div className="card-premium p-8 flex flex-col">
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Basic</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Free</h2>
                        <p className="text-gray-500 mb-8">Forever free for basic listings.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Basic Church Profile',
                                'Mass & Confession Times',
                                'Contact Information',
                                'Map Location'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/register" className="w-full py-3 text-center border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="card-premium p-8 flex flex-col border-2 border-gold-400 relative transform md:-translate-y-4 shadow-xl">
                        <div className="absolute top-0 right-0 bg-gold-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-lg text-sm font-bold">
                            POPULAR
                        </div>
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm font-medium">Premium</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">$29<span className="text-lg text-gray-500 font-normal">/mo</span></h2>
                        <p className="text-gray-500 mb-8">Everything you need to grow.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Everything in Free',
                                'Enhanced Profile Page',
                                'Prayer Request Management',
                                'Event Calendar',
                                'Parish Announcements',
                                'Weekly Analytics Report'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/register?plan=premium" className="w-full py-3 text-center bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors shadow-lg">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Diocese */}
                    <div className="card-premium p-8 flex flex-col">
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">Diocese</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Custom</h2>
                        <p className="text-gray-500 mb-8">For multi-parish management.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                'Multi-Parish Dashboard',
                                'Centralized Reporting',
                                'Staff Accounts',
                                'Priority Support',
                                'API Access',
                                'Custom Integration'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link href="/contact" className="w-full py-3 text-center border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors">
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
