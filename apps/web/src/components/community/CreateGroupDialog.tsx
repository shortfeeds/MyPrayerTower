
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Users, Lock } from 'lucide-react';

interface CreateGroupDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateGroupDialog({ isOpen, onClose }: CreateGroupDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, isPrivate })
            });

            if (res.ok) {
                const group = await res.json();
                router.refresh();
                router.push(`/community/groups/${group.id}`);
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-sacred-900 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-gold-500" />
                        Create Prayer Group
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Group Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. St. Monica's Intercessors"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="What is the purpose of this group?"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Privacy Toggle */}
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => setIsPrivate(!isPrivate)}>
                        <div className={`p-3 rounded-full ${isPrivate ? 'bg-sacred-900 text-white' : 'bg-green-100 text-green-600'}`}>
                            {isPrivate ? <Lock className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                                {isPrivate ? 'Private Group' : 'Public Group'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isPrivate ? 'Only members can see prayers' : 'Anyone can see and join'}
                            </p>
                        </div>
                        <div className={`w-12 h-7 rounded-full transition-colors relative ${isPrivate ? 'bg-gold-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${isPrivate ? 'left-6' : 'left-1'}`} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-lg rounded-xl shadow-lg hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Group'}
                    </button>
                </form>
            </div>
        </div>
    );
}
