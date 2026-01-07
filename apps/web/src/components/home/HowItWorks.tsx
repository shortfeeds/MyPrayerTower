'use client';

import { UserPlus, Target, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * HowItWorks - 3-step visual process explaining how the app works
 */
export function HowItWorks() {
    const steps = [
        {
            number: 1,
            icon: UserPlus,
            title: "Sign Up Free",
            description: "Create your account in 30 seconds. No credit card required.",
            color: "bg-sacred-500",
            iconBg: "bg-sacred-100",
            iconColor: "text-sacred-600"
        },
        {
            number: 2,
            icon: Target,
            title: "Set Your Goals",
            description: "Choose daily prayers, readings, and spiritual challenges.",
            color: "bg-gold-500",
            iconBg: "bg-gold-100",
            iconColor: "text-gold-600"
        },
        {
            number: 3,
            icon: TrendingUp,
            title: "Grow in Faith",
            description: "Track progress, earn achievements, and join the community.",
            color: "bg-emerald-500",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-sacred-100 text-sacred-700 text-sm font-bold rounded-full mb-4">
                        HOW IT WORKS
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Start Your Journey in <span className="text-sacred-600">3 Simple Steps</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Join over a million Catholics who are deepening their faith with MyPrayerTower.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <motion.div
                    className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-sacred-200 via-gold-200 to-emerald-200" style={{ left: '16%', right: '16%' }} />

                    {steps.map((step, index) => (
                        <motion.div key={step.number} className="relative" variants={itemVariants}>
                            {/* Step Card */}
                            <div className="bg-cream-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                {/* Step Number Badge */}
                                <div className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg relative z-10`}>
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                                </div>

                                {/* Content */}
                                <h3 className="font-bold text-xl text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow (Mobile) */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden flex justify-center my-4">
                                    <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sacred-600 to-sacred-700 hover:from-sacred-500 hover:to-sacred-600 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-lg shadow-sacred-500/30 group"
                    >
                        Start Praying
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                        No credit card required • Free forever
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
