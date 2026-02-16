"use client";

import { useState, useEffect } from 'react';
import { Users, UserPlus, Heart, MessageSquare, Plus, Check, X, Search } from 'lucide-react';

type Partner = {
    id: string;
    name: string;
    initials: string;
    status: 'active' | 'pending';
};

type PrayerRequest = {
    id: string;
    author: string;
    content: string;
    date: string;
    prayedCount: number;
    isMine: boolean;
};

const MOCK_PARTNERS: Partner[] = [
    { id: '1', name: 'Maria Garcia', initials: 'MG', status: 'active' },
    { id: '2', name: 'John Smith', initials: 'JS', status: 'active' },
    { id: '3', name: 'Sarah Lee', initials: 'SL', status: 'pending' },
];

const MOCK_REQUESTS: PrayerRequest[] = [
    { id: '1', author: 'Maria Garcia', content: 'Please pray for my mother\'s surgery tomorrow.', date: '2025-05-12', prayedCount: 5, isMine: false },
    { id: '2', author: 'John Smith', content: 'Asking for guidance in my new job search.', date: '2025-05-14', prayedCount: 2, isMine: false },
    { id: '3', author: 'You', content: 'For peace in my family during this difficult time.', date: '2025-05-15', prayedCount: 8, isMine: true },
];

export default function PrayerPartnersPage() {
    const [activeTab, setActiveTab] = useState<'requests' | 'partners'>('requests');
    const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
    const [requests, setRequests] = useState<PrayerRequest[]>(MOCK_REQUESTS);
    const [newRequest, setNewRequest] = useState('');

    // Persist requests to simulate a real app
    useEffect(() => {
        const savedRequests = localStorage.getItem('mpt_prayer_requests');
        if (savedRequests) {
            setRequests(JSON.parse(savedRequests));
        } else {
            localStorage.setItem('mpt_prayer_requests', JSON.stringify(MOCK_REQUESTS));
        }
    }, []);

    const handlePray = (id: string) => {
        const updated = requests.map(r =>
            r.id === id ? { ...r, prayedCount: r.prayedCount + 1 } : r
        );
        setRequests(updated);
        localStorage.setItem('mpt_prayer_requests', JSON.stringify(updated));
    };

    const submitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRequest.trim()) return;

        const request: PrayerRequest = {
            id: crypto.randomUUID(),
            author: 'You',
            content: newRequest,
            date: new Date().toISOString().split('T')[0],
            prayedCount: 0,
            isMine: true
        };

        const updated = [request, ...requests];
        setRequests(updated);
        localStorage.setItem('mpt_prayer_requests', JSON.stringify(updated));
        setNewRequest('');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Prayer Partners</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'requests' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        Prayer Requests
                        {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('partners')}
                        className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'partners' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        My Partners
                        {activeTab === 'partners' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                    </button>
                </div>

                {activeTab === 'requests' ? (
                    <div className="space-y-6">
                        {/* Create Request */}
                        <form onSubmit={submitRequest} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                                ME
                            </div>
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={newRequest}
                                    onChange={(e) => setNewRequest(e.target.value)}
                                    placeholder="Share a prayer intention..."
                                    className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={!newRequest.trim()}
                                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        Post Request
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Request Feed */}
                        {requests.map(request => (
                            <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${request.isMine ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {request.isMine ? 'ME' : request.author.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{request.author}</div>
                                            <div className="text-xs text-slate-400">{request.date}</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-700 mb-4 ml-13 pl-13 text-lg leading-relaxed">
                                    {request.content}
                                </p>

                                <div className="flex gap-4 border-t border-slate-50 pt-4">
                                    <button
                                        onClick={() => handlePray(request.id)}
                                        className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors group"
                                    >
                                        <div className={`p-2 rounded-full group-hover:bg-rose-50 ${request.prayedCount > 0 ? 'text-rose-500' : ''}`}>
                                            <Heart size={20} className={request.prayedCount > 0 ? 'fill-rose-500' : ''} />
                                        </div>
                                        <span className="font-medium">{request.prayedCount} Prayers</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors">
                                        <div className="p-2 rounded-full hover:bg-blue-50">
                                            <MessageSquare size={20} />
                                        </div>
                                        <span className="font-medium">Comment</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Your Circle</h2>
                            <button className="flex items-center gap-2 text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                                <UserPlus size={20} />
                                Invite Friend
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {partners.map(partner => (
                                <div key={partner.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                            {partner.initials}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{partner.name}</div>
                                            <div className={`text-xs ${partner.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>
                                                {partner.status === 'active' ? 'Active Partner' : 'Invitation Pending'}
                                            </div>
                                        </div>
                                    </div>
                                    {partner.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors h-24">
                                <Plus size={24} className="mb-1" />
                                <span className="font-medium">Find Partners</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
