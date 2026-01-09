'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, ShoppingCart, Loader2, Check, AlertCircle } from 'lucide-react';

interface AbandonedCart {
    id: string;
    type: string;
    email: string;
    name: string | null;
    step: string;
    createdAt: string;
    reminderCount: number;
    lastReminder: string | null;
}

export default function AbandonedCartsPage() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            // Mock data for now as we don't have a list API yet
            // In real impl: const res = await fetch('/api/admin/abandoned-carts');

            // Simulating API response
            const mockCarts: AbandonedCart[] = [
                {
                    id: '1',
                    type: 'MEMORIAL',
                    email: 'jane@example.com',
                    name: 'Jane Doe',
                    step: 'payment',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                    reminderCount: 0,
                    lastReminder: null,
                },
                {
                    id: '2',
                    type: 'CANDLE',
                    email: 'mark@example.com',
                    name: null,
                    step: 'details',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
                    reminderCount: 1,
                    lastReminder: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                }
            ];
            setCarts(mockCarts);
        } catch (error) {
            console.error('Failed to fetch carts', error);
        } finally {
            setLoading(false);
        }
    };

    const sendReminder = async (cart: AbandonedCart) => {
        setSendingId(cart.id);
        try {
            // Call API to send manual reminder
            // await fetch(`/api/admin/remind/${cart.id}`, { method: 'POST' });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            // Update local state
            setCarts(prev => prev.map(c =>
                c.id === cart.id
                    ? { ...c, reminderCount: c.reminderCount + 1, lastReminder: new Date().toISOString() }
                    : c
            ));
        } catch (error) {
            console.error('Failed to send reminder', error);
        } finally {
            setSendingId(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Abandoned Carts</h1>
                    <p className="text-gray-500">Track and recover incomplete transactions</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {carts.length} Active Carts
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Type</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reminders</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading carts...
                                    </td>
                                </tr>
                            ) : carts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No abandoned carts found.
                                    </td>
                                </tr>
                            ) : (
                                carts.map((cart) => (
                                    <tr key={cart.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <UserIcon name={cart.name} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{cart.name || 'Guest User'}</div>
                                                    <div className="text-xs text-gray-500">{cart.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cart.type === 'MEMORIAL' ? 'bg-purple-100 text-purple-800' :
                                                    cart.type === 'CANDLE' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {cart.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                                <span className="capitalize">{cart.step}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(cart.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs">{new Date(cart.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${i <= cart.reminderCount ? 'bg-green-500' : 'bg-gray-200'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {cart.reminderCount}/3
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => sendReminder(cart)}
                                                disabled={sendingId === cart.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                                            >
                                                {sendingId === cart.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Mail className="w-3 h-3" />
                                                )}
                                                Send Reminder
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function UserIcon({ name }: { name: string | null }) {
    if (!name) return <ShoppingCart className="w-4 h-4" />;
    return <span className="text-xs font-bold">{name.charAt(0).toUpperCase()}</span>;
}
