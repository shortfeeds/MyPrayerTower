import { NotificationSettings } from '@/components/dashboard/NotificationSettings';
import { Bell, Shield, User } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 pt-24 md:pt-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">Account Sanctuary</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your spiritual journey preferences and notifications.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Settings Navigation */}
                    <div className="space-y-2">
                        {[
                            { label: 'Notifications', icon: Bell, active: true },
                            { label: 'Privacy & Security', icon: Shield, active: false },
                            { label: 'Profile Details', icon: User, active: false }
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                        ? 'bg-sacred-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section id="notifications" className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold dark:text-white">Prayer Reminders</h2>
                            </div>
                            <NotificationSettings />
                        </section>

                        <section className="p-8 bg-gold-50/30 dark:bg-gold-950/20 border border-gold-200/50 dark:border-gold-800/30 rounded-[2.5rem] text-center">
                            <p className="text-gold-700 dark:text-gold-400 text-sm font-medium">
                                "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

