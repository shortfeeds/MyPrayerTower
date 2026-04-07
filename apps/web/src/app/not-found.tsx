import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050b1a] flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-9xl font-serif font-bold text-gold-500 mb-4 animate-pulse">404</h1>
            <h2 className="text-2xl font-serif mb-8 text-center">Peace Be With You. This page was not found.</h2>
            <Link 
                href="/"
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-lg transition-all"
            >
                Return to Sanctuary
            </Link>
        </div>
    );
}
