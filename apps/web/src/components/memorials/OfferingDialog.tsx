'use client';

import { useState, Fragment } from 'react';
import { X, Plus, Minus, Loader2, Check, Sparkles, Gift, Heart, Church } from 'lucide-react';
import { PayPalCheckout } from '@/components/PayPalCheckout';
import { SACRED_COPY } from '@/lib/sacred-copy';
import { saveAbandonedCart } from '@/app/actions/cart';

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

import { usePricing } from '@/contexts/PricingContext';

interface OfferingOption {
    id: string;
    name: string;
    icon: string;
    price: number;
    description?: string;
    category: 'candles' | 'sacred' | 'bouquet';
}

const DEFAULT_OFFERINGS: OfferingOption[] = [
    // Candles
    { id: 'CANDLE_SMALL', name: '3-Day Candle', icon: '🕯️', price: 3, category: 'candles' },
    { id: 'CANDLE_MEDIUM', name: '7-Day Candle', icon: '🕯️', price: 5, category: 'candles' },
    { id: 'CANDLE_LARGE', name: '14-Day Candle', icon: '🕯️', price: 10, category: 'candles' },
    { id: 'CANDLE_FEATURED', name: '30-Day Featured', icon: '✨', price: 25, category: 'candles' },
    // Sacred Offerings
    { id: 'FLOWERS', name: 'Flowers', icon: '🌹', price: 3, category: 'sacred' },
    { id: 'FLORAL_BOUQUET', name: 'Floral Bouquet', icon: '💐', price: 8, category: 'sacred' },
    { id: 'PRAYER_CARD', name: 'Prayer Card', icon: '🙏', price: 2, category: 'sacred' },
    { id: 'ROSARY_DECADE', name: 'Rosary Decade', icon: '📿', price: 5, category: 'sacred' },
    { id: 'ROSARY_FULL', name: 'Full Rosary', icon: '📿', price: 15, category: 'sacred' },
    { id: 'MASS', name: 'Holy Mass', icon: '✝️', price: 25, description: 'For the repose of the soul', category: 'sacred' },
    // Spiritual Bouquets
    { id: 'SPIRITUAL_BOUQUET_GARDEN', name: 'Garden of Grace', icon: '💝', price: 20, description: '3 candles + rosary + card', category: 'bouquet' },
    { id: 'SPIRITUAL_BOUQUET_HEAVENLY', name: 'Heavenly Tribute', icon: '💖', price: 50, description: '7 candles + Mass + rosary', category: 'bouquet' },
    { id: 'SPIRITUAL_BOUQUET_ETERNAL', name: 'Eternal Peace', icon: '👑', price: 100, description: '30 candles + 3 Masses', category: 'bouquet' },
    { id: 'SPIRITUAL_BOUQUET_LEGACY', name: 'Legacy Remembrance', icon: '🕊️', price: 300, description: '100 candles + 10 Masses + weekly rosary', category: 'bouquet' },
];

interface CartItem {
    offering: OfferingOption;
    quantity: number;
}

