"use client";

import { useState, useEffect } from 'react';
import { Droplet, BookOpen, Flame, HeartHandshake, User, Cross, Stethoscope, ChevronRight, CheckCircle2, Edit3, X } from 'lucide-react';
import { format } from 'date-fns';

type SacramentType = 'Baptism' | 'First Communion' | 'Confirmation' | 'Matrimony' | 'Holy Orders' | 'Anointing of the Sick';

type SacramentRecord = {
    id: string;
    name: SacramentType;
    icon: any;
    color: string;
    date?: string;
    parish?: string;
    city?: string;
    celebrant?: string;
    notes?: string;
    isReceived: boolean;
};

const DEFAULT_SACRAMENTS: SacramentRecord[] = [
    { id: 'baptism', name: 'Baptism', icon: Droplet, color: 'text-blue-500', isReceived: false },
    { id: 'communion', name: 'First Communion', icon: BookOpen, color: 'text-amber-500', isReceived: false },
    { id: 'confirmation', name: 'Confirmation', icon: Flame, color: 'text-red-500', isReceived: false },
    { id: 'matrimony', name: 'Matrimony', icon: HeartHandshake, color: 'text-pink-500', isReceived: false },
    { id: 'holy_orders', name: 'Holy Orders', icon: Cross, color: 'text-slate-500', isReceived: false },
    { id: 'anointing', name: 'Anointing of the Sick', icon: Stethoscope, color: 'text-green-500', isReceived: false },
];

export default function SacramentsPage() {
    const [records, setRecords] = useState<SacramentRecord[]>(DEFAULT_SACRAMENTS);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<SacramentRecord>>({});

    useEffect(() => {
        const saved = localStorage.getItem('mpt_sacrament_records');
        if (saved) {
            const savedRecords = JSON.parse(saved);
            // Merge saved data with default structure to ensure icons/colors are present
            const merged = DEFAULT_SACRAMENTS.map(def => {
                const savedRec = savedRecords.find((r: any) => r.id === def.id);
                return savedRec ? { ...def, ...savedRec } : def;
            });
            setRecords(merged);
        }
    }, []);

    const handleEdit = (record: SacramentRecord) => {
        setEditingId(record.id);
        setEditForm({ ...record });
    };

    const saveRecord = () => {
        if (!editingId) return;

        const updatedRecords = records.map(r =>
            r.id === editingId
                ? { ...r, ...editForm, isReceived: !!editForm.date }
                : r
        );

        setRecords(updatedRecords);
        localStorage.setItem('mpt_sacrament_records', JSON.stringify(updatedRecords));
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">My Sacraments</h1>
                    <p className="text-slate-600">Keep a digital record of your sacramental life.</p>
                </div>

                <div className="grid gap-6">
                    {records.map((record) => {
                        const Icon = record.icon;
                        const isEditing = editingId === record.id;

                        if (isEditing) {
                            return (
                                <div key={record.id} className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 animate-in zoom-in-95">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-slate-100 ${record.color} bg-opacity-10`}>
                                                <Icon size={24} className={record.color} />
                                            </div>
                                            {record.name}
                                        </h3>
                                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date Received</label>
                                            <input
                                                type="date"
                                                value={editForm.date || ''}
                                                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Church / Parish</label>
                                            <input
                                                type="text"
                                                value={editForm.parish || ''}
                                                onChange={e => setEditForm({ ...editForm, parish: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="e.g. St. Michael's Church"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                value={editForm.city || ''}
                                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="e.g. Rome"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Celebrant (Priest)</label>
                                            <input
                                                type="text"
                                                value={editForm.celebrant || ''}
                                                onChange={e => setEditForm({ ...editForm, celebrant: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="e.g. Fr. John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Memories</label>
                                        <textarea
                                            value={editForm.notes || ''}
                                            onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                            placeholder="Godparents, sponsors, specific bible verse..."
                                        />
                                    </div>

                                    <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                                        <button
                                            onClick={saveRecord}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                        >
                                            Save Record
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={record.id}
                                onClick={() => handleEdit(record)}
                                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all cursor-pointer group hover:shadow-md ${record.isReceived ? 'border-l-4 border-l-green-500 border-y-slate-100 border-r-slate-100' : 'border-slate-100 hover:border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-xl ${record.isReceived ? 'bg-green-50' : 'bg-slate-50 group-hover:bg-blue-50'} transition-colors`}>
                                        <Icon size={32} className={record.isReceived ? 'text-green-600' : 'text-slate-400 group-hover:text-blue-500'} />
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-slate-900">{record.name}</h3>
                                            {record.isReceived && <CheckCircle2 size={18} className="text-green-500" />}
                                        </div>

                                        {record.isReceived ? (
                                            <p className="text-slate-600">
                                                Received on {format(new Date(record.date!), 'MMMM d, yyyy')}
                                                {record.parish && ` at ${record.parish}`}
                                            </p>
                                        ) : (
                                            <p className="text-slate-400 italic">Tap to add details...</p>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        {record.isReceived ? <Edit3 size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
