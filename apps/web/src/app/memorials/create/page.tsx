'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Loader2 } from 'lucide-react';
import { createMemorial } from '@/app/actions/memorials';
import { useRouter } from 'next/navigation';

export default function CreateMemorialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        biography: '',
        photoUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createMemorial({
                ...formData,
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                deathDate: formData.deathDate ? new Date(formData.deathDate).toISOString() : null,
            });
            // Redirect to list (or detail page if we had ID response, but list is easier for now)
            router.push('/memorials');
        } catch (error) {
            console.error('Failed to create memorial', error);
            alert('Failed to create memorial. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                            Create an Eternal Memorial
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Share the story of your loved one and create a place for family and friends to gather in prayer.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                    <Input name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                    <Input name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                    <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Passing</label>
                                    <Input name="deathDate" type="date" value={formData.deathDate} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tribute / Story</label>
                                <Textarea
                                    name="biography"
                                    placeholder="Share their story, favorite memories, or a prayer..."
                                    className="min-h-[150px]"
                                    value={formData.biography}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cover Photo URL</label>
                                <Input name="photoUrl" placeholder="https://example.com/photo.jpg" value={formData.photoUrl} onChange={handleChange} />
                            </div>

                            <div className="pt-4">
                                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" size="lg" disabled={loading}>
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Memorial'}
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By creating a memorial, you agree to our Terms of Service.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
