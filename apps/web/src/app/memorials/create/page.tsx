'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Upload, Check, Heart, Sparkles, Loader2 } from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate: string;
    shortBio: string;
    biography: string;
    photoUrl: string;
    tier: 'BASIC' | 'PREMIUM';
}

export default function CreateMemorialPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        shortBio: '',
        biography: '',
        photoUrl: '',
        tier: 'BASIC',
    });

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName) return;

        setLoading(true);
        try {
            // Create checkout session with Cashfree
            const res = await fetch('/api/memorials/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.payment?.paymentLink) {
                // Redirect to Cashfree payment page
                window.location.href = data.payment.paymentLink;
            } else if (res.ok && data.payment?.sessionId) {
                // Alternative: Use Cashfree SDK if available
                // For now, show error if no payment link
                alert('Payment link not available. Please try again.');
            } else {
                alert(data.error || 'Failed to create memorial. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <Link href="/memorials" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Memorials
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold">
                        Create a Memorial
                    </h1>
                    <p className="text-slate-300 mt-2">
                        Honor your loved one with a beautiful, lasting tribute.
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step > s ? <Check className="w-5 h-5" /> : s}
                                </div>
                                <span className={`hidden sm:block text-sm ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {s === 1 ? 'Details' : s === 2 ? 'Story' : 'Plan'}
                                </span>
                                {s < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Your Loved One</h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => updateField('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => updateField('birthDate', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Passing</label>
                                    <input
                                        type="date"
                                        value={formData.deathDate}
                                        onChange={(e) => updateField('deathDate', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                                <input
                                    type="url"
                                    value={formData.photoUrl}
                                    onChange={(e) => updateField('photoUrl', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    placeholder="https://example.com/photo.jpg"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter a URL to an image of your loved one</p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.firstName || !formData.lastName}
                                    className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Biography */}
                    {step === 2 && (
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Their Story</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Short Description
                                    <span className="text-gray-400 font-normal"> (displayed on cards)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.shortBio}
                                    onChange={(e) => updateField('shortBio', e.target.value)}
                                    maxLength={200}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    placeholder="e.g., A loving father, grandfather, and friend to all"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.shortBio.length}/200 characters</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Biography
                                    <span className="text-gray-400 font-normal"> (tell their story)</span>
                                </label>
                                <textarea
                                    value={formData.biography}
                                    onChange={(e) => updateField('biography', e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                    placeholder="Share their life story, accomplishments, and what made them special..."
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Choose Plan */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                                <p className="text-gray-500">Select the memorial that best honors your loved one</p>
                            </div>

                            {/* Basic Plan */}
                            <div
                                onClick={() => updateField('tier', 'BASIC')}
                                className={`bg-white rounded-3xl p-6 border-2 cursor-pointer transition-all ${formData.tier === 'BASIC'
                                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Basic Memorial</h3>
                                        <p className="text-gray-500">Perfect for simple remembrance</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">$20</div>
                                        <div className="text-sm text-gray-500">one-time</div>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Memorial page forever</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 photo, 500 character bio</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> QR code for gravestone</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Guestbook messages</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Featured for 3 days</li>
                                </ul>
                            </div>

                            {/* Premium Plan */}
                            <div
                                onClick={() => updateField('tier', 'PREMIUM')}
                                className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 cursor-pointer transition-all relative ${formData.tier === 'PREMIUM'
                                    ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                                    : 'border-amber-200 hover:border-amber-300'
                                    }`}
                            >
                                <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                                    RECOMMENDED
                                </div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                            Premium Memorial
                                        </h3>
                                        <p className="text-gray-500">Give them the tribute they deserve</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-amber-600">$49</div>
                                        <div className="text-sm text-gray-500">one-time</div>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Everything in Basic</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Unlimited photos gallery</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> 60-second video tribute</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Background music</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Verified badge ✓</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> No ads on page</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Forever featured in directory</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500" /> Annual anniversary reminders</li>
                                </ul>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5" />
                                            Create Memorial — ${formData.tier === 'PREMIUM' ? 49 : 20}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
