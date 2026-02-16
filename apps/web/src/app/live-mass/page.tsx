import { Play, MapPin, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const STREAMS = [
    {
        id: 'vatican',
        name: "St. Peter's Basilica",
        location: 'Vatican City',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/1200px-St_Peter%27s_Basilica_1.jpg',
        url: 'https://www.youtube.com/channel/UCxIcwuQ8uLmivdJHeSwc0WQ', // Vatican News
        description: 'The papal enclave within Rome, Italy. The headquarters of the Roman Catholic Church.'
    },
    {
        id: 'guadalupe',
        name: 'Basilica of Our Lady of Guadalupe',
        location: 'Mexico City, Mexico',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG/1200px-Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG',
        url: 'https://www.youtube.com/user/BasilicadeGuadalupe',
        description: 'National shrine of Mexico. One of the most visited Catholic pilgrimage sites in the world.'
    },
    {
        id: 'st_patricks',
        name: "St. Patrick's Cathedral",
        location: 'New York, USA',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/St_Patricks_Cathedral_NY.jpg/1200px-St_Patricks_Cathedral_NY.jpg',
        url: 'https://saintpatrickscathedral.org/live',
        description: 'A decorated Neo-Gothic-style Roman Catholic cathedral church in the United States.'
    },
    {
        id: 'notre_dame',
        name: 'Notre-Dame de Paris',
        location: 'Paris, France',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Notre-Dame_de_Paris_2013-07-24.jpg/1200px-Notre-Dame_de_Paris_2013-07-24.jpg',
        url: 'https://www.youtube.com/channel/UC-XN1v8O9V7o7_j5x4y9g6A',
        description: 'Ideally located on the Île de la Cité, keeping watch over Paris for more than 850 years.'
    },
];

export default function LiveMassPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Live Mass Hub</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Participate in the Holy Mass from anywhere in the world. Join global congregations in real-time prayer and worship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {STREAMS.map((stream) => (
                        <Link
                            key={stream.id}
                            href={stream.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={stream.imageUrl}
                                    alt={stream.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full" />
                                    LIVE STREAM
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                                        {stream.name}
                                    </h3>
                                </div>

                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin size={16} className="mr-1" />
                                    {stream.location}
                                </div>

                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                                    {stream.description}
                                </p>

                                <div className="mt-auto flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                    <Globe size={16} className="mr-2" />
                                    Visit Official Channel
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center bg-slate-100 rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Can't find your parish?</h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        Many local churches now stream their Masses online. Check our church finder to locate parishes near you.
                    </p>
                    <Link
                        href="/churches"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Find Local Churches
                    </Link>
                </div>
            </div>
        </div>
    );
}
