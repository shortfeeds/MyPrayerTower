'use client';

import { useEffect, useState, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

// Major Catholic languages around the world
export const CATHOLIC_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global / USA' },
    { code: 'es', name: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'Brazil & Portugal' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', region: 'Italy & Vatican' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'France & Francophone' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', region: 'Poland' },
    { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭', region: 'Philippines' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Germany & Austria' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' },
    { code: 'la', name: 'Lingua Latina', flag: '🏛️', region: 'Ecclesiastical Latin' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳', region: 'India (Syro-Malabar)' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳', region: 'India & Sri Lanka' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', region: 'India' },
    { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷', region: 'South Korea' },
    { code: 'zh-CN', name: '简体中文 (Chinese)', flag: '🇨🇳', region: 'China' },
    { code: 'zh-TW', name: '繁體中文 (Traditional)', flag: '🇹🇼', region: 'Taiwan & HK' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia' },
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇱🇧', region: 'Middle East & Maronite' },
    { code: 'uk', name: 'Українська (Ukrainian)', flag: '🇺🇦', region: 'Ukraine' },
    { code: 'hr', name: 'Hrvatski (Croatian)', flag: '🇭🇷', region: 'Croatia' },
    { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪', region: 'Ireland' },
];

interface LanguageSwitcherProps {
    id?: string;
    variant?: 'header' | 'footer' | 'pill';
    className?: string;
}

export function LanguageSwitcher({
    id = 'google_translate_element',
    variant = 'header',
    className = '',
}: LanguageSwitcherProps) {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadTranslateScript = () => {
        const scriptId = 'google-translate-script';
        if (typeof document !== 'undefined' && !document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }
    };

    useEffect(() => {
        setMounted(true);

        // Detect saved language preference from googtrans cookie
        const cookieMatch = document.cookie.match(/googtrans=\/[^/]+\/([a-zA-Z-]+)/);
        if (cookieMatch && cookieMatch[1]) {
            setCurrentLang(cookieMatch[1]);
        }

        // Define global callback before script load
        if (typeof window !== 'undefined' && !window.googleTranslateElementInit) {
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: CATHOLIC_LANGUAGES.map((l) => l.code).join(','),
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                            autoDisplay: false,
                        },
                        'google_translate_element'
                    );

                    // Ensure injected select is not keyboard-focusable when offscreen to prevent ARIA violations
                    setTimeout(() => {
                        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
                        if (combo) {
                            combo.tabIndex = -1;
                            combo.setAttribute('tabindex', '-1');
                            combo.setAttribute('aria-label', 'Hidden Language Selector');
                        }
                    }, 400);
                }
            };
        }

        // If user has a previously selected language, load immediately
        const hasSavedTranslation = document.cookie.includes('googtrans=') && !document.cookie.includes('googtrans=/en/en');
        if (hasSavedTranslation) {
            loadTranslateScript();
        } else {
            // Otherwise defer until main thread idle to preserve Mobile PageSpeed / TBT scores
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(loadTranslateScript, { timeout: 3500 });
            } else {
                setTimeout(loadTranslateScript, 2500);
            }
        }

        // Close on click outside
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOpen = () => {
        loadTranslateScript();
        setIsOpen(!isOpen);
    };

    const selectLanguage = (langCode: string) => {
        setCurrentLang(langCode);
        setIsOpen(false);

        if (typeof window === 'undefined') return;

        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        const rootDomain = parts.length > 1 ? `.${parts.slice(-2).join('.')}` : hostname;

        // Set Google Translate cookie so the translation persists across pages
        if (langCode === 'en') {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
            document.cookie = 'googtrans=/en/en; path=/;';
            document.cookie = `googtrans=/en/en; path=/; domain=${rootDomain};`;
            document.cookie = `googtrans=/en/en; path=/; domain=${hostname};`;
        } else {
            const val = `/en/${langCode}`;
            document.cookie = `googtrans=${val}; path=/;`;
            document.cookie = `googtrans=${val}; path=/; domain=${rootDomain};`;
            document.cookie = `googtrans=${val}; path=/; domain=${hostname};`;
        }

        // Trigger Google Translate engine
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
        } else {
            // Reload page to let Google script pick up the new cookie
            window.location.reload();
        }
    };

    const currentLangData = CATHOLIC_LANGUAGES.find((l) => l.code === currentLang) || CATHOLIC_LANGUAGES[0];

    if (!mounted) return null;

    // Position dropdown upwards for footer variant, downwards for header/pill
    const isUpwards = variant === 'footer';

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Variant Button Rendering */}
            {variant === 'footer' ? (
                <button
                    onClick={toggleOpen}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gold-500/50 text-gray-300 hover:text-white transition-all text-xs focus:outline-none"
                    aria-label={`Select Language, currently ${currentLangData.name}`}
                    title="Translate Website"
                >
                    <Globe className="w-3.5 h-3.5 text-gold-400" />
                    <span>{currentLangData.flag}</span>
                    <span className="font-medium">{currentLangData.name}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : variant === 'pill' ? (
                <button
                    onClick={toggleOpen}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 transition-all text-sm font-medium focus:outline-none"
                    aria-label={`Translate: ${currentLangData.name}`}
                >
                    <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-gold-500" />
                        <span>Translate:</span>
                        <span>{currentLangData.flag}</span>
                        <span className="font-semibold">{currentLangData.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <button
                    onClick={toggleOpen}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs border border-transparent hover:border-white/10 focus:outline-none"
                    aria-label={`Select Language, currently ${currentLangData.name}`}
                    title="Translate Website"
                >
                    <Globe className="w-4 h-4 text-gold-400" />
                    <span className="text-sm">{currentLangData.flag}</span>
                    <span className="hidden md:inline font-medium">{currentLangData.name.split(' ')[0]}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute right-0 ${
                        isUpwards ? 'bottom-full mb-2' : 'top-full mt-2'
                    } w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-sacred-50 to-amber-50 dark:from-sacred-950/40 dark:to-amber-950/30 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-sacred-600 dark:text-gold-400" />
                                <span className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                                    Translate
                                </span>
                            </div>
                            <span className="text-[10px] bg-sacred-100 dark:bg-sacred-900/60 text-sacred-700 dark:text-sacred-200 px-2 py-0.5 rounded-full font-bold">
                                21 Languages
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            Catholic global translations via Google
                        </p>
                    </div>

                    {/* Language List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                        {CATHOLIC_LANGUAGES.map((lang) => {
                            const isSelected = currentLang === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => selectLanguage(lang.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gold-50/50 dark:hover:bg-gray-800 transition-colors text-left ${
                                        isSelected ? 'bg-gold-50/80 dark:bg-gray-800/80' : ''
                                    }`}
                                >
                                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className={`font-semibold text-sm truncate ${
                                                isSelected
                                                    ? 'text-gold-700 dark:text-gold-300'
                                                    : 'text-gray-900 dark:text-gray-100'
                                            }`}
                                        >
                                            {lang.name}
                                        </div>
                                        <div className="text-[11px] text-gray-400 truncate">{lang.region}</div>
                                    </div>
                                    {isSelected && <Check className="w-4 h-4 text-gold-600 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-center">
                        <span className="text-[10px] text-gray-400">
                            Powered by Google Translate &bull; Catholic Global Network
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
