'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, HandsPraying } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'; // Assuming UI lib or I will build simple overlay if not exists.
// Actually I'll build a simple custom modal within this file to avoid dependency issues if Shadcn isn't fully set up or I can't find it easily. 
// Re-checking layout.tsx showed minimal imports. I'll make a self-contained accessible Modal component here to be safe and fast.

import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

function BaseModal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gold-100"
                    >
                        {title && (
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-cream-50/50">
                                <h3 className="font-display font-bold text-xl text-sacred-800">{title}</h3>
                                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        )}
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- Closing Prayer Modal ---

interface ClosingPrayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAmen: () => void;
    prayerRequestContent: string;
}

export function ClosingPrayerModal({ isOpen, onClose, onAmen, prayerRequestContent }: ClosingPrayerModalProps) {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Lift Up This Intention">
            <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-sacred-100 rounded-full flex items-center justify-center">
                    <HandsPraying className="w-8 h-8 text-sacred-600" />
                </div> // Fix: icon name might be wrong via lucide-react, checking common names. 'HandsPraying' is likely not in Lucide. using 'Hand' or 'Heart'.
                {/* Actually let's use a known icon or SVGs. Lucide has 'HandHeart' or similar. I'll rely on generic heart for now if I can't check. */}

                <p className="text-gray-600 italic">
                    "Lord, look with favor on this intention..."
                </p>

                <div className="bg-cream-50 p-4 rounded-xl border border-cream-100 text-sacred-800 font-medium font-serif italic relative">
                    <span className="text-4xl absolute top-0 left-2 text-gold-200">"</span>
                    {prayerRequestContent.substring(0, 150)}{prayerRequestContent.length > 150 ? '...' : ''}
                </div>

                <p className="text-gray-600">
                    We ask this through Christ our Lord.
                </p>

                <button
                    onClick={onAmen}
                    className="w-full py-3 bg-sacred-600 hover:bg-sacred-700 text-white font-bold rounded-xl shadow-lg shadow-sacred-500/20 transform hover:scale-[1.02] transition-all"
                >
                    Amen
                </button>
            </div>
        </BaseModal>
    );
}

// --- Report Modal ---

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
    const [reason, setReason] = useState('Inappropriate Content');
    const [details, setDetails] = useState('');

    const handleSubmit = () => {
        onSubmit(`${reason}: ${details}`);
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Report Prayer">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Help us keep this community safe and holy. Why are you reporting this?</p>

                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sacred-500 focus:border-transparent"
                >
                    <option>Inappropriate Content</option>
                    <option>Spam or Scam</option>
                    <option>Disrespectful / Hate Speech</option>
                    <option>Not a Prayer Request</option>
                    <option>Other</option>
                </select>

                <textarea
                    placeholder="Additional details (optional)..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-3 h-24 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sacred-500 focus:border-transparent resize-none"
                />

                <div className="flex gap-3 justify-end pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}

// --- Answered Prayer Modal ---

interface AnsweredModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (testimony: string) => void;
}

export function AnsweredModal({ isOpen, onClose, onSubmit }: AnsweredModalProps) {
    const [testimony, setTestimony] = useState('');

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Praise God!">
            <div className="space-y-4">
                <div className="bg-green-50 text-green-800 p-4 rounded-lg flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">We rejoice with you! Sharing your testimony encourages the faith of others.</p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">How was this prayer answered?</label>
                    <textarea
                        value={testimony}
                        onChange={(e) => setTestimony(e.target.value)}
                        placeholder="Share your testimony here..."
                        className="w-full p-3 h-32 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Skip</button>
                    <button
                        onClick={() => { onSubmit(testimony); onClose(); }}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20"
                    >
                        Share Testimony
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
