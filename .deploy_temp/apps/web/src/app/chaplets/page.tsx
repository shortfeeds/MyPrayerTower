'use client';

import { useState } from 'react';
import { Gem, ChevronDown, Heart, Shield, Cross, Sun, Star } from 'lucide-react';

interface Chaplet {
    id: string;
    name: string;
    patron: string;
    beads: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    prayers: { name: string; text: string }[];
}

const CHAPLETS: Chaplet[] = [
    {
        id: 'divine-mercy',
        name: 'Divine Mercy Chaplet',
        patron: 'Divine Mercy of Jesus',
        beads: 'Standard Rosary beads',
        description: 'Given by Jesus to St. Faustina. Prayed especially at 3:00 PM, the Hour of Great Mercy.',
        icon: <Heart className="w-6 h-6" />,
        color: 'from-red-500 to-rose-600',
        prayers: [
            { name: 'Opening', text: 'You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world.' },
            { name: 'On Large Beads', text: 'Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.' },
            { name: 'On Small Beads', text: 'For the sake of His sorrowful Passion, have mercy on us and on the whole world.' },
            { name: 'Closing (3x)', text: 'Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.' }
        ]
    },
    {
        id: 'st-michael',
        name: 'St. Michael Chaplet',
        patron: 'St. Michael the Archangel',
        beads: 'Special St. Michael chaplet',
        description: 'Honors the nine choirs of angels and invokes St. Michael\'s protection against evil.',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-blue-600 to-indigo-700',
        prayers: [
            { name: 'Invocation', text: 'O God, come to my assistance. O Lord, make haste to help me. Glory be...' },
            { name: 'Per Choir', text: 'By the intercession of St. Michael and the celestial Choir of [Seraphim/Cherubim/etc.], may the Lord make us worthy to burn with the fire of perfect charity. Amen.' }
        ]
    },
    {
        id: 'holy-wounds',
        name: 'Chaplet of the Holy Wounds',
        patron: 'Holy Wounds of Jesus',
        beads: 'Standard Rosary beads',
        description: 'Meditates on the five wounds of Christ received during His Passion.',
        icon: <Cross className="w-6 h-6" />,
        color: 'from-purple-600 to-violet-700',
        prayers: [
            { name: 'On Large Beads', text: 'Eternal Father, I offer Thee the Wounds of our Lord Jesus Christ, to heal the wounds of our souls.' },
            { name: 'On Small Beads', text: 'My Jesus, pardon and mercy, through the merits of Thy Holy Wounds.' }
        ]
    },
    {
        id: 'holy-spirit',
        name: 'Chaplet of the Holy Spirit',
        patron: 'Holy Spirit',
        beads: '7 groups of 7 beads',
        description: 'Invokes the seven gifts of the Holy Spirit for guidance and strength.',
        icon: <Sun className="w-6 h-6" />,
        color: 'from-red-500 to-amber-500',
        prayers: [
            { name: 'Per Gift', text: 'Come, O Spirit of [Wisdom/Understanding/Counsel/etc.], fill the hearts of Thy faithful and kindle in them the fire of Thy love.' }
        ]
    },
    {
        id: 'sacred-heart',
        name: 'Chaplet of the Sacred Heart',
        patron: 'Sacred Heart of Jesus',
        beads: '33 beads (years of Christ\'s life)',
        description: 'Honors the Sacred Heart of Jesus and His infinite love for humanity.',
        icon: <Heart className="w-6 h-6" />,
        color: 'from-red-600 to-orange-500',
        prayers: [
            { name: 'On Each Bead', text: 'Sacred Heart of Jesus, I trust in Thee.' }
        ]
    },
    {
        id: 'seven-sorrows',
        name: 'Seven Sorrows of Mary',
        patron: 'Our Lady of Sorrows',
        beads: '7 groups of 7 beads',
        description: 'Meditates on the seven sorrows Mary experienced in her life.',
        icon: <Star className="w-6 h-6" />,
        color: 'from-slate-600 to-gray-700',
        prayers: [
            { name: 'Opening', text: 'Most Merciful Mother, remind us always about the Sorrows of your Son, Jesus.' }
        ]
    }
];

export default function ChapletsPage() {
    const [expanded, setExpanded] = useState<string | null>('divine-mercy');

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-800 to-violet-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Gem className="w-4 h-4 text-indigo-300" />
                        <span>Devotional Prayers</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Chaplet Collection</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Meditative bead prayers for various devotions beyond the traditional Rosary.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="space-y-4">
                    {CHAPLETS.map(chaplet => (
                        <div key={chaplet.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setExpanded(expanded === chaplet.id ? null : chaplet.id)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${chaplet.color} rounded-xl flex items-center justify-center text-white`}>
                                        {chaplet.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-gray-900">{chaplet.name}</h3>
                                        <p className="text-sm text-gray-500">{chaplet.patron}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded === chaplet.id ? 'rotate-180' : ''}`} />
                            </button>

                            {expanded === chaplet.id && (
                                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                                    <p className="text-gray-600 mb-4">{chaplet.description}</p>
                                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                        <Gem className="w-4 h-4" />
                                        <span>Beads: {chaplet.beads}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {chaplet.prayers.map((prayer, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-4">
                                                <h4 className="font-bold text-gray-800 text-sm mb-1">{prayer.name}</h4>
                                                <p className="text-gray-600 text-sm">{prayer.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
