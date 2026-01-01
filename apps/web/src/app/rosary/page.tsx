'use client';

import { useState } from 'react';
import { CircleDot, ChevronRight, ChevronLeft, Heart, Sun, Crown, Star, Play, Pause } from 'lucide-react';
import { MassOfferingCTA } from '@/components/giving/MassOfferingCTA';

type MysterySet = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

interface Mystery {
    name: string;
    scripture: string;
    meditation: string;
}

const MYSTERIES: Record<MysterySet, { name: string; day: string; color: string; icon: React.ReactNode; mysteries: Mystery[] }> = {
    joyful: {
        name: 'Joyful Mysteries',
        day: 'Monday & Saturday',
        color: 'from-emerald-600 to-teal-700',
        icon: <Heart className="w-5 h-5" />,
        mysteries: [
            { name: 'The Annunciation', scripture: 'Luke 1:26-38', meditation: 'The angel Gabriel announces to Mary that she will conceive the Son of God.' },
            { name: 'The Visitation', scripture: 'Luke 1:39-56', meditation: 'Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.' },
            { name: 'The Nativity', scripture: 'Luke 2:1-20', meditation: 'Jesus is born in a stable in Bethlehem.' },
            { name: 'The Presentation', scripture: 'Luke 2:22-38', meditation: 'Mary and Joseph present Jesus in the Temple.' },
            { name: 'Finding in the Temple', scripture: 'Luke 2:41-52', meditation: 'The child Jesus is found teaching in the Temple.' },
        ]
    },
    sorrowful: {
        name: 'Sorrowful Mysteries',
        day: 'Tuesday & Friday',
        color: 'from-purple-700 to-indigo-800',
        icon: <Crown className="w-5 h-5" />,
        mysteries: [
            { name: 'Agony in the Garden', scripture: 'Matthew 26:36-46', meditation: 'Jesus prays in Gethsemane and sweats blood.' },
            { name: 'Scourging at the Pillar', scripture: 'John 19:1', meditation: 'Jesus is brutally scourged by Roman soldiers.' },
            { name: 'Crowning with Thorns', scripture: 'Matthew 27:27-31', meditation: 'Soldiers mock Jesus with a crown of thorns.' },
            { name: 'Carrying the Cross', scripture: 'John 19:17', meditation: 'Jesus carries His cross to Calvary.' },
            { name: 'The Crucifixion', scripture: 'John 19:18-30', meditation: 'Jesus dies on the cross for our salvation.' },
        ]
    },
    glorious: {
        name: 'Glorious Mysteries',
        day: 'Wednesday & Sunday',
        color: 'from-amber-500 to-orange-600',
        icon: <Sun className="w-5 h-5" />,
        mysteries: [
            { name: 'The Resurrection', scripture: 'Matthew 28:1-10', meditation: 'Jesus rises from the dead on Easter Sunday.' },
            { name: 'The Ascension', scripture: 'Acts 1:9-11', meditation: 'Jesus ascends into Heaven forty days after Easter.' },
            { name: 'Descent of the Holy Spirit', scripture: 'Acts 2:1-4', meditation: 'The Holy Spirit descends upon the Apostles at Pentecost.' },
            { name: 'Assumption of Mary', scripture: 'Rev 12:1', meditation: 'Mary is assumed body and soul into Heaven.' },
            { name: 'Coronation of Mary', scripture: 'Rev 12:1', meditation: 'Mary is crowned Queen of Heaven and Earth.' },
        ]
    },
    luminous: {
        name: 'Luminous Mysteries',
        day: 'Thursday',
        color: 'from-blue-500 to-cyan-600',
        icon: <Star className="w-5 h-5" />,
        mysteries: [
            { name: 'Baptism in the Jordan', scripture: 'Matthew 3:13-17', meditation: 'Jesus is baptized and the Spirit descends like a dove.' },
            { name: 'Wedding at Cana', scripture: 'John 2:1-11', meditation: 'Jesus performs His first miracle at Mary\'s request.' },
            { name: 'Proclamation of the Kingdom', scripture: 'Mark 1:14-15', meditation: 'Jesus proclaims the Kingdom and calls to conversion.' },
            { name: 'The Transfiguration', scripture: 'Matthew 17:1-8', meditation: 'Jesus is transfigured on Mount Tabor.' },
            { name: 'Institution of the Eucharist', scripture: 'Matthew 26:26-28', meditation: 'Jesus institutes the Eucharist at the Last Supper.' },
        ]
    }
};

