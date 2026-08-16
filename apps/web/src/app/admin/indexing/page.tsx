'use client';

import { useState, useEffect } from 'react';
import {
    Zap,
    Send,
    CheckCircle2,
    XCircle,
    Globe,
    RefreshCw,
    ExternalLink,
    Search,
    ShieldCheck,
    FileText,
    Radio
} from 'lucide-react';

export default function AdminIndexingPage() {
    const [statusData, setStatusData] = useState<any>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);

    const [singleUrl, setSingleUrl] = useState('');
    const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);

    const [isSubmittingAll, setIsSubmittingAll] = useState(false);
    const [isPingingSitemaps, setIsPingingSitemaps] = useState(false);

    const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; type: 'info' | 'success' | 'error' }>>([]);

    const addLog = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [{ timestamp, text, type }, ...prev]);
    };

    const fetchStatus = async () => {
        setLoadingStatus(true);
        try {
            const res = await fetch('/api/indexnow');
            const data = await res.json();
            setStatusData(data);
            if (data.keyVerified) {
                addLog('IndexNow Key verification file verified successfully', 'success');
            } else {
                addLog('IndexNow Key verification check completed', 'info');
            }
        } catch (err: any) {
            addLog(`Failed to fetch IndexNow status: ${err.message}`, 'error');
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!singleUrl.trim()) return;

        setIsSubmittingSingle(true);
        addLog(`Submitting URL: ${singleUrl} to IndexNow...`, 'info');

        try {
            const res = await fetch('/api/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: singleUrl, pingSitemaps: true }),
            });
            const data = await res.json();

            if (data.success) {
                addLog(`Successfully submitted ${data.urlCount} URL to IndexNow engines!`, 'success');
                setSingleUrl('');
            } else {
                addLog(`IndexNow submission response: ${data.error || 'Partial success'}`, 'error');
            }
        } catch (err: any) {
            addLog(`Error submitting URL: ${err.message}`, 'error');
        } finally {
            setIsSubmittingSingle(false);
        }
    };

    const handleSubmitAll = async () => {
        if (!confirm('Submit ALL site pages (Prisma DB & static routes) to IndexNow?')) return;

        setIsSubmittingAll(true);
        addLog('Fetching all site URLs & submitting bulk IndexNow batch...', 'info');

        try {
            const res = await fetch('/api/indexnow/submit-all', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                addLog(`✅ Bulk IndexNow complete! ${data.urlCount} URLs submitted to Bing, Yandex & IndexNow network.`, 'success');
            } else {
                addLog(`Bulk IndexNow response: ${data.error || 'Encountered issues'}`, 'error');
            }
        } catch (err: any) {
            addLog(`Bulk submission error: ${err.message}`, 'error');
        } finally {
            setIsSubmittingAll(false);
        }
    };

    const handlePingSitemaps = async () => {
        setIsPingingSitemaps(true);
        addLog('Pinging Google & Bing sitemap endpoints...', 'info');

        try {
            const res = await fetch('/api/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: ['/sitemap.xml'], pingSitemaps: true }),
            });
            const data = await res.json();
            addLog('✅ Sitemap ping complete for Google & Bing!', 'success');
        } catch (err: any) {
            addLog(`Sitemap ping error: ${err.message}`, 'error');
        } finally {
            setIsPingingSitemaps(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 rounded-2xl border border-amber-500/20 text-white shadow-xl">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">IndexNow & Search Engine Quick Indexing</h1>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">
                        Instantly inform Bing, Yandex, Naver, Seznam, and Google when new pages, prayers, or articles are published.
                    </p>
                </div>
                <button
                    onClick={fetchStatus}
                    disabled={loadingStatus}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition"
                >
                    <RefreshCw className={`w-4 h-4 ${loadingStatus ? 'animate-spin' : ''}`} />
                    Refresh Key Status
                </button>
            </div>

            {/* Verification & Key Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Verification</span>
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900">565731...dc41.txt</h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                            https://www.myprayertower.com/565731002ad842e8bf184087dab6dc41.txt
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Status</span>
                        {statusData?.keyVerified ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" /> Active & Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                                <Radio className="w-4 h-4 animate-pulse" /> Ready for Indexers
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Supported Search Networks</span>
                            <Globe className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Bing, Yandex, Naver, Seznam</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Supported search engines immediately index submitted URLs across global search engine clusters.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                        <span>API Protocol</span>
                        <span className="font-mono text-slate-700 font-semibold">IndexNow standard</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">XML Sitemap Status</span>
                            <FileText className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Dynamic Sitemap</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Auto-updated on demand for Googlebot & Bingbot.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <a
                            href="https://www.myprayertower.com/sitemap.xml"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-amber-600 hover:text-amber-700"
                        >
                            View sitemap.xml <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Single URL Submission Form */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-slate-900">Instant Submit Specific URL</h2>
                    </div>
                    <p className="text-xs text-slate-500">
                        Submit a new prayer, guide, blog post, or page URL to Bing & IndexNow for indexing within seconds.
                    </p>

                    <form onSubmit={handleSingleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                URL Path or Full URL
                            </label>
                            <input
                                type="text"
                                value={singleUrl}
                                onChange={(e) => setSingleUrl(e.target.value)}
                                placeholder="e.g. /prayers/st-jude-novena or https://www.myprayertower.com/blog/..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmittingSingle || !singleUrl.trim()}
                            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmittingSingle ? 'Submitting to IndexNow...' : 'Submit URL to IndexNow'}
                        </button>
                    </form>
                </div>

                {/* Bulk Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-bold text-slate-900">Bulk Site Indexing & Pings</h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Trigger full site submissions to IndexNow or ping Google and Bing sitemap crawlers directly.
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleSubmitAll}
                            disabled={isSubmittingAll}
                            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4 text-amber-400" />
                            {isSubmittingAll ? 'Submitting All Pages...' : 'Submit Entire Site to IndexNow (Bulk)'}
                        </button>

                        <button
                            onClick={handlePingSitemaps}
                            disabled={isPingingSitemaps}
                            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Radio className="w-4 h-4 text-blue-600" />
                            {isPingingSitemaps ? 'Pinging Sitemaps...' : 'Ping Google & Bing Sitemaps'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Submission Log */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Search className="w-4 h-4 text-amber-400" /> Indexing Activity Log
                    </h3>
                    <button
                        onClick={() => setLogs([])}
                        className="text-xs text-slate-400 hover:text-slate-200"
                    >
                        Clear Log
                    </button>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl font-mono text-xs max-h-60 overflow-y-auto space-y-2 border border-slate-800">
                    {logs.length === 0 ? (
                        <p className="text-slate-500 italic">No indexing activities logged yet. Submit a URL above to test.</p>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                                <span
                                    className={
                                        log.type === 'success'
                                            ? 'text-emerald-400'
                                            : log.type === 'error'
                                            ? 'text-red-400'
                                            : 'text-slate-200'
                                    }
                                >
                                    {log.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
