'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Edit2, ExternalLink, Save, X, Image, Globe, Smartphone, BarChart3 } from 'lucide-react';

interface Advertisement {
    id: string;
    name: string;
    adSource: 'OFFLINE' | 'GOOGLE';
    imageUrl: string;
    linkUrl: string;
    googleAdUnitId: string;
    altText: string;
    page: string;
    position: string;
    priority: number;
    isActive: boolean;
    impressions: number;
    clicks: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
}

const PAGES = ['home', 'churches', 'saints', 'prayers', 'bible', 'readings', 'prayer-wall', 'memorials'];
const POSITIONS = ['top', 'sidebar', 'inline', 'bottom'];

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        adSource: 'OFFLINE' as 'OFFLINE' | 'GOOGLE',
        imageUrl: '',
        linkUrl: '',
        googleAdUnitId: '',
        altText: '',
        page: 'churches',
        position: 'sidebar',
        priority: 0,
        isActive: true,
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/admin/ads');
            const data = await res.json();
            setAds(data.ads || []);
        } catch (err) {
            console.error('Failed to fetch ads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingAd ? `/api/admin/ads/${editingAd.id}` : '/api/admin/ads';
            const method = editingAd ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setShowForm(false);
            setEditingAd(null);
            resetForm();
            fetchAds();
        } catch (err) {
            console.error('Failed to save ad:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        try {
            await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
            fetchAds();
        } catch (err) {
            console.error('Failed to delete ad:', err);
        }
    };

    const handleToggleActive = async (ad: Advertisement) => {
        try {
            await fetch(`/api/admin/ads/${ad.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ad, isActive: !ad.isActive })
            });
            fetchAds();
        } catch (err) {
            console.error('Failed to toggle ad:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            adSource: 'OFFLINE',
            imageUrl: '',
            linkUrl: '',
            googleAdUnitId: '',
            altText: '',
            page: 'churches',
            position: 'sidebar',
            priority: 0,
            isActive: true,
            startDate: '',
            endDate: ''
        });
    };

    const openEditForm = (ad: Advertisement) => {
        setEditingAd(ad);
        setFormData({
            name: ad.name,
            adSource: ad.adSource || 'OFFLINE',
            imageUrl: ad.imageUrl || '',
            linkUrl: ad.linkUrl || '',
            googleAdUnitId: ad.googleAdUnitId || '',
            altText: ad.altText || '',
            page: ad.page,
            position: ad.position,
            priority: ad.priority || 0,
            isActive: ad.isActive,
            startDate: ad.startDate || '',
            endDate: ad.endDate || ''
        });
        setShowForm(true);
    };

    const getCTR = (clicks: number, impressions: number) => {
        if (impressions === 0) return '0%';
        return ((clicks / impressions) * 100).toFixed(2) + '%';
    };

    // Split ads by source type
    const offlineAds = ads.filter(a => a.adSource !== 'GOOGLE');
    const googleAds = ads.filter(a => a.adSource === 'GOOGLE');

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
                    <p className="text-gray-500 mt-1">Manage offline sponsors and Google AdMob/AdSense ads</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingAd(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Ad
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500">Total Ads</p>
                    <p className="text-3xl font-bold text-gray-900">{ads.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500">Offline Sponsors</p>
                    <p className="text-3xl font-bold text-purple-600">{offlineAds.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500">Google Ads</p>
                    <p className="text-3xl font-bold text-blue-600">{googleAds.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500">Total Impressions</p>
                    <p className="text-3xl font-bold text-emerald-600">{ads.reduce((sum, a) => sum + a.impressions, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500">Total Clicks</p>
                    <p className="text-3xl font-bold text-amber-600">{ads.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Ads Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ad</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Placement</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Performance</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Loading advertisements...
                                    </td>
                                </tr>
                            ) : ads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="font-medium">No advertisements yet</p>
                                        <p className="text-sm">Create your first ad to start displaying sponsors</p>
                                    </td>
                                </tr>
                            ) : ads.map(ad => (
                                <tr key={ad.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {ad.adSource === 'GOOGLE' ? (
                                                <div className="w-20 h-12 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                                                    <Globe className="w-6 h-6 text-blue-500" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={ad.imageUrl}
                                                    alt={ad.altText || ad.name}
                                                    className="w-20 h-12 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x48?text=Ad'; }}
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{ad.name}</p>
                                                {ad.adSource === 'GOOGLE' ? (
                                                    <p className="text-xs text-gray-500">Unit: {ad.googleAdUnitId || 'Not set'}</p>
                                                ) : ad.linkUrl && (
                                                    <a href={ad.linkUrl} target="_blank" rel="noopener" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                        {ad.linkUrl.substring(0, 30)}...
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ad.adSource === 'GOOGLE' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                <Globe className="w-3 h-3" />
                                                Google
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                                <Smartphone className="w-3 h-3" />
                                                Offline
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                            {ad.page}
                                        </span>
                                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded ml-1">
                                            {ad.position}
                                        </span>
                                        {ad.priority > 0 && (
                                            <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded ml-1">
                                                P{ad.priority}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ad.isActive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                <Eye className="w-3 h-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                                                <EyeOff className="w-3 h-3" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-gray-900">{ad.impressions.toLocaleString()} views</p>
                                            <p className="text-gray-500">{ad.clicks} clicks • {getCTR(ad.clicks, ad.impressions)} CTR</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleActive(ad)}
                                                className={`p-2 rounded-lg transition-colors ${ad.isActive ? 'text-gray-500 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                                                title={ad.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {ad.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => openEditForm(ad)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ad.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}</h2>
                            <button onClick={() => { setShowForm(false); setEditingAd(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Ad Source Toggle */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ad Source</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, adSource: 'OFFLINE' })}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.adSource === 'OFFLINE'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Smartphone className="w-5 h-5" />
                                        <div className="text-left">
                                            <p className="font-semibold">Offline Sponsor</p>
                                            <p className="text-xs opacity-75">Custom image & link</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, adSource: 'GOOGLE' })}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.adSource === 'GOOGLE'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Globe className="w-5 h-5" />
                                        <div className="text-left">
                                            <p className="font-semibold">Google AdMob</p>
                                            <p className="text-xs opacity-75">Dynamic ads from Google</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Common Fields */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={formData.adSource === 'GOOGLE' ? 'e.g., Homepage Banner Ad' : 'e.g., Holiday Sponsor Banner'}
                                        required
                                    />
                                </div>

                                {/* Conditional Fields based on Ad Source */}
                                {formData.adSource === 'GOOGLE' ? (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Google Ad Unit ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.googleAdUnitId}
                                            onChange={(e) => setFormData({ ...formData, googleAdUnitId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                            placeholder="ca-app-pub-XXXXXXXX/YYYYYYYY or slot ID like 1234567890"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            For mobile: Use AdMob Unit ID • For web: Use AdSense Slot ID
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-red-500">*</span></label>
                                            <input
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://example.com/banner.jpg"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL <span className="text-red-500">*</span></label>
                                            <input
                                                type="url"
                                                value={formData.linkUrl}
                                                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="https://sponsor-website.com"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                                            <input
                                                type="text"
                                                value={formData.altText}
                                                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Descriptive text for the ad"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Placement Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                                    <select
                                        value={formData.page}
                                        onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {PAGES.map(p => (
                                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {POSITIONS.map(p => (
                                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                        <span className="text-gray-400 font-normal ml-1">(Higher = shown first)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div></div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active (Display this ad immediately)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingAd(null); }}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingAd ? 'Update Ad' : 'Create Ad'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
