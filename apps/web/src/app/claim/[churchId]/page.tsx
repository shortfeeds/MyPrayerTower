'use client';

import { useState } from 'react';
import { ChevronLeft, CheckCircle, Upload, Phone, Mail, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

// Mock church data
const church = {
    id: '1',
    name: "St. Patrick's Cathedral",
    address: '460 Madison Ave, New York, NY 10022',
};

const STEPS = [
    { id: 1, title: 'Email Verification', icon: Mail },
    { id: 2, title: 'Phone Verification', icon: Phone },
    { id: 3, title: 'Document Upload', icon: FileText },
];

export default function ClaimChurchPage({ params }: { params: { churchId: string } }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [documents, setDocuments] = useState<File[]>([]);
    const [emailSent, setEmailSent] = useState(false);
    const [phoneSent, setPhoneSent] = useState(false);

    const handleSendEmailOtp = () => {
        // TODO: API call
        setEmailSent(true);
    };

    const handleVerifyEmail = () => {
        if (emailOtp.length === 6) {
            setCurrentStep(2);
        }
    };

    const handleSendPhoneOtp = () => {
        // TODO: API call
        setPhoneSent(true);
    };

    const handleVerifyPhone = () => {
        if (phoneOtp.length === 6) {
            setCurrentStep(3);
        }
    };

    const handleSubmitClaim = () => {
        // TODO: Submit claim
        alert('Claim submitted! We will review your documents within 2-3 business days.');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href={`/churches/${params.churchId}`} className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Church
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-amber-200">Claim & Verify</p>
                            <h1 className="text-3xl font-bold">{church.name}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                    {STEPS.map((step, i) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep > step.id
                                            ? 'bg-green-600 text-white'
                                            : currentStep === step.id
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-6 h-6" />
                                    )}
                                </div>
                                <p className={`mt-2 text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mx-4 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    {/* Step 1: Email */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                            <p className="text-gray-500 mb-6">Enter your church's official email address</p>

                            <input
                                type="email"
                                placeholder="parish@example.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-amber-500"
                            />

                            {!emailSent ? (
                                <button
                                    onClick={handleSendEmailOtp}
                                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                                >
                                    Send Verification Code
                                </button>
                            ) : (
                                <>
                                    <p className="text-green-600 mb-4">✓ Code sent to {email}</p>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value.slice(0, 6))}
                                        className="w-full p-4 border border-gray-200 rounded-xl mb-4 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                                    >
                                        Verify Email
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 2: Phone */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
                            <p className="text-gray-500 mb-6">Enter your church's official phone number</p>

                            <input
                                type="tel"
                                placeholder="+1 (123) 456-7890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-amber-500"
                            />

                            {!phoneSent ? (
                                <button
                                    onClick={handleSendPhoneOtp}
                                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                                >
                                    Send SMS Code
                                </button>
                            ) : (
                                <>
                                    <p className="text-green-600 mb-4">✓ SMS sent to {phone}</p>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={phoneOtp}
                                        onChange={(e) => setPhoneOtp(e.target.value.slice(0, 6))}
                                        className="w-full p-4 border border-gray-200 rounded-xl mb-4 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyPhone}
                                        className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                                    >
                                        Verify Phone
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Verification Documents</h2>
                            <p className="text-gray-500 mb-6">
                                Please upload one of the following: Letter from Diocese, Parish registration, or Official letterhead
                            </p>

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600 mb-2">Drag & drop files here or</p>
                                <label className="cursor-pointer">
                                    <span className="text-amber-600 hover:underline">browse files</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                                    />
                                </label>
                            </div>

                            {documents.length > 0 && (
                                <div className="mb-6">
                                    {documents.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg mb-2">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <span className="text-green-800">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleSubmitClaim}
                                disabled={documents.length === 0}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-semibold"
                            >
                                Submit Claim Request
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
