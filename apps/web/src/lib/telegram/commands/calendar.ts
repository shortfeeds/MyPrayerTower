import { Context } from "grammy";

// Simple Liturgical Logic (MVP)
// In a full app, we'd use a library like 'romcal', but for Vercel/Edge performance, 
// a simplified static check is often better for standard Ordinary Time / Lent / Advent.

const getLiturgicalInfo = (date: Date) => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Simple checks for major seasons (Fixed dates only for MVP simplicity)
    // Dynamic Easter calculation is complex, but we can hardcode 2026 dates for now or use a simple algo.
    // 2026 Easter is April 5.

    // Advent: Late Nov - Dec 24
    if (month === 10 && day >= 29 || month === 11 && day <= 24) {
        return { season: "Advent", color: "💜 Violet", message: "Prepare the way of the Lord." };
    }

    // Christmas: Dec 25 - Jan 11 (approx)
    if (month === 11 && day >= 25 || month === 0 && day <= 11) {
        return { season: "Christmas", color: "🤍 White/Gold", message: "Joy to the World!" };
    }

    // Lent 2026: Feb 18 (Ash Wed) - April 4
    // Hardcoding for immediate 2026 usage
    if ((month === 1 && day >= 18) || (month === 2) || (month === 3 && day <= 4)) {
        return { season: "Lent", color: "💜 Violet", message: "Repent and believe in the Gospel." };
    }

    // Easter 2026: April 5 - May 24
    if ((month === 3 && day >= 5) || (month === 4) || (month === 5 && day <= 24)) {
        return { season: "Easter", color: "🤍 White/Gold", message: "He is Risen! Alleluia!" };
    }

    return { season: "Ordinary Time", color: "💚 Green", message: "Walking with Jesus in daily life." };
};

export const calendarCommand = async (ctx: Context) => {
    const now = new Date();
    const info = getLiturgicalInfo(now);

    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    await ctx.reply(`📅 <b>Liturgical Calendar</b>\n\n<b>${dateString}</b>\n\n🎨 <b>Color:</b> ${info.color}\n⏳ <b>Season:</b> ${info.season}\n\n<i>${info.message}</i>`, {
        parse_mode: "HTML"
    });
};
