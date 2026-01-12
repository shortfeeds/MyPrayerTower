'use client';
import React from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            {/* Hero */}
            <section className="bg-primary-950 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        We're here to help. Reach out to our team for support or inquiries.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 -mt-10 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card-premium p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                                    <a href="mailto:info@myprayertower.com" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">info@myprayertower.com</a>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">For general inquiries and support.</p>
                        </div>

                        <div className="card-premium p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-sacred-100 dark:bg-sacred-900 rounded-full flex items-center justify-center text-sacred-600 dark:text-sacred-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Response Time</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Within 24-48 hours</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">We'll get back to you as soon as possible.</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card-premium p-8 py-10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
                            <Suspense fallback={<div>Loading form...</div>}>
                                <ContactForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [status, setStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const defaultSubject = type === 'diocese' ? 'Diocese Partnership Inquiry' :
        type === 'parish' ? 'Parish Portal Inquiry' : '';

    const defaultMessage = type === 'diocese' ? 'I represents a Diocese and would like to learn more about the enterprise features.' :
        type === 'parish' ? 'I would like to claim my parish listing and verify my account.' : '';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: result.message || 'Message sent successfully!' });
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {status && (
                <div className={`p-4 rounded-xl ${status.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {status.message}
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input name="firstName" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input name="lastName" required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input name="subject" defaultValue={defaultSubject} required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="How can we help?" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea name="message" defaultValue={defaultMessage} required rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
