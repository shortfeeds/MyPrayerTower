'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
    Heart, 
    Sparkles, 
    Check, 
    ShieldCheck, 
    Church, 
    Flame, 
    BookOpen, 
    ExternalLink, 
    Loader2,
    Lock,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import type { PayPalSuccessDetails } from '@/components/PayPalCheckout';

// Dynamically load PayPal to prevent SSR issues
const PayPalCheckout = dynamic(
    () => import('@/components/PayPalCheckout').then((mod) => mod.PayPalCheckout),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 bg-slate-50 rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                <p className="text-sm text-slate-500 font-medium">Securing payment connection...</p>
            </div>
        ),
    }
);

interface DonationTier {
    id: string;
    amount: number; // in cents
    dollars: number;
    icon: string;
    label: string;
    description: string;
    popular?: boolean;
}

const ONE_TIME_TIERS: DonationTier[] = [
    { id: 'CANDLE', amount: 1000, dollars: 10, icon: '🕯️', label: 'Light a Candle', description: 'Supports daily prayer candles' },
    { id: 'ROSARY', amount: 2500, dollars: 25, icon: '📿', label: 'Rosary Partner', description: 'Supports communal prayers & guides' },
    { id: 'SUPPORTER', amount: 5000, dollars: 50, icon: '⛪', label: 'Parish Supporter', description: 'Helps sustain platform & priest stipends', popular: true },
    { id: 'GUARDIAN', amount: 10000, dollars: 100, icon: '👼', label: 'Guardian Angel', description: 'Sponsors community prayer needs' },
    { id: 'BENEFACTOR', amount: 25000, dollars: 250, icon: '🌟', label: 'Benefactor', description: 'Major support for global evangelization' },
    { id: 'PATRON', amount: 50000, dollars: 500, icon: '💎', label: 'Sanctuary Patron', description: 'Pillar of the digital sanctuary' },
];

interface MonthlyPlan {
    id: string;
    paypalPlanId?: string;
    name: string;
    dollars: number;
    price: number; // in cents
    icon: string;
    description: string;
    perks: string[];
    popular?: boolean;
}

const MONTHLY_PLANS: MonthlyPlan[] = [
    {
        id: 'PRAYER_PARTNER',
        name: 'Prayer Partner',
        dollars: 10,
        price: 1000,
        icon: '🙏',
        description: 'Sustain our daily prayer sanctuary',
        perks: [
            'Monthly Mass offered for your family',
            'Remembrance on our Daily Prayer Wall',
            'Monthly spiritual devotional newsletter',
        ],
        popular: true,
    },
    {
        id: 'FAMILY_PLAN',
        name: 'Family Pillar',
        dollars: 25,
        price: 2500,
        icon: '👨‍👩‍👧‍👦',
        description: 'Blessings for your entire household',
        perks: [
            'Priority Mass intention each month',
            'Entire household enrolled in prayer',
            'Special remembrance on feast days',
        ],
    },
    {
        id: 'PATRON_CIRCLE',
        name: 'Patron Circle',
        dollars: 50,
        price: 5000,
        icon: '💎',
        description: 'Integral pillar of digital ministry',
        perks: [
            'Regular Mass intentions celebrated for you',
            'Perpetual spiritual bouquet enrollment',
            'Sponsors church directory & free access for all',
        ],
    },
];

