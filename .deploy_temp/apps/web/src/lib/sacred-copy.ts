/**
 * Sacred Copy Library
 * 
 * Centralized pastoral language for MyPrayerTower.
 * All copy follows principles of:
 * - Gentle, reassuring tone
 * - Meaning before action
 * - Trust reinforcement
 * - No urgency or pressure
 */

export const SACRED_COPY = {
    // Global emotional touchpoints
    welcome: {
        homepage: "You are welcome here.",
        returning: "A quiet place to return whenever you need prayer.",
        closing: "May peace remain with you."
    },

    // Prayer completion (universal)
    prayerComplete: {
        primary: "Your prayer has been offered.",
        reassurance: "You are not alone."
    },

    // Candle flow
    candleFlow: {
        meaningFirst: "Lighting a candle keeps your intention present in prayer.",
        afterSelection: "This intention will be remembered with reverence.",
        noObligation: "Choose the offering that feels right for your heart.",
        transparency: "Every candle burns with care. Your intention is held in prayer throughout its duration."
    },

    // Mass Offerings
    massOfferings: {
        aboutTitle: "About Mass Intentions",
        aboutDescription: "A Mass intention is a beautiful way to remember a loved one or seek God's blessing. Each intention is entrusted to a partnered monastery or parish where it will be offered with reverence during Holy Mass.",
        process: [
            { step: 1, label: "Intention received", description: "We receive your request" },
            { step: 2, label: "Assigned respectfully", description: "Matched with a parish" },
            { step: 3, label: "Mass offered", description: "Celebrated with reverence" },
            { step: 4, label: "Confirmation sent", description: "You're notified" }
        ],
        reassurance: "Each intention is handled prayerfully and respectfully.",
        transparency: "Your offering supports our partner monasteries and keeps this ministry sustainable."
    },

    // Memorials
    memorials: {
        remembered: "This intention is remembered.",
        eternally: "In loving memory, held eternally in prayer.",
        anniversary: "Remember on anniversary"
    },

    // Church Directory
    churches: {
        heading: "Places of Prayer Near You",
        heroTitle: "Places of Prayer Near You",
        heroSubtitle: "Find a sacred space for Mass, Confession, and Adoration",
        prayForParish: "Pray for this parish",
        offerMassHere: "Offer a Mass here"
    },

    // Saints
    saints: {
        prayWith: "Pray with this Saint",
        prayWithCTA: "Seek their intercession",
        feastDay: "Honored on",
        feastDayContext: "Celebrated on",
        intercession: "Seeking this Saint's intercession",
        patronOf: "Patron of",
        devotion: "A model of faith and devotion"
    },

    // My Prayer Corner (Dashboard)
    prayerCorner: {
        remembered: "Remembered Intentions",
        holding: "Prayers You Hold",
        answered: "Answered in Prayer"
    },

    // Dashboard Navigation
    dashboard: {
        history: "Remembered Intentions",
        saved: "Prayers You Hold",
        completed: "Answered in Prayer",
        prayerCorner: "My Prayer Corner"
    },

    // System messages (replacing generic UI copy)
    system: {
        success: "Received with care",
        submitted: "Entrusted",
        completed: "Offered in prayer",
        processing: "Being prepared with reverence",
        error: "We're here to help",
        loading: "One moment...",
        saved: "Safely kept"
    },

    // Offerings (general)
    offerings: {
        transparency: "Your offering helps sustain this sacred ministry and supports our partner communities.",
        gratitude: "Thank you for your generosity.",
        noObligation: "All offerings are voluntary and deeply appreciated."
    },

    // Prayer Wall
    prayerWall: {
        submitIntention: "Share your prayer",
        beingPrayed: "Being lifted in prayer",
        answered: "Answered in prayer",
        community: "Join in prayer"
    },

    // Footer/Legal (gentle versions)
    legal: {
        privacy: "We protect your information",
        terms: "Our commitment to you",
        contact: "Reach out anytime"
    }
};

// Helper to get system message
export function getSystemMessage(key: keyof typeof SACRED_COPY.system): string {
    return SACRED_COPY.system[key] || key;
}

// Helper for toast notifications
export function getSacredToast(type: 'success' | 'error' | 'info') {
    switch (type) {
        case 'success':
            return {
                title: SACRED_COPY.system.success,
                description: "You may continue in peace."
            };
        case 'error':
            return {
                title: SACRED_COPY.system.error,
                description: "Please try again or contact us."
            };
        case 'info':
            return {
                title: SACRED_COPY.system.loading,
                description: "Please wait patiently."
            };
    }
}
