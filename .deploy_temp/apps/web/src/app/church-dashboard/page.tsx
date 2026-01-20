import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Bell, Settings, BarChart } from 'lucide-react';

export default function ChurchDashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Church Dashboard</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Manage your parish, connect with parishioners, and grow your community.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Cards */}
                    <div className="card-premium p-8 group hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Parishioner Management</h3>
                        <p className="text-gray-600 mb-6">
                            Manage your parish directory, track families, and organize groups.
                        </p>
                        <button className="text-primary-600 font-medium group-hover:underline">Manage Directory →</button>
                    </div>

                    <div className="card-premium p-8 group hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-xl flex items-center justify-center mb-6">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Mass Scheduler</h3>
                        <p className="text-gray-600 mb-6">
                            Update Mass times, confession schedules, and special liturgies.
                        </p>
                        <button className="text-gold-600 font-medium group-hover:underline">Update Schedule →</button>
                    </div>

                    <div className="card-premium p-8 group hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Announcements</h3>
                        <p className="text-gray-600 mb-6">
                            Send notifications to your parishioners about events and news.
                        </p>
                        <button className="text-purple-600 font-medium group-hover:underline">Send Update →</button>
                    </div>

                    <div className="card-premium p-8 group hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                            <BarChart className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
                        <p className="text-gray-600 mb-6">
                            Track engagement, attendance trends, and prayer requests.
                        </p>
                        <button className="text-green-600 font-medium group-hover:underline">View Insights →</button>
                    </div>
                </div>

                {/* Login Prompt */}
                <div className="mt-16 text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Parish Administrator?</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Sign in to access your dashboard. If you haven't claimed your church yet,
                        you can do so to start managing your listing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors"
                        >
                            Log In to Dashboard
                        </Link>
                        <Link
                            href="/claim"
                            className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Claim Your Church
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
