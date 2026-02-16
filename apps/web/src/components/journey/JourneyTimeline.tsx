"use client";

import { useState, useEffect } from 'react';
import { Plus, Footprints, Medal, Award, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

type Milestone = {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'milestone' | 'sacrament' | 'achievement';
};

export function JourneyTimeline() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
        type: 'milestone',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const saved = localStorage.getItem('mpt_journey_milestones');
        if (saved) {
            setMilestones(JSON.parse(saved).sort((a: Milestone, b: Milestone) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
        }
    }, []);

    const saveMilestone = () => {
        if (!newMilestone.title || !newMilestone.date) return;

        const milestone: Milestone = {
            id: crypto.randomUUID(),
            date: newMilestone.date!,
            title: newMilestone.title!,
            description: newMilestone.description || '',
            type: newMilestone.type as any,
        };

        const updated = [milestone, ...milestones].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setMilestones(updated);
        localStorage.setItem('mpt_journey_milestones', JSON.stringify(updated));
        setNewMilestone({ type: 'milestone', date: new Date().toISOString().split('T')[0], title: '', description: '' });
        setIsAdding(false);
    };

    const deleteMilestone = (id: string) => {
        const updated = milestones.filter(m => m.id !== id);
        setMilestones(updated);
        localStorage.setItem('mpt_journey_milestones', JSON.stringify(updated));
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Your Timeline</h2>
                    <p className="text-gray-600 dark:text-gray-400">Milestones along your path of faith.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    {isAdding ? 'Cancel' : 'Add Milestone'}
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-12 border border-amber-100 dark:border-amber-900 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">New Milestone</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                value={newMilestone.title || ''}
                                onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="e.g. Completed First Novena"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newMilestone.date}
                                    onChange={e => setNewMilestone({ ...newMilestone, date: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    value={newMilestone.type}
                                    onChange={e => setNewMilestone({ ...newMilestone, type: e.target.value as any })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
                                >
                                    <option value="milestone">Milestone</option>
                                    <option value="sacrament">Sacrament</option>
                                    <option value="achievement">Achievement</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                            <textarea
                                value={newMilestone.description || ''}
                                onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none h-24 resize-none"
                                placeholder="What made this moment special?"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={saveMilestone}
                                disabled={!newMilestone.title}
                                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                            >
                                Save Milestone
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 md:ml-6 space-y-12 pb-12">
                {milestones.length === 0 ? (
                    <div className="pl-8 md:pl-12 py-2">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <Footprints className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Your journey begins today. Add your first milestone!</p>
                        </div>
                    </div>
                ) : (
                    milestones.map((milestone, index) => {
                        const date = new Date(milestone.date);

                        let Icon = Footprints;
                        let colorClasses = 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';

                        if (milestone.type === 'sacrament') {
                            Icon = Award;
                            colorClasses = 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
                        } else if (milestone.type === 'achievement') {
                            Icon = Medal;
                            colorClasses = 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
                        }

                        return (
                            <div key={milestone.id} className="relative pl-8 md:pl-12">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] md:-left-[11px] top-0 w-[20px] h-[20px] rounded-full border-4 border-white dark:border-gray-950 ${index === 0 ? 'bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/30' : 'bg-gray-300 dark:bg-gray-600'
                                    }`} />

                                {/* Content Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                            {format(date, 'MMM d, yyyy')}
                                        </span>
                                        <button
                                            onClick={() => deleteMilestone(milestone.id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Milestone"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${colorClasses}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{milestone.title}</h3>
                                            {milestone.description && (
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                                    {milestone.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
