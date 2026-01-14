'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft, ChevronRight, Upload, Calendar, User,
    AlignLeft, Image as ImageIcon, Sparkles, Loader2, Check
} from 'lucide-react';
import Link from 'next/link';

type Step = 'details' | 'media' | 'plan' | 'payment';
type Tier = 'BASIC' | 'PREMIUM';

interface FormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate: string;
    shortBio: string;
    biography: string;
    photo: File | null;
    photoPreview: string | null;
    tier: Tier;
}

import { PayPalCheckout } from '@/components/PayPalCheckout';

export default function CreateMemorialPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('details');
    const [loading, setLoading] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<{ orderId: string; amount: number; memorialId: string } | null>(null);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        shortBio: '',
        biography: '',
        photo: null,
        photoPreview: null,
        tier: 'BASIC',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateForm = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Save draft to API (debounced in production)
        saveDraft({ ...formData, [field]: value });
    };

    const saveDraft = async (data: FormData) => {
        // Mock API call to save draft
        // console.log('Saving draft...', data);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            updateForm('photo', file);
            updateForm('photoPreview', previewUrl);
        }
    };

    const nextStep = () => {
        if (step === 'details') setStep('media');
        else if (step === 'media') setStep('plan');
        else if (step === 'plan') setStep('payment');
    };

    const prevStep = () => {
        if (step === 'media') setStep('details');
        else if (step === 'plan') setStep('media');
        else if (step === 'payment') setStep('plan');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create memorial via API
            const response = await fetch('/api/memorials/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    birthDate: formData.birthDate,
                    deathDate: formData.deathDate,
                    shortBio: formData.shortBio,
                    biography: formData.biography,
                    tier: formData.tier,
                    // photoUrl: would need to upload photo first in a real app
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPendingOrder({
                    orderId: data.payment.orderId,
                    amount: data.payment.amount,
                    memorialId: data.memorial.id
                });
                setShowPayPal(true);
            } else {
                alert(data.error || 'Failed to create memorial');
            }
        } catch (error) {
            console.error('Error creating memorial:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayPalSuccess = async (details: any) => {
        // Activate memorial
        await fetch(`/api/memorials/verify-payment?memorial_id=${pendingOrder?.memorialId}&paypal_order_id=${details.orderId}`);
        router.push('/memorials');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/memorials" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </Link>
                        <h1 className="text-xl font-serif font-bold text-gray-900">Create Digital Chapel</h1>
                        <div className="w-16" /> {/* Spacer */}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        {['details', 'media', 'plan', 'payment'].map((s, i) => {
                            const isCompleted = ['details', 'media', 'plan', 'payment'].indexOf(step) > i;
                            const isCurrent = step === s;

                            return (
                                <div key={s} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted ? 'bg-amber-500 text-white' :
                                        isCurrent ? 'bg-white border-2 border-amber-500 text-amber-500' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${isCurrent ? 'text-amber-500' : 'text-gray-400'
                                        }`}>
                                        {s}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                        {step === 'details' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Basic Details</h2>
                                <p className="text-gray-500 mb-6">Tell us about your loved one.</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => updateForm('firstName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => updateForm('lastName', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => updateForm('birthDate', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Passing</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="date"
                                                value={formData.deathDate}
                                                onChange={(e) => updateForm('deathDate', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                                    <input
                                        type="text"
                                        value={formData.shortBio}
                                        onChange={(e) => updateForm('shortBio', e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                        placeholder="A loving father and friend..."
                                        maxLength={100}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">{formData.shortBio.length}/100</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Biography</label>
                                    <textarea
                                        value={formData.biography}
                                        onChange={(e) => updateForm('biography', e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none h-40 resize-none"
                                        placeholder="Share their life story..."
                                    />
                                </div>
                            </div>
                        )}

                        {step === 'media' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Add a Photo</h2>
                                <p className="text-gray-500 mb-6">Choose a beautiful portrait for the memorial.</p>

                                <div
                                    className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${formData.photoPreview
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.photoPreview ? (
                                        <img
                                            src={formData.photoPreview}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                                <Upload className="w-8 h-8 text-amber-500" />
                                            </div>
                                            <p className="font-medium text-gray-900">Click to upload photo</p>
                                            <p className="text-sm text-gray-500 mt-1">JPG or PNG up to 5MB</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>

                                {formData.photoPreview && (
                                    <button
                                        onClick={() => {
                                            updateForm('photo', null);
                                            updateForm('photoPreview', null);
                                        }}
                                        className="text-sm text-red-500 font-medium hover:text-red-700"
                                    >
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        )}

                        {step === 'plan' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Select Chapel Type</h2>
                                <p className="text-gray-500 mb-6">Choose how you want to honor their memory.</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Basic Plan */}
                                    <div
                                        onClick={() => updateForm('tier', 'BASIC')}
                                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.tier === 'BASIC'
                                            ? 'border-amber-500 bg-amber-50'
                                            : 'border-gray-200 hover:border-amber-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">Standard Chapel</h3>
                                                <div className="text-2xl font-bold text-green-600 mt-1">FREE</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.tier === 'BASIC' ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
                                                }`}>
                                                {formData.tier === 'BASIC' && <Check className="w-4 h-4" />}
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Permanent page</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Photo & Bio</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Light candles</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Guestbook</li>
                                        </ul>
                                    </div>

                                    {/* Premium Plan */}
                                    <div
                                        onClick={() => updateForm('tier', 'PREMIUM')}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.tier === 'PREMIUM'
                                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50'
                                            : 'border-gray-200 hover:border-amber-300'
                                            }`}
                                    >
                                        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            RECOMMENDED
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                    Featured Chapel
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                </h3>
                                                <div className="text-2xl font-bold text-amber-600 mt-1">$49.99</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.tier === 'PREMIUM' ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
                                                }`}>
                                                {formData.tier === 'PREMIUM' && <Check className="w-4 h-4" />}
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <b>Featured Placement</b></li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Photos</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Video Tribute</li>
                                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> QR Code for Grave</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'payment' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Confirm Digital Chapel</h2>
                                <p className="text-gray-500 mb-6">Securely complete your memorial space.</p>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-900">
                                            {formData.tier === 'BASIC' ? 'Standard Chapel' : 'Featured Chapel'}
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {formData.tier === 'BASIC' ? 'FREE' : '$49.99'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">One-time setup</div>
                                </div>

                                {showPayPal && pendingOrder && formData.tier === 'PREMIUM' ? (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                            <p className="text-sm text-amber-800 font-medium mb-1">Order Details</p>
                                            <p className="text-xs text-amber-600">Order ID: {pendingOrder.orderId}</p>
                                        </div>
                                        <PayPalCheckout
                                            amount={pendingOrder.amount}
                                            onSuccess={handlePayPalSuccess}
                                            onError={() => alert('Payment failed. Please try again.')}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                                        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-6">
                                            {formData.tier === 'BASIC'
                                                ? 'Click "Create Chapel" to establish this sacred space.'
                                                : 'Click "Proceed to Offering" to secure this featured chapel.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                            {step !== 'details' ? (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2.5 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Back
                                </button>
                            ) : (
                                <div />
                            )}

                            {step === 'payment' ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        formData.tier === 'BASIC' ? 'Create Chapel' : 'Proceed to Offering'
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2"
                                >
                                    Next Step
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
