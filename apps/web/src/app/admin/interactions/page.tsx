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
    Heart
} from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams?: {
        days?: string;
        platform?: string;
    };
}

async function InteractionsOverview({ days = 30, platformFilter }: { days: number; platformFilter?: string }) {
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const platformWhere = platformFilter ? { platform: platformFilter } : {};

    let totalClicks = 0;
    let todayClicks = 0;
    let webClicks = 0;
    let appClicks = 0;
    let topTargets: any[] = [];
    let categoryStats: any[] = [];
    let recentClicks: any[] = [];

    try {
        const [
            total,
            today,
            web,
            app,
            targets,
            categories,
            recents
        ] = await Promise.all([
            (db as any).customerInteraction.count({ where: { createdAt: { gte: sinceDate }, ...platformWhere } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { createdAt: { gte: startOfToday }, ...platformWhere } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { platform: 'web', createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.count({ where: { platform: { in: ['android', 'ios'] }, createdAt: { gte: sinceDate } } }).catch(() => 0),
            (db as any).customerInteraction.groupBy({
                by: ['target', 'category'],
                _count: { target: true },
                where: { createdAt: { gte: sinceDate }, ...platformWhere },
                orderBy: { _count: { target: 'desc' } },
                take: 15,
            }).catch(() => []),
            (db as any).customerInteraction.groupBy({
                by: ['category'],
                _count: { category: true },
                where: { createdAt: { gte: sinceDate }, ...platformWhere },
                orderBy: { _count: { category: 'desc' } },
            }).catch(() => []),
            (db as any).customerInteraction.findMany({
                where: { ...platformWhere },
                take: 25,
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
        topTargets = targets;
        categoryStats = categories;
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
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Clicks */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Interactions</span>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                            <MousePointer className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
                        <Activity className="w-3.5 h-3.5 text-blue-500" />
                        <span>Logged in past {days} days</span>
                    </p>
                </div>

                {/* Today's Clicks */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Clicks</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{todayClicks.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Since midnight today</span>
                    </p>
                </div>

                {/* Website Clicks */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Website Actions</span>
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                            <Globe className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{webClicks.toLocaleString()}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Web Share</span>
                        <span className="font-bold text-indigo-600">{webPercent}%</span>
                    </div>
                </div>

                {/* Mobile App Clicks */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Android App Actions</span>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                            <Smartphone className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{appClicks.toLocaleString()}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Mobile Share</span>
                        <span className="font-bold text-amber-600">{appPercent}%</span>
                    </div>
                </div>
            </div>

            {/* Platform Comparison Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Traffic Source Split</h2>
                        <p className="text-xs text-slate-500">Customer engagement distribution across platform touchpoints</p>
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

            {/* Grid: Top Clicked Targets & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Clicked Actions Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Most Clicked Interactions</h2>
                                <p className="text-xs text-slate-500">Highest volume buttons, features, and prayers clicked by customers</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                Top {topTargets.length}
                            </span>
                        </div>

                        {topTargets.length > 0 ? (
                            <div className="space-y-3.5">
                                {topTargets.map((item, idx) => {
                                    const count = item._count?.target || 0;
                                    const percent = Math.round((count / maxTargetCount) * 100);
                                    return (
                                        <div key={idx} className="group">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="w-5 text-slate-400 font-mono font-bold text-[11px]">#{idx + 1}</span>
                                                    <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                        {item.target}
                                                    </span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium uppercase tracking-wider shrink-0">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="font-extrabold text-slate-900 text-right shrink-0 ml-3">
                                                    {count.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">clicks</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p>No interaction clicks logged yet for this period.</p>
                                <p className="text-xs text-slate-400 mt-1">Interactions will stream here live as users click on the website and app.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Interaction Categories</h2>
                                <p className="text-xs text-slate-500">Distribution by intent and ministry</p>
                            </div>
                            <Layers className="w-4 h-4 text-slate-400" />
                        </div>

                        {categoryStats.length > 0 ? (
                            <div className="space-y-4">
                                {categoryStats.map((cat, idx) => {
                                    const count = cat._count?.category || 0;
                                    const percent = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                                    
                                    let icon = Activity;
                                    let badgeColor = 'text-blue-600 bg-blue-50';
                                    if (cat.category === 'devotional') {
                                        icon = Flame;
                                        badgeColor = 'text-rose-600 bg-rose-50';
                                    } else if (cat.category === 'offering') {
                                        icon = Heart;
                                        badgeColor = 'text-amber-600 bg-amber-50';
                                    } else if (cat.category === 'audio') {
                                        icon = Volume2;
                                        badgeColor = 'text-purple-600 bg-purple-50';
                                    } else if (cat.category === 'social') {
                                        icon = Share2;
                                        badgeColor = 'text-emerald-600 bg-emerald-50';
                                    }

                                    const IconComp = icon;

                                    return (
                                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg ${badgeColor}`}>
                                                        <IconComp className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="font-bold text-slate-800 capitalize">{cat.category}</span>
                                                </div>
                                                <span className="font-extrabold text-slate-900">{count.toLocaleString()} ({percent}%)</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-700 rounded-full" style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400 text-xs">
                                No category data available.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Includes Web, TWA, and Android</span>
                        <span className="font-medium text-emerald-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking
                        </span>
                    </div>
                </div>
            </div>

            {/* Live Customer Interaction Feed */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Live Customer Activity Stream</h2>
                        <p className="text-xs text-slate-500">Chronological feed of real customer clicks as they navigate</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Realtime Stream
                    </span>
                </div>

                {recentClicks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                    <th className="pb-3 pl-2">Time</th>
                                    <th className="pb-3">Platform</th>
                                    <th className="pb-3">Action / Target</th>
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3">Path / Screen</th>
                                    <th className="pb-3 pr-2 text-right">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentClicks.map((click) => {
                                    const timeStr = new Date(click.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                    const isApp = click.platform === 'android' || click.platform === 'ios';
                                    return (
                                        <tr key={click.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 pl-2 font-mono text-slate-500 text-[11px] whitespace-nowrap">{timeStr}</td>
                                            <td className="py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isApp ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                    {isApp ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                    {click.platform}
                                                </span>
                                            </td>
                                            <td className="py-3 font-semibold text-slate-800 max-w-xs truncate">{click.target}</td>
                                            <td className="py-3">
                                                <span className="text-[10px] uppercase tracking-wider font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                    {click.category}
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono text-slate-500 text-[11px] max-w-xs truncate">{click.path || '—'}</td>
                                            <td className="py-3 pr-2 text-right font-medium text-slate-600">{click.country || 'Global'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                        No recent interaction events captured yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminInteractionsPage({ searchParams }: PageProps) {
    const days = parseInt(searchParams?.days || '30', 10);
    const platform = searchParams?.platform || '';

    return (
        <div className="space-y-6">
            {/* Header with Title and Range Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <MousePointer className="w-7 h-7 text-blue-600" />
                        Customer Interaction &amp; Click Ledger
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                        High-precision count of customer button taps, devotional actions, and prayer clicks across Web &amp; Android
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {/* Timeframe pills */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-xs">
                        <Link
                            href="/admin/interactions?days=1"
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${days === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Today
                        </Link>
                        <Link
                            href="/admin/interactions?days=7"
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${days === 7 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            7 Days
                        </Link>
                        <Link
                            href="/admin/interactions?days=30"
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${days === 30 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            30 Days
                        </Link>
                    </div>

                    {/* Platform filter */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-xs">
                        <Link
                            href={`/admin/interactions?days=${days}`}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${!platform ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            All
                        </Link>
                        <Link
                            href={`/admin/interactions?days=${days}&platform=web`}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${platform === 'web' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Web
                        </Link>
                        <Link
                            href={`/admin/interactions?days=${days}&platform=android`}
                            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${platform === 'android' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            App
                        </Link>
                    </div>
                </div>
            </div>

            {/* Suspended Overview Content */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            }>
                <InteractionsOverview days={days} platformFilter={platform} />
            </Suspense>
        </div>
    );
}
