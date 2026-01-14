/**
 * Sacred Copy Library
 * 
 * Faith-aligned language for MyPrayerTower.
 * Replace transactional phrases with spiritual invitations.
 * 
 * Principles:
 * - Never manipulate, pressure, or deceive
 * - Use invitation-based language
 * - Build trust before monetization
 * - Emphasize spiritual meaning over transactions
 */

export const SACRED_COPY = {
    // === CALLS TO ACTION ===
    cta: {
        // Primary Actions
        lightCandle: "Light a Candle",
        offerPrayer: "Offer This Prayer",
        joinCommunity: "Join Our Prayer Family",
        beginJourney: "Begin Your Journey",
        createSpace: "Create Your Prayer Space",
        makeOffering: "Make an Offering",

        // Secondary Actions
        learnMore: "Discover More",
        continue: "Continue in Peace",
        return: "Return When Ready",
        share: "Share This Blessing",
        invite: "Invite to Pray Together",
    },

    // === CANDLE LANGUAGE ===
    candles: {
        // Context (shown before price)
        meaning: "Lighting a candle is an ancient act of faith — a silent prayer that continues even when words fail.",
        symbolism: "Your candle will burn as a symbol of your prayer, joining thousands of lights around the world.",

        // Confirmation
        confirmation: "Your light now joins thousands of others burning for intentions around the world.",
        burning: "Your candle is burning for your intention.",
        completed: "Your candle has completed its vigil. Your prayer remains in God's hands.",

        // Offering framing
        offering: "Suggested offering",
        freeOption: "Light a candle freely — your prayer is always enough.",
    },

    // === PRAYER LANGUAGE ===
    prayers: {
        submit: "Offer this intention to our community",
        submitting: "Lifting your prayer...",
        confirmation: "Your intention has been received with reverence.",
        assurance: "You are not alone in this prayer.",
        community: "Others are praying with you.",

        // Stillness moment
        stillness: "Take a moment of stillness...",
        stillnessVerse: "\"Be still, and know that I am God.\" — Psalm 46:10",
    },

    // === OFFERING LANGUAGE ===
    offerings: {
        // Reassurance (always show on offering pages)
        reassurance: "There is no obligation. Your presence and prayers are the greatest gift.",
        noObligation: "Give only as you feel called.",

        // Gratitude
        gratitude: "Your generosity sustains this ministry and helps others find peace.",
        received: "Your offering has been received with deep gratitude.",

        // Transparency
        transparency: "Every offering supports our servers, development, and outreach to those seeking spiritual comfort.",

        // Mass offerings
        massRequest: "Request a Holy Mass",
        massConfirmation: "Your Mass intention will be offered by a priest in our network.",
    },

    // === MEMORIAL LANGUAGE ===
    memorials: {
        visit: "Visit the Chapel",
        create: "Create a Memorial Chapel",
        light: "Light a Remembrance Candle",
        anniversary: "An anniversary is approaching...",
        eternal: "In Loving Memory",
        rest: "Eternal rest grant unto them, O Lord.",
    },

    // === JOURNEY LANGUAGE ===
    journey: {
        welcome: "Welcome, pilgrim.",
        continue: "Continue your spiritual journey.",
        rest: "Rest here as long as you need.",
        return: "Return whenever your spirit calls.",
    },

    // === AFFIRMATIONS ===
    affirmations: {
        prayerReceived: "Your prayer has been received.",
        heldInPrayer: "You are held in our community's prayers.",
        notAlone: "You are not alone.",
        godHears: "God hears the prayers of the heart.",
        peace: "May peace be with you.",
    },

    // === RETENTION (GENTLE) ===
    retention: {
        feastDay: (saintName: string) =>
            `Today is the Feast of ${saintName}. Would you like to pray with us?`,
        anniversary: (name: string) =>
            `${name}'s anniversary is approaching. Light a remembrance candle?`,
        candleComplete: "Your candle has completed its vigil. Your intentions remain in prayer.",
        gentleReturn: "It's been a while since you visited. Your prayer space awaits.",
    },
};

// === FORBIDDEN PATTERNS ===
// These phrases should NEVER appear on MyPrayerTower:
// - "Buy Now"
// - "Limited Time"
// - "Don't Miss Out"
// - "Act Fast"
// - "You're Missing Out"
// - Any countdown timers
// - Guilt-based language

export default SACRED_COPY;
