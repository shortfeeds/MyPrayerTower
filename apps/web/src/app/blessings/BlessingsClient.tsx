'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
    Home, Car, Heart, GraduationCap, Sparkles, Check, 
    Download, Share2, Copy, Flame, Church, ChevronLeft, ShieldCheck,
    Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SacredCertificate } from '@/components/certificates/SacredCertificate';
import { CertificateModal } from '@/components/certificates/CertificateModal';

interface BlessingOccasion {
    id: string;
    title: string;
    latinTitle: string;
    subtitle: string;
    patronSaint: string;
    icon: any;
    color: string;
    scripture: string;
    scriptureRef: string;
    prayerText: string;
    traditionNote: string;
    placeholderName: string;
    placeholderDetail: string;
    nameLabel: string;
    detailLabel: string;
    sealCode?: string;
}

const BLESSING_OCCASIONS: BlessingOccasion[] = [
    {
        id: 'home',
        title: 'New Home & Family Protection',
        latinTitle: 'Benedictio Domus',
        subtitle: 'The Traditional Epiphany & Household Protection Ritual',
        patronSaint: 'Holy Family of Nazareth & St. Benedict',
        icon: Home,
        color: 'from-amber-500 to-orange-600',
        scripture: 'Peace be to this house, and to all who dwell in it. The Lord bless you and keep you.',
        scriptureRef: 'Luke 10:5 & Numbers 6:24',
        sealCode: '20 + C + M + B + 26',
        traditionNote: 'Catholic families across the world inscribe their doors with blessed chalk and holy water to invoke Christ’s protection (Christus Mansionem Benedicat) and ward off sickness, malice, and discord.',
        nameLabel: 'Family Surname / Householder Name',
        placeholderName: 'e.g., The Fernandez Family',
        detailLabel: 'Address or Residence Name',
        placeholderDetail: 'e.g., House No. 42, St. Jude Villa, Mumbai',
        prayerText: 'Lord God Almighty, bless this home that in it there may be health, purity, the strength of victory, humility, goodness and mildness, the fulfillment of the Law, and thanksgiving to God the Father, Son, and Holy Spirit. May this blessing remain upon this house and upon all who reside here, through Christ our Lord. Amen.'
    },
    {
        id: 'vehicle',
        title: 'Travel & Vehicle Safety',
        latinTitle: 'Benedictio Vehiculi',
        subtitle: 'Consecration for Cars, Motorbikes, Flights & Long Journeys',
        patronSaint: 'St. Christopher & Archangel Raphael',
        icon: Car,
        color: 'from-blue-500 to-indigo-600',
        scripture: 'For He shall give His angels charge over thee, to keep thee in all thy ways.',
        scriptureRef: 'Psalm 91:11',
        sealCode: 'ST. CHRISTOPHER PROTEGE NOS',
        traditionNote: 'In the Roman Ritual, motor vehicles and journeys are placed under the custody of St. Christopher (patron of travelers) and Archangel Raphael, asking for angels of light to protect against collision, mechanical failure, and road peril.',
        nameLabel: 'Traveler or Vehicle Owner Name',
        placeholderName: 'e.g., Michael & Sarah D’Souza',
        detailLabel: 'Vehicle Model or Plate / Journey Route',
        placeholderDetail: 'e.g., Toyota Fortuner / Journey to Goa',
        prayerText: 'Hear our prayers, O Lord, and with Thy holy hand bless this vehicle and its travelers. Send Thy holy angels to accompany, defend, and preserve them from all dangers and perils of the road, and guide them in peace and safety to their destination, through Christ our Lord. Amen.'
    },
    {
        id: 'healing',
        title: 'Critical Illness & Pre-Surgery',
        latinTitle: 'Benedictio Infirmorum',
        subtitle: 'Divine Healing Vigil for Surgery, Cancer & Grave Infirmity',
        patronSaint: 'St. Peregrine (Cancer Patron) & Our Lady of Lourdes',
        icon: Heart,
        color: 'from-emerald-500 to-teal-600',
        scripture: 'He heals the brokenhearted and binds up their wounds. By His stripes we are healed.',
        scriptureRef: 'Psalm 147:3 & Isaiah 53:5',
        sealCode: 'SALUS INFIRMORUM',
        traditionNote: 'When acute sickness, biopsy, or major surgery strikes, Christian tradition rallies perpetual intercession around the sick, invoking St. Peregrine who was miraculously cured of cancer before his leg amputation.',
        nameLabel: 'Patient / Afflicted Soul Name',
        placeholderName: 'e.g., Teresa Anthony',
        detailLabel: 'Nature of Burden or Surgery Date',
        placeholderDetail: 'e.g., Cardiac bypass surgery on Thursday',
        prayerText: 'O God, who in Thy Son Jesus Christ didst heal all sickness and cure all diseases: look with compassion upon Thy servant. Grant wisdom and steadiness to the hands of physicians and surgeons, deliver Thy servant from acute anxiety, and restore vitality and wholeness to body and soul. In Jesus’ Holy Name we pray. Amen.'
    },
    {
        id: 'exams',
        title: 'Academic Exams & Career Success',
        latinTitle: 'Benedictio Intellectus',
        subtitle: 'Patronal Blessing for Competitive Exams, Memory & Wisdom',
        patronSaint: 'St. Joseph of Cupertino & St. Thomas Aquinas',
        icon: GraduationCap,
        color: 'from-purple-500 to-violet-600',
        scripture: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.',
        scriptureRef: 'James 1:5',
        sealCode: 'SAPIENTIA DEI',
        traditionNote: 'St. Joseph of Cupertino, who struggled with human learning but was granted miraculous wisdom from the Holy Spirit during his examinations, is venerated by students worldwide before competitive exams, interviews, and university entrance tests.',
        nameLabel: 'Student or Candidate Name',
        placeholderName: 'e.g., Kevin Pereira',
        detailLabel: 'Examination or Interview Title',
        placeholderDetail: 'e.g., Medical Board Exam / Civil Service Interview',
        prayerText: 'O Great St. Joseph of Cupertino, helper of students in examinations: obtain for this candidate clarity of mind, steadfast memory, freedom from panic, and the grace to recall all that is needed. May all knowledge gained be dedicated to the honor of God and the service of neighbor. Amen.'
    },
    {
        id: 'anniversary',
        title: 'Holy Matrimony Anniversary',
        latinTitle: 'Renovatio Foederis Matrimonii',
        subtitle: 'Solemn Covenant Thanksgiving for Silver, Golden & Annual Milestones',
        patronSaint: 'The Holy Family & St. Valentine',
        icon: Sparkles,
        color: 'from-rose-500 to-pink-600',
        scripture: 'What therefore God hath joined together, let not man put asunder. Love never fails.',
        scriptureRef: 'Mark 10:9 & 1 Corinthians 13:8',
        sealCode: 'IN AETERNUM FOEDUS',
        traditionNote: 'Catholics renew their marriage promises before God on milestone anniversaries (1st, 10th, 25th Silver, 50th Golden), receiving a solemn digital blessing commemorating their lifelong sacrificial love and fruitful witness.',
        nameLabel: 'Couple Names (Husband & Wife)',
        placeholderName: 'e.g., Anthony & Maria Lobo',
        detailLabel: 'Anniversary Milestone',
        placeholderDetail: 'e.g., Celebrating 25 Years of Holy Matrimony',
        prayerText: 'Father, who created man and woman to be one flesh: look favorably upon this married couple who celebrate their covenant today. Deepen their mutual love, crown their home with peace and good health, and grant that as they have shared life’s joys and burdens on earth, they may rejoice together in eternal joy. Amen.'
    }
];

