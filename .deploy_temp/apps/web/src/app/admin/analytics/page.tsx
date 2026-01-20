import { Suspense } from 'react';
import {
    Users,
    Heart,
    Church,
    Crown,
    Eye,
    MousePointer,
    TrendingUp,
    Calendar,
    BarChart3,
    Activity,
    Globe,
    Clock
} from 'lucide-react';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function OverviewStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        newUsersThisMonth,
        totalChurches,
        totalSaints,
        totalPrayers,
        newPrayersThisWeek,
        adImpressions,
        adClicks
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        db.church.count(),
        db.saint.count(),
        db.prayerRequest.count(),
        db.prayerRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        db.sponsoredContent.aggregate({ _sum: { impressions: true } }),
        db.sponsoredContent.aggregate({ _sum: { clicks: true } })
    ]);

    const stats = [
        { label: 'Total Users', value: totalUsers, change: `+${newUsersThisMonth} this month`, icon: Users, color: 'text-blue-600' },
        { label: 'Churches', value: totalChurches, change: 'Active listings', icon: Church, color: 'text-indigo-600' },
        { label: 'Saints', value: totalSaints, change: 'In database', icon: Crown, color: 'text-amber-600' },
        { label: 'Prayer Requests', value: totalPrayers, change: `+${newPrayersThisWeek} this week`, icon: Heart, color: 'text-rose-600' },
        { label: 'Ad Impressions', value: adImpressions._sum.impressions || 0, change: 'Total views', icon: Eye, color: 'text-green-600' },
        { label: 'Ad Clicks', value: adClicks._sum.clicks || 0, change: 'Total clicks', icon: MousePointer, color: 'text-purple-600' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm text-gray-500">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </div>
            ))}
        </div>
    );
}

async function UserGrowthChart() {
    // Get user signups by month for the past 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const count = await db.user.count({
            where: {
                createdAt: { gte: start, lte: end }
            }
        });

        months.push({
            name: date.toLocaleDateString('en-US', { month: 'short' }),
            count
        });
    }

    const maxCount = Math.max(...months.map(m => m.count), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900">User Growth</h3>
                    <p className="text-sm text-gray-500">New registrations per month</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    Growing
                </div>
            </div>

            <div className="flex items-end gap-4 h-48">
                {months.map((month, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-900 mb-2">{month.count}</span>
                            <div
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                                style={{ height: `${(month.count / maxCount) * 160}px`, minHeight: '8px' }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{month.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function PrayerActivity() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));

        const count = await db.prayerRequest.count({
            where: {
                createdAt: { gte: start, lte: end }
            }
        });

        days.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count
        });
    }

    const maxCount = Math.max(...days.map(d => d.count), 1);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900">Prayer Activity</h3>
                    <p className="text-sm text-gray-500">Requests per day (last 7 days)</p>
                </div>
            </div>

            <div className="flex items-end gap-4 h-48">
                {days.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-900 mb-2">{day.count}</span>
                            <div
                                className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-lg"
                                style={{ height: `${(day.count / maxCount) * 160}px`, minHeight: '8px' }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{day.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function TopCountries() {
    const countries = await db.church.groupBy({
        by: ['country'],
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 10
    });

    const total = countries.reduce((sum, c) => sum + (c._count?.country || 0), 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900">Churches by Country</h3>
                    <p className="text-sm text-gray-500">Top 10 countries</p>
                </div>
                <Globe className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
                {countries.slice(0, 10).map((country, i) => {
                    const count = country._count?.country || 0;
                    const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-700">{country.country || 'Unknown'}</span>
                                <span className="text-gray-500">{count.toLocaleString()} ({percent}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

async function RecentMetrics() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));

    const [todayUsers, todayPrayers] = await Promise.all([
        db.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
        db.prayerRequest.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } })
    ]);

    const metrics = [
        { label: 'New Users Today', value: todayUsers, icon: Users },
        { label: 'Prayers Today', value: todayPrayers, icon: Heart },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900">Today's Metrics</h3>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                        <metric.icon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-xs text-gray-500">{metric.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Platform performance and insights</p>
            </div>

            {/* Overview Stats */}
            <Suspense fallback={<div className="h-24 bg-gray-100 rounded-xl animate-pulse" />}>
                <OverviewStats />
            </Suspense>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />}>
                    <UserGrowthChart />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />}>
                    <PrayerActivity />
                </Suspense>
            </div>

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />}>
                    <TopCountries />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />}>
                    <RecentMetrics />
                </Suspense>
            </div>
        </div>
    );
}
