import { Heart, Gift, Flame, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContributionsPage() {
    const methods = [
        {
            title: 'Mass Offerings',
            description: 'Have a Holy Mass offered for your intentions.',
            icon: Gift,
            href: '/mass-offerings',
            color: 'bg-indigo-100 text-indigo-600',
            btnColor: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'Light a Candle',
            description: 'Light a virtual candle that burns for your prayer.',
            icon: Flame,
            href: '/candles',
            color: 'bg-amber-100 text-amber-600',
            btnColor: 'bg-amber-600 hover:bg-amber-700'
        },
        {
            title: 'Spiritual Bouquets',
            description: 'Send a beautiful bouquet of prayers to a loved one.',
            icon: BookOpen,
            href: '/bouquets',
            color: 'bg-rose-100 text-rose-600',
            btnColor: 'bg-rose-600 hover:bg-rose-700'
        },
        {
            title: 'Eternal Memorials',
            description: 'Create a permanent tribute page for a departed soul.',
            icon: Heart,
            href: '/memorials/create',
            color: 'bg-slate-100 text-slate-600',
            btnColor: 'bg-slate-800 hover:bg-slate-900'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Support Our Mission</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your generous contributions help sustain this digital sanctuary and support our global prayer community.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {methods.map((method) => (
                        <Link
                            key={method.title}
                            href={method.href}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                <method.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h3>
                            <p className="text-gray-500 mb-8 flex-1">{method.description}</p>
                            <div className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 ${method.btnColor} transition-colors`}>
                                Contribute <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center text-sm text-gray-500">
                    <p>MyPrayerTower is a service provider. Contributions are effectively purchases of spiritual services and may not be tax-deductible.</p>
                </div>
            </div>
        </div>
    );
}
