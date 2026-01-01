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
    Zap
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
        // General (maps to siteName, siteTagline)
        siteName: 'MyPrayerTower',
        siteTagline: 'All-in-One Catholic Services',

        // Features (maps to prayerWallEnabled, registrationEnabled, etc)
        maintenanceMode: false,
        registrationEnabled: true,
        prayerWallEnabled: true,
        syncEnabled: true,
        syncSchedule: '0 2 * * 0',

        // Pricing (in cents - matches database)
        plusMonthlyPrice: 499,
        plusYearlyPrice: 3999,
        premiumMonthlyPrice: 999,
        premiumYearlyPrice: 7999,
        lifetimePrice: 14999
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
                    <p className="text-gray-500 mt-1">Configure your application settings (saved to database)</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
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
                                <div>
                                    <p className="font-medium">{section.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8">
                    {activeSection === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">General Settings</h2>
                                <p className="text-gray-500">Basic application configuration</p>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => updateSetting('siteName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.siteTagline}
                                        onChange={(e) => updateSetting('siteTagline', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'pricing' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Pricing Settings</h2>
                                <p className="text-gray-500">Subscription prices - changes save to database</p>
                            </div>

                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                <p className="text-green-800 text-sm">
                                    <strong>✓ Database Connected:</strong> Changes here are persisted to Supabase.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Subscription Plans</h3>
                                <div className="grid md:grid-cols-2 gap-4">
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
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lifetime Access ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formatPrice(settings.lifetimePrice)}
                                        onChange={(e) => updateSetting('lifetimePrice', parsePrice(e.target.value))}
                                        className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'features' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Feature Toggles</h2>
                                <p className="text-gray-500">Enable or disable application features</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put site in maintenance mode' },
                                    { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new user signups' },
                                    { key: 'prayerWallEnabled', label: 'Prayer Wall', desc: 'Enable prayer wall feature' },
                                    { key: 'syncEnabled', label: 'Auto Sync', desc: 'Enable automated data syncing' },
                                ].map(feature => (
                                    <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
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
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
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