export function OfferingDialog({ memorial, isOpen, onClose }: OfferingDialogProps) {
    const { prices } = usePricing();
    const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const allOfferings = DEFAULT_OFFERINGS.map(o => {
        let price = o.price * 100; // Convert default dollar price to cents for internal consistency

        if (prices) {
            if (o.id === 'CANDLE_SMALL' && prices.candles?.threeDay) price = prices.candles.threeDay;
            if (o.id === 'CANDLE_MEDIUM' && prices.candles?.sevenDay) price = prices.candles.sevenDay;
            if (o.id === 'CANDLE_LARGE' && prices.candles?.thirtyDay) price = prices.candles.thirtyDay;

            if (o.id === 'MASS' && prices.masses?.regular) price = prices.masses.regular;

            // Approximate mapping for bouquets constants for now
            if (o.id === 'SPIRITUAL_BOUQUET_GARDEN') price = 2000;
            if (o.id === 'SPIRITUAL_BOUQUET_HEAVENLY') price = 5000;
            if (o.id === 'SPIRITUAL_BOUQUET_ETERNAL') price = 10000;
            if (o.id === 'SPIRITUAL_BOUQUET_LEGACY') price = 30000;
        }
        return { ...o, price };
    });
    const [showPayPal, setShowPayPal] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<{ orderId: string; amount: number } | null>(null);
    const [activeTab, setActiveTab] = useState<'candles' | 'sacred' | 'bouquet'>('candles');

    if (!isOpen) return null;

    const addToCart = (offering: OfferingOption) => {
        setCart(prev => {
            const newCart = new Map(prev);
            const existing = newCart.get(offering.id);
            if (existing) {
                newCart.set(offering.id, { ...existing, quantity: existing.quantity + 1 });
            } else {
                newCart.set(offering.id, { offering, quantity: 1 });
            }
            return newCart;
        });
    };

    const handleClose = () => {
        if (!success && cart.size > 0) {
            // Track abandoned cart
            const items = Array.from(cart.values()).map(item => ({
                id: item.offering.id,
                name: item.offering.name,
                quantity: item.quantity,
                price: item.offering.price
            }));

            saveAbandonedCart({
                type: 'MEMORIAL_OFFERING',
                email: 'anonymous@tracking.com', // Memorials don't ask for email until checkout usually, or we can add input?
                // The dialog asks for message/anonymous but not email explicitly in UI shown?
                // Actually checkout payload might have it? No, checkout API handles it.
                // We'll capture what we have.
                data: {
                    memorialId: memorial.id,
                    memorialName: `${memorial.firstName} ${memorial.lastName}`,
                    items,
                    totalPrice,
                    message,
                    isAnonymous
                },
                step: showPayPal ? 'payment' : 'selection',
                source: 'WEB'
            });
        }
        onClose();
    };

    const removeFromCart = (offeringId: string) => {
        setCart(prev => {
            const newCart = new Map(prev);
            const existing = newCart.get(offeringId);
            if (existing && existing.quantity > 1) {
                newCart.set(offeringId, { ...existing, quantity: existing.quantity - 1 });
            } else {
                newCart.delete(offeringId);
            }
            return newCart;
        });
    };

    const getQuantity = (offeringId: string) => {
        return cart.get(offeringId)?.quantity || 0;
    };

    const cartItems = Array.from(cart.values());
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = Math.round(cartItems.reduce((sum, item) => sum + (item.offering.price * item.quantity), 0));

    const handleSubmit = async () => {
        if (cartItems.length === 0) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/memorials/${memorial.id}/offering-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        type: item.offering.id,
                        quantity: item.quantity,
                        price: Math.round(item.offering.price),
                    })),
                    totalAmount: totalPrice,
                    message,
                    isAnonymous,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (totalPrice > 0) {
                    setPendingOrder({ orderId: data.payment.orderId, amount: totalPrice });
                    setShowPayPal(true);
                } else {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                        setCart(new Map());
                        setMessage('');
                        onClose();
                    }, 2000);
                }
            } else {
                alert(data.message || 'Failed to process offering');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePayPalSuccess = async () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setCart(new Map());
            setMessage('');
            setShowPayPal(false);
            onClose();
        }, 2000);
    };

    const fullName = `${memorial.firstName} ${memorial.lastName}`;

    const renderOfferingCard = (offering: OfferingOption) => {
        const qty = getQuantity(offering.id);
        const isSelected = qty > 0;

        return (
            <div
                key={offering.id}
                className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${isSelected
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 shadow-lg shadow-amber-100 dark:shadow-none'
                    : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-md'
                    }`}
                onClick={() => !isSelected && addToCart(offering)}
            >
                {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                        {qty}
                    </div>
                )}

                <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">{offering.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2.5em]">{offering.name}</div>
                    {offering.description && (
                        <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight hidden sm:block">{offering.description}</div>
                    )}
                    <div className="text-amber-600 font-bold text-sm sm:text-base mt-1 sm:mt-2">${Math.round(offering.price / 100)}</div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
                    {isSelected ? (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFromCart(offering.id); }}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <span className="w-4 sm:w-8 text-center font-bold text-gray-900 text-xs sm:text-base">{qty}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(offering); }}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
                            >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); addToCart(offering); }}
                            className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm w-full"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const tabs = [
        { id: 'candles' as const, label: 'Candles', icon: '🕯️' },
        { id: 'sacred' as const, label: 'Sacred', icon: '✝️' },
        { id: 'bouquet' as const, label: 'Bouquets', icon: '💝' },
    ];

    const filteredOfferings = allOfferings.filter(o => o.category === activeTab);

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white p-4 sm:p-5 flex-shrink-0">
                    <button onClick={handleClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 sm:gap-4 pr-8">
                        {memorial.photoUrl ? (
                            <img src={memorial.photoUrl} alt={fullName} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 sm:border-3 border-white/40 shadow-lg" />
                        ) : (
                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg">✝️</div>
                        )}
                        <div className="min-w-0">
                            <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wide font-medium truncate">Send a tribute to</div>
                            <div className="text-lg sm:text-xl font-bold truncate">{fullName}</div>
                        </div>
                    </div>
                </div>

                {success ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <Check className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tribute Sent!</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">Your offerings have been lovingly sent in memory of {fullName}.</p>
                    </div>
                ) : showPayPal ? (
                    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Complete Your Offering</h3>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-6 border border-amber-100 dark:border-amber-800/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">Total Offering</span>
                                <span className="text-3xl font-bold text-gray-900 dark:text-amber-400">${Math.round(totalPrice / 100)}</span>
                            </div>
                            <p className="text-sm text-gray-500 italic text-center">
                                "God loves a cheerful giver." — 2 Corinthians 9:7
                            </p>
                        </div>
                        <PayPalCheckout
                            amount={totalPrice}
                            referenceId={pendingOrder?.orderId}
                            description={`Offering for ${fullName}`}
                            onSuccess={handlePayPalSuccess}
                            onError={() => alert('Payment failed. Please try again.')}
                        />
                        <button
                            onClick={() => setShowPayPal(false)}
                            className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                            ← Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-100 px-2 sm:px-4 pt-2 sm:pt-4 flex-shrink-0">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-all ${activeTab === tab.id
                                        ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-1 sm:mr-2 block sm:inline text-center text-lg sm:text-base">{tab.icon}</span>
                                    <span className="block sm:inline text-center">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Offerings Grid */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                {filteredOfferings.map(renderOfferingCard)}
                            </div>

                            {/* Message & Anonymous Option */}
                            {totalItems > 0 && (
                                <div className="mt-6 space-y-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Add a personal message (optional)..."
                                        className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none bg-white text-gray-800 placeholder-gray-400 text-sm"
                                        rows={2}
                                    />
                                    <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        Send anonymously
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Footer with Submit Button */}
                        <div className="border-t border-gray-100 bg-white p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex-shrink-0 z-10">
                            <button
                                onClick={handleSubmit}
                                disabled={cartItems.length === 0 || submitting}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        {totalItems > 0 ? (
                                            <span>Make Offering — ${Math.round(totalPrice / 100)}</span>
                                        ) : (
                                            <span>Select Offerings Above</span> // Changed from "Select Offerings" to match original logic but be clearer
                                        )}
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4 italic max-w-lg mx-auto leading-relaxed">
                                {SACRED_COPY.offerings.transparency}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </Fragment>
    );
}
