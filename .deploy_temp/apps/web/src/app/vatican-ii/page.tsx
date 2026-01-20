import { Landmark, FileText, ExternalLink, Calendar } from 'lucide-react';

interface Document {
    title: string;
    latinTitle: string;
    type: 'constitution' | 'decree' | 'declaration';
    topic: string;
    url: string;
}

const DOCUMENTS: Document[] = [
    // Constitutions (4)
    { title: 'On the Sacred Liturgy', latinTitle: 'Sacrosanctum Concilium', type: 'constitution', topic: 'Liturgy', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_en.html' },
    { title: 'On the Church', latinTitle: 'Lumen Gentium', type: 'constitution', topic: 'Ecclesiology', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html' },
    { title: 'On Divine Revelation', latinTitle: 'Dei Verbum', type: 'constitution', topic: 'Scripture', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html' },
    { title: 'On the Church in the Modern World', latinTitle: 'Gaudium et Spes', type: 'constitution', topic: 'Pastoral', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651207_gaudium-et-spes_en.html' },
    // Decrees (9)
    { title: 'On the Media', latinTitle: 'Inter Mirifica', type: 'decree', topic: 'Communications', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19631204_inter-mirifica_en.html' },
    { title: 'On Ecumenism', latinTitle: 'Unitatis Redintegratio', type: 'decree', topic: 'Ecumenism', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_unitatis-redintegratio_en.html' },
    { title: 'On Eastern Churches', latinTitle: 'Orientalium Ecclesiarum', type: 'decree', topic: 'Eastern Rites', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_orientalium-ecclesiarum_en.html' },
    { title: 'On Bishops', latinTitle: 'Christus Dominus', type: 'decree', topic: 'Hierarchy', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_christus-dominus_en.html' },
    { title: 'On Priestly Formation', latinTitle: 'Optatam Totius', type: 'decree', topic: 'Seminaries', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_optatam-totius_en.html' },
    { title: 'On Religious Life', latinTitle: 'Perfectae Caritatis', type: 'decree', topic: 'Religious Life', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_perfectae-caritatis_en.html' },
    { title: 'On the Apostolate of the Laity', latinTitle: 'Apostolicam Actuositatem', type: 'decree', topic: 'Laity', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651118_apostolicam-actuositatem_en.html' },
    { title: 'On Missionary Activity', latinTitle: 'Ad Gentes', type: 'decree', topic: 'Missions', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651207_ad-gentes_en.html' },
    { title: 'On Priestly Life', latinTitle: 'Presbyterorum Ordinis', type: 'decree', topic: 'Priesthood', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651207_presbyterorum-ordinis_en.html' },
    // Declarations (3)
    { title: 'On Christian Education', latinTitle: 'Gravissimum Educationis', type: 'declaration', topic: 'Education', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651028_gravissimum-educationis_en.html' },
    { title: 'On Non-Christian Religions', latinTitle: 'Nostra Aetate', type: 'declaration', topic: 'Interfaith', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651028_nostra-aetate_en.html' },
    { title: 'On Religious Freedom', latinTitle: 'Dignitatis Humanae', type: 'declaration', topic: 'Freedom', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651207_dignitatis-humanae_en.html' },
];

const TYPE_COLORS = {
    constitution: 'bg-purple-100 text-purple-700',
    decree: 'bg-blue-100 text-blue-700',
    declaration: 'bg-amber-100 text-amber-700',
};

export default function VaticanIIPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-yellow-600 via-amber-700 to-orange-800 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <Landmark className="w-4 h-4 text-yellow-300" />
                        <span>1962-1965</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Second Vatican Council</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-10">
                        The 21st Ecumenical Council — 16 documents that shaped the modern Catholic Church.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">4</div>
                            <div className="text-amber-200 text-sm">Constitutions</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">9</div>
                            <div className="text-amber-200 text-sm">Decrees</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">3</div>
                            <div className="text-amber-200 text-sm">Declarations</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Constitutions */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Constitutions (Highest Authority)</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {DOCUMENTS.filter(d => d.type === 'constitution').map(doc => (
                        <a
                            key={doc.latinTitle}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[doc.type]}`}>
                                Constitution
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1 group-hover:text-purple-600">
                                {doc.latinTitle}
                            </h3>
                            <p className="text-gray-500">{doc.title}</p>
                        </a>
                    ))}
                </div>

                {/* Decrees & Declarations */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Decrees & Declarations</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {DOCUMENTS.filter(d => d.type !== 'constitution').map(doc => (
                        <a
                            key={doc.latinTitle}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[doc.type]}`}>
                                {doc.type}
                            </span>
                            <h3 className="font-bold text-gray-900 mt-2 mb-1 group-hover:text-blue-600">
                                {doc.latinTitle}
                            </h3>
                            <p className="text-gray-500 text-sm">{doc.title}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
