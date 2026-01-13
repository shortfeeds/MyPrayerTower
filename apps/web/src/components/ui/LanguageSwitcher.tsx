'use client';

import { useEffect, useState, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

// Major Catholic languages around the world
const CATHOLIC_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸', region: 'USA/UK' },
    { code: 'es', name: 'Español', flag: '🇪🇸', region: 'Spain/Latin America' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'Brazil/Portugal' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', region: 'Italy' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'France' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱', region: 'Poland' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭', region: 'Philippines' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', region: 'Korea' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳', region: 'China' },
    { code: 'la', name: 'Latina', flag: '🏛️', region: 'Vatican' },
];

interface LanguageSwitcherProps {
    id?: string;
}

export function LanguageSwitcher({ id = 'google_translate_element' }: LanguageSwitcherProps) {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        // Load Google Translate script
        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        // Define global callback
        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = () => {
                // Initialize hidden translate element
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: CATHOLIC_LANGUAGES.map(l => l.code).join(','),
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                }, 'google_translate_hidden');
            };
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectLanguage = (langCode: string) => {
        setCurrentLang(langCode);
        setIsOpen(false);

        // Trigger Google Translate
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change'));
        }
    };

    const currentLangData = CATHOLIC_LANGUAGES.find(l => l.code === currentLang) || CATHOLIC_LANGUAGES[0];

    if (!mounted) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Hidden Google Translate Element */}
            <div id="google_translate_hidden" className="hidden absolute" />

            {/* Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Select Language"
            >
                <Globe className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">{currentLangData.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gradient-to-r from-sacred-50 to-amber-50 dark:from-sacred-900/20 dark:to-amber-900/20 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-sacred-600" />
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">Select Language</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Major Catholic Languages</p>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {CATHOLIC_LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => selectLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${currentLang === lang.code ? 'bg-sacred-50 dark:bg-sacred-900/20' : ''
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex-1 text-left">
                                    <div className={`font-medium text-sm ${currentLang === lang.code ? 'text-sacred-700 dark:text-sacred-300' : 'text-gray-900 dark:text-white'}`}>
                                        {lang.name}
                                    </div>
                                    <div className="text-xs text-gray-400">{lang.region}</div>
                                </div>
                                {currentLang === lang.code && (
                                    <Check className="w-4 h-4 text-sacred-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-[10px] text-gray-400 text-center">Powered by Google Translate</p>
                    </div>
                </div>
            )}
        </div>
    );
}
