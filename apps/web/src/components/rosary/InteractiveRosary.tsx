'use client';

import { useState, useMemo } from 'react';
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    CheckCircle2,
    Volume2,
    VolumeX,
    Heart,
    BookOpen,
    Share2
} from 'lucide-react';
import { ShareButtons } from '@/components/social/ShareButtons';

export interface MysteryDetail {
    title: string;
    scripture: string;
    fruit: string;
}

export interface MysteryGroup {
    name: string;
    days: string[];
    mysteries: MysteryDetail[];
}

const MYSTERY_GROUPS: MysteryGroup[] = [
    {
        name: 'Joyful Mysteries',
        days: ['Monday', 'Saturday'],
        mysteries: [
            {
                title: 'The Annunciation',
                scripture: 'The angel Gabriel said to Mary: "Do not be afraid, for you have found favor with God."',
                fruit: 'Humility of Heart'
            },
            {
                title: 'The Visitation',
                scripture: 'Elizabeth was filled with the Holy Spirit and exclaimed: "Blessed are you among women!"',
                fruit: 'Love of Neighbor & Charity'
            },
            {
                title: 'The Nativity of Our Lord',
                scripture: 'She gave birth to her firstborn Son and laid Him in a manger.',
                fruit: 'Poverty of Spirit & Detachment'
            },
            {
                title: 'The Presentation in the Temple',
                scripture: 'Simeon took Him into his arms and blessed God: "My eyes have seen your salvation."',
                fruit: 'Obedience & Purity'
            },
            {
                title: 'The Finding of Jesus in the Temple',
                scripture: 'They found Him in the temple, sitting among the teachers, listening and asking questions.',
                fruit: 'Piety & Joy in Finding Jesus'
            }
        ]
    },
    {
        name: 'Sorrowful Mysteries',
        days: ['Tuesday', 'Friday'],
        mysteries: [
            {
                title: 'The Agony in the Garden',
                scripture: 'Father, if You are willing, remove this cup from Me; yet not My will, but Yours be done.',
                fruit: 'Sorrow for Sin & Conformity to God\'s Will'
            },
            {
                title: 'The Scourging at the Pillar',
                scripture: 'Pilate took Jesus and had Him scourged. By His wounds we are healed.',
                fruit: 'Mortification & Purity of Senses'
            },
            {
                title: 'The Crowning with Thorns',
                scripture: 'The soldiers twisted together a crown of thorns and set it on His head.',
                fruit: 'Moral Courage & Reign of Christ in Mind'
            },
            {
                title: 'The Carrying of the Cross',
                scripture: 'Bearing His own cross, He went out to the Place of the Skull (Golgotha).',
                fruit: 'Patience & Bearing Daily Crosses'
            },
            {
                title: 'The Crucifixion and Death of Our Lord',
                scripture: 'Jesus cried out in a loud voice, "Father, into your hands I commend my spirit."',
                fruit: 'Self-Sacrifice & Forgiveness of Enemies'
            }
        ]
    },
    {
        name: 'Glorious Mysteries',
        days: ['Wednesday', 'Sunday'],
        mysteries: [
            {
                title: 'The Resurrection',
                scripture: 'He is not here; He has risen, just as He said. Come and see the place where He lay.',
                fruit: 'Faith & Spiritual Rebirth'
            },
            {
                title: 'The Ascension into Heaven',
                scripture: 'As they watched, He was lifted up, and a cloud hid Him from their sight.',
                fruit: 'Christian Hope & Desire for Heaven'
            },
            {
                title: 'The Descent of the Holy Spirit (Pentecost)',
                scripture: 'Tongues of fire rested upon each of them, and all were filled with the Holy Spirit.',
                fruit: 'Love of God & Zeal for Souls'
            },
            {
                title: 'The Assumption of Mary into Heaven',
                scripture: 'The Immaculate Virgin, preserved free from all stain of original sin, was taken body and soul into heavenly glory.',
                fruit: 'Grace of a Happy Death & Devotion to Mary'
            },
            {
                title: 'The Coronation of Mary as Queen of Heaven',
                scripture: 'A great sign appeared in heaven: a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.',
                fruit: 'Trust in Mary’s Intercession'
            }
        ]
    },
    {
        name: 'Luminous Mysteries',
        days: ['Thursday'],
        mysteries: [
            {
                title: 'The Baptism of the Lord in the Jordan',
                scripture: 'A voice from heaven said: "This is my beloved Son, with whom I am well pleased."',
                fruit: 'Openness to the Holy Spirit'
            },
            {
                title: 'The Wedding at Cana',
                scripture: 'His mother said to the servants: "Do whatever He tells you."',
                fruit: 'To Jesus Through Mary'
            },
            {
                title: 'The Proclamation of the Kingdom of God',
                scripture: 'Repent and believe in the Gospel, for the Kingdom of Heaven is at hand.',
                fruit: 'Repentance & Trust in God'
            },
            {
                title: 'The Transfiguration',
                scripture: 'His face shone like the sun, and His clothes became dazzling white.',
                fruit: 'Desire for Holiness'
            },
            {
                title: 'The Institution of the Holy Eucharist',
                scripture: 'Take and eat; this is My body. Do this in memory of Me.',
                fruit: 'Eucharistic Adoration & Reverence'
            }
        ]
    }
];

