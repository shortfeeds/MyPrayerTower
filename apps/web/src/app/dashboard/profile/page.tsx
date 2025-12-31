'use client';

import { useState } from 'react';
import { Save, Upload, Clock, MapPin, Phone, Mail, Globe, Camera } from 'lucide-react';

export default function ProfilePage() {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: 'St. Mary\'s Parish',
        description: 'A welcoming Catholic community in the heart of the city.',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        phone: '+1 (555) 123-4567',
        email: 'contact@stmarys.org',
        website: 'https://stmarys.org',
        sundayMass: ['8:00 AM', '10:30 AM', '12:00 PM', '5:00 PM'],
        weekdayMass: ['7:00 AM', '12:10 PM'],
        confession: ['Saturday 3:00 PM - 4:30 PM'],
    });

    const handleSave = async () => {
        setSaving(true);
        // TODO: API call to save profile
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Profile</h1>
                    <p className="text-gray-500">Manage your church's public information</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Church Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            Location
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" /> Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" /> Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mass Schedule */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            Mass Schedule
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sunday Mass Times</label>
                                <input
                                    type="text"
                                    value={formData.sundayMass.join(', ')}
                                    placeholder="e.g., 8:00 AM, 10:30 AM, 12:00 PM"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple times with commas</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weekday Mass Times</label>
                                <input
                                    type="text"
                                    value={formData.weekdayMass.join(', ')}
                                    placeholder="e.g., 7:00 AM, 12:10 PM"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confession Times</label>
                                <input
                                    type="text"
                                    value={formData.confession.join(', ')}
                                    placeholder="e.g., Saturday 3:00 PM - 4:30 PM"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Church Image */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Church Photo</h2>

                        <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                            <Camera className="w-12 h-12 text-gray-300" />
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                        <h3 className="font-bold text-primary-900 mb-2">Profile Tips</h3>
                        <ul className="text-sm text-primary-700 space-y-2">
                            <li>• Add a welcoming description</li>
                            <li>• Upload a high-quality church photo</li>
                            <li>• Keep Mass times up to date</li>
                            <li>• Include your website link</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
