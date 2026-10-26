'use client';

import React, { useRef, useState } from 'react';
import {
    X,
    Download,
    Share2,
    Check,
    Copy,
    Printer,
    Sparkles,
    Palette
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import {
    SacredCertificate,
    SacredCertificateProps,
    CertificateTheme
} from './SacredCertificate';

export interface CertificateModalProps extends SacredCertificateProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CertificateModal({
    isOpen,
    onClose,
    ...certProps
}: CertificateModalProps) {
    const certRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<CertificateTheme>(certProps.theme || 'cathedral-gold');
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedImg, setCopiedImg] = useState(false);

    if (!isOpen) return null;

    const sanitizedName = (certProps.recipientName || 'Devotee')
        .slice(0, 24)
        .replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `MyPrayerTower-${certProps.type}-${sanitizedName}.png`;

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/app` : 'https://www.myprayertower.com/app';
    const shareMessage = `🕊️ Official Consecration Certificate from MyPrayerTower for "${certProps.recipientName}":\n"${certProps.intention || certProps.dedicatedDetail || 'Solemnly consecrated before the Perpetual Adoration Altar'}"\n\n🙏 View & Join in Prayer: ${shareUrl}\n✝️ Sanctuary Community: https://t.me/myprayertower`;

    const handleDownload = async () => {
        if (!certRef.current) return;
        try {
            setIsExporting(true);
            await new Promise(resolve => setTimeout(resolve, 150));

            const node = certRef.current;
            const dataUrl = await toPng(node, {
                pixelRatio: 2.5,
                cacheBust: true,
                backgroundColor: theme === 'cathedral-gold' ? '#080310' : '#f4efe4',
                style: {
                    margin: '0',
                    maxWidth: '760px',
                    width: '760px',
                }
            });

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to export certificate:', error);
            alert('Could not generate automatic PNG download. You can take a screenshot or use the print option.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleNativeShare = async () => {
        if (!certRef.current) return;
        try {
            setIsExporting(true);
            await new Promise(resolve => setTimeout(resolve, 150));

            const node = certRef.current;
            const blob = await toBlob(node, {
                pixelRatio: 2.2,
                cacheBust: true,
                backgroundColor: theme === 'cathedral-gold' ? '#080310' : '#f4efe4',
                style: {
                    margin: '0',
                    maxWidth: '760px',
                    width: '760px',
                }
            });

            if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
                const file = new File([blob], fileName, { type: 'image/png' });
                await navigator.share({
                    title: `Official Consecration Certificate for ${certProps.recipientName}`,
                    text: shareMessage,
                    files: [file],
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: `Official Consecration Certificate for ${certProps.recipientName}`,
                    text: shareMessage,
                    url: shareUrl,
                });
            } else {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Share error:', error);
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
            }
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyImage = async () => {
        if (!certRef.current) return;
        try {
            const blob = await toBlob(certRef.current, {
                pixelRatio: 2,
                backgroundColor: theme === 'cathedral-gold' ? '#080310' : '#f4efe4',
                style: { margin: '0', maxWidth: '760px', width: '760px' }
            });
            if (blob && navigator.clipboard && (window as any).ClipboardItem) {
                await navigator.clipboard.write([
                    new (window as any).ClipboardItem({ 'image/png': blob })
                ]);
                setCopiedImg(true);
                setTimeout(() => setCopiedImg(false), 2500);
            } else {
                handleCopyText();
            }
        } catch {
            handleCopyText();
        }
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(shareMessage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-3xl bg-[#090514] border-2 border-amber-400/50 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto p-4 sm:p-6 text-white max-h-[96vh] flex flex-col">
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-amber-400/20">
                    <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-black font-black text-lg shadow-md">
                            ☩
                        </span>
                        <div>
                            <h3 className="font-serif font-black text-base sm:text-xl text-amber-100 flex items-center gap-2">
                                Official Sacred Memorabilia
                                <span className="text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                    Archival High-Res
                                </span>
                            </h3>
                            <p className="text-[11px] sm:text-xs text-amber-200/60 font-sans">
                                Vatican-Style Illumination • Ready to Frame, Download &amp; Share
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Theme Switcher */}
                        <div className="flex items-center bg-white/5 border border-amber-400/30 rounded-xl p-0.5">
                            <button
                                onClick={() => setTheme('cathedral-gold')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    theme === 'cathedral-gold'
                                        ? 'bg-amber-400 text-black font-bold shadow-md'
                                        : 'text-white/70 hover:text-white'
                                }`}
                                title="Cathedral Gold (Midnight Edition)"
                            >
                                Cathedral Gold
                            </button>
                            <button
                                onClick={() => setTheme('papal-parchment')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    theme === 'papal-parchment'
                                        ? 'bg-[#f5eed7] text-[#3d2919] font-bold shadow-md'
                                        : 'text-white/70 hover:text-white'
                                }`}
                                title="Papal Parchment (Print &amp; Frame Edition)"
                            >
                                Papal Parchment
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10"
                            aria-label="Close certificate modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Certificate Display / Preview Area */}
                <div className="flex-1 overflow-y-auto py-2 px-1 flex items-center justify-center">
                    <div className="w-full max-w-[760px]">
                        <SacredCertificate
                            ref={certRef}
                            {...certProps}
                            theme={theme}
                        />
                    </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 mt-3 border-t border-amber-400/20 space-y-3">
                    {/* Primary Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Download High-Res PNG */}
                        <button
                            onClick={handleDownload}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isExporting ? 'Generating High-Res PNG...' : 'Download Archival PNG'}</span>
                        </button>

                        {/* Native Share / Social */}
                        <button
                            onClick={handleNativeShare}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share with Family &amp; Friends</span>
                        </button>

                        {/* Copy Image / Text */}
                        <button
                            onClick={handleCopyImage}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 active:scale-95 transition-all"
                        >
                            {copiedImg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedImg ? 'Image Copied to Clipboard!' : 'Copy Certificate'}</span>
                        </button>
                    </div>

                    {/* Social Media Quick Share Strip */}
                    <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                        <span className="hidden sm:inline font-sans text-amber-200/80">
                            Direct Share:
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                            {/* WhatsApp */}
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors font-medium flex items-center gap-1.5"
                            >
                                <span>WhatsApp</span>
                            </a>

                            {/* Telegram */}
                            <a
                                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-colors font-medium flex items-center gap-1.5"
                            >
                                <span>Telegram</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-colors font-medium flex items-center gap-1.5"
                            >
                                <span>Facebook</span>
                            </a>

                            {/* Twitter / X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/10 text-white/90 border border-white/20 transition-colors font-medium flex items-center gap-1.5"
                            >
                                <span>X (Twitter)</span>
                            </a>

                            {/* Print */}
                            <button
                                onClick={handlePrint}
                                className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors font-medium flex items-center gap-1.5"
                                title="Print Certificate"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Print / Frame</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
