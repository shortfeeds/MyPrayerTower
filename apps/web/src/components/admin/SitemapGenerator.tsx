'use client';

import { useState, useTransition } from 'react';
import { RefreshCw, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { generateSitemapAction } from '@/app/actions/sitemap';

export function SitemapGenerator() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    const handleGenerate = () => {
        startTransition(async () => {
            try {
                const result = await generateSitemapAction();
                if (result.success) {
                    setStatus({
                        type: 'success',
                        message: `Success! Generated ${result.count.toLocaleString()} URLs at ${new Date().toLocaleTimeString()}`
                    });
                }
            } catch (error) {
                console.error(error);
                setStatus({ type: 'error', message: 'Failed to generate sitemap. Check console.' });
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sitemap Manager</h2>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-gray-900 truncate">sitemap.xml</p>
                        <a
                            href="https://www.myprayertower.com/sitemap.xml"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                            View Live <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            {status.message && (
                <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
                    {status.message}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={isPending}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                {isPending ? 'Regenerate Live Sitemap' : 'Regenerate Now'}
            </button>
        </div>
    );
}