export function DonateClient() {
    const router = useRouter();
    const [tab, setTab] = useState<'oneTime' | 'monthly'>('oneTime');
    const [selectedTier, setSelectedTier] = useState<string>('SUPPORTER');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [selectedPlan, setSelectedPlan] = useState<string>('PRAYER_PARTNER');
    
    // Donor Details
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    
    // Payment UI state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const selectedTierData = ONE_TIME_TIERS.find((t) => t.id === selectedTier);
    const selectedPlanData = MONTHLY_PLANS.find((p) => p.id === selectedPlan);

    // Get current amount in cents
    const getAmountCents = (): number => {
        if (tab === 'monthly') {
            return selectedPlanData?.price || 1000;
        }
        if (customAmount && Number(customAmount) > 0) {
            return Math.round(Number(customAmount) * 100);
        }
        return selectedTierData?.amount || 5000;
    };

    const getAmountDollars = (): number => {
        return Math.round(getAmountCents() / 100);
    };

    const handleOpenPayment = () => {
        setErrorMessage('');
        if (!email.trim() || !name.trim()) {
            setErrorMessage('Please provide your name and email so we can send your confirmation receipt.');
            return;
        }
        if (getAmountDollars() < 1) {
            setErrorMessage('Please enter a donation amount of at least $1.');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePayPalSuccess = async (details: PayPalSuccessDetails) => {
        console.log('PayPal donation completed:', details);
        setShowPaymentModal(false);

        // Record on server if subscription or fallback
        if (tab === 'monthly') {
            try {
                await fetch('/api/donations/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: getAmountCents(),
                        tier: selectedPlan,
                        email,
                        name: isAnonymous ? 'Anonymous' : name,
                        message,
                        isAnonymous,
                        isSubscription: true,
                        paypalOrderId: details.orderId,
                        paypalPayerEmail: details.payerEmail,
                    }),
                });
            } catch (err) {
                console.error('Error saving subscription record:', err);
            }
        }

        router.push(`/donate/success?order=${encodeURIComponent(details.orderId || details.captureId)}`);
    };

    const handlePayPalError = (error: any) => {
        console.error('PayPal checkout error:', error);
        setErrorMessage('We could not complete your PayPal donation. Please try again or use the direct PayPal link below.');
        setShowPaymentModal(false);
    };

    // Direct PayPal Donate URL fallback with specified dollar amount
    const directPayPalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=myprayertower2@gmail.com&currency_code=USD&amount=${getAmountDollars()}&item_name=Support+MyPrayerTower+Mission`;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Header */}
            <section className="relative overflow-hidden bg-gradient-to-b from-rose-950 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-rose-900/30">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        Support Our Ministry
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
                        Support Our Sacred Mission
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                    </p>
                    <p className="text-xs text-rose-300/80 italic">— 2 Corinthians 9:7</p>

                    <div className="pt-2">
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            There is never an obligation. Your prayers and presence are the greatest blessing. Give only as you feel called.
                        </p>
                    </div>
                </div>
            </section>

            {/* Donation Container */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* Giving Mode Tabs */}
                <div className="flex p-1.5 bg-slate-200/80 rounded-2xl max-w-md mx-auto mb-10 shadow-inner">
                    <button
                        type="button"
                        onClick={() => { setTab('oneTime'); setErrorMessage(''); }}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            tab === 'oneTime'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${tab === 'oneTime' ? 'text-rose-500 fill-rose-500' : ''}`} />
                        One-Time Gift
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab('monthly'); setErrorMessage(''); }}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            tab === 'monthly'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Sparkles className={`w-4 h-4 ${tab === 'monthly' ? 'text-amber-500' : ''}`} />
                        Monthly Partner
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Gift Selection & Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Tab 1: One-Time Gifts */}
                        {tab === 'oneTime' && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-slate-900">Choose Your Gift</h2>
                                    <p className="text-xs text-slate-500 mt-1">Select an offering tier or enter a custom gift amount</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {ONE_TIME_TIERS.map((tier) => {
                                        const isSelected = selectedTier === tier.id && !customAmount;
                                        return (
                                            <button
                                                key={tier.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTier(tier.id);
                                                    setCustomAmount('');
                                                    setErrorMessage('');
                                                }}
                                                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                                                    isSelected
                                                        ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-1 ring-rose-500/20'
                                                        : 'border-slate-100 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                {tier.popular && (
                                                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
                                                        POPULAR
                                                    </span>
                                                )}
                                                <div className="text-2xl mb-1.5">{tier.icon}</div>
                                                <div>
                                                    <div className="font-serif font-bold text-lg text-slate-900">${tier.dollars}</div>
                                                    <div className="text-xs font-medium text-slate-700">{tier.label}</div>
                                                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tier.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Amount */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Or enter custom amount ($ USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setSelectedTier('');
                                                setErrorMessage('');
                                            }}
                                            placeholder="Enter amount"
                                            className={`w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 text-lg font-bold focus:outline-none transition-colors ${
                                                customAmount
                                                    ? 'border-rose-500 bg-rose-50/30 text-rose-900'
                                                    : 'border-slate-200 focus:border-rose-500 bg-slate-50/50'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Monthly Giving */}
                        {tab === 'monthly' && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                                <div>
                                    <h2 className="text-xl font-serif font-bold text-slate-900">Become a Monthly Prayer Partner</h2>
                                    <p className="text-xs text-slate-500 mt-1">Sustained monthly contributions allow us to keep 24/7 prayer ministries active</p>
                                </div>

                                <div className="space-y-3">
                                    {MONTHLY_PLANS.map((plan) => {
                                        const isSelected = selectedPlan === plan.id;
                                        return (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlan(plan.id);
                                                    setErrorMessage('');
                                                }}
                                                className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-4 ${
                                                    isSelected
                                                        ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-1 ring-rose-500/20'
                                                        : 'border-slate-100 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                <span className="text-3xl p-2 bg-slate-50 rounded-xl">{plan.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-serif font-bold text-slate-900">{plan.name}</h3>
                                                        <span className="font-serif font-bold text-rose-600 text-lg">${plan.dollars}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mb-3">{plan.description}</p>
                                                    <ul className="space-y-1.5">
                                                        {plan.perks.map((perk, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                                <span>{perk}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Donor Information */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                            <h2 className="text-xl font-serif font-bold text-slate-900">Your Information</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm bg-slate-50/50"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-1 block">For your secure confirmation receipt.</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Special Prayer Intention / Note (Optional)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Share an intention you would like included in our prayers..."
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm bg-slate-50/50 resize-none"
                                />
                            </div>

                            <label className="flex items-center gap-3 pt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-400"
                                />
                                <span className="text-xs text-slate-600">Keep my donation anonymous from public prayer lists</span>
                            </label>
                        </div>
                    </div>

                    {/* Right: Summary & Action Cards */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-serif font-bold text-slate-900 text-lg">Gift Summary</h3>

                            <div className="space-y-3 pb-4 border-b border-slate-100 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Type</span>
                                    <span className="font-medium text-slate-900">
                                        {tab === 'oneTime' ? 'One-Time Donation' : 'Monthly Partnership'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Purpose</span>
                                    <span className="font-medium text-slate-900">
                                        {tab === 'oneTime'
                                            ? (customAmount ? 'Custom Gift' : selectedTierData?.label)
                                            : selectedPlanData?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline">
                                <span className="text-slate-700 font-medium">Total Offering</span>
                                <span className="font-serif font-bold text-3xl text-rose-600">
                                    ${getAmountDollars()}
                                    {tab === 'monthly' && <span className="text-xs font-normal text-slate-500">/mo</span>}
                                </span>
                            </div>

                            {/* Main CTA: Open PayPal Modal */}
                            <button
                                type="button"
                                onClick={handleOpenPayment}
                                className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                            >
                                <Heart className="w-5 h-5 fill-white/20" />
                                <span>Donate ${getAmountDollars()}</span>
                            </button>

                            {/* Direct PayPal Link Button */}
                            <div className="pt-2 text-center">
                                <a
                                    href={directPayPalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-xl hover:bg-slate-100 w-full"
                                >
                                    <span>Or give via Direct PayPal Page</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                            </div>

                            {/* Trust Badge */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>256-Bit SSL Encrypted & Verified PayPal Protection</span>
                            </div>
                        </div>

                        {/* Spiritual Offerings Alternative Card */}
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border border-amber-200/50 space-y-4">
                            <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
                                <Church className="w-4 h-4 text-amber-600" />
                                <span>Looking for Sacred Offerings?</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                You can also have a Holy Mass offered for your loved ones, light a sanctuary candle, or send spiritual bouquets:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <Link
                                    href="/mass-offerings"
                                    className="p-2.5 rounded-xl bg-white border border-amber-200/60 font-semibold text-slate-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                                >
                                    <Church className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Mass Intentions</span>
                                </Link>
                                <Link
                                    href="/candles"
                                    className="p-2.5 rounded-xl bg-white border border-amber-200/60 font-semibold text-slate-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                                >
                                    <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span>Light Candle</span>
                                </Link>
                                <Link
                                    href="/bouquets"
                                    className="p-2.5 rounded-xl bg-white border border-amber-200/60 font-semibold text-slate-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                                >
                                    <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                    <span>Bouquets</span>
                                </Link>
                                <Link
                                    href="/memorials"
                                    className="p-2.5 rounded-xl bg-white border border-amber-200/60 font-semibold text-slate-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                                >
                                    <Heart className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <span>Memorials</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ & Transparency Section */}
                <section className="mt-16 pt-12 border-t border-slate-200/70">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <h2 className="text-2xl font-serif font-bold text-slate-900">Your Generosity at Work</h2>
                        <p className="text-xs text-slate-500 mt-1">Transparency in how we steward gifts entrusted to our sanctuary</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 text-left">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                ⛪
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Priests & Masses</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Offerings directly support Catholic priests celebrating daily Masses and perpetual prayer intentions for souls worldwide.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                🌐
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">24/7 Digital Sanctuary</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Powers our infrastructure, ensuring daily readings, saint devotions, and prayer requests remain free for millions of Catholics.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                🔒
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Security & Privacy</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                We respect your privacy. Anonymous giving is fully honored, and all transactions are processed securely through PayPal.
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-[11px] text-slate-400 mt-10 max-w-lg mx-auto">
                        MyPrayerTower is a Catholic digital prayer service and platform. Contributions sustain ongoing prayer ministries and technical operations.
                    </p>
                </section>
            </main>

            {/* PayPal Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 sm:p-7 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                        <Heart className="w-5 h-5 fill-rose-500/20" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-slate-900">Complete Donation</h3>
                                        <p className="text-[11px] text-slate-500">Secure PayPal Checkout</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-semibold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-rose-950">
                                        {tab === 'oneTime' ? 'One-Time Donation' : selectedPlanData?.name}
                                    </p>
                                    <p className="text-[11px] text-rose-700/80">Donor: {name}</p>
                                </div>
                                <span className="font-serif font-bold text-2xl text-rose-600">
                                    ${getAmountDollars()}
                                    {tab === 'monthly' && <span className="text-xs font-normal">/mo</span>}
                                </span>
                            </div>

                            {/* PayPal In-Modal Buttons */}
                            <div className="min-h-[160px]">
                                <PayPalCheckout
                                    amount={tab === 'oneTime' ? getAmountCents() : undefined}
                                    subscriptionPlanId={tab === 'monthly' ? selectedPlanData?.paypalPlanId : undefined}
                                    description={
                                        tab === 'oneTime'
                                            ? `Donation to MyPrayerTower - ${customAmount ? 'Custom' : selectedTierData?.label}`
                                            : `${selectedPlanData?.name} Monthly Subscription`
                                    }
                                    onSuccess={handlePayPalSuccess}
                                    onError={handlePayPalError}
                                    onCancel={() => setShowPaymentModal(false)}
                                    referenceId={`DONATE_${tab}_${Date.now()}`}
                                    createOrderUrl={tab === 'oneTime' ? '/api/donations/payment/create' : undefined}
                                    captureOrderUrl={tab === 'oneTime' ? '/api/donations/payment/capture' : undefined}
                                    buttonLabel="donate"
                                    metadata={{
                                        tier: customAmount ? 'CUSTOM' : (selectedTier || 'CUSTOM'),
                                        email,
                                        name,
                                        message,
                                        isAnonymous,
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-slate-500 hover:text-slate-800 font-medium"
                                >
                                    ← Back & Edit Details
                                </button>
                                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <Lock className="w-3 h-3" /> Encrypted
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
