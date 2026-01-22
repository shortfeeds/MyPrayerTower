'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Crown, Calendar, ImageIcon, User } from 'lucide-react';
import Link from 'next/link';

export default function EditMemorialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        biography: '',
        photoUrl: '',
        isPremium: false,
        isActive: true
    });

    useEffect(() => {
        fetchMemorial();
    }, [id]);

    const fetchMemorial = async () => {
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/memorials/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
                    deathDate: data.deathDate ? new Date(data.deathDate).toISOString().split('T')[0] : '',
                    biography: data.biography || '',
                    photoUrl: data.photoUrl || '',
                    isPremium: data.isPremium || false,
                    isActive: data.isActive || false
                });
            } else {
                toast.error('Failed to load memorial');
                router.push('/admin/memorials');
            }
        } catch (error) {
            console.error('Error loading memorial:', error);
            toast.error('Error loading memorial');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/memorials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Memorial updated successfully');
                router.push('/admin/memorials');
            } else {
                toast.error('Failed to update memorial');
            }
        } catch (error) {
            toast.error('Error updating memorial');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <Link
                href="/admin/memorials"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Memorials
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Edit Memorial</h1>
                        <p className="text-sm text-gray-500">Update memorial tribute</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Crown className="w-5 h-5" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            Deceased Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Birth Date</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Death Date</label>
                                <input
                                    type="date"
                                    value={formData.deathDate}
                                    onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-gray-500" />
                            Content & Media
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Main Photo URL</label>
                                <input
                                    type="url"
                                    value={formData.photoUrl}
                                    onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Biography</label>
                                <textarea
                                    rows={6}
                                    value={formData.biography}
                                    onChange={e => setFormData({ ...formData, biography: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-gray-500" />
                            Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gradient-to-r from-amber-50 to-transparent border-amber-100">
                                <input
                                    type="checkbox"
                                    id="isPremium"
                                    checked={formData.isPremium}
                                    onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="isPremium" className="cursor-pointer">
                                    <span className="block font-medium text-amber-900">Premium Memorial</span>
                                    <span className="block text-xs text-amber-700">Unlock full multimedia features</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="isActive" className="cursor-pointer">
                                    <span className="block font-medium text-gray-900">Publicly Visible</span>
                                    <span className="block text-xs text-gray-500">Show on public memorial listing</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Link
                            href="/admin/memorials"
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
