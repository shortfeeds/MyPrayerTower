'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Church,
    BookOpen,
    Settings,
    ShieldCheck,
    BarChart3,
    LogOut,
    ChevronDown,
    Search,
    Flame,
    CreditCard,
    DollarSign,
    Candle,
    Gift,
    ShoppingBag,
    AlertOctagon,
    HeartHandshake,
    CheckCircle,
    Flag,
    FileText,
    Activity,
    Sliders,
    Megaphone,
    Globe,
    Mail,
    SlidersHorizontal,
    ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SubMenuItem {
    name: string;
    href: string;
    badge?: number;
}

interface PillarItem {
    name: string;
    icon: any;
    defaultHref: string;
    children: SubMenuItem[];
}

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const [reportCount, setReportCount] = useState(0);
    const [claimCount, setClaimCount] = useState(0);
    const [searchFilter, setSearchFilter] = useState('');

    const [expandedPillars, setExpandedPillars] = useState<string[]>([
        'Financials & Offerings',
        'Community & Ministry',
        'Content & Liturgy',
        'Trust & Safety',
        'Platform & Growth',
    ]);

    useEffect(() => {
        const fetchCounters = async () => {
            try {
                // Reports counter
                const repRes = await fetch('/api/admin/reports?status=PENDING&limit=1');
                if (repRes.ok) {
                    const data = await repRes.json();
                    setReportCount(data.total || 0);
                }
            } catch (err) {
                // non-blocking
            }

            try {
                // Claims counter
                const claimRes = await fetch('/api/admin/claims?limit=1');
                if (claimRes.ok) {
                    const data = await claimRes.json();
                    setClaimCount(data.total || 0);
                }
            } catch (err) {
                // non-blocking
            }
        };

        fetchCounters();
        const interval = setInterval(fetchCounters, 60000);
        return () => clearInterval(interval);
    }, []);

    const togglePillar = (name: string) => {
        setExpandedPillars(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const isLinkActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname === href || pathname?.startsWith(href + '/');
    };

    const pillars: PillarItem[] = [
        {
            name: 'Financials & Offerings',
            icon: CreditCard,
            defaultHref: '/admin/finance/overview',
            children: [
                { name: 'Revenue Overview', href: '/admin/finance/overview' },
                { name: 'Transactions Ledger', href: '/admin/finance/transactions' },
                { name: 'Virtual Candles', href: '/admin/candles' },
                { name: 'Mass Offerings', href: '/admin/mass-offerings' },
                { name: 'Spiritual Bouquets', href: '/admin/bouquets' },
                { name: 'Donations & Tithing', href: '/admin/donations' },
                { name: 'Failed Payments', href: '/admin/finance/failed-payments' },
                { name: 'Abandoned Carts', href: '/admin/abandoned-carts' },
            ]
        },
        {
            name: 'Community & Ministry',
            icon: Users,
            defaultHref: '/admin/users',
            children: [
                { name: 'User Directory', href: '/admin/users' },
                { name: 'Parish Directory', href: '/admin/churches' },
                { name: 'Parish Claim Requests', href: '/admin/churches/claims', badge: claimCount },
                { name: 'Verified Parishes', href: '/admin/churches/verified' },
                { name: 'Eternal Memorials', href: '/admin/memorials' },
                { name: 'Mass Partners Network', href: '/admin/partners' },
            ]
        },
        {
            name: 'Content & Liturgy',
            icon: BookOpen,
            defaultHref: '/admin/cms/prayers',
            children: [
                { name: 'Prayer Wall & Queue', href: '/admin/cms/prayers' },
                { name: 'Saints & Feasts CMS', href: '/admin/cms/saints' },
                { name: 'Catholic Articles', href: '/admin/articles' },
            ]
        },
        {
            name: 'Trust & Safety',
            icon: ShieldCheck,
            defaultHref: '/admin/moderation',
            children: [
                { name: 'Content Moderation', href: '/admin/moderation' },
                { name: 'Incident Reports', href: '/admin/reports', badge: reportCount },
                { name: 'Audit & Task Logs', href: '/admin/audit' },
            ]
        },
        {
            name: 'Platform & Growth',
            icon: SlidersHorizontal,
            defaultHref: '/admin/analytics',
            children: [
                { name: 'Platform Analytics', href: '/admin/analytics' },
                { name: 'Sponsor Advertisements', href: '/admin/ads' },
                { name: 'Instant Indexing (SEO)', href: '/admin/indexing' },
                { name: 'Newsletter Subscribers', href: '/admin/newsletter' },
                { name: 'Feature Controls', href: '/admin/features' },
                { name: 'Platform Settings', href: '/admin/settings' },
            ]
        }
    ];

    return (
        <>
            {/* Sidebar Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B132B] text-slate-100 border-r border-slate-800/80
                transform transition-transform duration-300 z-50 flex flex-col overflow-hidden shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Custom Scrollbar */}
                <style jsx global>{`
                    .admin-sidebar-scroll::-webkit-scrollbar {
                        width: 4px;
                    }
                    .admin-sidebar-scroll::-webkit-scrollbar-thumb {
                        background: #1e293b;
                        border-radius: 4px;
                    }
                    .admin-sidebar-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }
                `}</style>

                {/* Brand / Logo */}
                <div className="p-4 border-b border-slate-800/60 bg-[#070D1E]/60 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3 px-1">
                        <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
                        </div>
                        <div>
                            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 tracking-tight block">
                                MyPrayerTower
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                                Admin Portal
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Search Quick-Filter */}
                <div className="px-3 pt-3 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter modules..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/60 focus:border-amber-500/60"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto admin-sidebar-scroll">
                    {/* Top-Level Dashboard */}
                    {(!searchFilter || 'dashboard overview'.includes(searchFilter.toLowerCase())) && (
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                pathname === '/admin'
                                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                            <span>Executive Dashboard</span>
                        </Link>
                    )}

                    {/* 5 Enterprise Pillars */}
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        const matchingChildren = pillar.children.filter(c =>
                            !searchFilter || c.name.toLowerCase().includes(searchFilter.toLowerCase())
                        );

                        if (searchFilter && matchingChildren.length === 0 && !pillar.name.toLowerCase().includes(searchFilter.toLowerCase())) {
                            return null;
                        }

                        const isPillarActive = pillar.children.some(c => isLinkActive(c.href));
                        const isExpanded = expandedPillars.includes(pillar.name) || Boolean(searchFilter);
                        const pillarTotalBadge = pillar.children.reduce((acc, c) => acc + (c.badge || 0), 0);

                        return (
                            <div key={pillar.name} className="pt-1">
                                <button
                                    onClick={() => togglePillar(pillar.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors text-xs font-semibold ${
                                        isPillarActive
                                            ? 'text-amber-400 bg-amber-500/10'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${isPillarActive ? 'text-amber-400' : 'text-slate-400'}`} />
                                        <span className="truncate">{pillar.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {pillarTotalBadge > 0 && !isExpanded && (
                                            <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                                {pillarTotalBadge}
                                            </span>
                                        )}
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="mt-0.5 ml-3 pl-3 border-l border-slate-800/80 space-y-0.5">
                                        {(searchFilter ? matchingChildren : pillar.children).map((child) => {
                                            const active = isLinkActive(child.href);
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                                        active
                                                            ? 'bg-amber-500/20 text-amber-300 font-semibold'
                                                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                                                    }`}
                                                >
                                                    <span className="truncate">{child.name}</span>
                                                    {Boolean(child.badge && child.badge > 0) && (
                                                        <span className="ml-2 px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                                            {child.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer User & External Link */}
                <div className="p-3 border-t border-slate-800/80 bg-[#070D1E]/60 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800/40 rounded-lg transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-amber-500" />
                            View Public Site
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                    </Link>

                    <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-xl border border-slate-800/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center font-bold text-[11px] text-slate-950 flex-shrink-0">
                                SA
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white text-xs truncate leading-tight">Super Administrator</p>
                                <p className="text-[10px] text-slate-400 truncate leading-tight">Enterprise Console</p>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
                                window.location.href = '/admin/login';
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
