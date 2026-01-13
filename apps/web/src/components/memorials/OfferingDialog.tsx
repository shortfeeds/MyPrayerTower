'use client';

import { useState, Fragment } from 'react';
import { X, Plus, Minus, ShoppingCart, Loader2, Check } from 'lucide-react';
import { PayPalCheckout } from '@/components/PayPalCheckout';

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
    category: 'quick' | 'sacred' | 'bouquet';
}

const ALL_OFFERINGS: OfferingOption[] = [
    // Quick Acts
    { id: 'CANDLE_SMALL', name: '3-Day Candle', icon: '🕯️', price: 2.49, category: 'quick' },
    { id: 'CANDLE_MEDIUM', name: '7-Day Candle', icon: '🕯️', price: 4.99, category: 'quick' },
    { id: 'CANDLE_LARGE', name: '14-Day Candle', icon: '🕯️', price: 9.99, category: 'quick' },
    { id: 'FLOWERS', name: 'Flowers', icon: '🌹', price: 3, category: 'quick' },
    { id: 'PRAYER_CARD', name: 'Prayer Card', icon: '🙏', price: 2, category: 'quick' },
    { id: 'FLORAL_BOUQUET', name: 'Floral Bouquet', icon: '💐', price: 7, category: 'quick' },
    // Sacred
    { id: 'ROSARY_DECADE', name: 'Rosary Decade', icon: '📿', price: 5, category: 'sacred' },
    { id: 'ROSARY_FULL', name: 'Full Rosary', icon: '📿', price: 15, category: 'sacred' },
    { id: 'MASS', name: 'Holy Mass', icon: '✝️', price: 25, description: 'For the repose of the soul', category: 'sacred' },
    // Bundles
    { id: 'BOUQUET_GARDEN', name: 'Garden of Grace', icon: '💝', price: 19, description: '3 candles + rosary + card', category: 'bouquet' },
    { id: 'BOUQUET_HEAVENLY', name: 'Heavenly Tribute', icon: '💝', price: 49, description: '7 candles + Mass + rosary', category: 'bouquet' },
    { id: 'BOUQUET_ETERNAL', name: 'Eternal Peace', icon: '💝', price: 99, description: '30 candles + 3 Masses', category: 'bouquet' },
];

interface CartItem {
    offering: OfferingOption;
    quantity: number;
}

export function OfferingDialog({ memorial, isOpen, onClose }: OfferingDialogProps) {
    const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<{ orderId: string; amount: number } | null>(null);

    // Filter logic... (keep existing helper functions or inline them)

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

    const clearItem = (offeringId: string) => {
        setCart(prev => {
            const newCart = new Map(prev);
            newCart.delete(offeringId);
            return newCart;
        });
    };

    const getQuantity = (offeringId: string) => {
        return cart.get(offeringId)?.quantity || 0;
    };

    const cartItems = Array.from(cart.values());
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.offering.price * item.quantity), 0);

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
                        price: item.offering.price,
                    })),
                    totalAmount: totalPrice * 100,
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
                alert(data.message || 'Failed to process checkout');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePayPalSuccess = async (details: any) => {
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
        return (
            <div
                key={offering.id}
                className={`relative p-3 rounded-xl border-2 transition-all ${qty > 0
                    ? 'border-amber-500 bg-amber-50 shadow-lg'
                    : 'border-gray-200 hover:border-amber-300 bg-white'
                    }`}
            >
                {qty > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {qty}
                    </div>
                )}
                <div className="text-center">
                    <span className="text-2xl">{offering.icon}</span>
                    <div className="font-semibold text-gray-900 text-sm mt-1">{offering.name}</div>
                    <div className="text-amber-600 font-bold text-sm">${offering.price}</div>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                    {qty > 0 ? (
                        <>
                            <button onClick={() => removeFromCart(offering.id)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{qty}</span>
                            <button onClick={() => addToCart(offering)} className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Plus className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => addToCart(offering)} className="px-3 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full">
                            Add
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4">
                    <button onClick={onClose} className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        {memorial.photoUrl ? (
                            <img src={memorial.photoUrl} alt={fullName} className="w-12 h-12 rounded-full object-cover border-2 border-white/30" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">✝️</div>
                        )}
                        <div>
                            <div className="text-xs text-white/80">Send tribute to</div>
                            <div className="text-lg font-bold">{fullName}</div>
                        </div>
                    </div>
                </div>

                {success ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Tributes Sent!</h3>
                        <p className="text-gray-500 text-center">Your offerings have been sent in memory of {fullName}.</p>
                    </div>
                ) : showPayPal ? (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Complete Your Offering</h3>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Total Tribute Amount</span>
                                <span className="text-xl font-bold text-gray-900">${totalPrice}</span>
                            </div>
                        </div>
                        <PayPalCheckout
                            amount={totalPrice}
                            onSuccess={handlePayPalSuccess}
                            onError={() => alert('Payment failed. Please try again.')}
                        />
                        <button
                            onClick={() => setShowPayPal(false)}
                            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">🕯️ Quick Acts</h4>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                    {ALL_OFFERINGS.filter(o => o.category === 'quick').map(renderOfferingCard)}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">✝️ Sacred Offerings</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALL_OFFERINGS.filter(o => o.category === 'sacred').map(renderOfferingCard)}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">💝 Bundles</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {ALL_OFFERINGS.filter(o => o.category === 'bouquet').map(renderOfferingCard)}
                                </div>
                            </div>
                            {totalItems > 0 && (
                                <div className="mt-4 space-y-3 bg-gray-50 rounded-xl p-4">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Add a personal message (optional)..."
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none bg-white"
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
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                            <button
                                onClick={handleSubmit}
                                disabled={cartItems.length === 0 || submitting}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        Checkout — {totalItems} item{totalItems !== 1 ? 's' : ''} — ${totalPrice}
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Fragment>
    );
}
