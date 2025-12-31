import { Headphones, ExternalLink, Clock, Star, Mic } from 'lucide-react';

interface Podcast {
    name: string;
    host: string;
    description: string;
    frequency: string;
    url: string;
    rating: number;
}

const PODCASTS: Podcast[] = [
    { name: 'Catholic Stuff You Should Know', host: 'Fr. Nathan Goebel & Fr. John Nepil', description: 'Two priests discuss faith, culture, and life with humor and insight.', frequency: 'Weekly', url: 'https://catholicstuffpodcast.com/', rating: 5 },
    { name: 'Pints With Aquinas', host: 'Matt Fradd', description: 'Deep dives into the thought of St. Thomas Aquinas with great guests.', frequency: 'Weekly', url: 'https://pintswithaquinas.com/', rating: 5 },
    { name: 'The Liturgy Guys', host: 'Fr. Patrick Schultz & Thomas Engel', description: 'All things liturgy, sacred music, and Catholic worship.', frequency: 'Weekly', url: 'https://www.liturgyguys.com/', rating: 5 },
    { name: 'The Catholic Talk Show', host: 'Ryan Scheel, Ryan DellaCrosse, Fr. Rich Pagano', description: 'Fun and engaging discussions on Catholic faith and culture.', frequency: 'Weekly', url: 'https://www.thecatholictalkshow.com/', rating: 4 },
    { name: 'Word on Fire Show', host: 'Bishop Robert Barron', description: 'Bishop Barron discusses the intersection of faith and culture.', frequency: 'Weekly', url: 'https://www.wordonfire.org/show/', rating: 5 },
    { name: 'The Counsel of Trent', host: 'Trent Horn', description: 'Apologetics and defense of the Catholic faith.', frequency: 'Weekly', url: 'https://www.catholic.com/audio/cot', rating: 5 },
    { name: 'All Things Catholic', host: 'Edward Sri', description: 'Explores the beauty and wisdom of the Catholic faith.', frequency: 'Weekly', url: 'https://allthingscatholic.libsyn.com/', rating: 4 },
    { name: 'Breaking in the Habit', host: 'Fr. Casey Cole', description: 'A Franciscan friar\'s take on faith, religion, and spirituality.', frequency: 'Weekly', url: 'https://www.youtube.com/c/BreakingInTheHabit', rating: 5 },
    { name: 'The Lanky Guys', host: 'Fr. Patrick Briscoe & Fr. Bonaventure Chapman', description: 'Dominican friars discuss faith with depth and humor.', frequency: 'Weekly', url: 'https://thelankyguys.com/', rating: 4 },
];

export default function PodcastsPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-orange-600 via-red-700 to-rose-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Headphones className="w-4 h-4 text-orange-300" />
                        <span>Listen & Learn</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic Podcasts</h1>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                        Curated podcast recommendations for deepening your faith on the go.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PODCASTS.map(podcast => (
                        <a
                            key={podcast.name}
                            href={podcast.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Mic className="w-6 h-6 text-orange-600" />
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600">{podcast.name}</h3>
                            <p className="text-orange-600 text-sm mb-3">{podcast.host}</p>
                            <p className="text-gray-600 text-sm mb-4">{podcast.description}</p>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{podcast.frequency}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(podcast.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
