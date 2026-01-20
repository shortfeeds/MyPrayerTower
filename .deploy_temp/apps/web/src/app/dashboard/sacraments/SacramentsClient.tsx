'use client';

import { useState } from 'react';
import { Search, Plus, FileText, MoreHorizontal, Baby, UserCheck, HeartHandshake } from 'lucide-react';
import { SacramentRecord, SacramentType } from '@mpt/database';

interface SacramentsClientProps {
    records: SacramentRecord[];
    stats: {
        baptisms: number;
        confirmations: number;
        marriages: number;
    };
}

export default function SacramentsClient({ records, stats }: SacramentsClientProps) {
    const [selectedType, setSelectedType] = useState('All');

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sacramental Records</h1>
                    <p className="text-gray-500">Manage and digitize your parish registry</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Record
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Baptisms</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.baptisms}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Baby className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Confirmations</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.confirmations}</h3>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Marriages</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats.marriages}</h3>
                    </div>
                    <div className="p-3 bg-gold-50 text-gold-600 rounded-lg">
                        <HeartHandshake className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                    {['All', 'BAPTISM', 'CONFIRMATION', 'MARRIAGE'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {type === 'All' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Sacrament</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Minister</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.filter(r => selectedType === 'All' || r.type === selectedType).map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{record.candidateName}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${record.type === 'BAPTISM' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        record.type === 'CONFIRMATION' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-gold-50 text-gold-700 border-gold-100'
                                        }`}>
                                        {record.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{record.minister || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${record.status === 'COMPLETED' ? 'text-green-700 bg-green-50' :
                                        record.status === 'SCHEDULED' ? 'text-blue-700 bg-blue-50' :
                                            'text-orange-700 bg-orange-50'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'COMPLETED' ? 'bg-green-600' :
                                            record.status === 'SCHEDULED' ? 'bg-blue-600' :
                                                'bg-orange-600'
                                            }`}></span>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-primary-600" title="View Certificate">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-primary-600" title="Manage">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
