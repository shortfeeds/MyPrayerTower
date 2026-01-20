'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Sparkles, X, Flame, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SacredMomentModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'prayer' | 'candle' | 'offering';
}

const CLOSING_PRAYERS = {
    prayer: {
        title: "Prayer Offered",
        text: "Lord, hear our prayer. We lift this intention to You with faith and hope, trusting in Your infinite mercy and love. Amen.",
        subtext: "You are not alone. Our community prays with you.",
    },
    candle: {
        title: "Light in Darkness",
        text: "May this light shine as a symbol of your faith and hope. Let it be a beacon of prayer rising to Heaven.",
        subtext: "Your candle will burn as a sign of your intention.",
    },
    offering: {
        title: "Listing Offered",
        text: "May this offering be received with grace. We unite these intentions with the prayers of the faithful.",
        subtext: "Thank you for supporting our ministry.",
    }
};

export function SacredMomentModal({ isOpen, onClose, type }: SacredMomentModalProps) {
    const content = CLOSING_PRAYERS[type];
    const router = useRouter();

    const handleAction = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-1000"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-sacred-950/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-700 delay-100"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 text-left align-middle shadow-2xl transition-all border border-gold-100 dark:border-gold-900 ring-4 ring-gold-50 dark:ring-gold-900/10">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                        onClick={onClose}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-gold-50 dark:bg-gold-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                                        <Sparkles className="w-8 h-8 text-gold-500" />
                                    </div>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-serif font-bold text-sacred-800 dark:text-sacred-200 mb-4"
                                    >
                                        {content.title}
                                    </Dialog.Title>

                                    <p className="text-lg text-gray-700 dark:text-gray-300 font-serif leading-relaxed mb-6 italic">
                                        "{content.text}"
                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mb-8">
                                        {content.subtext}
                                    </p>

                                    <div className="flex flex-col w-full gap-3">
                                        {type === 'prayer' && (
                                            <button
                                                onClick={() => handleAction('/candles')}
                                                className="w-full py-3.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Flame className="w-5 h-5" />
                                                Light a Candle for this Intention
                                            </button>
                                        )}

                                        {type === 'candle' && (
                                            <button
                                                onClick={() => handleAction('/prayers')}
                                                className="w-full py-3.5 px-6 rounded-xl bg-sacred-600 hover:bg-sacred-700 text-white font-bold shadow-lg shadow-sacred-600/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Heart className="w-5 h-5" />
                                                Say a Prayer for Others
                                            </button>
                                        )}

                                        <button
                                            onClick={onClose}
                                            className="w-full py-3.5 px-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium transition-all"
                                        >
                                            Return to Peace
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
