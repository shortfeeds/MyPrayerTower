import { Suspense } from 'react';
import { getAppSettings } from '@/app/actions/admin';
import { FeatureToggle } from '@/components/admin/FeatureToggle';
import { Shield, Zap, Lock, RefreshCw } from 'lucide-react';

export default async function FeatureControlPage() {
    const settings = await getAppSettings();

    // Defaults if null
    const s = settings || {
        maintenanceMode: false,
        registrationEnabled: true,
        prayerWallEnabled: true,
        syncEnabled: true,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Control</h1>
                <p className="text-gray-500">Manage global settings and availability of platform features.</p>
            </div>

            {/* Critical Settings */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-bold text-red-900">Critical Controls</h2>
                </div>
                <div className="space-y-4">
                    <FeatureToggle
                        label="Maintenance Mode"
                        description="Disable public access to the site. Only admins can login."
                        settingKey="maintenanceMode"
                        initialValue={s.maintenanceMode}
                    />
                    <FeatureToggle
                        label="User Registration"
                        description="Allow new users to sign up. Disable to pause growth."
                        settingKey="registrationEnabled"
                        initialValue={s.registrationEnabled}
                    />
                </div>
            </div>

            {/* Feature Modules */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-gray-900">Feature Modules</h2>
                </div>
                <div className="grid gap-4">
                    <FeatureToggle
                        label="Prayer Wall"
                        description="Public prayer request feed and interactions."
                        settingKey="prayerWallEnabled"
                        initialValue={s.prayerWallEnabled}
                    />
                    <FeatureToggle
                        label="Automated Sync"
                        description="Daily background sync for news and church data."
                        settingKey="syncEnabled"
                        initialValue={s.syncEnabled}
                    />
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Changes apply immediately but may take a few seconds to propagate due to caching.
            </div>
        </div>
    );
}
