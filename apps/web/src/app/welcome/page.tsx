import Link from 'next/link';
import { Heart, BookOpen, Building2, Users, Sparkles, Star, ArrowRight, Check } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "I'm New Here - Welcome to MyPrayerTower",
    description: 'Welcome to MyPrayerTower! Learn how to get started with daily prayers, Mass readings, church finder, and join our global Catholic community.',
};

export default function WelcomePage() {
    const features = [
        {
            icon: Sparkles,
            title: 'Daily Prayers',
            description: 'Browse hundreds of Catholic prayers, from the Rosary to novenas and more.',
            link: '/prayers',
            color: 'bg-sacred-500'
        },
        {
            icon: BookOpen,
            title: 'Mass Readings',
            description: "Today's readings from the Roman Missal, updated daily.",
            link: '/readings',
            color: 'bg-blue-500'
        },
        {
            icon: Building2,
            title: 'Find Churches',
            description: 'Locate 10,000+ Catholic churches with Mass times and directions.',
            link: '/churches',
            color: 'bg-emerald-500'
        },
        {
            icon: Users,
            title: 'Live Sessions',
            description: 'Join live prayer sessions with Catholics around the world.',
            link: '/sessions',
            color: 'bg-rose-500'
        },
        {
            icon: Star,
            title: 'Saint of the Day',
            description: 'Learn about a different saint each day with biographies and prayers.',
            link: '/saints',
            color: 'bg-purple-500'
        },
        {
            icon: Heart,
            title: 'Prayer Candles',
            description: 'Light virtual candles for your intentions and prayer requests.',
            link: '/candles',
            color: 'bg-amber-500'
        },
    ];

    const accountBenefits = [
        'Track your prayer streaks and spiritual growth',
        'Save your favorite prayers for quick access',
        'Join live prayer sessions with the community',
        'Post and manage prayer intentions',
        'Earn achievements and badges',
        'Set personalized prayer reminders',
        'Access your spiritual journey dashboard',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Welcome, Friend!
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        We're Glad You're <span className="text-sacred-600">Here</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        MyPrayerTower is your Catholic faith companion—a one-stop place for prayers, readings,
                        church finder, and a global community of Catholics praying together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-bold text-lg rounded-full shadow-lg shadow-sacred-500/30 transition-all"
                        >
                            Create Account
                        </Link>
                        <Link
                            href="/readings"
                            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-lg rounded-full hover:border-sacred-300 hover:text-sacred-700 transition-all"
                        >
                            Start Exploring
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Start Features */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
                            What Would You Like to Do?
                        </h2>
                        <p className="text-lg text-gray-600">
                            No account needed to start exploring. Jump right in!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Link
                                key={index}
                                href={feature.link}
                                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-sacred-200 transition-all"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-sacred-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {feature.description}
                                </p>
                                <span className="text-sacred-600 font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Create an Account */}
            <section className="py-16 px-4 bg-gradient-to-br from-sacred-700 to-sacred-900">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white mb-4">
                            Why Create an Account?
                        </h2>
                        <p className="text-lg text-blue-100">
                            Unlock personalized features to enhance your spiritual journey
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                        <div className="grid md:grid-cols-2 gap-4">
                            {accountBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 text-white">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sacred-700 font-bold text-lg rounded-full hover:bg-gold-100 transition-colors"
                            >
                                Join Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <p className="text-sm text-blue-200 mt-4">
                                No credit card required • Free forever
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Already Have Account */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
                        Already Have an Account?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Welcome back! Sign in to access your personalized dashboard.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-sacred-600 text-sacred-600 font-semibold rounded-full hover:bg-sacred-50 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </section>
        </div>
    );
}
