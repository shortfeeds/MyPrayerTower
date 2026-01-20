'use client';

import Link from 'next/link';
import { Heart, BookOpen, Flame, Shield, Gift } from 'lucide-react';

const quickActions = [
    { href: '/prayers/rosary', label: 'Rosary', icon: '📿', color: 'from-rose-500 to-rose-600' },
    { href: '/readings', label: 'Readings', icon: BookOpen, color: 'from-emerald-500 to-emerald-600' },
    { href: '/confession', label: 'Confession', icon: Shield, color: 'from-purple-500 to-purple-600' },
    { href: '/candles', label: 'Candles', icon: Flame, color: 'from-amber-500 to-amber-600' },
    { href: '/prayer-wall', label: 'Pray', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { href: '/mass-offerings', label: 'Offering', icon: Gift, color: 'from-blue-500 to-blue-600' },
];

export function QuickAccessBar() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">Quick Access</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            {typeof action.icon === 'string' ? (
                                <span className="text-2xl">{action.icon}</span>
                            ) : (
                                <action.icon className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function QuickAccessCompact() {
    return (
        <div className="flex items-center justify-center gap-2 flex-wrap">
            {quickActions.slice(0, 4).map((action, i) => (
                <Link
                    key={i}
                    href={action.href}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-colors"
                >
                    {typeof action.icon === 'string' ? (
                        <span className="text-lg">{action.icon}</span>
                    ) : (
                        <action.icon className="w-4 h-4 text-white" />
                    )}
                    <span className="text-sm font-medium text-white">{action.label}</span>
                </Link>
            ))}
        </div>
    );
}
