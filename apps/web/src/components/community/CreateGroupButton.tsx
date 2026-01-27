
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateGroupDialog } from './CreateGroupDialog';

export function CreateGroupButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold rounded-full shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
            >
                <Plus className="w-5 h-5" />
                Start a New Circle
            </button>

            <CreateGroupDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
