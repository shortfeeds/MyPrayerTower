'use client';

import { useState, useEffect } from 'react';
import { Flame, Heart, Users, Clock, Sparkles } from 'lucide-react';

interface Candle {
    id: string;
    userName: string;
    intention: string;
    color: 'white' | 'red' | 'blue' | 'gold';
    remainingHours: number;
    prayerCount: number;
}

const CANDLE_COLORS = {
    white: { bg: 'from-gray-100 to-white', flame: '#FFA500', glow: 'shadow-orange-200' },
    red: { bg: 'from-red-200 to-red-100', flame: '#FF4500', glow: 'shadow-red-300' },
    blue: { bg: 'from-blue-200 to-blue-100', flame: '#4169E1', glow: 'shadow-blue-300' },
    gold: { bg: 'from-amber-200 to-yellow-100', flame: '#FFD700', glow: 'shadow-amber-300' },
};

export default function CandleWallPage() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [showLightModal, setShowLightModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<'white' | 'red' | 'blue' | 'gold'>('white');
    const [intention, setIntention] = useState('');

    // Mock data
    useEffect(() => {
        setCandles([
            { id: '1', userName: 'Maria S.', intention: 'For my mother\'s healing', color: 'red', remainingHours: 42, prayerCount: 23 },
            { id: '2', userName: 'John D.', intention: 'Thanksgiving for answered prayers', color: 'gold', remainingHours: 156, prayerCount: 45 },
            { id: '3', userName: 'Anonymous', intention: 'For peace in our family', color: 'white', remainingHours: 18, prayerCount: 12 },
            { id: '4', userName: 'Sarah M.', intention: 'Protection for my children', color: 'blue', remainingHours: 65, prayerCount: 31 },
            { id: '5', userName: 'Peter L.', intention: 'Guidance in career decision', color: 'white', remainingHours: 8, prayerCount: 7 },
            { id: '6', userName: 'Anonymous', intention: 'For the souls in purgatory', color: 'gold', remainingHours: 140, prayerCount: 89 },
        ]);
    }, []);

    const handlePray = (candleId: string) => {
        setCandles(prev => prev.map(c =>
            c.id === candleId ? { ...c, prayerCount: c.prayerCount + 1 } : c
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 py-12 text-center">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Flame className="w-10 h-10 text-amber-400" />
                        <h1 className="text-4xl font-bold text-white">Virtual Prayer Candles</h1>
                    </div>
                    <p className="text-amber-200 text-lg max-w-2xl mx-auto">
                        Light a candle for your intentions. When others pray for you, your candle burns brighter and longer.
                    </p>
                    <button
                        onClick={() => setShowLightModal(true)}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30"
                    >
                        🕯️ Light a Candle
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
                    {[
                        { icon: Flame, label: 'Active Candles', value: candles.length },
                        { icon: Heart, label: 'Prayers Offered', value: candles.reduce((s, c) => s + c.prayerCount, 0) },
                        { icon: Users, label: 'People Praying', value: '1,234' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center p-4 bg-white/5 rounded-xl backdrop-blur">
                            <stat.icon className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Candle Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {candles.map((candle) => (
                        <div
                            key={candle.id}
                            className="group relative bg-white/5 rounded-2xl p-4 backdrop-blur hover:bg-white/10 transition-all duration-300"
                        >
                            {/* Candle Visual */}
                            <div className="relative flex flex-col items-center">
                                {/* Flame */}
                                <div
                                    className="w-6 h-10 rounded-full animate-pulse mb-1"
                                    style={{
                                        background: `radial-gradient(ellipse at bottom, ${CANDLE_COLORS[candle.color].flame}, transparent 70%)`,
                                        filter: 'blur(1px)',
                                    }}
                                />
                                {/* Candle Body */}
                                <div
                                    className={`w-10 h-20 rounded-t-lg bg-gradient-to-b ${CANDLE_COLORS[candle.color].bg} shadow-lg ${CANDLE_COLORS[candle.color].glow}`}
                                />
                                {/* Base */}
                                <div className="w-12 h-3 bg-amber-800 rounded-b-lg" />
                            </div>

                            {/* Info */}
                            <div className="mt-4 text-center">
                                <p className="text-white font-medium text-sm truncate">{candle.userName}</p>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-2 h-8">{candle.intention}</p>
                                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{candle.remainingHours}h left</span>
                                </div>
                            </div>

                            {/* Pray Button */}
                            <button
                                onClick={() => handlePray(candle.id)}
                                className="mt-3 w-full py-2 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                🙏 Pray ({candle.prayerCount})
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Light Candle Modal */}
            {showLightModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="text-amber-400" />
                            Light a Prayer Candle
                        </h2>

                        {/* Color Selection */}
                        <div className="mb-4">
                            <label className="text-gray-300 text-sm mb-2 block">Choose candle color:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(Object.keys(CANDLE_COLORS) as Array<keyof typeof CANDLE_COLORS>).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedColor === color
                                                ? 'border-amber-400 bg-amber-400/20'
                                                : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-12 mx-auto rounded-t bg-gradient-to-b ${CANDLE_COLORS[color].bg}`}
                                        />
                                        <p className="text-xs text-gray-400 mt-1 capitalize">{color}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intention */}
                        <div className="mb-6">
                            <label className="text-gray-300 text-sm mb-2 block">Your intention:</label>
                            <textarea
                                value={intention}
                                onChange={(e) => setIntention(e.target.value)}
                                placeholder="Share your prayer intention..."
                                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLightModal(false)}
                                className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: API call to light candle
                                    setShowLightModal(false);
                                    setIntention('');
                                }}
                                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold"
                            >
                                Light Candle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
