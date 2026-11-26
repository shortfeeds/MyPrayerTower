'use client';

import { useState, useEffect } from 'react';
import { Crown, Sparkles, Bell, Save, Check, RefreshCw } from 'lucide-react';

export default function AdminSponsoredEventsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [tonightSponsor, setTonightSponsor] = useState({
        family: 'The Rodriguez Family',
        dedication: 'In loving memory of Grandma Rosa',
        faithfulCount: 2847,
        eventTitle: "Tonight's Rosary Marathon",
    });

    const [automation, setAutomation] = useState({
        dailyGospelPush: true,
        angelusBellsPush: true,
        divineMercyPush: true,
        candleExpiryAlerts: true,
        sponsoredEventAlerts: true,
        abandonedCartRecovery: true,
    });

    const [recentSponsors, setRecentSponsors] = useState<any[]>([]);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/events/sponsored');
            const data = await res.json();
            if (data.config) {
                setTonightSponsor(data.config.tonightSponsor);
                setAutomation(data.config.automation);
                setRecentSponsors(data.config.recentSponsors || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch('/api/events/sponsored', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'admin_update',
                    tonightSponsor,
                    automation,
                }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Crown className="w-6 h-6 text-amber-500" />
                        Sponsored Sacred Events &amp; Automation Hub
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Synced live across MyPrayerTower Website and Android App.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadConfig}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm flex items-center gap-2 shadow-md"
                    >
                        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'Saving...' : saved ? 'Synced Live!' : 'Save & Sync All Platforms'}</span>
                    </button>
                </div>
            </div>

            {/* Featured Sponsor Editor */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Tonight&apos;s Featured Rosary Sponsor (Live Banner)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Sponsor / Family Name</label>
                        <input
                            type="text"
                            value={tonightSponsor.family}
                            onChange={e => setTonightSponsor({ ...tonightSponsor, family: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Event Title</label>
                        <input
                            type="text"
                            value={tonightSponsor.eventTitle}
                            onChange={e => setTonightSponsor({ ...tonightSponsor, eventTitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Dedication / In Memory Of</label>
                        <input
                            type="text"
                            value={tonightSponsor.dedication}
                            onChange={e => setTonightSponsor({ ...tonightSponsor, dedication: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Automated System & Notification Controls */}
            <div id="automation" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-500" />
                    Automated Notification &amp; Revenue Workflows
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { key: 'dailyGospelPush', label: '7:00 AM Daily Gospel Push', desc: 'Auto-delivered in user local timezone' },
                        { key: 'angelusBellsPush', label: '12:00 PM Angelus Bells', desc: 'Cathedral chime reminder on Android' },
                        { key: 'divineMercyPush', label: '3:00 PM Hour of Great Mercy', desc: 'Divine Mercy Chaplet reminder' },
                        { key: 'candleExpiryAlerts', label: 'Candle Expiry Alerts (2h prior)', desc: 'Prompts renewal or Holy Mass offering' },
                        { key: 'sponsoredEventAlerts', label: 'Sponsored Rosary Live Alerts', desc: 'Notifies faithful 15 mins before Rosary' },
                        { key: 'abandonedCartRecovery', label: 'Abandoned Cart Recovery', desc: 'Automated 1h / 24h / 72h follow-up' },
                    ].map(item => (
                        <label
                            key={item.key}
                            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                        >
                            <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={(automation as any)[item.key]}
                                onChange={e => setAutomation({ ...automation, [item.key]: e.target.checked })}
                                className="w-5 h-5 rounded text-amber-500 mt-0.5"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Recent Sponsor Ledger */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Event Sponsors</h2>
                {recentSponsors.length === 0 ? (
                    <p className="text-sm text-gray-500">No sponsorships recorded yet.</p>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {recentSponsors.map(sp => (
                            <div key={sp.id} className="py-3 flex items-center justify-between gap-4">
                                <div>
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{sp.family}</div>
                                    <div className="text-xs text-gray-500">{sp.packageTitle} · &ldquo;{sp.dedication}&rdquo;</div>
                                </div>
                                <span className="font-mono font-bold text-emerald-600 text-sm">${sp.amount}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
