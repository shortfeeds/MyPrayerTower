import { format } from 'date-fns';
import { Star, Sunset, Sunrise, Infinity } from 'lucide-react';

interface MemorialTimelineProps {
    birthDate?: string | null;
    deathDate?: string | null;
    createdAt: string;
}

export function MemorialTimeline({ birthDate, deathDate, createdAt }: MemorialTimelineProps) {
    if (!birthDate && !deathDate) return null;

    return (
        <div className="py-12 relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent -translate-x-1/2" />

            <div className="space-y-16 relative z-10">
                {/* Birth */}
                {birthDate && (
                    <div className="flex items-center justify-center relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-100 rounded-full border-2 border-amber-300" />
                        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl px-4 items-center">
                            <div className="text-right pr-4">
                                <h4 className="text-xl font-serif text-slate-800">Entrance into Life</h4>
                                <p className="text-slate-500 font-serif italic">"Before I formed you in the womb I knew you."</p>
                            </div>
                            <div className="pl-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 text-amber-800 font-bold">
                                    <Sunrise className="w-4 h-4" />
                                    {format(new Date(birthDate), 'MMMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Life (Center Icon) */}
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center z-10">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                    </div>
                </div>

                {/* Death (Entrance to Eternity) */}
                {deathDate && (
                    <div className="flex items-center justify-center relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-600" />
                        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl px-4 items-center">
                            <div className="text-right pr-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-slate-800 font-bold">
                                    {format(new Date(deathDate), 'MMMM d, yyyy')}
                                    <Sunset className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="pl-4">
                                <h4 className="text-xl font-serif text-slate-800">Entrance into Eternity</h4>
                                <p className="text-slate-500 font-serif italic">"Life is changed, not ended."</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Eternal Life */}
                <div className="flex items-center justify-center relative pt-8">
                    <div className="flex flex-col items-center gap-3">
                        <Infinity className="w-8 h-8 text-amber-500" />
                        <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">Forever in our Hearts</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
