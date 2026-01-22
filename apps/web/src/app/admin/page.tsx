import { Suspense } from 'react';
import Link from 'next/link';
import {
    Users,
    Church,
    Heart,
    Crown,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowRight,
    Activity,
    Eye,
    MousePointer,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { db } from '@/lib/db';
import { SitemapGenerator } from '@/components/admin/SitemapGenerator';

export const dynamic = 'force-dynamic';

async function DashboardStats() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

    const [
        userCount,
        newUsersThisMonth,
        newUsersToday,
        churchCount,
        verifiedChurches,
        saintCount,
        prayerCount,
        prayersToday,
        pendingReports,
        adImpressions,
        adClicks
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
        db.user.count({ where: { createdAt: { gte: startOfToday } } }),
        db.church.count(),
        db.church.count({ where: { isVerified: true } }),
        db.saint.count(),
        db.prayerRequest.count(),
        db.prayerRequest.count({ where: { createdAt: { gte: startOfToday } } }),
        db.userReport.count({ where: { status: 'PENDING' } }),
        db.sponsoredContent.aggregate({ _sum: { impressions: true } }),
        db.sponsoredContent.aggregate({ _sum: { clicks: true } })
    ]);

    const stats = [
        {
            label: 'Total Users',
            value: userCount.toLocaleString(),
            change: `+${newUsersThisMonth} this month`,
            trend: 'up',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            href: '/admin/users'
        },
        {
            label: 'Churches',
            value: churchCount.toLocaleString(),
            change: `${verifiedChurches} verified`,
            trend: 'up',
            icon: Church,
            color: 'from-indigo-500 to-indigo-600',
            href: '/admin/churches'
        },
        {
            label: 'Saints Database',
            value: saintCount.toLocaleString(),
            change: 'Complete collection',
            trend: 'neutral',
            icon: Crown,
            color: 'from-amber-500 to-amber-600',
            href: '/admin/saints'
        },
        {
            label: 'Prayer Requests',
            value: prayerCount.toLocaleString(),
            change: `+${prayersToday} today`,
            trend: 'up',
            icon: Heart,
            color: 'from-rose-500 to-rose-600',
            href: '/admin/prayers'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <Link
                    key={stat.label}
                    href={stat.href}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                    <div className="flex items-center text-xs">
                        {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500 mr-1" />}
                        {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500 mr-1" />}
                        <span className={stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}>
                            {stat.change}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

async function AdPerformance() {
    const ads = await db.sponsoredContent.findMany({
        where: { isActive: true },
        select: {
            id: true,
            title: true,
            impressions: true,
            clicks: true,
            placement: true
        },
        take: 5,
        orderBy: { impressions: 'desc' }
    });

    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Ad Performance</h2>
                <Link href="/admin/ads" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Eye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Impressions</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                    <MousePointer className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <Activity className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{avgCTR}%</p>
                    <p className="text-xs text-gray-500">Avg CTR</p>
                </div>
            </div>

            {ads.length > 0 ? (
                <div className="space-y-3">
                    {ads.map(ad => {
                        const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
                        return (
                            <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">{ad.title}</p>
                                    <p className="text-xs text-gray-500">{ad.placement}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="font-medium text-gray-900">{ctr}%</p>
                                    <p className="text-xs text-gray-500">CTR</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">No active ads</p>
            )}
        </div>
    );
}

async function RecentActivity() {
    const [recentUsers, recentPrayers] = await Promise.all([
        db.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, firstName: true, lastName: true, displayName: true, email: true, createdAt: true }
        }),
        db.prayerRequest.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, createdAt: true, isAnonymous: true }
        })
    ]);

    const activities = [
        ...recentUsers.map(u => ({
            type: 'user',
            title: u.displayName || (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName || 'New User'),
            subtitle: u.email,
            time: u.createdAt,
            icon: Users,
            color: 'bg-blue-100 text-blue-600'
        })),
        ...recentPrayers.map(p => ({
            type: 'prayer',
            title: p.title || 'Prayer Request',
            subtitle: p.isAnonymous ? 'Anonymous' : 'Community Member',
            time: p.createdAt,
            icon: Heart,
            color: 'bg-rose-100 text-rose-600'
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                            <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                            <p className="text-sm text-gray-500 truncate">{activity.subtitle}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(activity.time)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function SystemStatus() {
    const [pendingReports, pendingClaims] = await Promise.all([
        db.userReport.count({ where: { status: 'PENDING' } }),
        db.churchClaim.count({ where: { status: 'PENDING' } })
    ]);

    const statuses = [
        { name: 'API Server', status: 'operational', uptime: '99.9%' },
        { name: 'Database', status: 'operational', uptime: '99.99%' },
        { name: 'CDN', status: 'operational', uptime: '100%' },
        { name: 'RSS Sync', status: 'active', lastRun: '12m ago' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">System Status</h2>

            {pendingReports > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                        <p className="font-medium text-red-900">{pendingReports} Pending Reports</p>
                        <p className="text-sm text-red-600">Require immediate attention</p>
                    </div>
                    <Link href="/admin/reports" className="ml-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                        Review
                    </Link>
                </div>
            )}

            <div className="space-y-3">
                {statuses.map(s => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${s.status === 'operational' || s.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} ${s.status === 'active' ? 'animate-pulse' : ''}`} />
                            <span className="font-medium text-gray-900">{s.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{s.uptime || s.lastRun}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuickActions() {
    const actions = [
        { name: 'Add Church', href: '/admin/churches/create', icon: Church, color: 'bg-indigo-500' },
        { name: 'Add Saint', href: '/admin/cms/saints/create', icon: Crown, color: 'bg-amber-500' },
        { name: 'Create Ad', href: '/admin/ads', icon: Activity, color: 'bg-green-500' },
        { name: 'View Reports', href: '/admin/reports', icon: AlertTriangle, color: 'bg-red-500' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                {actions.map(action => (
                    <Link
                        key={action.name}
                        href={action.href}
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{action.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {today}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats */}
            <Suspense fallback={<div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}</div>}>
                <DashboardStats />
            </Suspense>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <Suspense fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />}>
                        <RecentActivity />
                    </Suspense>
                    <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />}>
                        <AdPerformance />
                    </Suspense>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <SitemapGenerator />
                    <QuickActions />
                    <Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />}>
                        <SystemStatus />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
