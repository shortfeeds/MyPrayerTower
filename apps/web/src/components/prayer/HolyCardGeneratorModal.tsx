'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Share2, Copy, Check, X, Image as ImageIcon } from 'lucide-react';

interface HolyCardGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    prayerText: string;
    category?: string;
    authorOrSource?: string;
}

export function HolyCardGeneratorModal({
    isOpen,
    onClose,
    title,
    prayerText,
    category = 'Catholic Prayer',
    authorOrSource = 'Traditional Devotion',
}: HolyCardGeneratorModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [theme, setTheme] = useState<'midnight_gold' | 'cathedral_crimson' | 'marian_blue'>('midnight_gold');
    const [cardFormat, setCardFormat] = useState<'story' | 'square'>('story'); // story: 1080x1920, square: 1080x1080
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Filter and clean prayer text for aesthetic card display (max 280 chars)
    const cleanedText = prayerText
        .replace(/^>.*$/gm, '')
        .replace(/[#*`_]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const cardSnippet = cleanedText.length > 280 ? cleanedText.slice(0, 275) + '...' : cleanedText;

    useEffect(() => {
        if (!isOpen) return;
        renderCanvas();
    }, [isOpen, theme, cardFormat, title, cardSnippet]);

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = cardFormat === 'story' ? 1080 : 1080;
        const height = cardFormat === 'story' ? 1920 : 1080;

        canvas.width = width;
        canvas.height = height;

        // 1. Rich Liturgical Background
        let bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        if (theme === 'midnight_gold') {
            bgGradient.addColorStop(0, '#1c1335');
            bgGradient.addColorStop(0.5, '#0e071c');
            bgGradient.addColorStop(1, '#05020a');
        } else if (theme === 'cathedral_crimson') {
            bgGradient.addColorStop(0, '#380c14');
            bgGradient.addColorStop(0.5, '#1e050a');
            bgGradient.addColorStop(1, '#090103');
        } else {
            // Marian Blue
            bgGradient.addColorStop(0, '#0f2442');
            bgGradient.addColorStop(0.5, '#071324');
            bgGradient.addColorStop(1, '#02060d');
        }
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // 2. Ornate Gilded Borders
        const margin = 60;
        ctx.strokeStyle = '#d4af37'; // Antique Gold
        ctx.lineWidth = 4;
        ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

        // Inner thinner accent border
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(margin + 16, margin + 16, width - (margin + 16) * 2, height - (margin + 16) * 2);

        // Corner Cross Embellishments
        const drawCornerCross = (x: number, y: number) => {
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - 14, y);
            ctx.lineTo(x + 14, y);
            ctx.moveTo(x, y - 14);
            ctx.lineTo(x, y + 14);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        drawCornerCross(margin, margin);
        drawCornerCross(width - margin, margin);
        drawCornerCross(margin, height - margin);
        drawCornerCross(width - margin, height - margin);

        // 3. Central Sacred Emblem (Latin Cross & Halo)
        const emblemY = cardFormat === 'story' ? 280 : 180;
        const haloGrad = ctx.createRadialGradient(width / 2, emblemY, 10, width / 2, emblemY, 110);
        haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(width / 2, emblemY, 110, 0, Math.PI * 2);
        ctx.fill();

        // Gilded Cross
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(width / 2, emblemY - 50);
        ctx.lineTo(width / 2, emblemY + 50);
        ctx.moveTo(width / 2 - 32, emblemY - 18);
        ctx.lineTo(width / 2 + 32, emblemY - 18);
        ctx.stroke();

        // 4. Category Tag
        ctx.fillStyle = '#e5c07b';
        ctx.font = '600 24px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '6px';
        ctx.fillText(category.toUpperCase(), width / 2, emblemY + 110);

        // 5. Prayer Title (Wrapped)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px "Cinzel", Georgia, serif';
        ctx.letterSpacing = '1px';
        const titleY = emblemY + 180;

        // Title text wrapping
        const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
            const words = text.split(' ');
            let line = '';
            let currentY = y;

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    ctx.fillText(line.trim(), x, currentY);
                    line = words[n] + ' ';
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line.trim(), x, currentY);
            return currentY;
        };

        const afterTitleY = wrapText(title, width / 2, titleY, width - 240, 64);

        // Decorative Divider
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 90, afterTitleY + 36);
        ctx.lineTo(width / 2 + 90, afterTitleY + 36);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(width / 2, afterTitleY + 36, 5, 0, Math.PI * 2);
        ctx.fill();

        // 6. Prayer Snippet (Italic, Sacred, Centered)
        ctx.fillStyle = '#f3f4f6';
        ctx.font = 'italic 34px Georgia, serif';
        ctx.letterSpacing = '0.5px';
        const prayerStartY = afterTitleY + 110;
        const afterPrayerY = wrapText(`“${cardSnippet}”`, width / 2, prayerStartY, width - 260, 52);

        // 7. Footer Seal & Watermark
        const footerY = height - 140;
        ctx.fillStyle = '#d4af37';
        ctx.font = '600 22px Georgia, serif';
        ctx.letterSpacing = '4px';
        ctx.fillText('MY PRAYER TOWER', width / 2, footerY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '18px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('www.myprayertower.com • Daily Catholic Sanctuary', width / 2, footerY + 36);

        // Update download URL
        setDownloadUrl(canvas.toDataURL('image/png'));
    };

    const handleDownload = () => {
        if (!downloadUrl) return;
        const link = document.createElement('a');
        link.download = `holy-card-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
        link.href = downloadUrl;
        link.click();
    };

    const handleShareWhatsApp = () => {
        const text = `🕊️ *${title}*\n\n“${cardSnippet}”\n\nPray together at My Prayer Tower:\nhttps://www.myprayertower.com`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopyImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            });
        } catch {
            handleDownload();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-[#0e0818] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-amber-200">Catholic Holy Card Creator</h3>
                                <p className="text-xs text-gray-400">Export high-resolution prayer cards for WhatsApp & Instagram</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Canvas Preview & Controls */}
                    <div className="my-4 flex-1 flex flex-col md:flex-row gap-6 items-center overflow-y-auto">
                        {/* Preview Box */}
                        <div className="flex-1 flex justify-center items-center bg-black/40 rounded-2xl p-3 border border-white/5 w-full">
                            <canvas
                                ref={canvasRef}
                                className="rounded-xl shadow-2xl max-h-[46vh] w-auto border border-amber-500/30"
                            />
                        </div>

                        {/* Customization Options */}
                        <div className="w-full md:w-56 flex flex-col gap-4 text-xs">
                            <div>
                                <label className="text-gray-300 font-semibold mb-2 block">Card Format</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setCardFormat('story')}
                                        className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                            cardFormat === 'story'
                                                ? 'bg-amber-500 text-black font-bold border-amber-400'
                                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        Story (9:16)
                                    </button>
                                    <button
                                        onClick={() => setCardFormat('square')}
                                        className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                            cardFormat === 'square'
                                                ? 'bg-amber-500 text-black font-bold border-amber-400'
                                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        Post (1:1)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-300 font-semibold mb-2 block">Sacred Theme</label>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        onClick={() => setTheme('midnight_gold')}
                                        className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                                            theme === 'midnight_gold'
                                                ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                                                : 'border-white/10 bg-white/5 text-gray-400'
                                        }`}
                                    >
                                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block" />
                                        Midnight Gold
                                    </button>
                                    <button
                                        onClick={() => setTheme('cathedral_crimson')}
                                        className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                                            theme === 'cathedral_crimson'
                                                ? 'border-red-400 bg-red-500/20 text-red-200'
                                                : 'border-white/10 bg-white/5 text-gray-400'
                                        }`}
                                    >
                                        <span className="w-3.5 h-3.5 rounded-full bg-red-600 inline-block" />
                                        Cathedral Crimson
                                    </button>
                                    <button
                                        onClick={() => setTheme('marian_blue')}
                                        className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                                            theme === 'marian_blue'
                                                ? 'border-blue-400 bg-blue-500/20 text-blue-200'
                                                : 'border-white/10 bg-white/5 text-gray-400'
                                        }`}
                                    >
                                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block" />
                                        Marian Blue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                        <button
                            onClick={handleShareWhatsApp}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                        >
                            <span>💬</span>
                            <span>Share to WhatsApp</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyImage}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 font-semibold rounded-xl text-xs transition-all border border-white/10"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied Holy Card' : 'Copy Image'}</span>
                            </button>

                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs shadow-lg transition-all active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Holy Card</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
