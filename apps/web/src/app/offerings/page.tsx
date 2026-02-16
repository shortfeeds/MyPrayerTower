import Link from 'next/link';
import { Flame, Church, Heart, Scroll, ArrowRight, Gift } from 'lucide-react';

const OFFERINGS = [
    {
        title: 'Light a Candle',
        description: 'Light a virtual candle for your intentions or loved ones. A physical candle will also be lit in our chapel.',
        icon: Flame,
        href: '/candles',
        color: 'bg-amber-500',
        textColor: 'text-amber-500',
        bgGradient: 'from-amber-500/20 to-amber-500/5',
    },
    {
        title: 'Mass Offerings',
        description: 'Request a Mass to be offered for your special intentions, for the deceased, or for thanksgiving.',
        icon: Church,
        href: '/mass-offerings',
        color: 'bg-purple-600',
        textColor: 'text-purple-600',
        bgGradient: 'from-purple-600/20 to-purple-600/5',
    },
    {
        title: 'Support Our Mission',
        description: 'Help us maintain this app and continue our work of digital evangelization.',
        icon: Heart,
        href: '/contributions',
        color: 'bg-red-500',
        textColor: 'text-red-500',
        bgGradient: 'from-red-500/20 to-red-500/5',
    },
    {
        title: 'Create a Memorial',
        description: 'Create a permanent digital memorial for a departed loved one.',
        icon: Scroll,
        href: '/memorials',
        color: 'bg-slate-600',
        textColor: 'text-slate-600',
        bgGradient: 'from-slate-600/20 to-slate-600/5',
    },
];

export default function OfferingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Spiritual Offerings</h1>
                <p className="text-lg text-slate-600">
                    "God loves a cheerful giver." (2 Corinthians 9:7)<br />
                    Choose a way to support the church and offer your prayers.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
                {OFFERINGS.map((offering) => {
                    const Icon = offering.icon;
                    return (
                        <Link
                            key={offering.title}
                            href={offering.href}
                            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${offering.bgGradient} rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl ${offering.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={28} />
                                </div>

                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors">
                                    {offering.title}
                                </h3>

                                <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                                    {offering.description}
                                </p>

                                <div className={`flex items-center font-semibold ${offering.textColor} group-hover:translate-x-2 transition-transform`}>
                                    Proceed <ArrowRight size={18} className="ml-2" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="max-w-3xl mx-auto mt-16 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                <Gift className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">Why Offer?</h3>
                <p className="text-blue-800/80">
                    Your offerings support the maintenance of our digital platform and the physical maintenance of our partner churches. We ensure 100% of mass offerings reach the designated priests.
                </p>
            </div>
        </div>
    );
}
