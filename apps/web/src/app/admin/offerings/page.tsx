'use client';

import { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Flame,
    Flower,
    Heart,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function OfferingsDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
                const res = await fetch(`${API_BASE}/admin/offerings/stats`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                toast.error('Failed to load offering stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const cards = [
        {
            title: 'Mass Offerings',
            count: stats?.counts.mass || 0,
            revenue: stats?.revenue.mass || 0,
            icon: Calendar,
            color: 'blue'
        },
        {
            title: 'Virtual Candles',
            count: stats?.counts.candle || 0,
            revenue: stats?.revenue.candle || 0,
            icon: Flame,
            color: 'orange'
        },
        {
            title: 'Donations',
            count: stats?.counts.donation || 0,
            revenue: stats?.revenue.donation || 0,
            icon: Heart,
            color: 'rose'
        },
        {
            title: 'Spiritual Bouquets',
            count: stats?.counts.bouquet || 0,
            revenue: stats?.revenue.bouquet || 0,
            icon: Flower,
            color: 'purple'
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Offerings Overview</h1>
            <p className="text-gray-500">Real-time tracking of all spiritual offerings.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-${card.color}-50 text-${card.color}-600`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                ${(card.revenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{card.count}</span> total offerings
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Revenue Summary */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-indigo-100 font-medium mb-1">Total Contributions</p>
                        <h2 className="text-4xl font-bold">
                            ${(stats?.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                            <p className="text-xs text-indigo-100 uppercase tracking-wider mb-1">Top Source</p>
                            <p className="font-semibold text-lg">Mass Offerings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
