'use client';

import { useState } from 'react';
import { Flag, AlertTriangle, X, Send, CheckCircle } from 'lucide-react';

interface ReportContentButtonProps {
    contentType: 'prayer' | 'user' | 'church' | 'comment';
    contentId: string;
    contentPreview?: string;
    className?: string;
}

const REPORT_REASONS = [
    { value: 'SPAM', label: 'Spam or misleading' },
    { value: 'HARASSMENT', label: 'Harassment or bullying' },
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate content' },
    { value: 'IMPERSONATION', label: 'Impersonation' },
    { value: 'MALICIOUS_LINKS', label: 'Malicious links or scams' },
    { value: 'OTHER', label: 'Other' },
];

export function ReportContentButton({
    contentType,
    contentId,
    contentPreview,
    className = ''
}: ReportContentButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState<string>('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!reason) {
            setError('Please select a reason');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentType,
                    contentId,
                    reason,
                    details: details.trim() || undefined,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit report');
            }

            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setReason('');
                setDetails('');
            }, 2000);
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Report Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`inline-flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-sm ${className}`}
                title="Report this content"
            >
                <Flag className="w-4 h-4" />
                <span className="sr-only md:not-sr-only">Report</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {submitted ? (
                            // Success State
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h3>
                                <p className="text-gray-500">
                                    Thank you for helping keep our community safe.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Report Content</h3>
                                        <p className="text-sm text-gray-500">Help us keep the community safe</p>
                                    </div>
                                </div>

                                {/* Content Preview */}
                                {contentPreview && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600 line-clamp-2">
                                        "{contentPreview}"
                                    </div>
                                )}

                                {/* Reason Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Why are you reporting this?
                                    </label>
                                    <div className="space-y-2">
                                        {REPORT_REASONS.map((r) => (
                                            <label
                                                key={r.value}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${reason === r.value
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={r.value}
                                                    checked={reason === r.value}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <span className="text-sm text-gray-900">{r.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional details (optional)
                                    </label>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Provide any additional context..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        rows={3}
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !reason}
                                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
