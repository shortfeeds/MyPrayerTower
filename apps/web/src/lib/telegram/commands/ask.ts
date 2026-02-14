import { Context } from "grammy";

export const askCommand = async (ctx: Context) => {
    const question = typeof ctx.match === 'string' ? ctx.match.trim() : "";

    if (!question) {
        await ctx.reply("🧠 <b>AI Spiritual Companion</b>\n\nAsk me anything about Catholic doctrine, saints, or scripture.\n\nExample: <code>/ask What is the Rosary?</code>", {
            parse_mode: "HTML"
        });
        return;
    }

    // Check for API Key
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
        await ctx.reply("⚠️ AI is not configured yet. (Missing API Key)");
        return;
    }

    // Send typing status
    await ctx.replyWithChatAction("typing");

    try {
        // Simple OpenAI-compatible fetch
        // Works with OpenAI, OpenRouter, or compatible local/hosted endpoints
        const endpoint = process.env.AI_ENDPOINT || "https://api.openai.com/v1/chat/completions";

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL || "gpt-3.5-turbo", // Fallback to cheap/fast model
                messages: [
                    {
                        role: "system",
                        content: "You are a warm, knowledgeable, and strictly orthodox Catholic spiritual companion. Answer questions with love, citing Scripture and the Catechism where appropriate. Keep answers concise (under 200 words) for Telegram reading."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("AI API Error:", err);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;

        if (!answer) throw new Error("No answer generated");

        await ctx.reply(answer, { parse_mode: "Markdown" });

    } catch (e) {
        console.error("AI Command Error:", e);
        await ctx.reply("I'm having trouble thinking right now. Please try again later. 🙏");
    }
};