const PRAYERS_TEXT = {
    creed: {
        title: "The Apostles' Creed",
        text: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord: Who was conceived by the Holy Spirit, born of the Virgin Mary; suffered under Pontius Pilate, was crucified, died and was buried. He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
    },
    ourFather: {
        title: "Our Father (Pater Noster)",
        text: "Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
    },
    hailMary: {
        title: "Hail Mary (Ave Maria)",
        text: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
    },
    gloryBe: {
        title: "Glory Be (Gloria Patri)",
        text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
    },
    fatima: {
        title: "The Fatima Prayer",
        text: "O My Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy. Amen."
    },
    hailHolyQueen: {
        title: "Hail, Holy Queen (Salve Regina)",
        text: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ. Amen."
    }
};

export function InteractiveRosary() {
    // Determine today's mystery group based on current day of week
    const todayName = useMemo(() => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long' });
    }, []);

    const defaultGroupIndex = useMemo(() => {
        const idx = MYSTERY_GROUPS.findIndex(g => g.days.includes(todayName));
        return idx !== -1 ? idx : 0;
    }, [todayName]);

    const [selectedGroupIndex, setSelectedGroupIndex] = useState(defaultGroupIndex);
    const [decadeStep, setDecadeStep] = useState(0); // 0: Opening, 1-5: Decades, 6: Concluding
    const [hailMaryCount, setHailMaryCount] = useState(1);

    const activeGroup = MYSTERY_GROUPS[selectedGroupIndex];
    const currentMystery = decadeStep >= 1 && decadeStep <= 5 ? activeGroup.mysteries[decadeStep - 1] : null;

    // Advance step
    const handleNext = () => {
        if (decadeStep === 0) {
            setDecadeStep(1);
            setHailMaryCount(1);
        } else if (decadeStep >= 1 && decadeStep <= 5) {
            if (hailMaryCount < 10) {
                setHailMaryCount(prev => prev + 1);
            } else {
                if (decadeStep === 5) {
                    setDecadeStep(6);
                } else {
                    setDecadeStep(prev => prev + 1);
                    setHailMaryCount(1);
                }
            }
        }
    };

    const handlePrev = () => {
        if (decadeStep === 6) {
            setDecadeStep(5);
            setHailMaryCount(10);
        } else if (decadeStep >= 1 && decadeStep <= 5) {
            if (hailMaryCount > 1) {
                setHailMaryCount(prev => prev - 1);
            } else if (decadeStep > 1) {
                setDecadeStep(prev => prev - 1);
                setHailMaryCount(10);
            } else {
                setDecadeStep(0);
            }
        }
    };

    const handleReset = () => {
        setDecadeStep(0);
        setHailMaryCount(1);
    };

    // Total completion percentage (1 opening + 50 decade beads + 1 concluding = 52 units)
    const progressPercent = useMemo(() => {
        if (decadeStep === 0) return 5;
        if (decadeStep === 6) return 100;
        const beadsDone = (decadeStep - 1) * 10 + hailMaryCount;
        return Math.min(95, Math.round((beadsDone / 50) * 90) + 5);
    }, [decadeStep, hailMaryCount]);

    return (
        <section
            aria-label="Interactive Rosary Prayer Guide"
            className="my-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
        >
            {/* Top Toolbar */}
            <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-950 text-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                            <Sparkles className="w-3 h-3 text-rose-300" />
                            Virtual Decade Bead Tracker
                        </span>
                        <h3 className="text-2xl font-serif font-bold">
                            Interactive Holy Rosary
                        </h3>
                        <p className="text-xs text-rose-200">
                            Today is <strong>{todayName}</strong> — Recommended: <strong>{MYSTERY_GROUPS[defaultGroupIndex].name}</strong>
                        </p>
                    </div>

                    {/* Mystery Selector Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {MYSTERY_GROUPS.map((g, idx) => (
                            <button
                                key={g.name}
                                type="button"
                                onClick={() => {
                                    setSelectedGroupIndex(idx);
                                    handleReset();
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    selectedGroupIndex === idx
                                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                {g.name.replace(' Mysteries', '')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-center text-xs text-rose-200 mb-1">
                        <span>
                            {decadeStep === 0 && 'Opening Prayers (Creed & 3 Hail Marys)'}
                            {decadeStep >= 1 && decadeStep <= 5 && `Decade ${decadeStep} of 5 • Bead ${hailMaryCount} of 10`}
                            {decadeStep === 6 && 'Concluding Prayers (Salve Regina)'}
                        </span>
                        <span className="font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Central Prayer Meditation Display */}
            <div className="p-6 md:p-8 space-y-6">
                {/* Step 0: Opening Prayers */}
                {decadeStep === 0 && (
                    <div className="space-y-6">
                        <div className="text-center max-w-xl mx-auto">
                            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                                In The Name Of The Father, And Of The Son, And Of The Holy Spirit
                            </span>
                            <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                                Opening Devotions
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Begin by holding the crucifix, making the Sign of the Cross, and professing your faith with the Apostles&apos; Creed.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                            <h5 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2">
                                {PRAYERS_TEXT.creed.title}
                            </h5>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                                {PRAYERS_TEXT.creed.text}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                                <h6 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                                    {PRAYERS_TEXT.ourFather.title}
                                </h6>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {PRAYERS_TEXT.ourFather.text}
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                                <h6 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                                    3 Hail Marys (For Faith, Hope &amp; Charity)
                                </h6>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Recite three Hail Marys asking the Queen of Heaven to increase theological virtues in your soul.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Steps 1-5: The Five Decades */}
                {decadeStep >= 1 && decadeStep <= 5 && currentMystery && (
                    <div className="space-y-6">
                        {/* Mystery Title and Fruit Banner */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl p-6 border border-amber-200 dark:border-slate-800 text-center">
                            <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                                {activeGroup.name} • Decade {decadeStep}
                            </span>
                            <h4 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                                {currentMystery.title}
                            </h4>
                            <p className="italic text-sm text-slate-700 dark:text-slate-300 mt-2 max-w-xl mx-auto">
                                &ldquo;{currentMystery.scripture}&rdquo;
                            </p>
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-slate-700 shadow-sm">
                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                                Spiritual Fruit: {currentMystery.fruit}
                            </div>
                        </div>

                        {/* Interactive 10 Beads Graphic */}
                        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Hail Mary Beads ({hailMaryCount} / 10)
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Click bead to jump
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-1.5 md:gap-3">
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((bead) => {
                                    const isCompleted = bead < hailMaryCount;
                                    const isCurrent = bead === hailMaryCount;
                                    return (
                                        <button
                                            key={bead}
                                            type="button"
                                            onClick={() => setHailMaryCount(bead)}
                                            className={`h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all ${
                                                isCurrent
                                                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300/50 scale-105 shadow-md'
                                                    : isCompleted
                                                    ? 'bg-rose-900 text-white shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                            }`}
                                        >
                                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : bead}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Active Prayer Text Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                Current Bead Prayer
                            </span>
                            <h5 className="font-serif font-bold text-lg text-slate-900 dark:text-white mt-1 mb-2">
                                {PRAYERS_TEXT.hailMary.title}
                            </h5>
                            <p className="text-base font-serif text-slate-800 dark:text-slate-200 leading-relaxed">
                                {PRAYERS_TEXT.hailMary.text}
                            </p>

                            {hailMaryCount === 10 && (
                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                                            {PRAYERS_TEXT.gloryBe.title}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-serif">
                                            {PRAYERS_TEXT.gloryBe.text}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                                            {PRAYERS_TEXT.fatima.title}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-serif">
                                            {PRAYERS_TEXT.fatima.text}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 6: Concluding Prayers */}
                {decadeStep === 6 && (
                    <div className="space-y-6">
                        <div className="text-center max-w-xl mx-auto">
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                All 5 Decades Completed!
                            </span>
                            <h4 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">
                                Concluding Devotions
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Offer the final prayers to our Blessed Mother Mary.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-amber-200 dark:border-slate-800">
                            <h5 className="font-serif font-bold text-lg text-slate-900 dark:text-white mb-2">
                                {PRAYERS_TEXT.hailHolyQueen.title}
                            </h5>
                            <p className="text-sm font-serif text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                                {PRAYERS_TEXT.hailHolyQueen.text}
                            </p>
                            <p className="text-xs italic text-slate-500 dark:text-slate-400">
                                Conclude by making the Sign of the Cross: &ldquo;In the name of the Father, and of the Son, and of the Holy Spirit. Amen.&rdquo;
                            </p>
                        </div>

                        {/* Viral WhatsApp Share Card */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 text-center">
                            <h5 className="font-serif font-bold text-emerald-950 dark:text-emerald-200 text-lg mb-1">
                                Share the Grace of the Rosary
                            </h5>
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-4 max-w-md mx-auto">
                                Inspire family and prayer groups by sharing today&apos;s Holy Rosary meditation.
                            </p>
                            <div className="flex justify-center">
                                <ShareButtons
                                    url="https://www.myprayertower.com/rosary"
                                    title={`I just prayed the ${activeGroup.name} of the Holy Rosary on MyPrayerTower.`}
                                    description="Join me in meditating on the Holy Rosary with our interactive bead-by-bead tracker."
                                    variant="cta"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Action Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={decadeStep === 0}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous Bead
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 transition"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Start Over
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all"
                    >
                        {decadeStep === 0 && 'Begin 1st Decade'}
                        {decadeStep >= 1 && decadeStep <= 5 && (hailMaryCount < 10 ? 'Next Hail Mary' : decadeStep === 5 ? 'Finish Decades' : 'Next Decade')}
                        {decadeStep === 6 && 'Pray Another Rosary'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
