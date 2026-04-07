'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Loader2, Camera, X } from 'lucide-react';
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
        imagePreview: null as string | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imagePreview: reader.result as string,
                    photoUrl: 'uploaded-local-image' // Placeholder for actual upload logic
                }));
            };
            reader.readAsDataURL(file);
        }
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

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Memorial Photo</label>
                                
                                {formData.imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 group">
                                        <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imagePreview: null, photoUrl: '' }))}
                                            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                                <Camera className="w-6 h-6" />
                                            </div>
                                            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-bold">Tap to upload photo</p>
                                            <p className="text-xs text-gray-500">Camera or Gallery (JPEG, PNG)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                )}
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
