'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthGateProps {
    /** Whether the user is authenticated */
    isAuthenticated: boolean;
    /** Content to show when authenticated */
    children: ReactNode;
    /** Feature name for the login prompt */
    featureName?: string;
    /** Custom message for the login prompt */
    message?: string;
    /** Whether to show a compact version */
    compact?: boolean;
    /** Custom redirect URL after login */
    redirectTo?: string;
}

/**
 * AuthGate - Wrapper component to gate features behind authentication
 * Shows a login prompt for unauthenticated users
 */
export function AuthGate({
    isAuthenticated,
    children,
    featureName = 'this feature',
    message,
    compact = false,
    redirectTo
}: AuthGateProps) {
    if (isAuthenticated) {
        return <>{children}</>;
    }

    const loginUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';
    const registerUrl = redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register';

    if (compact) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {message || `Sign in to access ${featureName}`}
                </p>
                <Link
                    href={loginUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sacred-600 text-white text-sm font-semibold rounded-lg hover:bg-sacred-700 transition-colors"
                >
                    Sign In <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-cream-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-sacred-100 dark:bg-sacred-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-sacred-600 dark:text-sacred-400" />
                </div>

                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Sign In to Continue
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {message || `Create an account or sign in to access ${featureName} and track your spiritual journey.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={registerUrl}
                        className="px-6 py-3 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-bold rounded-full shadow-lg shadow-sacred-500/30 transition-all"
                    >
                        Create Account
                    </Link>
                    <Link
                        href={loginUrl}
                        className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:border-sacred-300 hover:text-sacred-700 dark:hover:text-sacred-400 transition-all"
                    >
                        Sign In
                    </Link>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                    Free forever • No credit card required
                </p>
            </div>
        </motion.div>
    );
}

/**
 * FeatureTeaser - Shows a preview of a feature with a login prompt
 * Used on public pages to tease authenticated features
 */
interface FeatureTeaserProps {
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor?: string;
    benefits?: string[];
}

export function FeatureTeaser({
    title,
    description,
    icon: Icon,
    iconColor = 'bg-sacred-500',
    benefits = []
}: FeatureTeaserProps) {
    return (
        <div className="bg-gradient-to-br from-cream-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sacred-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className={`w-14 h-14 ${iconColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {description}
                </p>

                {benefits.length > 0 && (
                    <ul className="space-y-2 mb-6">
                        {benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-1.5 h-1.5 bg-sacred-500 rounded-full flex-shrink-0" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center gap-3">
                    <Link
                        href="/register"
                        className="px-5 py-2.5 bg-sacred-600 text-white text-sm font-bold rounded-lg hover:bg-sacred-700 transition-colors"
                    >
                        Join Now
                    </Link>
                    <Link
                        href="/login"
                        className="text-sm text-sacred-600 dark:text-sacred-400 font-semibold hover:underline"
                    >
                        Sign In →
                    </Link>
                </div>
            </div>
        </div>
    );
}