const PRAYERS = {
    ourFather: `Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,
    hailMary: `Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
    gloryBe: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`,
    fatimaPrayer: `O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy. Amen.`
};

export default function RosaryPage() {
    const [selectedSet, setSelectedSet] = useState<MysterySet>('joyful');
    const [currentMystery, setCurrentMystery] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentSetData = MYSTERIES[selectedSet];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className={`bg-gradient-to-br ${currentSetData.color} text-white pt-28 pb-16 transition-all duration-500`}>
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <CircleDot className="w-4 h-4" />
                        <span>Holy Rosary</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Pray the Rosary</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Meditate on the life of Christ through the eyes of Mary with this centuries-old devotion.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Mystery Set Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {(Object.keys(MYSTERIES) as MysterySet[]).map(key => {
                        const set = MYSTERIES[key];
                        return (
                            <button
                                key={key}
                                onClick={() => { setSelectedSet(key); setCurrentMystery(0); }}
                                className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-all ${selectedSet === key
                                    ? `bg-gradient-to-r ${set.color} text-white shadow-lg`
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {set.icon}
                                <div className="text-left">
                                    <div className="font-bold">{set.name}</div>
                                    <div className="text-xs opacity-75">{set.day}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Current Mystery */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                        <div className={`bg-gradient-to-r ${currentSetData.color} text-white p-6`}>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentMystery(m => Math.max(0, m - 1))}
                                    disabled={currentMystery === 0}
                                    className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="text-center">
                                    <div className="text-sm opacity-75">Mystery {currentMystery + 1} of 5</div>
                                    <h2 className="text-2xl font-serif font-bold">{currentSetData.mysteries[currentMystery].name}</h2>
                                </div>
                                <button
                                    onClick={() => setCurrentMystery(m => Math.min(4, m + 1))}
                                    disabled={currentMystery === 4}
                                    className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="text-sm text-gray-500 mb-2">{currentSetData.mysteries[currentMystery].scripture}</div>
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                {currentSetData.mysteries[currentMystery].meditation}
                            </p>

                            {/* Prayer sequence */}
                            <div className="space-y-4">
                                <div className="bg-amber-50 rounded-xl p-4">
                                    <h4 className="font-bold text-amber-800 mb-2">1. Our Father</h4>
                                    <p className="text-amber-700 text-sm">{PRAYERS.ourFather}</p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="font-bold text-blue-800 mb-2">2. Ten Hail Marys</h4>
                                    <p className="text-blue-700 text-sm">{PRAYERS.hailMary}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <h4 className="font-bold text-purple-800 mb-2">3. Glory Be</h4>
                                    <p className="text-purple-700 text-sm">{PRAYERS.gloryBe}</p>
                                </div>
                                <div className="bg-rose-50 rounded-xl p-4">
                                    <h4 className="font-bold text-rose-800 mb-2">4. Fatima Prayer</h4>
                                    <p className="text-rose-700 text-sm">{PRAYERS.fatimaPrayer}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mystery Progress */}
                    <div className="flex justify-center gap-2">
                        {currentSetData.mysteries.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentMystery(i)}
                                className={`w-4 h-4 rounded-full transition-all ${i === currentMystery
                                    ? `bg-gradient-to-r ${currentSetData.color} scale-125`
                                    : i < currentMystery ? 'bg-gray-400' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    {/* Mass Offering CTA */}
                    <div className="mt-10">
                        <MassOfferingCTA variant="inline" context="rosary" />
                    </div>
                </div>
            </div>
        </div>
    );
}
