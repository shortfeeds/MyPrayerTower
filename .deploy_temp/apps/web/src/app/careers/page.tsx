import { ArrowRight, Code, PenTool, Users } from 'lucide-react';

export default function CareersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-primary-900 text-white py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Join Our Mission</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Build technology that serves the Church. We're looking for passionate individuals to join our team.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Positions</h2>

                    <div className="space-y-6">
                        {/* Job Card 1 */}
                        <div className="card-premium p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary-200 transition-colors cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                                    <Code className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">Senior Full Stack Engineer</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span>Engineering</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-2 rounded-full border border-gray-200 text-gray-600 font-medium group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all flex items-center gap-2">
                                Apply <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Job Card 2 */}
                        <div className="card-premium p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary-200 transition-colors cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">Product Designer</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span>Design</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-2 rounded-full border border-gray-200 text-gray-600 font-medium group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all flex items-center gap-2">
                                Apply <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Job Card 3 */}
                        <div className="card-premium p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary-200 transition-colors cursor-pointer">
                            <div className="w-full text-center py-8 text-gray-500 italic">
                                Don't see a role for you? <a href="/contact" className="text-primary-600 hover:underline">Email us</a> your resume.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
