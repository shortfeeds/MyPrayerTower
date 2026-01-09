'use client';

import { useState } from 'react';
import { QrCode, Download, Copy, Check, Smartphone } from 'lucide-react';

interface QRCodeGeneratorProps {
    memorialSlug: string;
    memorialName: string;
}

export function QRCodeGenerator({ memorialSlug, memorialName }: QRCodeGeneratorProps) {
    const [copied, setCopied] = useState(false);

    const memorialUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/memorials/${memorialSlug}`
        : `https://myprayertower.com/memorials/${memorialSlug}`;

    // Use Google Charts QR API for simplicity (no npm package needed)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(memorialUrl)}&bgcolor=ffffff&color=1e293b`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `memorial-qr-${memorialSlug}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading QR code:', err);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(memorialUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-gray-900">Memorial QR Code</h4>
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Print this QR code for headstones, memorial cards, or plaques.
            </p>

            {/* QR Code Display */}
            <div className="bg-gray-50 rounded-xl p-4 flex justify-center mb-4">
                <img
                    src={qrCodeUrl}
                    alt={`QR Code for ${memorialName}'s memorial`}
                    width={200}
                    height={200}
                    className="rounded-lg"
                />
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download QR Code
                </button>

                <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-600" />
                            Link Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Memorial Link
                        </>
                    )}
                </button>
            </div>

            {/* Tip */}
            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                    Visitors can scan this code with their phone camera to instantly view the memorial page.
                </p>
            </div>
        </div>
    );
}
