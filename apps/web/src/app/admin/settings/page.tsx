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
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Email and push notification settings' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Authentication and security options' },
    { id: 'appearance', name: 'Appearance', icon: Palette, description: 'Theme, colors, and branding' },
    { id: 'email', name: 'Email', icon: Mail, description: 'SMTP and email template settings' },
];

export default function AdminSettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState({
        // General
        appName: 'MyPrayerTower',
        tagline: 'All-in-One Catholic Services',
        contactEmail: 'support@myprayertower.com',

        // Pricing (in cents for storage, displayed in dollars)
        massOfferingPrice: 1500, // $15.00
        novenaPrice: 2500, // $25.00
        gregorianMassPrice: 50000, // $500.00
        plusMonthlyPrice: 499, // $4.99
        plusYearlyPrice: 3999, // $39.99
        premiumMonthlyPrice: 999, // $9.99
        premiumYearlyPrice: 7999, // $79.99
        lifetimePrice: 14999, // $149.99

        // Features
        enablePrayerWall: true,
        enableChurchFinder: true,
        enableBibleReader: true,
        enableDailyReadings: true,
        enableSaints: true,
        enableConfessionGuide: true,
        requireEmailVerification: true,
        allowAnonymousPrayers: true,
        requirePrayerModeration: true,

        // Notifications
        sendWelcomeEmail: true,
        sendPrayerNotifications: true,
        sendWeeklyDigest: false,

        // Security
        enableTwoFactor: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,

        // Appearance
        primaryColor: '#b45309',
        darkMode: 'auto',

        // Email
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        fromEmail: 'noreply@myprayertower.com',
        fromName: 'MyPrayerTower'
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
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const formatPrice = (cents: number) => (cents / 100).toFixed(2);
    const parsePrice = (dollars: string) => Math.round(parseFloat(dollars) * 100) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Configure your application settings</p>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
                                    <input
                                        type="text"
                                        value={settings.appName}
                                        onChange={(e) => updateSetting('appName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                    <input
                                        type="text"
                                        value={settings.tagline}
                                        onChange={(e) => updateSetting('tagline', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => updateSetting('contactEmail', e.target.value)}
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
                                <p className="text-gray-500">Set prices for Mass offerings and subscriptions</p>
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-amber-800 text-sm">
                                    <strong>Note:</strong> Changes will take effect immediately on the app and website.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Mass Offerings</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Single Mass ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formatPrice(settings.massOfferingPrice)}
                                            onChange={(e) => updateSetting('massOfferingPrice', parsePrice(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Novena (9 Masses) ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formatPrice(settings.novenaPrice)}
                                            onChange={(e) => updateSetting('novenaPrice', parsePrice(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gregorian (30 Masses) ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formatPrice(settings.gregorianMassPrice)}
                                            onChange={(e) => updateSetting('gregorianMassPrice', parsePrice(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 border-b pb-2 mt-8">Subscription Plans</h3>
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
                                    { key: 'enablePrayerWall', label: 'Prayer Wall', desc: 'Allow users to share and pray for intentions' },
                                    { key: 'enableChurchFinder', label: 'Church Finder', desc: 'Enable church directory and search' },
                                    { key: 'enableBibleReader', label: 'Bible Reader', desc: 'Provide access to Bible chapters' },
                                    { key: 'enableDailyReadings', label: 'Daily Readings', desc: 'Show daily Mass readings' },
                                    { key: 'enableSaints', label: 'Saints Database', desc: 'Access to saints directory' },
                                    { key: 'enableConfessionGuide', label: 'Confession Guide', desc: 'Examination of conscience tool' },
                                    { key: 'requireEmailVerification', label: 'Require Email Verification', desc: 'Users must verify email to access features' },
                                    { key: 'allowAnonymousPrayers', label: 'Anonymous Prayers', desc: 'Allow anonymous prayer submissions' },
                                    { key: 'requirePrayerModeration', label: 'Prayer Moderation', desc: 'Prayers require admin approval before publishing' },
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

                    {activeSection === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Notification Settings</h2>
                                <p className="text-gray-500">Configure email and push notifications</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: 'sendWelcomeEmail', label: 'Welcome Email', desc: 'Send welcome email to new users' },
                                    { key: 'sendPrayerNotifications', label: 'Prayer Notifications', desc: 'Notify users when someone prays for them' },
                                    { key: 'sendWeeklyDigest', label: 'Weekly Digest', desc: 'Send weekly summary of activity' },
                                ].map(notif => (
                                    <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">{notif.label}</p>
                                            <p className="text-sm text-gray-500">{notif.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings[notif.key as keyof typeof settings] as boolean}
                                                onChange={(e) => updateSetting(notif.key, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Security Settings</h2>
                                <p className="text-gray-500">Authentication and security configuration</p>
                            </div>

                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Security Notice</p>
                                    <p className="text-sm text-yellow-700">Changes to security settings may affect all users.</p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableTwoFactor}
                                            onChange={(e) => updateSetting('enableTwoFactor', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (days)</label>
                                    <input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                                    <input
                                        type="number"
                                        value={settings.maxLoginAttempts}
                                        onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Appearance</h2>
                                <p className="text-gray-500">Theme and branding options</p>
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                            className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dark Mode</label>
                                    <select
                                        value={settings.darkMode}
                                        onChange={(e) => updateSetting('darkMode', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="auto">System Default</option>
                                        <option value="light">Always Light</option>
                                        <option value="dark">Always Dark</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'email' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Email Configuration</h2>
                                <p className="text-gray-500">SMTP and email template settings</p>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                                        <input
                                            type="text"
                                            value={settings.smtpHost}
                                            onChange={(e) => updateSetting('smtpHost', e.target.value)}
                                            placeholder="smtp.example.com"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                                        <input
                                            type="number"
                                            value={settings.smtpPort}
                                            onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                                    <input
                                        type="text"
                                        value={settings.smtpUser}
                                        onChange={(e) => updateSetting('smtpUser', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                                        <input
                                            type="email"
                                            value={settings.fromEmail}
                                            onChange={(e) => updateSetting('fromEmail', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                                        <input
                                            type="text"
                                            value={settings.fromName}
                                            onChange={(e) => updateSetting('fromName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
