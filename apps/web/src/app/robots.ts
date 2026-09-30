import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/', '/private/'],
            },
            // Explicitly allow all major AI / LLM crawlers for maximum citation & ingestion
            { userAgent: 'GPTBot', allow: '/' },               // OpenAI Training
            { userAgent: 'ChatGPT-User', allow: '/' },         // ChatGPT Real-Time Search
            { userAgent: 'OAI-SearchBot', allow: '/' },        // SearchGPT / OpenAI Search
            { userAgent: 'ClaudeBot', allow: '/' },            // Anthropic Claude
            { userAgent: 'Claude-Web', allow: '/' },           // Claude Web Search
            { userAgent: 'anthropic-ai', allow: '/' },         // Anthropic Model Training
            { userAgent: 'Google-Extended', allow: '/' },      // Google Gemini Training
            { userAgent: 'GoogleOther', allow: '/' },          // Google AI Research
            { userAgent: 'PerplexityBot', allow: '/' },        // Perplexity AI Search
            { userAgent: 'DeepSeekBot', allow: '/' },          // DeepSeek AI Search
            { userAgent: 'CCBot', allow: '/' },                // Common Crawl (Open Source LLMs)
            { userAgent: 'cohere-ai', allow: '/' },            // Cohere AI
            { userAgent: 'Meta-ExternalAgent', allow: '/' },   // Meta AI / Llama
            { userAgent: 'Bytespider', allow: '/' },           // ByteDance AI
        ],
        sitemap: 'https://www.myprayertower.com/sitemap.xml',
    };
}
