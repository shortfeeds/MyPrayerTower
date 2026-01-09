'use client';

import { useState, Fragment } from 'react';
import { X, Flame, Heart, Cross, Gift, Loader2, Check } from 'lucide-react';

interface Memorial {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
}

interface OfferingDialogProps {
    memorial: Memorial;
    isOpen: boolean;
    onClose: () => void;
}

interface OfferingOption {
    id: string;
    name: string;
    icon: string;
    price: number;
    description?: string;
}

const QUICK_OFFERINGS: OfferingOption[] = [
    { id: 'CANDLE_SMALL', name: 'Small Candle', icon: '🕯️', price: 1 },
    { id: 'CANDLE_MEDIUM', name: 'Candle', icon: '🕯️', price: 3 },
    { id: 'CANDLE_LARGE', name: 'Large Candle', icon: '🕯️', price: 5 },
    { id: 'FLOWERS', name: 'Flowers', icon: '🌹', price: 3 },
    { id: 'PRAYER_CARD', name: 'Prayer Card', icon: '🙏', price: 2 },
    { id: 'FLORAL_BOUQUET', name: 'Floral Bouquet', icon: '💐', price: 7 },
];

const SACRED_OFFERINGS: OfferingOption[] = [
    { id: 'ROSARY_DECADE', name: 'Rosary Decade', icon: '📿', price: 5 },
    { id: 'ROSARY_FULL', name: 'Full Rosary', icon: '📿', price: 15 },
    { id: 'MASS', name: 'Holy Mass', icon: '✝️', price: 25, description: 'For the repose of the soul' },
];

const BOUQUET_OFFERINGS: OfferingOption[] = [
    { id: 'SPIRITUAL_BOUQUET_GARDEN', name: 'Garden of Grace', icon: '💝', price: 19, description: '3 candles + 1 rosary + prayer card' },
    { id: 'SPIRITUAL_BOUQUET_HEAVENLY', name: 'Heavenly Tribute', icon: '💝', price: 49, description: '7 candles + 1 Mass + 1 rosary' },
    { id: 'SPIRITUAL_BOUQUET_ETERNAL', name: 'Eternal Peace', icon: '💝', price: 99, description: '30 candles + 3 Masses + 3 rosaries' },
    { id: 'SPIRITUAL_BOUQUET_LEGACY', name: 'Legacy Remembrance', icon: '💝', price: 299, description: '100 candles + 10 Masses + weekly rosary' },
];

type Tab = 'quick' | 'sacred' | 'bouquets';

export function OfferingDialog({ memorial, isOpen, onClose }: OfferingDialogProps) {
    const [activeTab, setActiveTab] = useState<Tab>('quick');
    const [selectedOffering, setSelectedOffering] = useState<OfferingOption | null>(null);
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedOffering) return;

        setSubmitting(true);
        // Simulate API call - in production, this would call the payment API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSuccess(true);

        // Reset after showing success
        setTimeout(() => {
            setSuccess(false);
            setSelectedOffering(null);
            setMessage('');
            onClose();
        }, 2000);
    };

    const fullName = `${memorial.firstName} ${memorial.lastName}`;

    const renderOfferings = (offerings: OfferingOption[]) => (
        <div className="grid grid-cols-2 gap-3">
            {offerings.map((offering) => (
                <button
                    key={offering.id}
                    onClick={() => setSelectedOffering(offering)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedOffering?.id === offering.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300 bg-white'
                        }`}
                >
                    <span className="text-2xl">{offering.icon}</span>
                    <div className="font-semibold text-gray-900 mt-1">{offering.name}</div>
                    {offering.description && (
                        <div className="text-xs text-gray-500 mt-1">{offering.description}</div>
                    )}
                    <div className="text-amber-600 font-bold mt-1">${offering.price}</div>
                </button>
            ))}
        </div>
    );

    return (
        <Fragment>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        {memorial.photoUrl ? (
                            <img
                                src={memorial.photoUrl}
                                alt={fullName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                                <Cross className="w-8 h-8 text-slate-500" />
                            </div>
                        )}
                        <div>
                            <div className="text-sm text-slate-300">Send a tribute to</div>
                            <div className="text-xl font-serif font-bold">{fullName}</div>
                        </div>
                    </div>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tribute Sent!</h3>
                        <p className="text-gray-500 text-center">
                            Your {selectedOffering?.name} has been sent in memory of {fullName}.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('quick')}
                                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'quick'
                                        ? 'text-amber-600 border-b-2 border-amber-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Flame className="w-4 h-4 inline mr-1" />
                                Quick Acts
                            </button>
                            <button
                                onClick={() => setActiveTab('sacred')}
                                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'sacred'
                                        ? 'text-amber-600 border-b-2 border-amber-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Cross className="w-4 h-4 inline mr-1" />
                                Sacred
                            </button>
                            <button
                                onClick={() => setActiveTab('bouquets')}
                                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'bouquets'
                                        ? 'text-amber-600 border-b-2 border-amber-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Gift className="w-4 h-4 inline mr-1" />
                                Bouquets
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === 'quick' && renderOfferings(QUICK_OFFERINGS)}
                            {activeTab === 'sacred' && renderOfferings(SACRED_OFFERINGS)}
                            {activeTab === 'bouquets' && renderOfferings(BOUQUET_OFFERINGS)}

                            {/* Message */}
                            {selectedOffering && (
                                <div className="mt-4 space-y-3">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Add a personal message (optional)..."
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                        rows={2}
                                    />
                                    <label className="flex items-center gap-2 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        Send anonymously
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedOffering || submitting}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : selectedOffering ? (
                                    <>Send {selectedOffering.name} — ${selectedOffering.price}</>
                                ) : (
                                    'Select an offering'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Fragment>
    );
}
