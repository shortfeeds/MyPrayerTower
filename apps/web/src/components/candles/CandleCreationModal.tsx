'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, ChevronRight, Lock, CheckCircle, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import { type PayPalSuccessDetails } from '@/components/PayPalCheckout';
import { lightVirtualCandle, lightBulkCandles } from '@/app/actions/spiritual';

// Dynamic import for PayPal
const PayPalCheckout = dynamic(() => import('@/components/PayPalCheckout').then(mod => mod.PayPalCheckout), { ssr: false });
import { saveAbandonedCart } from '@/app/actions/cart';

import { SACRED_COPY } from '@/lib/sacred-copy';

                                                        </div>
                                                        <div className="text-xs text-amber-700/80 italic mt-0.5">{tier.spiritual}</div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className={`font-medium ${tier.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {tier.price === 0 ? 'Free' : tier.priceDisplay}
                                                    </div>
                                                    {tier.price > 0 && (
                                                        <div className="text-[10px] text-gray-400">offering</div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start mb-4">
                                    <div className="p-1 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        {SACRED_COPY.offerings.transparency}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-0.5"
                                    >
                                        <span>{totalPrice === 0 ? 'Light Candles' : 'Make Offering'}</span>
                                        {totalPrice > 0 && <span className="text-[10px] opacity-80 font-normal">Total: {totalPriceDisplay}</span>}
                                    </button>
                                </div>

                                {/* Reassurance After Selection */}
                                <p className="text-center text-xs text-gray-400 mt-4 italic">
                                    {SACRED_COPY.candleFlow.afterSelection}
                                </p>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                        <Lock className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h4 className="font-serif font-bold text-xl text-gray-900 mb-1">Secure Offering</h4>
                                    <p className="text-gray-500 text-sm">
                                        Your offering of <span className="font-semibold text-gray-900">{totalPriceDisplay}</span> helps sustain this sanctuary.
                                    </p>
                                </div>

                                <div className="min-h-[150px] relative z-0">
                                    <PayPalCheckout
                                        amount={totalPrice}
                                        description={`${formData.quantity}x Virtual Candle Offering`}
                                        onSuccess={handlePayPalSuccess}
                                        onError={(err) => setError(err.message)}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-6 w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Change Selection
                                </button>
                            </motion.div>
                        )}

                        {/* Sacred Pause Overlay */}
                        {isSacredPausing && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-3xl animate-fade-in p-6">
                                <div className="text-center">
                                    {stillnessStage === 'lifting' ? (
                                        <>
                                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-pulse-slow mx-auto">
                                                <Flame className="w-8 h-8 text-amber-600 animate-pulse" />
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 animate-fade-in">
                                                Lighting your {formData.quantity > 1 ? 'candles' : 'candle'}...
                                            </h3>
                                            <p className="text-gray-500 font-medium animate-fade-in delay-75">
                                                May your {formData.quantity > 1 ? 'prayers' : 'prayer'} rise like incense.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-scale-in mx-auto">
                                                <CheckCircle className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 animate-fade-in">
                                                {formData.quantity > 1 ? 'Candles' : 'Candle'} Lit
                                            </h3>
                                            <p className="text-gray-500 font-medium animate-fade-in delay-75">
                                                Your {formData.quantity > 1 ? 'intentions shine' : 'intention shines'} in our chapel.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
