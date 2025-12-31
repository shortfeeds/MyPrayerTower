'use client';

import { useState } from 'react';
import { updateAppSetting } from '@/app/actions/admin';
import { Loader2 } from 'lucide-react';

interface FeatureToggleProps {
    label: string;
    description: string;
    settingKey: string;
    initialValue: boolean;
}

export function FeatureToggle({ label, description, settingKey, initialValue }: FeatureToggleProps) {
    const [enabled, setEnabled] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const newValue = !enabled;
            await updateAppSetting(settingKey, newValue);
            setEnabled(newValue);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div>
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-3 h-3 animate-spin text-primary-800" />
                    </div>
                )}
            </button>
        </div>
    );
}
