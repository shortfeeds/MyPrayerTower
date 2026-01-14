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
        prayerReceived: "Your prayer has been received in heaven.",
        lights: "This light shines as a beacon of your faith.",
        peace: "May the peace of God, which transcends all understanding, guard your heart.",
        daily: [
            "You are loved beyond measure.",
            "Walk in faith, not by sight.",
            "His grace is sufficient for you.",
            "Be still and know that I am God.",
            "The Lord is your shepherd; you shall not want."
        ],
        welcome: "Welcome home to your sacred space.",
        checkout: "Thank you for supporting our mission. Your generosity lights the way for others.",
    },

    // Retention Messages - Gentle, not pestering
    retention: {
        feastDay: (saint: string) => `Today we celebrate ${saint}. Join the universal church in prayer.`,
        anniversary: (name: string) => `Remembering ${name} today. Their light still shines.`,
        missed: "The chapel is always open when you are ready to return.",
        streak: "Your faithfulness is a blessing. Keep walking this path.", // Internal use, not shown as "streak"
    },

    // === PRAYER CLOSURE (Post-prayer stillness) ===
    prayerClosure: {
        primary: "Your prayer has been offered.",
        secondary: "You are not alone.",
        candle: {
            primary: "Your light now burns for this intention.",
            secondary: "This intention will be remembered with reverence.",
        },
        mass: {
            primary: "Your Mass intention has been received.",
            secondary: "Each intention is handled prayerfully and respectfully.",
        },
        memorial: {
            primary: "This intention is remembered.",
            secondary: "Their memory lives on in prayer.",
        },
        stillnessDuration: 3000, // 3 seconds
    },

    // === SYSTEM MESSAGES (Replace transactional language) ===
    system: {
        success: "Received with care",
        submitted: "Entrusted",
        completed: "Offered in prayer",
        saved: "Held in prayer",
        loading: "Preparing your sacred space...",
        error: "Something went awry. Please try again.",
        empty: "This space awaits your prayer.",
    },

    // === DASHBOARD LABELS (My Prayer Corner) ===
    dashboard: {
        history: "Remembered Intentions",
        saved: "Prayers You Hold",
        completed: "Answered in Prayer",
        favorites: "Treasured Prayers",
        recent: "Recent Moments",
        welcome: "Welcome to your prayer corner.",
    },

    // === CHURCH DIRECTORY ===
    churches: {
        heroTitle: "Places of Prayer Near You",
        heroSubtitle: "Find a sanctuary for Mass, Confession, and quiet reflection.",
        prayForParish: "Pray for this parish",
        offerMass: "Offer a Mass here",
    },

    // === CANDLE ETHICAL COPY ===
    candleFlow: {
        meaningFirst: "Lighting a candle keeps your intention present in prayer.",
        afterSelection: "This intention will be remembered with reverence.",
        noObligation: "There is no obligation. Your prayer alone is cherished.",
    },

    // === MASS OFFERINGS ===
    massOfferings: {
        aboutTitle: "About Mass Intentions",
        aboutDescription: "A Mass intention is a centuries-old Catholic tradition of having a Mass offered for a specific person or purpose. Your intention will be received with reverence and offered by a priest in our network.",
        process: [
            { step: 1, label: "Intention Received", description: "Your request is received with care" },
            { step: 2, label: "Prayerfully Assigned", description: "Matched with a celebrant" },
            { step: 3, label: "Mass Offered", description: "The Holy Sacrifice offered" },
            { step: 4, label: "Confirmation Sent", description: "You receive a confirmation" },
        ],
        reassurance: "Each intention is handled prayerfully and respectfully.",
    },

    // Forbidden Transactional Words - purely for documentation/linter future use
    forbidden: [
        "Buy Now", "Checkout", "Cart", "Product", "Price", "Deal", "Discount", "Sale", "Premium Subscription"
    ]
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
