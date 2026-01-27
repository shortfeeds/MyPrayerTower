
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JoinGroupButton({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleJoin() {
        setLoading(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/join`, { method: 'POST' });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to join group');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Joining...' : 'Join Circle'}
        </button>
    );
}
