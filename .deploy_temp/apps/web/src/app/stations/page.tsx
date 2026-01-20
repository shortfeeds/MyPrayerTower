'use client';

import { useState } from 'react';
import { Cross, ChevronLeft, ChevronRight, BookOpen, Heart } from 'lucide-react';

interface Station {
    number: number;
    title: string;
    scripture: string;
    meditation: string;
    prayer: string;
}

const STATIONS: Station[] = [
    { number: 1, title: 'Jesus is Condemned to Death', scripture: 'Matthew 27:22-26', meditation: 'Pilate washes his hands and delivers Jesus to be crucified.', prayer: 'Lord, help me to accept unjust criticism with patience.' },
    { number: 2, title: 'Jesus Carries His Cross', scripture: 'John 19:17', meditation: 'Jesus takes up the heavy wooden cross on His shoulders.', prayer: 'Lord, help me to carry my daily crosses without complaint.' },
    { number: 3, title: 'Jesus Falls the First Time', scripture: 'Isaiah 53:4-6', meditation: 'Weakened by the scourging, Jesus stumbles under the weight.', prayer: 'Lord, when I fall into sin, help me to rise again.' },
    { number: 4, title: 'Jesus Meets His Mother', scripture: 'Luke 2:34-35', meditation: 'Mary\'s heart is pierced seeing her Son suffering.', prayer: 'Lord, comfort all mothers who suffer for their children.' },
    { number: 5, title: 'Simon Helps Jesus Carry the Cross', scripture: 'Mark 15:21', meditation: 'Simon of Cyrene is compelled to help carry the cross.', prayer: 'Lord, help me to willingly help those who are burdened.' },
    { number: 6, title: 'Veronica Wipes the Face of Jesus', scripture: 'Isaiah 53:2-3', meditation: 'A woman named Veronica offers Jesus a cloth to wipe His face.', prayer: 'Lord, help me to see Your face in those who suffer.' },
    { number: 7, title: 'Jesus Falls the Second Time', scripture: 'Psalm 22:14-15', meditation: 'Jesus falls again under the crushing weight of the cross.', prayer: 'Lord, when I fall repeatedly, give me strength to persevere.' },
    { number: 8, title: 'Jesus Meets the Women of Jerusalem', scripture: 'Luke 23:27-31', meditation: 'Jesus tells the weeping women to weep for themselves and their children.', prayer: 'Lord, help me to truly repent for my sins.' },
    { number: 9, title: 'Jesus Falls the Third Time', scripture: 'Hebrews 4:15', meditation: 'Jesus falls a third time, yet continues toward Calvary.', prayer: 'Lord, teach me to never give up in doing good.' },
    { number: 10, title: 'Jesus is Stripped of His Garments', scripture: 'John 19:23-24', meditation: 'Soldiers strip Jesus and divide His garments among themselves.', prayer: 'Lord, help me to be detached from material possessions.' },
    { number: 11, title: 'Jesus is Nailed to the Cross', scripture: 'Luke 23:33', meditation: 'Jesus is nailed to the cross at the Place of the Skull.', prayer: 'Lord, help me to endure suffering with patience.' },
    { number: 12, title: 'Jesus Dies on the Cross', scripture: 'Luke 23:44-46', meditation: 'After three hours of agony, Jesus breathes His last.', prayer: 'Lord, help me to live each day as if it were my last.' },
    { number: 13, title: 'Jesus is Taken Down from the Cross', scripture: 'John 19:38-40', meditation: 'Joseph of Arimathea and Nicodemus take down the body of Jesus.', prayer: 'Lord, grant peace to all who mourn their loved ones.' },
    { number: 14, title: 'Jesus is Laid in the Tomb', scripture: 'Matthew 27:59-60', meditation: 'Jesus is placed in a new tomb, and a large stone seals its entrance.', prayer: 'Lord, help me to trust that death leads to resurrection.' },
];

export default function StationsPage() {
    const [currentStation, setCurrentStation] = useState(0);

    const station = STATIONS[currentStation];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-stone-800 via-stone-900 to-neutral-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Cross className="w-4 h-4 text-red-400" />
                        <span>Via Crucis</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Stations of the Cross</h1>
                    <p className="text-xl text-stone-300 max-w-2xl mx-auto">
                        Walk with Jesus on His journey to Calvary through these 14 meditations on His Passion.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Station Progress */}
                <div className="flex justify-center gap-1 mb-8 flex-wrap">
                    {STATIONS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStation(i)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i === currentStation
                                    ? 'bg-red-600 text-white scale-125'
                                    : i < currentStation
                                        ? 'bg-stone-400 text-white'
                                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                }`}
                        >
                            {s.number}
                        </button>
                    ))}
                </div>

                {/* Current Station */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-800 to-rose-900 text-white p-6">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentStation(s => Math.max(0, s - 1))}
                                    disabled={currentStation === 0}
                                    className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="text-center">
                                    <div className="text-sm opacity-75">Station {station.number} of 14</div>
                                    <h2 className="text-2xl font-serif font-bold">{station.title}</h2>
                                </div>
                                <button
                                    onClick={() => setCurrentStation(s => Math.min(13, s + 1))}
                                    disabled={currentStation === 13}
                                    className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-amber-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-amber-800 mb-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-bold">Scripture</span>
                                </div>
                                <p className="text-amber-700">{station.scripture}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Meditation</h3>
                                <p className="text-gray-600 leading-relaxed">{station.meditation}</p>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-purple-800 mb-2">
                                    <Heart className="w-4 h-4" />
                                    <span className="font-bold">Prayer</span>
                                </div>
                                <p className="text-purple-700 italic">{station.prayer}</p>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-gray-500 text-sm">We adore You, O Christ, and we bless You,</p>
                                <p className="text-gray-700 font-medium">because by Your Holy Cross You have redeemed the world.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
