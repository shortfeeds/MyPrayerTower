
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { BouquetActions } from '@/components/bouquets/BouquetActions';
import { Metadata } from 'next';
import { Flower } from 'lucide-react';

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const bouquet = await db.spiritualBouquet.findUnique({
        where: { id: params.id },
    });

    if (!bouquet) {
        return {
            title: 'Spiritual Bouquet not found',
        };
    }

    const ogParams = new URLSearchParams({
        recipient: bouquet.recipientName,
        sender: bouquet.creatorName,
        occasion: bouquet.occasion || 'Spiritual Bouquet',
        masses: bouquet.massesCount.toString(),
        rosaries: bouquet.rosariesCount.toString(),
        prayers: bouquet.prayersCount.toString(),
        candles: bouquet.candlesCount.toString(),
    });

    // Use absolute URL for OG image
    const ogUrl = `https://myprayertower.com/api/og/bouquets?${ogParams.toString()}`;

    return {
        title: `A Spiritual Bouquet for ${bouquet.recipientName}`,
        description: `${bouquet.creatorName} has sent a spiritual bouquet containing ${bouquet.massesCount} Masses, ${bouquet.rosariesCount} Rosaries, and more.`,
        openGraph: {
            title: `A Spiritual Bouquet for ${bouquet.recipientName}`,
            description: `Sent with love by ${bouquet.creatorName}`,
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: `Spiritual Bouquet for ${bouquet.recipientName}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `A Spiritual Bouquet for ${bouquet.recipientName}`,
            description: `Sent with love by ${bouquet.creatorName}`,
            images: [ogUrl],
        },
    };
}

export default async function BouquetPage({ params }: Props) {
    const bouquet = await db.spiritualBouquet.findUnique({
        where: { id: params.id },
    });

    if (!bouquet) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-double border-slate-100">
                <div className="bg-sacred-900 px-6 py-12 text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/bg-pattern.png')] bg-cover" />

                    <Flower className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-pulse-soft" />

                    <h1 className="font-serif text-3xl font-bold text-white mb-2 relative z-10">
                        Top {bouquet.recipientName}
                    </h1>
                    <p className="text-sacred-200 font-medium uppercase tracking-widest text-sm relative z-10">
                        {bouquet.occasion || 'Spiritual Bouquet'}
                    </p>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-slate-600 italic leading-relaxed">
                            "{bouquet.message}"
                        </p>
                        <p className="text-slate-400 text-sm mt-4 font-medium">
                            — From {bouquet.creatorName}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {bouquet.massesCount > 0 && (
                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                    <span className="block text-3xl font-bold text-sacred-700">{bouquet.massesCount}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Masses</span>
                                </div>
                            )}
                            {bouquet.rosariesCount > 0 && (
                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                    <span className="block text-3xl font-bold text-rose-600">{bouquet.rosariesCount}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Rosaries</span>
                                </div>
                            )}
                            {bouquet.prayersCount > 0 && (
                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                    <span className="block text-3xl font-bold text-indigo-600">{bouquet.prayersCount}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Prayers</span>
                                </div>
                            )}
                            {bouquet.candlesCount > 0 && (
                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                    <span className="block text-3xl font-bold text-amber-500">{bouquet.candlesCount}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wide">Candles</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <BouquetActions bouquet={{
                        id: bouquet.id,
                        recipientName: bouquet.recipientName,
                        senderName: bouquet.creatorName,
                        occasion: bouquet.occasion || '',
                        massesCount: bouquet.massesCount,
                        rosariesCount: bouquet.rosariesCount,
                        prayersCount: bouquet.prayersCount,
                        candlesCount: bouquet.candlesCount
                    }} />
                </div>
            </div>
        </div>
    );
}

// Add viewport export in file or handle in layout
