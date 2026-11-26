'use client';

import { useState, useEffect } from 'react';
import { Activity, Mail, CreditCard, Database, Save, Check, Send, Layout, RefreshCw } from 'lucide-react';

export default function FrontendStudioPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [emailResult, setEmailResult] = useState<string | null>(null);

    const [health, setHealth] = useState<any>(null);
    const [frontendConfig, setFrontendConfig] = useState({
        heroTitle: 'Enter a Sanctuary of Perpetual Prayer',
        heroSubtitle: 'Light a vigil candle before the altar, unite in the Holy Rosary, and entrust your intentions to priests and faithful worldwide.',
        candlesBurningCount: '12,847',
        faithfulOfferedCount: '428',
        googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app',
        appRatingText: '4.8 Rating · 100% Free',
        seasonalBannerText: 'Advent & Christmas Gift Bundles Now Available',
    });

    const loadAll = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/system-health');
            const data = await res.json();
            if (data.health) setHealth(data.health);
            if (data.frontendConfig) setFrontendConfig(data.frontendConfig);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch('/api/admin/system-health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'save_frontend_config', frontendConfig }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setTestingEmail(true);
        setEmailResult(null);
        try {
            const res = await fetch('/api/admin/system-health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send_test_email' }),
            });
            const data = await res.json();
            setEmailResult(data.success ? 'Test email sent to myprayertower2@gmail.com!' : `Failed: ${data.error}`);
        } finally {
            setTestingEmail(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Layout className="w-6 h-6 text-amber-500" />
                        Enterprise Frontend Studio &amp; System Health
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Control live homepage copy, app links, and monitor automated Payments, SMTP &amp; Crons.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadAll}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center gap-2"
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
                        <span>{saving ? 'Saving...' : saved ? 'Published Live!' : 'Publish Frontend Changes'}</span>
                    </button>
                </div>
            </div>

            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-gray-400">Database</span>
                        <Database className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {health?.database || 'Checking...'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Supabase Postgres</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-gray-400">PayPal Gateway</span>
                        <CreditCard className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {health?.paypal?.configured ? `LIVE (${health.paypal.environment})` : 'Not Configured'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Web &amp; Offerings Checkout</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-gray-400">Email SMTP</span>
                        <Mail className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {health?.email?.configured ? 'Configured' : 'Missing'}
                    </div>
                    <button
                        onClick={handleTestEmail}
                        disabled={testingEmail}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
                    >
                        <Send className="w-3 h-3" />
                        <span>{testingEmail ? 'Sending...' : 'Send Test Email'}</span>
                    </button>
                    {emailResult && <p className="text-[11px] text-emerald-600 mt-1">{emailResult}</p>}
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-gray-400">Automation Crons</span>
                        <Activity className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                        <div>Liturgical: {health?.crons?.liturgical?.at ? new Date(health.crons.liturgical.at).toLocaleString() : 'Scheduled'}</div>
                        <div>Lifecycle: {health?.crons?.lifecycle?.at ? new Date(health.crons.lifecycle.at).toLocaleString() : 'Scheduled'}</div>
                    </div>
                </div>
            </div>

            {/* Frontend Controls */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Hero &amp; App Controls</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Hero Headline</label>
                        <input
                            type="text"
                            value={frontendConfig.heroTitle}
                            onChange={e => setFrontendConfig({ ...frontendConfig, heroTitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Hero Subtitle</label>
                        <textarea
                            rows={2}
                            value={frontendConfig.heroSubtitle}
                            onChange={e => setFrontendConfig({ ...frontendConfig, heroSubtitle: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Candles Burning Counter</label>
                        <input
                            type="text"
                            value={frontendConfig.candlesBurningCount}
                            onChange={e => setFrontendConfig({ ...frontendConfig, candlesBurningCount: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Monthly Faithful Counter</label>
                        <input
                            type="text"
                            value={frontendConfig.faithfulOfferedCount}
                            onChange={e => setFrontendConfig({ ...frontendConfig, faithfulOfferedCount: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Google Play Store URL</label>
                        <input
                            type="text"
                            value={frontendConfig.googlePlayUrl}
                            onChange={e => setFrontendConfig({ ...frontendConfig, googlePlayUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">App Rating Text</label>
                        <input
                            type="text"
                            value={frontendConfig.appRatingText}
                            onChange={e => setFrontendConfig({ ...frontendConfig, appRatingText: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
