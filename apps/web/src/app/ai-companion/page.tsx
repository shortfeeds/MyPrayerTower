"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, RefreshCw } from 'lucide-react';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const SUGGESTIONS = [
    "How can I pray when I feel anxious?",
    "Explain the parable of the Prodigal Son.",
    "Who is the patron saint of students?",
    "Suggest a short morning prayer.",
];

export default function AICompanionPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Peace be with you. I am your spiritual companion. How can I help you on your faith journey today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const responseText = getMockResponse(text);
            const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: responseText };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    const getMockResponse = (text: string): string => {
        const lower = text.toLowerCase();
        if (lower.includes('anxious') || lower.includes('worry')) {
            return "When you feel anxious, remember Philippians 4:6-7: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' Try praying: 'Jesus, I surrender my worries to You. Take care of everything.'";
        }
        if (lower.includes('prodigal son')) {
            return "The Parable of the Prodigal Son (Luke 15:11-32) illustrates God's boundless mercy. No matter how far we stray, the Father is always watching for our return, ready to embrace us with love and forgiveness.";
        }
        if (lower.includes('saint') && lower.includes('student')) {
            return "St. Thomas Aquinas and St. Joseph of Cupertino are excellent patron saints for students. You can ask for their intercession before studying or taking exams.";
        }
        if (lower.includes('morning prayer')) {
            return "Here is a simple morning prayer: 'Lord Jesus, I offer You my day. I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart.'";
        }
        return "I am a demo version of the AI Spiritual Companion. In the full version, I will be connected to a knowledge base to help answer your spiritual questions more deeply. For now, try asking one of the suggested questions!";
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900">AI Spiritual Companion</h1>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Online
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
                <div className="px-4 pb-4">
                    <p className="text-sm text-slate-500 mb-2 ml-1">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map(suggestion => (
                            <button
                                key={suggestion}
                                onClick={() => sendMessage(suggestion)}
                                className="text-sm bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors text-slate-600 text-left"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                    className="flex gap-2 max-w-4xl mx-auto"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
