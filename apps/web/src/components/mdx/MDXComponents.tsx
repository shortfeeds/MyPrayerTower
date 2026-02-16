import Link from 'next/link';
import Image from 'next/image';

export const MDXComponents = {
    h1: (props: any) => (
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mt-12 mb-6 leading-tight" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="font-serif text-3xl font-bold text-gray-900 mt-12 mb-6 border-b border-gray-100 pb-2" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="font-serif text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
    ),
    p: (props: any) => (
        <p className="text-lg text-gray-700 leading-loose mb-6 font-light" {...props} />
    ),
    ul: (props: any) => (
        <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-gray-700" {...props} />
    ),
    ol: (props: any) => (
        <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-gray-700" {...props} />
    ),
    li: (props: any) => (
        <li className="pl-2" {...props} />
    ),
    a: (props: any) => {
        const href = props.href;
        const isInternal = href && (href.startsWith('/') || href.startsWith('#'));

        if (isInternal) {
            return (
                <Link href={href} className="text-gold-600 font-medium hover:underline decoration-2 decoration-gold-200 underline-offset-2 transition-all">
                    {props.children}
                </Link>
            );
        }

        return (
            <a target="_blank" rel="noopener noreferrer" className="text-gold-600 font-medium hover:underline decoration-2 decoration-gold-200 underline-offset-2 transition-all" {...props} />
        );
    },
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-gold-400 pl-6 py-2 my-8 italic text-xl text-gray-600 bg-gray-50 rounded-r-lg" {...props} />
    ),
    img: (props: any) => (
        <div className="my-8 rounded-xl overflow-hidden shadow-lg">
            <img className="w-full h-auto" {...props} alt={props.alt || ''} />
            {props.title && (
                <div className="bg-gray-50 p-2 text-center text-sm text-gray-500 italic">
                    {props.title}
                </div>
            )}
        </div>
    ),
    hr: (props: any) => (
        <hr className="my-12 border-gray-100" {...props} />
    ),
};
