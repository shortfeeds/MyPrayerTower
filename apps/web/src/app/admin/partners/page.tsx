'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Church, MapPin, DollarSign, Users, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MassPartner {
    id: string;
    name: string;
    location?: string | null;
    country?: string | null;
    contactEmail?: string | null;
    contactName?: string | null;
    stipendAmount: number;
    dailyCapacity: number;
    isActive: boolean;
    createdAt: string;
    _count?: { MassOffering: number };
}

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<MassPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<MassPartner | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        country: '',
        contactEmail: '',
        contactName: '',
        stipendAmount: 800,
        dailyCapacity: 10,
        isActive: true,
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/partners');
            if (res.ok) {
                const data = await res.json();
                setPartners(data.partners || []);
            } else {
                toast.error('Failed to load partners from database');
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Network error loading partners');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingPartner ? `/api/admin/partners/${editingPartner.id}` : '/api/admin/partners';
            const method = editingPartner ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingPartner ? 'Partner updated successfully' : 'Partner added successfully');
                setShowAddModal(false);
                setEditingPartner(null);
                resetForm();
                fetchPartners();
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data.error || 'Failed to save partner');
            }
        } catch (error) {
            toast.error('Error saving partner');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Partner deleted');
                fetchPartners();
            } else {
                toast.error('Failed to delete partner');
            }
        } catch (error) {
            toast.error('Error deleting partner');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            country: '',
            contactEmail: '',
            contactName: '',
            stipendAmount: 800,
            dailyCapacity: 10,
            isActive: true,
        });
    };

    const openEditModal = (partner: MassPartner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            location: partner.location || '',
            country: partner.country || '',
            contactEmail: partner.contactEmail || '',
            contactName: partner.contactName || '',
            stipendAmount: partner.stipendAmount,
            dailyCapacity: partner.dailyCapacity,
            isActive: partner.isActive,
        });
        setShowAddModal(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Partner Monasteries & Churches</h1>
                    <p className="text-gray-600 mt-1">Manage network partners that offer Mass intentions</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Partner
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Church className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Partners</p>
                            <p className="text-2xl font-bold text-gray-900">{partners.filter(p => p.isActive).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Daily Capacity</p>
                            <p className="text-2xl font-bold text-gray-900">{partners.reduce((sum, p) => sum + p.dailyCapacity, 0)} Masses</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg. Stipend</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${partners.length > 0 ? (partners.reduce((sum, p) => sum + p.stipendAmount, 0) / partners.length / 100).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
                        <p>Loading partners...</p>
                    </div>
                ) : partners.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Church className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-700">No partner monasteries added yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add a partner monastery or parish to route Holy Mass intentions</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Partner</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stipend</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Offerings</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {partners.map(partner => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 text-sm">{partner.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {partner.location || partner.country || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{partner.contactName || '-'}</p>
                                            <p className="text-xs text-gray-500">{partner.contactEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-green-600 text-sm">
                                            ${(partner.stipendAmount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {partner.dailyCapacity}/day
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {partner._count?.MassOffering || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            {partner.isActive ? (
                                                <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-medium">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(partner)}
                                                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner.id, partner.name)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
                )}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {editingPartner ? 'Edit Mass Partner' : 'Add New Mass Partner'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner / Monastery Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        required
                                        placeholder="e.g. Benedictine Monastery of St. Scholastica"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City / Region</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                            placeholder="Subiaco"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                            placeholder="Italy"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                        <input
                                            type="text"
                                            value={formData.contactName}
                                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                            placeholder="Fr. Benedict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                            placeholder="prior@monastery.org"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Amount (cents)</label>
                                        <input
                                            type="number"
                                            value={formData.stipendAmount}
                                            onChange={(e) => setFormData({ ...formData, stipendAmount: parseInt(e.target.value) || 0 })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">${(formData.stipendAmount / 100).toFixed(2)} per Mass</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Capacity</label>
                                        <input
                                            type="number"
                                            value={formData.dailyCapacity}
                                            onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value) || 0 })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Active (ready to receive holy mass intentions)</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setEditingPartner(null); }}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingPartner ? 'Save Changes' : 'Add Partner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
