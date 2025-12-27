import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ReadingsPage() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="hero-pattern py-20 text-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4">
                        Daily Liturgy
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Daily Readings</h1>
                    <p className="text-xl text-blue-100">{today}</p>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Readings */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* First Reading */}
                        <div className="card-premium p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">First Reading</h2>
                                    <p className="text-sm text-gray-500">Acts 2:14, 22-33</p>
                                </div>
                            </div>
                            <div className="prose prose-lg text-gray-700 max-w-none">
                                <p>
                                    Then Peter stood up with the Eleven, raised his voice and addressed the crowd:
                                    "Fellow Jews and all of you who live in Jerusalem, let me explain this to you; listen carefully to what I say.
                                    Men of Israel, listen to this: Jesus of Nazareth was a man accredited by God to you by miracles, wonders and signs...
                                </p>
                            </div>
                        </div>

                        {/* Psalam */}
                        <div className="card-premium p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Responsorial Psalm</h2>
                                    <p className="text-sm text-gray-500">Psalm 16:1-2, 5, 7-11</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-primary-800 text-lg mb-6 italic">
                                    "Lord, you will show us the path of life."
                                </p>
                                <div className="prose prose-lg text-gray-700 max-w-none text-left">
                                    <p>
                                        Keep me safe, my God,<br />
                                        for in you I take refuge.<br />
                                        I say to the LORD, "You are my Lord."...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gospel */}
                        <div className="card-premium p-8 border-l-4 border-l-gold-500">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-white">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Gospel</h2>
                                    <p className="text-sm text-gray-500">Matthew 28:8-15</p>
                                </div>
                            </div>
                            <div className="prose prose-lg text-gray-700 max-w-none">
                                <p>
                                    So the women hurried away from the tomb, afraid yet filled with joy, and ran to tell his disciples.
                                    Suddenly Jesus met them. "Greetings," he said. They came to him, clasped his feet and worshiped him.
                                    Then Jesus said to them, "Do not be afraid. Go and tell my brothers to go to Galilee; there they will see me."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="card-premium p-6 bg-primary-900 text-white">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gold-400" />
                                Liturgical Calendar
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-blue-100">Season</span>
                                    <span className="font-semibold text-gold-400">Easter Time</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-blue-100">Color</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-white"></span>
                                        <span>White</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-blue-100">Week</span>
                                    <span>Octave of Easter</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Related Prayers</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/prayers/morning" className="flex items-center justify-between text-gray-600 hover:text-primary-600 group">
                                        <span>Morning Offering</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/prayers/angelus" className="flex items-center justify-between text-gray-600 hover:text-primary-600 group">
                                        <span>The Angelus</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/prayers/rosary" className="flex items-center justify-between text-gray-600 hover:text-primary-600 group">
                                        <span>Holy Rosary</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
