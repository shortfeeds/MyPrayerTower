'use client';

import React from 'react';
import {
    Flame,
    Church,
    Heart,
    Shield,
    Star,
    Sparkles
} from 'lucide-react';

export type CertificateType = 'blessing' | 'mass-offering' | 'vigil' | 'bouquet' | 'memorial' | 'tabernacle';
export type CertificateTheme = 'cathedral-gold' | 'papal-parchment';

export interface SacredCertificateProps {
    type: CertificateType;
    theme?: CertificateTheme;
    title?: string;
    latinTitle?: string;
    recipientName: string;
    dedicatedDetail?: string;
    donorName?: string;
    intention?: string;
    date?: string;
    durationDays?: number;
    serialNumber?: string;
    scripture?: string;
    scriptureRef?: string;
    pledgedItems?: {
        masses?: number;
        rosaries?: number;
        prayers?: number;
        candles?: number;
    };
    celebrantOrSanctuary?: string;
    sealCode?: string;
}

// Ornate Baroque Corner Filigree Ornament (Inline SVG - zero external dependencies)
function CornerOrnament({ className, flipX, flipY }: { className?: string; flipX?: boolean; flipY?: boolean }) {
    const transform = `${flipX ? 'scaleX(-1) ' : ''}${flipY ? 'scaleY(-1)' : ''}`.trim();
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            style={{ transform: transform || undefined }}
            fill="currentColor"
        >
            <path d="M 0,0 L 50,0 C 44,9 38,18 38,28 C 38,42 52,46 48,60 C 45,70 32,76 22,76 C 16,76 10,74 8,70 C 12,65 16,55 16,42 C 16,28 6,16 0,0 Z" opacity="0.95" />
            <path d="M 0,0 L 0,50 C 9,44 18,38 28,38 C 42,38 46,52 60,48 C 70,45 76,32 76,22 C 76,16 74,10 70,8 C 65,12 55,16 42,16 C 28,16 16,6 0,0 Z" opacity="0.95" />
            <circle cx="20" cy="20" r="4.5" />
            <circle cx="32" cy="11" r="3" />
            <circle cx="11" cy="32" r="3" />
            <path d="M 4,4 L 90,4 C 80,11 65,20 48,20 C 32,20 20,32 20,48 C 20,65 11,80 4,90 Z" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
        </svg>
    );
}

