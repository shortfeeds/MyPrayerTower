import { BookOpen, ExternalLink, Library, ScrollText, Cross, BookMarked, Globe } from 'lucide-react';
import Link from 'next/link';

const resources = [
    {
        name: 'St. Isidore E-Book Library',
        description: 'A vast collection of Catholic e-books powered by Calibre. Includes Fathers of the Church, papal encyclicals, and classic spiritual works.',
        url: 'https://isidore.co/calibre/',
        icon: Library,
        color: 'bg-amber-100 text-amber-600',
        tags: ['E-books', 'Free', 'English']
    },
    {
        name: 'Liberius.net',
        description: 'Traditional Catholic texts including pre-Vatican II catechisms, missals, and theological treatises.',
        url: 'http://liberius.net/',
        icon: ScrollText,
        color: 'bg-purple-100 text-purple-600',
        tags: ['Traditional', 'Latin', 'French']
    },
    {
        name: 'New Advent',
        description: 'Catholic Encyclopedia, Summa Theologica, Church Fathers, and Bible.',
        url: 'https://www.newadvent.org/',
        icon: BookOpen,
        color: 'bg-blue-100 text-blue-600',
        tags: ['Encyclopedia', 'Summa', 'Free']
    },
    {
        name: 'Catholic Culture',
        description: 'Extensive library of papal documents, liturgical texts, and Catholic encyclopedia.',
        url: 'https://www.catholicculture.org/culture/library/',
        icon: Globe,
        color: 'bg-green-100 text-green-600',
        tags: ['Documents', 'Encyclicals', 'Free']
    },
    {
        name: 'EWTN Document Library',
        description: 'Official Church documents, papal writings, and catechetical resources.',
        url: 'https://www.ewtn.com/catholicism/library',
        icon: Cross,
        color: 'bg-red-100 text-red-600',
        tags: ['Official', 'Documents', 'Free']
    },
    {
        name: 'Sacred Texts: Catholicism',
        description: 'Historic Catholic texts including medieval mysticism and early church writings.',
        url: 'https://www.sacred-texts.com/chr/index.htm',
        icon: BookMarked,
        color: 'bg-indigo-100 text-indigo-600',
        tags: ['History', 'Mysticism', 'Free']
    }
];

export default function LibraryPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-orange-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Library className="w-4 h-4 text-amber-300" />
                        <span>Catholic Resources</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic E-Book Library</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                        Explore free online libraries containing centuries of Catholic wisdom — from Church Fathers to modern encyclicals.
                    </p>
                </div>
            </div>

            {/* Resources Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource) => (
                        <a
                            key={resource.name}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                            <div className={`w-14 h-14 ${resource.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <resource.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                {resource.name}
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                            </h3>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>

                {/* Internal Resources */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Also on MyPrayerTower</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/catechism" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 transition-colors">
                            Catechism of the Catholic Church
                        </Link>
                        <Link href="/bible" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors">
                            Bible Reader
                        </Link>
                        <Link href="/prayers" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors">
                            Prayer Library
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