export function BlessingsClient() {
    const [selectedOccasion, setSelectedOccasion] = useState<BlessingOccasion>(BLESSING_OCCASIONS[0]);
    const [dedicatedName, setDedicatedName] = useState('');
    const [dedicatedDetail, setDedicatedDetail] = useState('');
    const [isConsecrated, setIsConsecrated] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleConsecrate = () => {
        if (!dedicatedName.trim()) {
            alert('Please enter a name for the dedication.');
            return;
        }

        setIsConsecrated(true);
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#F59E0B', '#EF4444', '#FFFFFF']
        });
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const shareUrl = 'https://www.myprayertower.com/blessings';
    const whatsappText = `☩ Sacred ${selectedOccasion.title} Consecration on MyPrayerTower for "${dedicatedName}": "${selectedOccasion.scripture}" \n\n📱 Free app: https://www.myprayertower.com/app \nJoin Telegram: https://t.me/myprayertower`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#120824] via-[#0d071a] to-[#080410] text-gray-100 font-sans pb-24">
            {/* Header Hero */}
            <div className="relative pt-12 pb-16 px-4 border-b border-amber-500/20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-purple-900/10 to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-amber-300/80 hover:text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Home Sanctuary
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Sacramental Life &amp; Occasion Ceremonies</span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl font-black text-amber-100 tracking-tight mb-4">
                        Sacred Blessings &amp; Occasion Rituals
                    </h1>
                    <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        In Catholic tradition, every life milestone, new possession, and time of vulnerability is consecrated to God. Conduct your sacred blessing ritual and receive an official digital Consecration Certificate.
                    </p>
                </div>
            </div>

            {/* Occasion Selector Carousel */}
            <div className="max-w-5xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
                    {BLESSING_OCCASIONS.map((occ) => {
                        const Icon = occ.icon;
                        const isSelected = selectedOccasion.id === occ.id;
                        return (
                            <button
                                key={occ.id}
                                type="button"
                                onClick={() => {
                                    setSelectedOccasion(occ);
                                    setIsConsecrated(false);
                                }}
                                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-3 ${
                                    isSelected
                                        ? 'bg-gradient-to-b from-[#22103d] to-[#160a28] border-amber-400/80 shadow-lg shadow-amber-950/40 ring-2 ring-amber-400/30'
                                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-gray-400'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                    isSelected ? `bg-gradient-to-br ${occ.color} text-white shadow-md` : 'bg-white/5 text-gray-400'
                                }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-serif text-xs md:text-sm font-bold leading-tight ${isSelected ? 'text-amber-100' : 'text-gray-300'}`}>
                                        {occ.title}
                                    </h3>
                                    <span className="text-[10px] text-gray-400 font-mono block mt-1">
                                        {occ.latinTitle}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Interactive Ritual Chamber */}
                <div className="bg-gradient-to-b from-[#180d2c] via-[#120722] to-[#0d0418] border-2 border-amber-400/30 rounded-3xl p-6 md:p-10 shadow-2xl relative">
                    <div className="max-w-2xl mx-auto text-center mb-8">
                        <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block mb-1">
                            {selectedOccasion.latinTitle} &bull; {selectedOccasion.patronSaint}
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                            {selectedOccasion.title}
                        </h2>
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
                            {selectedOccasion.traditionNote}
                        </p>
                    </div>

                    {/* Ritual Prayer Card */}
                    <div className="p-6 rounded-2xl bg-black/40 border border-amber-500/20 max-w-2xl mx-auto mb-8 text-center">
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block mb-2">
                            Scripture of Consecration
                        </span>
                        <p className="font-serif italic text-amber-100 text-sm md:text-base leading-relaxed mb-2">
                            "{selectedOccasion.scripture}"
                        </p>
                        <span className="text-[11px] text-amber-300/70 font-mono uppercase tracking-widest">
                            — {selectedOccasion.scriptureRef}
                        </span>

                        <div className="w-16 h-px bg-amber-400/30 mx-auto my-4" />

                        <p className="text-xs md:text-sm text-gray-300 font-serif leading-relaxed text-justify px-2">
                            {selectedOccasion.prayerText}
                        </p>
                    </div>

                    {/* Form Input for Personalization */}
                    {!isConsecrated ? (
                        <div className="max-w-xl mx-auto space-y-4 bg-white/[0.02] p-6 rounded-2xl border border-white/10">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-2">
                                    {selectedOccasion.nameLabel} *
                                </label>
                                <input
                                    type="text"
                                    value={dedicatedName}
                                    onChange={(e) => setDedicatedName(e.target.value)}
                                    placeholder={selectedOccasion.placeholderName}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-2">
                                    {selectedOccasion.detailLabel} (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={dedicatedDetail}
                                    onChange={(e) => setDedicatedDetail(e.target.value)}
                                    placeholder={selectedOccasion.placeholderDetail}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleConsecrate}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Consecrate &amp; Generate Sacred Certificate</span>
                            </button>
                        </div>
                    ) : (
                        /* Consecration Completed & Certificate Display */
                        <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
                            <div className="text-center p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                <span>Ritual Consecration Completed &bull; Ready for Download</span>
                            </div>

                            {/* Enhanced Consecration Certificate (Renaissance / Papal Layout) */}
                            <div className="relative group cursor-pointer" onClick={() => setIsCertModalOpen(true)}>
                                <SacredCertificate
                                    type="blessing"
                                    theme="cathedral-gold"
                                    title="CERTIFICATE OF CONSECRATION"
                                    latinTitle={selectedOccasion.latinTitle}
                                    recipientName={dedicatedName}
                                    dedicatedDetail={dedicatedDetail}
                                    scripture={selectedOccasion.scripture}
                                    scriptureRef={selectedOccasion.scriptureRef}
                                    sealCode={selectedOccasion.sealCode}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-xl flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Click to Customize &amp; Download High-Res
                                    </span>
                                </div>
                            </div>

                            {/* Share & Download Toolbar */}
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCertModalOpen(true)}
                                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Memorabilia (PNG / 300 DPI)</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsCertModalOpen(true)}
                                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>Share Certificate</span>
                                </button>

                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                                    title="Share on WhatsApp"
                                >
                                    <span>💬</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(whatsappText);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                                    title="Copy text"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Fullscreen High-Resolution Certificate Modal with Theme Switcher */}
                            <CertificateModal
                                isOpen={isCertModalOpen}
                                onClose={() => setIsCertModalOpen(false)}
                                type="blessing"
                                title="CERTIFICATE OF CONSECRATION"
                                latinTitle={selectedOccasion.latinTitle}
                                recipientName={dedicatedName}
                                dedicatedDetail={dedicatedDetail}
                                scripture={selectedOccasion.scripture}
                                scriptureRef={selectedOccasion.scriptureRef}
                                sealCode={selectedOccasion.sealCode}
                            />

                            {/* Next Sacred Step: Seal with a Sanctuary Candle or Mass */}
                            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                                <div>
                                    <h4 className="font-serif font-bold text-amber-200 text-sm">
                                        Anchor This Blessing Before the Altar
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-0.5">
                                        Light a 7-day candle or request a Holy Mass so your intention is held in continuous vigil.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        data-open-offering="candle"
                                        data-intention={`${selectedOccasion.title} for ${dedicatedName}`}
                                        data-recipient={dedicatedName}
                                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                    >
                                        <Flame className="w-3.5 h-3.5 fill-current" />
                                        <span>Light Candle</span>
                                    </button>
                                    <button
                                        type="button"
                                        data-open-offering="mass"
                                        data-intention={`${selectedOccasion.title} for ${dedicatedName}`}
                                        data-recipient={dedicatedName}
                                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                    >
                                        <Church className="w-3.5 h-3.5" />
                                        <span>Offer Mass</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsConsecrated(false);
                                    setDedicatedName('');
                                    setDedicatedDetail('');
                                }}
                                className="w-full text-center text-xs text-gray-400 hover:text-white underline pt-2"
                            >
                                Consecrate Another Occasion or Person
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
