'use client';

import { useState } from 'react';
import { Scale, ChevronDown, CheckCircle2, Circle, Heart, Users, Church, ShieldCheck } from 'lucide-react';

interface Commandment {
    number: number;
    name: string;
    questions: string[];
}

const COMMANDMENTS: Commandment[] = [
    {
        number: 1, name: 'I am the Lord your God; you shall not have strange gods before Me.',
        questions: [
            'Have I doubted or denied the existence of God?',
            'Have I practiced superstition, read horoscopes, or consulted fortune-tellers?',
            'Have I received Holy Communion in a state of mortal sin?',
            'Have I neglected prayer for a long time?',
            'Have I put my trust in money, possessions, or people instead of God?'
        ]
    },
    {
        number: 2, name: 'You shall not take the name of the Lord your God in vain.',
        questions: [
            'Have I used God\'s name carelessly or in anger?',
            'Have I cursed or sworn using God\'s name?',
            'Have I broken an oath or vow made to God?',
            'Have I spoken disrespectfully about sacred things?'
        ]
    },
    {
        number: 3, name: 'Remember to keep holy the Lord\'s Day.',
        questions: [
            'Have I missed Mass on Sundays or Holy Days of Obligation through my own fault?',
            'Have I arrived late or left early from Mass without good reason?',
            'Have I done unnecessary work on Sunday?',
            'Have I failed to rest and spend time with family on Sunday?'
        ]
    },
    {
        number: 4, name: 'Honor your father and your mother.',
        questions: [
            'Have I disobeyed or disrespected my parents?',
            'Have I neglected to care for aging parents?',
            'Have I caused family discord or held grudges against family members?',
            'Have I been a poor example to my children?'
        ]
    },
    {
        number: 5, name: 'You shall not kill.',
        questions: [
            'Have I physically harmed anyone?',
            'Have I had an abortion or encouraged one?',
            'Have I abused alcohol, drugs, or food?',
            'Have I harbored hatred or a desire for revenge?',
            'Have I been reckless with my own or others\' safety?'
        ]
    },
    {
        number: 6, name: 'You shall not commit adultery.',
        questions: [
            'Have I been unfaithful to my spouse in thought, word, or deed?',
            'Have I viewed pornography or impure images?',
            'Have I engaged in sexual activity outside of marriage?',
            'Have I used artificial contraception?'
        ]
    },
    {
        number: 7, name: 'You shall not steal.',
        questions: [
            'Have I stolen anything?',
            'Have I cheated in school or business?',
            'Have I failed to pay just wages or debts?',
            'Have I damaged others\' property?',
            'Have I accepted stolen goods?'
        ]
    },
    {
        number: 8, name: 'You shall not bear false witness against your neighbor.',
        questions: [
            'Have I lied or deceived others?',
            'Have I gossiped or spread rumors?',
            'Have I revealed secrets entrusted to me?',
            'Have I judged others rashly?',
            'Have I failed to defend the reputation of others?'
        ]
    },
    {
        number: 9, name: 'You shall not covet your neighbor\'s wife.',
        questions: [
            'Have I entertained impure thoughts or desires?',
            'Have I looked at others lustfully?',
            'Have I failed to guard my senses (eyes, ears)?',
            'Have I allowed myself near occasions of sin?'
        ]
    },
    {
        number: 10, name: 'You shall not covet your neighbor\'s goods.',
        questions: [
            'Have I been envious of what others have?',
            'Have I been greedy or excessively attached to possessions?',
            'Have I been ungrateful for what God has given me?',
            'Have I failed to share with those in need?'
        ]
    }
];

export default function ExaminePage() {
    const [expandedCmd, setExpandedCmd] = useState<number | null>(1);
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const toggleCheck = (key: string) => {
        setChecked(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Scale className="w-4 h-4 text-violet-300" />
                        <span>Sacrament of Reconciliation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Examination of Conscience</h1>
                    <p className="text-xl text-violet-100 max-w-2xl mx-auto">
                        Prepare for a good confession by reflecting on your actions in light of the Ten Commandments.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* Opening Prayer */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Prayer Before Examination
                    </h3>
                    <p className="text-gray-600 italic">
                        Come, Holy Spirit, enlighten my mind that I may clearly know my sins.
                        Move my heart to sincere sorrow and a firm purpose of amendment.
                        Help me to make a good confession. Amen.
                    </p>
                </div>

                {/* Commandments */}
                <div className="space-y-4">
                    {COMMANDMENTS.map(cmd => (
                        <div key={cmd.number} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setExpandedCmd(expandedCmd === cmd.number ? null : cmd.number)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold">
                                        {cmd.number}
                                    </div>
                                    <span className="font-medium text-gray-900">{cmd.name}</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCmd === cmd.number ? 'rotate-180' : ''}`} />
                            </button>

                            {expandedCmd === cmd.number && (
                                <div className="px-5 pb-5 space-y-3">
                                    {cmd.questions.map((q, i) => {
                                        const key = `${cmd.number}-${i}`;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => toggleCheck(key)}
                                                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${checked[key] ? 'bg-violet-50' : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {checked[key]
                                                    ? <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                                    : <Circle className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                                                }
                                                <span className={checked[key] ? 'text-violet-700' : 'text-gray-600'}>{q}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Act of Contrition */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mt-8">
                    <h3 className="font-bold text-violet-900 mb-3">Act of Contrition</h3>
                    <p className="text-violet-800">
                        O my God, I am heartily sorry for having offended Thee, and I detest all my sins
                        because I dread the loss of Heaven and the pains of Hell, but most of all because
                        they offend Thee, my God, Who art all good and deserving of all my love. I firmly
                        resolve, with the help of Thy grace, to confess my sins, to do penance, and to
                        amend my life. Amen.
                    </p>
                </div>
            </div>
        </div>
    );
}
