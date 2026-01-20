'use client';

import { TrendingUp, TrendingDown, BarChart3, Calendar, Clock, Heart, Flame, Book, Users, Target } from 'lucide-react';

// Stats Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, color }: StatCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' :
                            isNegative ? 'text-red-600 dark:text-red-400' :
                                'text-gray-500'
                        }`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
            {changeLabel && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{changeLabel}</div>
            )}
        </div>
    );
}

// Prayer Activity Chart (Simple Bar Chart)
interface ActivityData {
    day: string;
    prayers: number;
    minutes: number;
}

export function WeeklyActivityChart({ data }: { data: ActivityData[] }) {
    const maxPrayers = Math.max(...data.map(d => d.prayers));

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    This Week
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">Prayer Activity</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-40">
                {data.map((day, i) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div
                            className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all hover:from-primary-500 hover:to-primary-300"
                            style={{ height: `${(day.prayers / maxPrayers) * 100}%`, minHeight: day.prayers > 0 ? '8px' : '0' }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{day.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Time Distribution
interface TimeSlot {
    time: string;
    prayers: number;
}

export function TimeDistribution({ data }: { data: TimeSlot[] }) {
    const maxPrayers = Math.max(...data.map(d => d.prayers));

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Prayer Times
                </h3>
            </div>

            <div className="space-y-3">
                {data.map((slot) => (
                    <div key={slot.time} className="flex items-center gap-3">
                        <span className="w-16 text-sm text-gray-500 dark:text-gray-400">{slot.time}</span>
                        <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-sacred-500 to-sacred-600 rounded-full"
                                style={{ width: `${(slot.prayers / maxPrayers) * 100}%` }}
                            />
                        </div>
                        <span className="w-8 text-sm text-right text-gray-600 dark:text-gray-400">{slot.prayers}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Personal Dashboard
interface DashboardData {
    totalPrayers: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    saintsViewed: number;
    groupsJoined: number;
    badgesEarned: number;
    weeklyActivity: ActivityData[];
    timeDistribution: TimeSlot[];
}

export function PersonalDashboard({ data }: { data: DashboardData }) {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Prayers"
                    value={data.totalPrayers.toLocaleString()}
                    change={12}
                    changeLabel="vs last month"
                    icon={Heart}
                    color="from-rose-500 to-rose-600"
                />
                <StatCard
                    title="Time in Prayer"
                    value={`${Math.floor(data.totalMinutes / 60)}h ${data.totalMinutes % 60}m`}
                    icon={Clock}
                    color="from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Current Streak"
                    value={data.currentStreak}
                    icon={Flame}
                    color="from-orange-500 to-orange-600"
                />
                <StatCard
                    title="Badges Earned"
                    value={data.badgesEarned}
                    icon={Target}
                    color="from-purple-500 to-purple-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                <WeeklyActivityChart data={data.weeklyActivity} />
                <TimeDistribution data={data.timeDistribution} />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <Book className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.saintsViewed}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Saints Learned</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-sacred-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.groupsJoined}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Groups Joined</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <Flame className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.longestStreak}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Best Streak</div>
                </div>
            </div>
        </div>
    );
}

// Insights component
interface Insight {
    id: string;
    type: 'tip' | 'achievement' | 'reminder' | 'encouragement';
    title: string;
    message: string;
}

export function InsightsCard({ insights }: { insights: Insight[] }) {
    const typeColors = {
        tip: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        achievement: 'bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800',
        reminder: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        encouragement: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    };

    const typeIcons = {
        tip: '💡',
        achievement: '🏆',
        reminder: '⏰',
        encouragement: '✨',
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Personal Insights</h3>
            <div className="space-y-3">
                {insights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-xl border ${typeColors[insight.type]}`}>
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{typeIcons[insight.type]}</span>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
