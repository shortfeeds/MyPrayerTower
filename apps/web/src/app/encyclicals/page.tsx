import { FileText, ExternalLink, User, Calendar, Search } from 'lucide-react';

interface Encyclical {
    title: string;
    latinTitle: string;
    pope: string;
    year: number;
    topic: string;
    url: string;
}

const ENCYCLICALS: Encyclical[] = [
    { title: 'On Faith and Reason', latinTitle: 'Fides et Ratio', pope: 'John Paul II', year: 1998, topic: 'Philosophy', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html' },
    { title: 'The Gospel of Life', latinTitle: 'Evangelium Vitae', pope: 'John Paul II', year: 1995, topic: 'Pro-Life', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25031995_evangelium-vitae.html' },
    { title: 'The Splendor of Truth', latinTitle: 'Veritatis Splendor', pope: 'John Paul II', year: 1993, topic: 'Moral Theology', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_06081993_veritatis-splendor.html' },
    { title: 'On Human Work', latinTitle: 'Laborem Exercens', pope: 'John Paul II', year: 1981, topic: 'Social Teaching', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091981_laborem-exercens.html' },
    { title: 'On Human Life', latinTitle: 'Humanae Vitae', pope: 'Paul VI', year: 1968, topic: 'Marriage & Family', url: 'https://www.vatican.va/content/paul-vi/en/encyclicals/documents/hf_p-vi_enc_25071968_humanae-vitae.html' },
    { title: 'Mother and Teacher', latinTitle: 'Mater et Magistra', pope: 'John XXIII', year: 1961, topic: 'Social Teaching', url: 'https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_15051961_mater.html' },
    { title: 'Peace on Earth', latinTitle: 'Pacem in Terris', pope: 'John XXIII', year: 1963, topic: 'Peace & Rights', url: 'https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_11041963_pacem.html' },
    { title: 'On Social Concerns', latinTitle: 'Sollicitudo Rei Socialis', pope: 'John Paul II', year: 1987, topic: 'Social Teaching', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_30121987_sollicitudo-rei-socialis.html' },
    { title: 'God is Love', latinTitle: 'Deus Caritas Est', pope: 'Benedict XVI', year: 2005, topic: 'Love & Charity', url: 'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html' },
    { title: 'In Hope We Were Saved', latinTitle: 'Spe Salvi', pope: 'Benedict XVI', year: 2007, topic: 'Hope', url: 'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html' },
    { title: 'Charity in Truth', latinTitle: 'Caritas in Veritate', pope: 'Benedict XVI', year: 2009, topic: 'Social Teaching', url: 'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20090629_caritas-in-veritate.html' },
    { title: 'The Joy of the Gospel', latinTitle: 'Evangelii Gaudium', pope: 'Francis', year: 2013, topic: 'Evangelization', url: 'https://www.vatican.va/content/francesco/en/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html' },
    { title: 'On Care for Our Common Home', latinTitle: 'Laudato Si\'', pope: 'Francis', year: 2015, topic: 'Environment', url: 'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html' },
    { title: 'On Fraternity', latinTitle: 'Fratelli Tutti', pope: 'Francis', year: 2020, topic: 'Fraternity', url: 'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html' },
    { title: 'On the New Evangelization', latinTitle: 'Redemptoris Missio', pope: 'John Paul II', year: 1990, topic: 'Mission', url: 'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_07121990_redemptoris-missio.html' },
];

export default function EncyclicalsPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <FileText className="w-4 h-4 text-emerald-300" />
                        <span>Papal Teaching</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Papal Encyclicals</h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                        Authoritative letters from the Popes addressing faith, morals, and social issues.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ENCYCLICALS.map(enc => (
                        <a
                            key={enc.latinTitle}
                            href={enc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    {enc.topic}
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600">
                                {enc.latinTitle}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">{enc.title}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{enc.pope}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{enc.year}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