export const SacredCertificate = React.forwardRef<HTMLDivElement, SacredCertificateProps>((props, ref) => {
    const {
        type = 'blessing',
        theme = 'cathedral-gold',
        title,
        latinTitle,
        recipientName,
        dedicatedDetail,
        donorName,
        intention,
        date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        serialNumber = `MPT-${type.toUpperCase().slice(0, 4)}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        scripture,
        scriptureRef,
        pledgedItems,
        celebrantOrSanctuary = 'Sanctuary of Perpetual Adoration & Sacred Vigils',
        sealCode
    } = props;

    const isGold = theme === 'cathedral-gold';

    // Titles & metadata by certificate type
    const defaultTitles: Record<CertificateType, { title: string; latin: string; scripture: string; ref: string }> = {
        'blessing': {
            title: 'CERTIFICATE OF SACRED CONSECRATION',
            latin: 'Benedictio et Consecratio Divina',
            scripture: 'The Lord bless thee, and keep thee: The Lord make his face shine upon thee, and be gracious unto thee: The Lord lift up his countenance upon thee, and give thee peace.',
            ref: 'Numbers 6:24-26'
        },
        'mass-offering': {
            title: 'HOLY MASS OFFERING TESTIMONIAL',
            latin: 'Sacrificium Sanctissimum Altaris',
            scripture: 'From the rising of the sun even unto the going down of the same my name shall be great among the nations; and in every place incense shall be offered unto my name, and a pure offering.',
            ref: 'Malachi 1:11'
        },
        'vigil': {
            title: 'CERTIFICATE OF PERPETUAL VIGIL',
            latin: 'Lumen Perpetuum Coram Domino',
            scripture: 'I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.',
            ref: 'John 8:12'
        },
        'bouquet': {
            title: 'SPIRITUAL BOUQUET OF PRAYERS',
            latin: 'Corona Precum et Florilegium Sacrum',
            scripture: 'And the smoke of the incense, which came with the prayers of the saints, ascended up before God out of the angel\'s hand.',
            ref: 'Revelation 8:4'
        },
        'memorial': {
            title: 'IN SACRED AND ETERNAL MEMORIAM',
            latin: 'Requiem Aeternam Dona Eis, Domine',
            scripture: 'Blessed are the dead which die in the Lord from henceforth: Yea, saith the Spirit, that they may rest from their labours; and their works do follow them.',
            ref: 'Revelation 14:13'
        },
        'tabernacle': {
            title: 'TABERNACLE LAMP CONSECRATION',
            latin: 'Lumen Coram Tabernaculo Sanctissimo',
            scripture: 'Command the children of Israel that they bring unto thee pure oil olive beaten for the light, to cause the lamps to burn continually without the vail of the testimony in the tabernacle.',
            ref: 'Leviticus 24:2-3'
        }
    };

    const activeMeta = defaultTitles[type] || defaultTitles.blessing;
    const displayTitle = title || activeMeta.title;
    const displayLatin = latinTitle || activeMeta.latin;
    const displayScripture = scripture || activeMeta.scripture;
    const displayRef = scriptureRef || activeMeta.ref;

    return (
        /* Outer Canvas Mat Border - Provides 20px of safe non-clipped buffer on all sides */
        <div
            ref={ref}
            className={`w-full max-w-[760px] mx-auto p-4 sm:p-6 rounded-[32px] select-none font-serif transition-colors duration-300 ${
                isGold ? 'bg-[#080310]' : 'bg-[#f4efe4]'
            }`}
            style={{
                boxSizing: 'border-box',
            }}
        >
            {/* Inner Formal Certificate Plaque with Multi-layer Gilded Renaissance Borders */}
            <div
                className={`w-full rounded-[24px] relative p-6 sm:p-10 pb-8 sm:pb-10 border-4 ${
                    isGold
                        ? 'bg-gradient-to-b from-[#150b28] via-[#0a0414] to-[#040108] text-white shadow-[0_20px_70px_rgba(0,0,0,0.9)] border-amber-400'
                        : 'bg-[#fcfaf4] text-[#1f1610] shadow-[0_20px_50px_rgba(80,50,20,0.18)] border-[#b89758]'
                }`}
                style={{
                    letterSpacing: '0.015em',
                }}
            >
                {/* Background Ambient Radiance */}
                {isGold ? (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.22),transparent_70%)] pointer-events-none rounded-[22px]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.15),transparent_65%)] pointer-events-none rounded-[22px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.7),rgba(235,223,197,0.5))] pointer-events-none rounded-[22px]" />
                    </>
                )}

                {/* Inner Concentric Fine Borders */}
                <div
                    className={`absolute inset-2 sm:inset-3 border-2 rounded-2xl pointer-events-none ${
                        isGold ? 'border-amber-400/50' : 'border-[#b89758]/60'
                    }`}
                />
                <div
                    className={`absolute inset-3.5 sm:inset-4.5 border border-dashed rounded-xl pointer-events-none ${
                        isGold ? 'border-amber-300/30' : 'border-[#b89758]/40'
                    }`}
                />

                {/* Four Baroque Corner Ornaments */}
                <CornerOrnament
                    className={`absolute top-2 sm:top-3 left-2 sm:left-3 w-12 sm:w-16 h-12 sm:h-16 pointer-events-none ${
                        isGold ? 'text-amber-400' : 'text-[#a68038]'
                    }`}
                />
                <CornerOrnament
                    flipX
                    className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-12 sm:w-16 h-12 sm:h-16 pointer-events-none ${
                        isGold ? 'text-amber-400' : 'text-[#a68038]'
                    }`}
                />
                <CornerOrnament
                    flipY
                    className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-12 sm:w-16 h-12 sm:h-16 pointer-events-none ${
                        isGold ? 'text-amber-400' : 'text-[#a68038]'
                    }`}
                />
                <CornerOrnament
                    flipX
                    flipY
                    className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-12 sm:w-16 h-12 sm:h-16 pointer-events-none ${
                        isGold ? 'text-amber-400' : 'text-[#a68038]'
                    }`}
                />

                {/* 1. TOP PROMINENT BRANDING: MY PRAYER TOWER */}
                <div className="text-center relative z-10 pt-1 mb-2">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 mb-2">
                        <span className="text-amber-400 text-xs">☩</span>
                        <span className={`text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold font-sans ${isGold ? 'text-amber-300' : 'text-[#7d5e27]'}`}>
                            SANCTUARIUM PERPETUAE ADORATIONIS
                        </span>
                        <span className="text-amber-400 text-xs">☩</span>
                    </div>

                    {/* Unmistakable My Prayer Tower Brand Crest */}
                    <div className="flex flex-col items-center justify-center">
                        <h2 className={`text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-[0.25em] uppercase ${
                            isGold
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]'
                                : 'text-[#38220f]'
                        }`}>
                            MY PRAYER TOWER
                        </h2>
                        <span className={`text-[8.5px] sm:text-[10px] uppercase tracking-[0.25em] font-sans font-semibold mt-0.5 ${isGold ? 'text-amber-200/75' : 'text-[#6e501e]'}`}>
                            Global Digital Catholic Sanctuary &amp; Perpetual Adoration Altar
                        </span>
                    </div>
                </div>

                {/* 2. SACRED EMBLEM / CREST ICON */}
                <div className="relative z-10 flex flex-col items-center justify-center my-2 sm:my-3">
                    <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative p-1 ${
                            isGold
                                ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-[#090312] ring-4 ring-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.6)]'
                                : 'bg-gradient-to-br from-[#d4af37] via-[#b89758] to-[#8c6520] text-amber-50 ring-4 ring-[#a68038]/60 shadow-lg'
                        }`}
                    >
                        <div className="w-full h-full rounded-full border border-amber-900/30 flex items-center justify-center">
                            {type === 'vigil' && <Flame className="w-8 h-8 fill-current drop-shadow" />}
                            {type === 'mass-offering' && <Church className="w-8 h-8 drop-shadow" />}
                            {type === 'bouquet' && <Heart className="w-8 h-8 fill-current drop-shadow" />}
                            {type === 'blessing' && <Shield className="w-8 h-8 drop-shadow" />}
                            {type === 'memorial' && <Star className="w-8 h-8 fill-current drop-shadow" />}
                            {type === 'tabernacle' && <Flame className="w-8 h-8 text-red-950 fill-red-800 drop-shadow" />}
                        </div>
                    </div>

                    {/* Gold Divider Ribbon */}
                    <div className="flex items-center justify-center gap-2 mt-2.5 mb-1">
                        <span className={`text-xs ${isGold ? 'text-amber-400/80' : 'text-[#8c6520]'}`}>❖</span>
                        <div className="w-32 sm:w-44 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        <span className={`text-xs ${isGold ? 'text-amber-400/80' : 'text-[#8c6520]'}`}>❖</span>
                    </div>
                </div>

                {/* 3. DIPLOMA / TITLE OF CONSECRATION */}
                <div className="text-center relative z-10 mb-4 sm:mb-5">
                    <span className={`text-[9px] sm:text-[10.5px] uppercase tracking-[0.2em] font-sans font-semibold block ${isGold ? 'text-amber-200/80' : 'text-[#7d5e27]'}`}>
                        {celebrantOrSanctuary}
                    </span>

                    <h1
                        className={`text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-wider uppercase mt-1.5 mb-1 leading-tight ${
                            isGold
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_2px_12px_rgba(245,158,11,0.35)]'
                                : 'text-[#38220f]'
                        }`}
                    >
                        {displayTitle}
                    </h1>

                    <span className={`text-xs sm:text-sm font-serif italic tracking-wider block font-semibold ${isGold ? 'text-amber-300' : 'text-[#855e1c]'}`}>
                        ~ {displayLatin} ~
                    </span>
                </div>

                {/* 4. DEDICATED RECIPIENT CARTOUCHE */}
                <div
                    className={`relative z-10 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-5 text-center border-2 shadow-xl ${
                        isGold
                            ? 'bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/50 border-amber-400/50 shadow-[inset_0_1px_15px_rgba(245,158,11,0.12)]'
                            : 'bg-white/95 border-[#b89758]/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
                    }`}
                >
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                        <span className={`h-px w-8 sm:w-14 ${isGold ? 'bg-amber-400/40' : 'bg-[#b89758]/50'}`} />
                        <span className={`text-[8.5px] sm:text-[10px] uppercase tracking-[0.25em] font-sans font-bold block ${isGold ? 'text-amber-300' : 'text-[#7d5a22]'}`}>
                            {type === 'memorial' ? 'In Sacred & Perpetual Remembrance of' : 'Solemnly Dedicated & Consecrated For'}
                        </span>
                        <span className={`h-px w-8 sm:w-14 ${isGold ? 'bg-amber-400/40' : 'bg-[#b89758]/50'}`} />
                    </div>

                    {/* Recipient Full Name */}
                    <h3
                        className={`text-2xl sm:text-3xl md:text-4xl font-serif font-black italic tracking-wide my-1.5 sm:my-2 ${
                            isGold
                                ? 'text-amber-50 drop-shadow-[0_2px_12px_rgba(255,215,0,0.4)]'
                                : 'text-[#241304]'
                        }`}
                    >
                        &ldquo;{recipientName}&rdquo;
                    </h3>

                    {dedicatedDetail && (
                        <p className={`text-xs sm:text-sm font-sans mt-1.5 font-medium max-w-lg mx-auto leading-relaxed ${isGold ? 'text-amber-200/90' : 'text-[#4d331a]'}`}>
                            {dedicatedDetail}
                        </p>
                    )}

                    {intention && (
                        <div className={`mt-3 pt-3 border-t ${isGold ? 'border-amber-400/20' : 'border-[#b89758]/30'}`}>
                            <span className={`text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] font-sans font-bold block mb-1 ${isGold ? 'text-amber-300/80' : 'text-[#7d5a22]'}`}>
                                Sacred Prayer Intention
                            </span>
                            <p className={`text-xs sm:text-sm italic font-serif leading-relaxed px-2 sm:px-4 ${isGold ? 'text-white/95' : 'text-[#2b180a]'}`}>
                                &ldquo;{intention}&rdquo;
                            </p>
                        </div>
                    )}

                    {/* Spiritual Bouquet Badges */}
                    {pledgedItems && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-amber-400/20">
                            {pledgedItems.masses ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${isGold ? 'bg-indigo-950/90 text-indigo-100 border border-indigo-400/40' : 'bg-indigo-50 text-indigo-900 border border-indigo-300'}`}>
                                    ✝ {pledgedItems.masses} Holy Masses
                                </span>
                            ) : null}
                            {pledgedItems.rosaries ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${isGold ? 'bg-purple-950/90 text-purple-100 border border-purple-400/40' : 'bg-purple-50 text-purple-900 border border-purple-300'}`}>
                                    📿 {pledgedItems.rosaries} Holy Rosaries
                                </span>
                            ) : null}
                            {pledgedItems.candles ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${isGold ? 'bg-amber-950/90 text-amber-100 border border-amber-400/40' : 'bg-amber-50 text-amber-900 border border-amber-300'}`}>
                                    🕯️ {pledgedItems.candles} Sanctuary Candles
                                </span>
                            ) : null}
                            {pledgedItems.prayers ? (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${isGold ? 'bg-emerald-950/90 text-emerald-100 border border-emerald-400/40' : 'bg-emerald-50 text-emerald-900 border border-emerald-300'}`}>
                                    🙏 {pledgedItems.prayers} Special Prayers
                                </span>
                            ) : null}
                        </div>
                    )}

                    {sealCode && (
                        <div className="mt-3 pt-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${
                                isGold ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                                † {sealCode} †
                            </span>
                        </div>
                    )}

                    {donorName && (
                        <p className={`text-xs font-serif mt-2.5 font-medium ${isGold ? 'text-amber-200/80' : 'text-[#6b4e20]'}`}>
                            Consecrated by the devotion of: <span className="font-bold underline decoration-amber-400/50">{donorName}</span>
                        </p>
                    )}
                </div>

                {/* 5. SCRIPTURE PASSAGE & BENEDICTION */}
                <div className="text-center relative z-10 px-2 sm:px-6 my-4">
                    <p className={`text-xs sm:text-sm font-serif italic leading-relaxed ${isGold ? 'text-amber-100/95 drop-shadow' : 'text-[#382412]'}`}>
                        &ldquo;{displayScripture}&rdquo;
                    </p>
                    <span className={`text-[9.5px] sm:text-[10.5px] font-sans uppercase tracking-[0.25em] font-bold mt-1.5 block ${isGold ? 'text-amber-400' : 'text-[#825c1e]'}`}>
                        — {displayRef}
                    </span>
                </div>

                {/* 6. EMBOSSED GOLD WAX SEAL, CUSTODIAN SIGNATURE & RIBBONS */}
                <div className={`relative z-10 pt-4 mt-5 border-t-2 ${isGold ? 'border-amber-400/30' : 'border-[#b89758]/40'} flex flex-col sm:flex-row items-center justify-between gap-5`}>
                    {/* Left: Sanctuary Record & Ledger ID */}
                    <div className="text-center sm:text-left text-[10px] sm:text-[11px] font-mono leading-relaxed">
                        <span className={`block font-bold uppercase tracking-wider text-[10.5px] ${isGold ? 'text-amber-300' : 'text-[#5e4118]'}`}>
                            Sanctuary Archival Record
                        </span>
                        <span className={`block mt-0.5 ${isGold ? 'text-white/75' : 'text-gray-700'}`}>
                            Date: <strong className="font-semibold">{date}</strong>
                        </span>
                        <span className={`block mt-0.5 tracking-wider font-bold ${isGold ? 'text-amber-400' : 'text-[#7d5a22]'}`}>
                            Serial ID: {serialNumber}
                        </span>
                        <span className={`block text-[8.5px] mt-0.5 uppercase tracking-widest ${isGold ? 'text-emerald-400/90' : 'text-emerald-700'}`}>
                            ✓ Cryptographically Sealed &amp; Registered
                        </span>
                    </div>

                    {/* Center / Right: 3D Embossed Gilded Wax Seal with Liturgical Satin Ribbons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative flex flex-col items-center">
                            {/* 3D Wax Seal */}
                            <div
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center relative p-1 text-center z-10 shadow-2xl ${
                                    isGold
                                        ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-[#0e051a] ring-4 ring-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                                        : 'bg-gradient-to-br from-[#cda240] via-[#ab7e22] to-[#7d5612] text-amber-50 ring-4 ring-[#8c6520]/60 shadow-xl'
                                }`}
                            >
                                <span className="text-[6.5px] sm:text-[7px] font-extrabold tracking-widest uppercase font-sans leading-none block">
                                    MY PRAYER TOWER
                                </span>
                                <span className="text-base sm:text-lg leading-none my-0.5 font-serif font-black">☩</span>
                                <span className="text-[6px] sm:text-[6.5px] font-extrabold uppercase font-sans tracking-widest leading-none block">
                                    SEAL OF ALTAR
                                </span>
                            </div>

                            {/* Hanging Crimson Satin Ribbons */}
                            <div className="flex items-center justify-center gap-1 -mt-3 z-0">
                                <div
                                    className="w-3.5 sm:w-4 h-9 sm:h-10 bg-gradient-to-b from-rose-800 via-rose-900 to-rose-950 border border-amber-400/50 shadow-md"
                                    style={{
                                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                                        transform: 'rotate(-7deg)',
                                    }}
                                />
                                <div
                                    className="w-3.5 sm:w-4 h-9 sm:h-10 bg-gradient-to-b from-rose-800 via-rose-900 to-rose-950 border border-amber-400/50 shadow-md"
                                    style={{
                                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%)',
                                        transform: 'rotate(7deg)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Signature Line */}
                        <div className="text-[10px] sm:text-[11px] leading-tight text-left">
                            <span className={`block font-serif font-bold text-xs sm:text-sm ${isGold ? 'text-amber-200' : 'text-[#382412]'}`}>
                                Custos Sanctuarii
                            </span>
                            <span className={`block text-[8px] sm:text-[9px] uppercase tracking-wider ${isGold ? 'text-amber-300/80' : 'text-[#704f1c]'}`}>
                                Keeper of the Perpetual Light
                            </span>
                            <div className="mt-1 pt-1 border-t border-amber-400/30">
                                <span className={`block font-serif italic text-[11px] ${isGold ? 'text-amber-100' : 'text-[#422c15]'}`}>
                                    MyPrayerTower Sanctuary
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. BOTTOM PERMANENT BRANDING & VERIFICATION WATERMARK */}
                <div className={`mt-4 pt-2.5 border-t text-[9px] sm:text-[10px] font-mono flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left ${
                    isGold ? 'border-amber-400/15 text-amber-300/60' : 'border-[#b89758]/25 text-[#704f1c]/80'
                }`}>
                    <span className="font-semibold tracking-wide">
                        Archival Verification: <strong>myprayertower.com/app</strong>
                    </span>
                    <span className="tracking-wider">
                        Sanctuary Channel: <strong>t.me/myprayertower</strong>
                    </span>
                </div>
            </div>
        </div>
    );
});

SacredCertificate.displayName = 'SacredCertificate';
