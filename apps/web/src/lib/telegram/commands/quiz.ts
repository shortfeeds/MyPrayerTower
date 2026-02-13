import { Context, InlineKeyboard } from "grammy";
import { QUIZ_QUESTIONS, QuizQuestion } from "../content/quiz-content";

// Simple seeded randomizer based on day to show same 5 questions/day to everyone
// or purely random? Let's go purely random for engagement.

export const quizCommand = async (ctx: Context) => {
    // Start a new game - pick random question
    await sendQuestion(ctx);
};

async function sendQuestion(ctx: Context, previousQuestionId?: number, score: number = 0) {
    // Pick a random question not equal to prev
    let available = QUIZ_QUESTIONS;
    if (previousQuestionId) {
        available = QUIZ_QUESTIONS.filter(q => q.id !== previousQuestionId);
    }

    const question = available[Math.floor(Math.random() * available.length)];

    const keyboard = new InlineKeyboard();

    // Shuffle options visually but keep tracking correct index
    // Simplified: Just list them 0-3.
    // To make it harder, we'd shuffle, but then we need to map the shuffled index back to the real index.
    // Let's stick to fixed order for MVP reliability, or simple shuffle mapping.

    question.options.forEach((opt, idx) => {
        keyboard.text(opt, `quiz_ans_${question.id}_${idx}_${score}`).row(); // pass score along
    });

    keyboard.text("🏠 Exit Quiz", "cmd_start");

    const text = `🧠 *Catholic Quiz*

**Score:** ${score}

${question.question}`;

    // If it's a new message (command)
    if (!ctx.callbackQuery) {
        await ctx.reply(text, { parse_mode: "Markdown", reply_markup: keyboard });
    } else {
        await ctx.editMessageText(text, { parse_mode: "Markdown", reply_markup: keyboard });
    }
}

export const handleQuizCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    if (data.startsWith("quiz_ans_")) {
        const parts = data.split("_");
        const qId = parseInt(parts[2]);
        const ansIdx = parseInt(parts[3]);
        const currentScore = parseInt(parts[4]);

        const question = QUIZ_QUESTIONS.find(q => q.id === qId);
        if (!question) return;

        const isCorrect = ansIdx === question.correctIndex;
        const newScore = isCorrect ? currentScore + 1 : currentScore;

        if (isCorrect) {
            // Persist score
            try {
                const { incrementQuizScore } = await import("../services/user.service");
                await incrementQuizScore(ctx.from?.id);
            } catch (e) {
                console.error("Failed to update quiz score", e);
            }
        }

        const feedback = isCorrect ? "✅ Correct!" : `❌ Wrong. The answer was: ${question.options[question.correctIndex]}`;

        await ctx.answerCallbackQuery(feedback);

        // Show next question or specific feedback screen? 
        // Let's immediately load next question to keep flow fast.

        await sendQuestion(ctx, qId, newScore);
    }
};
