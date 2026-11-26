import { Suspense } from 'react';
import Link from 'next/link';
import {
    MousePointer,
    Smartphone,
    Globe,
    Activity,
    TrendingUp,
    Clock,
    Sparkles,
    Flame,
    Volume2,
    Share2,
    Calendar,
    ArrowUpRight,
    RefreshCw,
    Layers,
    Heart,
    CheckCircle2
} from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams?: {
        days?: string;
        category?: string;
        platform?: string;
    };
}

async function InteractionsOverview({
    days = 30,
    categoryFilter,
    platformFilter
}: {
    days: number;
    categoryFilter?: string;
    platformFilter?: string;
}) {
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const baseWhere: any = {
        createdAt: { gte: sinceDate },
        eventType: { not: 'screen_view' },
        category: { in: ['prayer', 'amen', 'candle', 'audio', 'offering', 'rosary', 'social', 'share', 'download', 'devotional'] },
        NOT: [
            { path: { startsWith: '/admin' } },
            { target: { contains: 'Instance Of' } },
            { target: { contains: 'RouteSettings' } },
            { target: { contains: 'NoTransitionPage' } },
            { target: { contains: 'MaterialPage' } },
            { target: { in: ['Sign In', 'Close', 'Edit User', 'Abandoned Carts', 'Failed Payments', 'Login', 'Search', 'Onboarding'] } },
        ]
    };
    if (categoryFilter && categoryFilter !== 'all') {
        baseWhere.category = categoryFilter;
    }
    if (platformFilter) {
        baseWhere.platform = platformFilter;
    }

    let totalClicks = 0;
    let todayClicks = 0;
    let webClicks = 0;
    let appClicks = 0;
    let prayedClicks = 0;
    let amenClicks = 0;
    let candleClicks = 0;
    let audioClicks = 0;
    let offeringClicks = 0;
    let topTargets: any[] = [];
    let recentClicks: any[] = [];

    try {
        const [
            total,
            today,
            web,
            app,
            prayed,
            amen,
            candle,
            audio,
            offering,
            targets,
            recents
        ] = await Promise.all([
            (db as any).customerInteraction.count({ where: baseWhere }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { ...baseWhere, createdAt: { gte: startOfToday } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { ...baseWhere, platform: 'web' } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { ...baseWhere, platform: { in: ['android', 'ios'] } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { category: 'prayer', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { category: 'amen', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { category: 'candle', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { category: 'audio', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { category: 'offering', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.groupBy({
                by: ['target', 'category'],
                _count: { target: true },
                where: baseWhere,
                orderBy: { _count: { target: 'desc' } },
                take: 20,
            }).catch(() => []),
            (db as any).customerInteraction.findMany({
                where: baseWhere,
                take: 30,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    platform: true,
                    eventType: true,
                    target: true,
                    category: true,
                    path: true,
                    country: true,
                    createdAt: true,
                },
            }).catch(() => [])
        ]);

        totalClicks = total;
        todayClicks = today;
        webClicks = web;
        appClicks = app;
        prayedClicks = prayed;
        amenClicks = amen;
        candleClicks = candle;
        audioClicks = audio;
        offeringClicks = offering;
        topTargets = targets;
        recentClicks = recents;
    } catch (e) {
        console.error('Failed to load customer interactions overview:', e);
    }

    const maxTargetCount = topTargets.length > 0 ? (topTargets[0]._count?.target || 1) : 1;
    const combinedTotal = webClicks + appClicks || 1;
    const webPercent = Math.round((webClicks / combinedTotal) * 100);
    const appPercent = Math.round((appClicks / combinedTotal) * 100);

    return (
        <div className="space-y-8">
            {/* Devotional Engagement Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Total Engagements */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Actions</span>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{totalClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Past {days} days</p>
                </div>

                {/* "I Prayed for This" */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">I Prayed for This</span>
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                            <Heart className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-rose-600">{prayedClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Prayers offered</p>
                </div>

                {/* "Say Amen" */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Say Amen</span>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600">{amenClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Affirmations sealed</p>
                </div>

                {/* Candles Lit */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Candles Lit</span>
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                            <Flame className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-amber-600">{candleClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Vigil intentions</p>
                </div>

                {/* Sacred Ambiance Audio */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Sacred Ambiance</span>
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                            <Volume2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-purple-600">{audioClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Chimes & Chants</p>
                </div>

                {/* Mass Offerings */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Offerings</span>
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-indigo-600">{offeringClicks.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Dedications initiated</p>
                </div>
            </div>

            {/* Platform Comparison Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Engagement Touchpoint Split</h2>
                        <p className="text-xs text-slate-500">Live breakdown of engagement actions performed on Website vs Android App</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-indigo-500" />
                            <span className="font-medium text-slate-700">Website: {webClicks.toLocaleString()} ({webPercent}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="font-medium text-slate-700">Android App: {appClicks.toLocaleString()} ({appPercent}%)</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-indigo-500 transition-all duration-500" style={{ width: `${webPercent}%` }} />
                    <div className="bg-amber-500 transition-all duration-500" style={{ width: `${appPercent}%` }} />
                </div>
            </div>

            {/* Filter Tabs by Button Category */}
            <div className="flex flex-wrap items-center gap-2">
                {[
                    { key: 'all', label: 'All Buttons', icon: Layers },
                    { key: 'prayer', label: '🙏 "I Prayed for This"', icon: Heart },
                    { key: 'amen', label: '🕊️ "Say Amen"', icon: CheckCircle2 },
                    { key: 'candle', label: '🕯️ Candle Lighting', icon: Flame },
                    { key: 'audio', label: '🔔 Sacred Audio & Bells', icon: Volume2 },
                    { key: 'offering', label: '✝️ Mass Offerings', icon: Sparkles },
                    { key: 'social', label: '📤 Share Prayer', icon: Share2 },
                ].map((cat) => {
                    const isActive = (!categoryFilter && cat.key === 'all') || categoryFilter === cat.key;
                    const Icon = cat.icon;
                    return (
                        <Link
                            key={cat.key}
                            href={`/admin/interactions?days=${days}&category=${cat.key}${platformFilter ? `&platform=${platformFilter}` : ''}`}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Grid: Top Specific Engagement Buttons & Realtime Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Specific Engagement Buttons Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Customer Engagement Buttons Ranked</h2>
                                <p className="text-xs text-slate-500">Every specific button clicked by faithful visitors to pray, affirm, or dedicate</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                {topTargets.length} Distinct Buttons
                            </span>
                        </div>

                        {topTargets.length > 0 ? (
                            <div className="space-y-3.5">
                                {topTargets.map((item, idx) => {
                                    const count = item._count?.target || 0;
                                    const percent = Math.round((count / maxTargetCount) * 100);

                                    // Category color badge
                                    let badgeColor = 'bg-slate-100 text-slate-700';
                                    if (item.category === 'prayer') badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200';
                                    else if (item.category === 'amen') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                                    else if (item.category === 'candle') badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200';
                                    else if (item.category === 'audio') badgeColor = 'bg-purple-50 text-purple-700 border border-purple-200';
                                    else if (item.category === 'offering') badgeColor = 'bg-indigo-50 text-indigo-700 border border-indigo-200';

                                    return (
                                        <div key={idx} className="group">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="w-5 text-slate-400 font-mono font-bold text-[11px]">#{idx + 1}</span>
                                                    <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                        {item.target}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="font-mono font-bold text-slate-900 shrink-0">
                                                    {count.toLocaleString()} <span className="text-slate-400 font-normal">clicks</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        item.category === 'prayer' ? 'bg-rose-500' :
                                                        item.category === 'amen' ? 'bg-emerald-500' :
                                                        item.category === 'candle' ? 'bg-amber-500' :
                                                        item.category === 'audio' ? 'bg-purple-500' :
                                                        'bg-indigo-500'
                                                    }`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-xs">
                                No engagement button interactions recorded yet in this time window.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Showing verified customer engagement buttons only</span>
                        <span>Auto-deduplicated</span>
                    </div>
                </div>

                {/* Real-time Interaction Feed */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                Real-time Stream
                            </h2>
                            <span className="text-xs text-slate-400">Latest 30</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Live stream of customers praying, affirming, or lighting candles</p>

                        <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                            {recentClicks.length > 0 ? (
                                recentClicks.map((click) => {
                                    const timeAgo = formatTimeAgo(click.createdAt);
                                    const isAndroid = click.platform === 'android';
                                    return (
                                        <div
                                            key={click.id}
                                            className="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-colors text-xs"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-slate-800 truncate mr-2">{click.target}</span>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{timeAgo}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span className="truncate max-w-[140px] text-slate-400" title={click.path || '/'}>
                                                    {click.path || '/'}
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                    isAndroid ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                    {isAndroid ? 'Android' : 'Web'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-400 text-xs">
                                    No interactions recorded yet. Click buttons on the site or app to see them stream here.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <Link
                            href="/admin/interactions"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Stream
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatTimeAgo(dateString: string | Date): string {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default async function CustomerInteractionsPage({ searchParams }: PageProps) {
    const days = parseInt(searchParams?.days || '30', 10);
    const category = searchParams?.category;
    const platform = searchParams?.platform;

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                        <MousePointer className="w-4 h-4" />
                        <span>Faith &amp; Devotion Analytics</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Customer Engagement &amp; Button Clicks
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Real-time tracking of specific engagement buttons ("I Prayed for This", "Say Amen", "Light a Candle", "Sacred Ambiance") across Web and Android App.
                    </p>
                </div>

                {/* Days Filter */}
                <div className="flex items-center gap-2">
                    {[
                        { label: '7 Days', val: 7 },
                        { label: '30 Days', val: 30 },
                        { label: '90 Days', val: 90 },
                    ].map((tab) => (
                        <Link
                            key={tab.val}
                            href={`/admin/interactions?days=${tab.val}${category ? `&category=${category}` : ''}${platform ? `&platform=${platform}` : ''}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                days === tab.val
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            <Suspense fallback={<div className="p-12 text-center text-slate-400 text-sm">Loading engagement analytics...</div>}>
                <InteractionsOverview
                    days={days}
                    categoryFilter={category}
                    platformFilter={platform}
                />
            </Suspense>
        </div>
    );
}
