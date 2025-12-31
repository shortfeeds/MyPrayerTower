'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Church, MapPin, DollarSign, Users, Check, X, RefreshCw } from 'lucide-react';

interface MassPartner {
    id: string;
    name: string;
    location?: string;
    country?: string;
    contactEmail?: string;
    contactName?: string;
    stipendAmount: number;
    dailyCapacity: number;
    isActive: boolean;
    createdAt: string;
    _count?: { MassOffering: number };
}

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<MassPartner[]>([]);
    const [loading, setLoading] = useState(true);
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
            // TODO: Implement API endpoint
            // For now, using mock data
            setPartners([
                {
                    id: '1',
                    name: 'Benedictine Monastery of Our Lady',
                    location: 'Subiaco, Italy',
                    country: 'Italy',
                    contactEmail: 'masses@monastery.org',
                    contactName: 'Fr. Benedict',
                    stipendAmount: 800,
                    dailyCapacity: 20,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    _count: { MassOffering: 45 },
                },
                {
                    id: '2',
                    name: 'Carmelite Sisters of the Divine Heart',
                    location: 'Kerala, India',
                    country: 'India',
                    contactEmail: 'carmelite@example.com',
                    contactName: 'Sr. Teresa',
                    stipendAmount: 500,
                    dailyCapacity: 15,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    _count: { MassOffering: 32 },
                },
            ]);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement save functionality
        console.log('Saving partner:', formData);
        setShowAddModal(false);
        setEditingPartner(null);
        resetForm();
        fetchPartners();
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
                    <h1 className="text-3xl font-bold text-gray-900">Partner Monasteries</h1>
                    <p className="text-gray-600 mt-1">Manage monasteries and parishes that fulfill Mass intentions</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Partner
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Church className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Partners</p>
                            <p className="text-2xl font-bold">{partners.filter(p => p.isActive).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Capacity/Day</p>
                            <p className="text-2xl font-bold">{partners.reduce((sum, p) => sum + p.dailyCapacity, 0)} Masses</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg. Stipend</p>
                            <p className="text-2xl font-bold">
                                ${partners.length > 0 ? (partners.reduce((sum, p) => sum + p.stipendAmount, 0) / partners.length / 100).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Loading...
                    </div>
                ) : partners.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Church className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No partners added yet</p>
                        <p className="text-sm">Add a monastery or parish to start fulfilling Mass intentions</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Partner</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Contact</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Stipend</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Capacity</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Masses</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map(partner => (
                                <tr key={partner.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <p className="font-medium">{partner.name}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            {partner.location || partner.country || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm">{partner.contactName || '-'}</p>
                                        <p className="text-xs text-gray-500">{partner.contactEmail}</p>
                                    </td>
                                    <td className="px-4 py-4 font-medium">${(partner.stipendAmount / 100).toFixed(2)}</td>
                                    <td className="px-4 py-4">{partner.dailyCapacity}/day</td>
                                    <td className="px-4 py-4">{partner._count?.MassOffering || 0}</td>
                                    <td className="px-4 py-4">
                                        {partner.isActive ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(partner)}
                                                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (cents)</label>
                                        <input
                                            type="number"
                                            value={formData.stipendAmount}
                                            onChange={(e) => setFormData({ ...formData, stipendAmount: parseInt(e.target.value) })}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">${(formData.stipendAmount / 100).toFixed(2)} per Mass</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Capacity</label>
                                        <input
                                            type="number"
                                            value={formData.dailyCapacity}
                                            onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value) })}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 text-amber-500 rounded"
                                    />
                                    <span>Active (can receive new Mass assignments)</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setEditingPartner(null); }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                >
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
