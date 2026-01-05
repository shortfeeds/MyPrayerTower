'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Globe,
    Bell,
    Shield,
    Palette,
    Mail,
    Save,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    DollarSign,
    Zap,
    Flame,
    Scroll,
    Flower
} from 'lucide-react';

interface SettingSection {
    id: string;
    name: string;
    icon: any;
    description: string;
}

const sections: SettingSection[] = [
    { id: 'general', name: 'General', icon: Settings, description: 'App name, branding, and basic settings' },
    { id: 'pricing', name: 'Pricing', icon: DollarSign, description: 'Mass offerings and subscription prices' },
    { id: 'features', name: 'Features', icon: Zap, description: 'Enable or disable app features' },
];

export default function AdminSettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Settings that match AppSettings model in database
    const [settings, setSettings] = useState({
        // General
        siteName: 'MyPrayerTower',
        siteTagline: 'All-in-One Catholic Services',

        // System Settings
        maintenanceMode: false,
        registrationEnabled: true,
        prayerWallEnabled: true,
        syncEnabled: true,
        syncSchedule: '0 2 * * 0',

        // Subscription Pricing
        plusMonthlyPrice: 499,
        plusYearlyPrice: 3999,
        premiumMonthlyPrice: 999,
        premiumYearlyPrice: 7999,
        lifetimePrice: 14999,

        // Candle Pricing
        candleOneDayPrice: 100,
        candleThreeDayPrice: 300,
        candleSevenDayPrice: 500,
        candleThirtyDayPrice: 1500,

        // Mass Offering Pricing
        massRegularPrice: 1500,
        massExpeditedPrice: 2500,
        massNovenaPrice: 7500,
        massGregorianPrice: 25000,
        massPerpetualPrice: 10000,

        // Spiritual Bouquet Pricing
        bouquetBasePrice: 1000,
        bouquetMassAddOn: 500,
        bouquetCandleAddOn: 200,

        // Feature Toggles
        candlesEnabled: true,
        massOfferingsEnabled: true,
        donationsEnabled: true,
        spiritualBouquetsEnabled: true,
        challengesEnabled: true,
        leaderboardEnabled: true,
        nativeAdsEnabled: true,
        rewardedAdsEnabled: true,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) {
                setSettings(prev => ({ ...prev, ...data.settings }));
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            const data = await res.json();
            if (data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                setError(data.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const formatPrice = (cents: number) => (cents / 100).toFixed(2);
    const parsePrice = (dollars: string) => Math.round(parseFloat(dollars) * 100) || 0;

    const sections = [
        { id: 'general', name: 'General', icon: Settings },
        { id: 'subscriptions', name: 'Subscriptions', icon: DollarSign },
        { id: 'candles', name: 'Candles', icon: Flame },
        { id: 'masses', name: 'Mass Offerings', icon: Scroll },
        { id: 'bouquets', name: 'Spiritual Bouquets', icon: Flower },
        { id: 'features', name: 'Feature Toggles', icon: Zap },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Configure your application settings and pricing</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-2 sticky top-4">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeSection === section.id
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="font-medium">{section.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8">
                    {activeSection === 'general' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">General Settings</h2>
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => updateSetting('siteName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.siteTagline}
                                        onChange={(e) => updateSetting('siteTagline', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'subscriptions' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Subscription Plans</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Plus Monthly ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.plusMonthlyPrice)}
                                        onChange={(e) => updateSetting('plusMonthlyPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Plus Yearly ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.plusYearlyPrice)}
                                        onChange={(e) => updateSetting('plusYearlyPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Premium Monthly ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.premiumMonthlyPrice)}
                                        onChange={(e) => updateSetting('premiumMonthlyPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Premium Yearly ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.premiumYearlyPrice)}
                                        onChange={(e) => updateSetting('premiumYearlyPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lifetime Access ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.lifetimePrice)}
                                        onChange={(e) => updateSetting('lifetimePrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'candles' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Candle Pricing</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">1 Day Candle ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.candleOneDayPrice)}
                                        onChange={(e) => updateSetting('candleOneDayPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">3 Day Candle ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.candleThreeDayPrice)}
                                        onChange={(e) => updateSetting('candleThreeDayPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">7 Day Candle ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.candleSevenDayPrice)}
                                        onChange={(e) => updateSetting('candleSevenDayPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">30 Day / Featured ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.candleThirtyDayPrice)}
                                        onChange={(e) => updateSetting('candleThirtyDayPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'masses' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Mass Offering Pricing</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Regular Mass ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.massRegularPrice)}
                                        onChange={(e) => updateSetting('massRegularPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expedited Mass ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.massExpeditedPrice)}
                                        onChange={(e) => updateSetting('massExpeditedPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Novena (9 Days) ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.massNovenaPrice)}
                                        onChange={(e) => updateSetting('massNovenaPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gregorian (30 Days) ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.massGregorianPrice)}
                                        onChange={(e) => updateSetting('massGregorianPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Perpetual Enrollment ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.massPerpetualPrice)}
                                        onChange={(e) => updateSetting('massPerpetualPrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'bouquets' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Spiritual Bouquet Pricing</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Bouquet Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.bouquetBasePrice)}
                                        onChange={(e) => updateSetting('bouquetBasePrice', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mass Add-on Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.bouquetMassAddOn)}
                                        onChange={(e) => updateSetting('bouquetMassAddOn', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Candle Add-on Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.bouquetCandleAddOn)}
                                        onChange={(e) => updateSetting('bouquetCandleAddOn', parsePrice(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'features' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Feature Toggles</h2>
                            <p className="text-gray-500">Enable or disable application features instantly</p>

                            <div className="space-y-4">
                                {[
                                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put site in maintenance mode (admins can still login)' },
                                    { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new user signups' },
                                    { key: 'prayerWallEnabled', label: 'Prayer Wall', desc: 'Public prayer request feed' },
                                    { key: 'candlesEnabled', label: 'Virtual Candles', desc: 'Light a candle feature' },
                                    { key: 'massOfferingsEnabled', label: 'Mass Offerings', desc: 'Request masses from partners' },
                                    { key: 'donationsEnabled', label: 'Donations', desc: 'Accept donations' },
                                    { key: 'spiritualBouquetsEnabled', label: 'Spiritual Bouquets', desc: 'Send spiritual bouquets' },
                                    { key: 'challengesEnabled', label: 'Prayer Challenges', desc: 'Gamification challenges' },
                                    { key: 'leaderboardEnabled', label: 'Leaderboard', desc: 'Community leaderboard' },
                                    { key: 'nativeAdsEnabled', label: 'Native Ads', desc: 'Show native advertisements' },
                                    { key: 'rewardedAdsEnabled', label: 'Rewarded Ads', desc: 'Show rewarded video ads' },
                                    { key: 'syncEnabled', label: 'Auto Data Sync', desc: 'Background data synchronization' },
                                ].map(feature => (
                                    <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-900">{feature.label}</p>
                                            <p className="text-sm text-gray-500">{feature.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings[feature.key as keyof typeof settings] as boolean}
                                                onChange={(e) => updateSetting(feature.key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
