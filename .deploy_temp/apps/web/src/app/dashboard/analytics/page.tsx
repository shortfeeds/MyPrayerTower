import { redirect } from 'next/navigation';
import { getParishStats } from '@/app/actions/dashboard';
import { Eye, Users, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export default async function AnalyticsPage() {
    const data = await getParishStats();

    if (!data) {
        redirect('/');
    }

    const { stats } = data;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-500">Track your church's engagement and growth</p>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Eye className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Page Views</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFollowers.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Followers</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Announcements</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Upcoming Events</p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center text-blue-800">
                <h3 className="text-lg font-bold mb-2">Detailed Historical Data Coming Soon</h3>
                <p>We are currently gathering more data points to provide you with detailed historical charts and trends.</p>
            </div>
        </div>
    );
}
