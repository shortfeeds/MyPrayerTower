'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, Camera, X, Sparkles, Check, Crown, Flame, Shield, ArrowRight } from 'lucide-react';
import { createMemorial } from '@/app/actions/memorials';
import { PayPalCheckout } from '@/components/PayPalCheckout';
import { useAuth } from '@/hooks/useAuth';

export default function CreateMemorialPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [tier, setTier] = useState<'BASIC' | 'PREMIUM'>('BASIC');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        biography: '',
        photoUrl: '',
        creatorName: user?.name || '',
        creatorEmail: user?.email || '',
        imagePreview: null as string | null,
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorMsg(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imagePreview: reader.result as string,
                    photoUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFreeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const created = await createMemorial({
                ...formData,
                tier: 'BASIC',
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                deathDate: formData.deathDate ? new Date(formData.deathDate).toISOString() : null,
            });
            router.push(`/memorials/${created.id}`);
        } catch (error: any) {
            console.error('Failed to create memorial', error);
            setErrorMsg(error?.message || 'Failed to create memorial. Please verify the details and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePremiumSuccess = async (details: any) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const created = await createMemorial({
                ...formData,
                tier: 'PREMIUM',
                paymentId: details.id || 'paypal_memorial_prem',
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                deathDate: formData.deathDate ? new Date(formData.deathDate).toISOString() : null,
            });
            router.push(`/memorials/${created.id}`);
        } catch (error: any) {
            console.error('Failed to provision premium memorial', error);
            setErrorMsg('Payment processed, but memorial provisioning had an issue. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#07040d] text-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl mb-4 shadow-lg shadow-rose-950/40">
                        <Heart className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                        Create an Eternal Memorial
                    </h1>
                    <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto font-light">
                        A perpetual Catholic sanctuary to honor their legacy, collect prayers, and preserve sacred memories forever.
                    </p>
                </div>

                {/* Tier Selection */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {/* Free Standard Tier */}
                    <div
                        onClick={() => setTier('BASIC')}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                            tier === 'BASIC'
                                ? 'bg-white/[0.08] border-gold-400/80 shadow-lg shadow-gold-500/10 ring-1 ring-gold-400/40'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Standard Memorial</span>
                            <span className="text-lg font-serif font-bold text-white">Free</span>
                        </div>
                        <p className="text-xs text-white/50 mb-4">Permanent listing in the global Catholic obituary and memorial registry.</p>
                        <ul className="text-xs text-white/70 space-y-2">
                            <li className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Perpetual public listing & tribute page</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Global community prayer wall</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Shareable memorial link & QR code</span>
                            </li>
                        </ul>
                    </div>

                    {/* Premium Altar Tier */}
                    <div
                        onClick={() => setTier('PREMIUM')}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all relative ${
                            tier === 'PREMIUM'
                                ? 'bg-gradient-to-br from-amber-500/20 to-gold-600/10 border-gold-400 shadow-xl shadow-amber-500/20 ring-2 ring-gold-400/60'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                    >
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-gold-400 text-sacred-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                            ⭐ Most Sacred
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-gold-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-gold-200">Featured Altar</span>
                            </div>
                            <span className="text-lg font-serif font-bold text-gold-300">$19 <span className="text-[11px] font-normal text-white/50">one-time</span></span>
                        </div>
                        <p className="text-xs text-gold-100/70 mb-4">Distinguished gold aura, priority homepage tribute, and starter vigil.</p>
                        <ul className="text-xs text-white/80 space-y-2">
                            <li className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                                <span className="font-semibold text-gold-200">Featured Sanctuary placement & Gold Aura</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                <span>Pre-lit 7-day Memorial Candle Vigil</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                <span>High-res printable commemorative certificate</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-[#0e0919] rounded-3xl border border-white/[0.08] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleFreeSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">First Name *</label>
                                <input
                                    name="firstName"
                                    placeholder="e.g. Maria"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Last Name *</label>
                                <input
                                    name="lastName"
                                    placeholder="e.g. Santos"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Date of Birth</label>
                                <input
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400 [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Date of Passing *</label>
                                <input
                                    name="deathDate"
                                    type="date"
                                    required
                                    value={formData.deathDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400 [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Your Name (Guardian)</label>
                                    <input
                                        name="creatorName"
                                        placeholder="e.g. Anna Santos"
                                        value={formData.creatorName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Your Email (For Updates)</label>
                                    <input
                                        name="creatorEmail"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.creatorEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Sacred Story & Eulogy</label>
                            <textarea
                                name="biography"
                                placeholder="Share their story, favorite virtues, parish activities, or prayers of remembrance..."
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400 min-h-[140px]"
                                value={formData.biography}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Memorial Photo</label>
                            {formData.imagePreview ? (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imagePreview: null, photoUrl: '' }))}
                                        className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.03] transition-colors">
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-3">
                                            <Camera className="w-6 h-6" />
                                        </div>
                                        <p className="text-xs text-white/80 font-bold mb-1">Click to upload photo</p>
                                        <p className="text-[11px] text-white/40">JPEG, PNG or WebP</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        {tier === 'BASIC' ? (
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !formData.firstName || !formData.lastName}
                                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-rose-950/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Creating Sanctuary Memorial...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Publish Free Memorial</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 space-y-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-gold-500/30 text-center">
                                    <p className="text-xs text-gold-200 font-semibold mb-1">Featured Altar Listing — $19.00 USD</p>
                                    <p className="text-[11px] text-white/60">Complete payment via PayPal to instantly activate premium features & perpetual golden aura.</p>
                                </div>
                                <div className="max-w-md mx-auto">
                                    <PayPalCheckout
                                        amount={19}
                                        currency="USD"
                                        description={`Featured Memorial Altar for ${formData.firstName} ${formData.lastName}`}
                                        onSuccess={handlePremiumSuccess}
                                        onError={(err) => setErrorMsg(err?.message || 'Payment could not be completed.')}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
