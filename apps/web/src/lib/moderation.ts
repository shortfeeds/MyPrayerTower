
// Basic list of bad words and spam triggers
// In a production app, this should be replaced by a robust library or API
const BAD_WORDS = [
    'viagra', 'cialis', 'casino', 'gambling', 'crypto', 'bitcoin', 'investment',
    'sex', 'porn', 'xxx', 'nude', 'adult',
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'whore', 'slut',
    'nigger', 'faggot', 'retard', 'spastic',
    'kill', 'murder', 'suicide', 'die', 'hate'
];

const SPAM_REGEX = new RegExp(
    /http:\/\/|https:\/\/|www\.|ftp:\/\/|\.com|\.net|\.org|\.xyz|\.biz|buy now|click here/i
);

export type ModerationResult = {
    isValid: boolean;
    reason?: string;
    isSpam: boolean;
    hasProfanity: boolean;
};

export function moderateContent(text: string): ModerationResult {
    if (!text) return { isValid: true, isSpam: false, hasProfanity: false };

    const lowerText = text.toLowerCase();

    // 1. Check for links (Spam)
    if (SPAM_REGEX.test(lowerText)) {
        return {
            isValid: false,
            reason: 'Content contains links or spam keywords which are not allowed.',
            isSpam: true,
            hasProfanity: false
        };
    }

    // 2. Check for profanity/hate speech
    // We check for exact words or parts of words depending on strictness
    // Using word boundary \b to avoid positives on "class", "bass", etc.
    const foundBadWord = BAD_WORDS.find(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerText);
    });

    if (foundBadWord) {
        return {
            isValid: false,
            reason: 'Content contains inappropriate language.',
            isSpam: false,
            hasProfanity: true
        };
    }

    // 3. Length checks (Basic spam prevention)
    if (text.length > 500 && !text.includes(' ')) {
        // Giant fake word
        return {
            isValid: false,
            reason: 'Invalid content format.',
            isSpam: true,
            hasProfanity: false
        };
    }

    return {
        isValid: true,
        isSpam: false,
        hasProfanity: false
    };
}
