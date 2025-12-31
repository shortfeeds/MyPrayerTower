'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Calendar, Church, DollarSign, Users, TrendingUp, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface MassOffering {
    id: string;
    orderNumber: string;
    offeringType: string;
    amount: number;
    intentionFor: string;
    isForLiving: boolean;
    categories: string[];
    status: string;
    email: string;
    name: string;
    createdAt: string;
    celebrationDate?: string;
    Partner?: { id: string; name: string } | null;
}

interface Statistics {
    totalOfferings: number;
    totalRevenue: number;
    pendingAssignment: number;
    offeredThisMonth: number;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
    PENDING_PAYMENT: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending Payment' },
    PAID: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Awaiting Assignment' },
    ASSIGNED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Assigned' },
    SCHEDULED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Scheduled' },
    OFFERED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Mass Offered' },
    COMPLETED: { bg: 'bg-green-200', text: 'text-green-800', label: 'Completed' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    REFUNDED: { bg: 'bg-red-200', text: 'text-red-800', label: 'Refunded' },
};

const OFFERING_TYPES: Record<string, string> = {
    REGULAR: 'Single Mass',
    PERPETUAL: 'Perpetual Enrollment',
    NOVENA: 'Novena (9 Masses)',
    GREGORIAN: 'Gregorian (30 Masses)',
    EXPEDITED: 'Expedited Mass',
};

export default function AdminMassOfferingsPage() {
    const [offerings, setOfferings] = useState<MassOffering[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Statistics>({
        totalOfferings: 0,
        totalRevenue: 0,
        pendingAssignment: 0,
        offeredThisMonth: 0,
    });
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        fetchOfferings();
    }, [statusFilter]);

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/mass-offerings/admin/all?${params}`);
            const data = await response.json();

            setOfferings(data.offerings || []);

            // Calculate stats
            const allOfferings = data.offerings || [];
            setStats({
                totalOfferings: data.total || allOfferings.length,
                totalRevenue: allOfferings.reduce((sum: number, o: MassOffering) => sum + o.amount, 0),
                pendingAssignment: allOfferings.filter((o: MassOffering) => o.status === 'PAID').length,
                offeredThisMonth: allOfferings.filter((o: MassOffering) => o.status === 'OFFERED' || o.status === 'COMPLETED').length,
            });
        } catch (error) {
            console.error('Error fetching offerings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (offeringId: string, partnerId: string) => {
        try {
            await fetch(`/api/mass-offerings/admin/${offeringId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partnerId }),
            });
            fetchOfferings();
        } catch (error) {
            console.error('Error assigning:', error);
        }
    };

    const handleSchedule = async (offeringId: string, date: string) => {
        try {
            await fetch(`/api/mass-offerings/admin/${offeringId}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ celebrationDate: date }),
            });
            fetchOfferings();
        } catch (error) {
            console.error('Error scheduling:', error);
        }
    };

    const handleMarkOffered = async (offeringId: string) => {
        try {
            await fetch(`/api/mass-offerings/admin/${offeringId}/mark-offered`, {
                method: 'POST',
            });
            fetchOfferings();
        } catch (error) {
            console.error('Error marking as offered:', error);
        }
    };

    const filteredOfferings = offerings.filter(o =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.intentionFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mass Offerings Management</h1>
                <p className="text-gray-600 mt-1">View and manage all Mass intention requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Offerings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOfferings}</p>
                        </div>
                        <Church className="w-10 h-10 text-amber-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">${(stats.totalRevenue / 100).toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Assignment</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pendingAssignment}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Offered This Month</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.offeredThisMonth}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order, name, or email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="PAID">Awaiting Assignment</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="OFFERED">Offered</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                        onClick={fetchOfferings}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Offerings Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        Loading...
                    </div>
                ) : filteredOfferings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No offerings found
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Order</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Type</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Intention For</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOfferings.map(offering => (
                                <>
                                    <tr
                                        key={offering.id}
                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setExpandedRow(expandedRow === offering.id ? null : offering.id)}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {expandedRow === offering.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                <span className="font-mono text-sm">{offering.orderNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{OFFERING_TYPES[offering.offeringType] || offering.offeringType}</td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{offering.intentionFor}</p>
                                                <p className="text-xs text-gray-500">{offering.isForLiving ? 'Living' : 'Deceased'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-green-600">${(offering.amount / 100).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_BADGES[offering.status]?.bg || 'bg-gray-100'} ${STATUS_BADGES[offering.status]?.text || 'text-gray-600'}`}>
                                                {STATUS_BADGES[offering.status]?.label || offering.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(offering.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {offering.status === 'PAID' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAssign(offering.id, 'default-partner'); }}
                                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                                                >
                                                    Assign
                                                </button>
                                            )}
                                            {offering.status === 'ASSIGNED' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSchedule(offering.id, new Date().toISOString()); }}
                                                    className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600"
                                                >
                                                    Schedule
                                                </button>
                                            )}
                                            {offering.status === 'SCHEDULED' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleMarkOffered(offering.id); }}
                                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                                >
                                                    Mark Offered
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    {expandedRow === offering.id && (
                                        <tr className="bg-amber-50">
                                            <td colSpan={7} className="px-4 py-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Requested By</p>
                                                        <p className="font-medium">{offering.name}</p>
                                                        <p className="text-gray-600">{offering.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Intentions</p>
                                                        <p className="font-medium">{offering.categories?.join(', ') || 'None specified'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Partner</p>
                                                        <p className="font-medium">{offering.Partner?.name || 'Not assigned'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Celebration Date</p>
                                                        <p className="font-medium">
                                                            {offering.celebrationDate
                                                                ? new Date(offering.celebrationDate).toLocaleDateString()
                                                                : 'Not scheduled'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
