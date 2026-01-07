'use client';

import { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl?: string;
}

/**
 * VideoModal - Modal for playing demo/tutorial videos
 * Uses YouTube embed or custom video URL
 */
export function VideoModal({ isOpen, onClose, videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ' }: VideoModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                aria-label="Close video"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Video Embed */}
                            <iframe
                                src={videoUrl}
                                title="Demo Video"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface WatchDemoButtonProps {
    className?: string;
}

/**
 * WatchDemoButton - Button to open the video modal
 */
export function WatchDemoButton({ className = '' }: WatchDemoButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/30 transition-all ${className}`}
            >
                <Play className="w-5 h-5" />
                Watch Demo
            </button>

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
