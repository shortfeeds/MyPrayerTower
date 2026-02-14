import { Context, InlineKeyboard } from "grammy";

export const hoursCommand = async (ctx: Context) => {
    // Determine hour
    const now = new Date();
    // Ideally we use user's timezone if stored. For now, assume UTC or rough estimate.
    // Or just ask them "What time is it?" - no, that's friction.
    // Let's use UTC+0 for simplicity or server time.
    const hour = now.getHours();

    let type = "Midday Prayer";
    let content = "";

    if (hour >= 5 && hour < 9) {
        type = "Lauds (Morning Prayer)";
        content =
            `☀️ <b>O God, come to my assistance.</b>
O Lord, make haste to help me.
Glory to the Father...

<b>Hymn:</b> Morning has broken...

<b>Psalm 63:</b> O God, you are my God, for you I long...

<b>Benedictus:</b> Blessed be the Lord, the God of Israel...

<b>Prayer:</b> Lord, open our lips and we shall praise your name. Amen.`;
    } else if (hour >= 17 && hour < 21) {
        type = "Vespers (Evening Prayer)";
        content =
            `🌇 <b>O God, come to my assistance.</b>
O Lord, make haste to help me.

<b>Hymn:</b> O Gracious Light...

<b>Psalm 141:</b> Let my prayer rise like incense before you...

<b>Magnificat:</b> My soul proclaims the greatness of the Lord...

<b>Prayer:</b> Lord, as evening falls, keep watch over us. Amen.`;
    } else if (hour >= 21 || hour < 5) {
        type = "Compline (Night Prayer)";
        content =
            `🌙 <b>O God, come to my assistance.</b>
O Lord, make haste to help me.

<b>Examination of Conscience:</b> (Pause for silence)

<b>Hymn:</b> To you before the close of day...

<b>Psalm 91:</b> He who dwells in the shelter of the Most High...

<b>Nunc Dimittis:</b> Lord, now you let your servant go in peace...

<b>Prayer:</b> Visit this house, we beg you, Lord, and banish from it the snares of the enemy. Amen.`;
    } else {
        type = "Midday Prayer (Sext)";
        content =
            `☀️ <b>O God, come to my assistance.</b>
O Lord, make haste to help me.

<b>Hymn:</b> Come, Holy Ghost...

<b>Psalm 119:</b> Your word is a lamp to my feet...

<b>Prayer:</b> Lord, kindle in our hearts the fire of your love. Amen.`;
    }

    const keyboard = new InlineKeyboard()
        .text("🔄 Refresh", "cmd_hours")
        .text("🏠 Menu", "cmd_start");

    const message =
        `⏳ <b>Liturgy of the Hours</b>
<b>${type}</b>

${content}`;

    if (ctx.callbackQuery) {
        await ctx.editMessageText(message, { parse_mode: "HTML", reply_markup: keyboard });
    } else {
        await ctx.reply(message, { parse_mode: "HTML", reply_markup: keyboard });
    }
};
