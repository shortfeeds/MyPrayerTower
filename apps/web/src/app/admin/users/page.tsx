'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    UserX,
    UserCheck,
    Mail,
    Calendar,
    Filter,
    Download,
    Plus,
    Loader2,
    Users as UsersIcon,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isEmailVerified: boolean;
    isBanned: boolean;
    createdAt: string;
    lastLoginAt?: string;
    subscriptionTier: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [page, searchQuery]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/users?page=${page}&limit=20&search=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(Math.ceil(data.total / 20));
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) return;

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const endpoint = currentStatus ? 'unban' : 'ban';
            const res = await fetch(`${API_BASE}/admin/users/${userId}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Admin action' })
            });

            if (res.ok) {
                toast.success(`User ${currentStatus ? 'unbanned' : 'banned'} successfully`);
                fetchUsers();
                setShowActionMenu(null);
            } else {
                toast.error('Action failed');
            }
        } catch (error) {
            toast.error('Error updating user status');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure? This action is irreversible.')) return;

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            const res = await fetch(`${API_BASE}/admin/users/${userId}`, { method: 'DELETE' });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                toast.success('User deleted');
                setShowActionMenu(null);
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500">Manage user accounts and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => !u.isBanned).length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Premium Members</p>
                            <h3 className="text-2xl font-bold text-gray-900">{users.filter(u => u.subscriptionTier !== 'FREE').length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-transparent border-none text-sm focus:outline-none text-gray-700"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden pb-32">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <p className="text-gray-500">Loading users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium border ${user.isBanned
                                                        ? 'bg-red-50 text-red-700 border-red-100'
                                                        : 'bg-green-50 text-green-700 border-green-100'
                                                    }`}>
                                                    {user.isBanned ? 'Banned' : 'Active'}
                                                </span>
                                                {user.subscriptionTier !== 'FREE' && (
                                                    <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                        {user.subscriptionTier}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {showActionMenu === user.id && (
                                                <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-left">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <UserCheck className="w-4 h-4" /> Edit User
                                                    </Link>
                                                    <button
                                                        onClick={() => handleBanUser(user.id, user.isBanned)}
                                                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${user.isBanned ? 'text-green-600' : 'text-orange-600'
                                                            }`}
                                                    >
                                                        {user.isBanned ? <CheckCircle2 className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                        {user.isBanned ? 'Unban User' : 'Ban User'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-200 rounded bg-white text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-200 rounded bg-white text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
