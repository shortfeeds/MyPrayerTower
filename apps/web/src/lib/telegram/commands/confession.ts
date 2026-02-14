import { Context, InlineKeyboard } from "grammy";

export const confessionCommand = async (ctx: Context) => {
    const keyboard = new InlineKeyboard()
        .text("📝 Examination of Conscience", "confess_examine").row()
        .text("🙏 Act of Contrition", "confess_act").row()
        .text("guide_steps", "confess_steps").text("🚶 Steps to Go", "confess_steps").row()
        .text("🏠 Menu", "cmd_start");

    await ctx.reply(
        `🔓 <b>Confession Guide</b>
        
<i>"If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness." - 1 John 1:9</i>

Prepare your soul for the Sacrament of Reconciliation.`,
        { type: "HTML", reply_markup: keyboard } // type HTML ensures bolding works if grammy supports it via simplified opt
        // Actually standard way: { parse_mode: "HTML", ... }
    );
};

export const handleConfessionCallback = async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    let text = "";
    let keyboard = new InlineKeyboard();

    if (data === "confess_examine") {
        text = `📝 <b>Examination of Conscience</b>
        
<b>1. I am the Lord your God.</b>
Have I put anything before God? (Money, career, popularity, pleasure)

<b>2. Do not take the Lord's name in vain.</b>
Have I used God's name in anger or carelessly?

<b>3. Keep holy the Sabbath.</b>
Have I missed Mass on Sunday or Holy Days?

<b>4. Honor your father and mother.</b>
Have I been disrespectful to parents or legitimate authority?

<b>5. You shall not kill.</b>
Have I harmed others physically or verbally? Have I harbored hatred?

<b>6. You shall not commit adultery.</b>
Have I been impure in thought, word, or deed? Have I viewed pornography?

<b>7. You shall not steal.</b>
Have I taken what is not mine? Have I been honest in work?

<b>8. You shall not bear false witness.</b>
Have I lied, gossiped, or revealed secrets?

<b>9. You shall not covet your neighbor's wife.</b>
Have I entertained impure thoughts?

<b>10. You shall not covet your neighbor's goods.</b>
Am I envious of what others have?`;

        keyboard.text("🙏 Act of Contrition", "confess_act").row().text("🔙 Back", "cmd_confession");

    } else if (data === "confess_act") {
        text = `🙏 <b>Act of Contrition</b>
        
O my God, I am heartily sorry for having offended Thee, and I detest all my sins because I dread the loss of heaven and the pains of hell; but most of all because they offend Thee, my God, Who art all good and deserving of all my love.

I firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life.

Amen.`;
        keyboard.text("🚶 How to Go", "confess_steps").row().text("🔙 Back", "cmd_confession");

    } else if (data === "confess_steps") {
        text = `🚶 <b>How to go to Confession</b>
        
1. <b>Examine</b> your conscience.
2. <b>Enter</b> the confessional and greet the priest.
3. <b>Say:</b> "Bless me Father, for I have sinned. It has been [time] since my last confession."
4. <b>Confess</b> your sins clearly and simply.
5. <b>Listen</b> to the priest's counsel and penance.
6. <b>Pray</b> the Act of Contrition.
7. <b>Receive</b> absolution ("I absolve you...").
8. <b>Dismissal:</b> "Thanks be to God."
9. <b>Do</b> your penance.`;
        keyboard.text("🏠 Back to Menu", "cmd_start");
    }

    await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: keyboard });
    await ctx.answerCallbackQuery();
}
