
/**
 * Generates SEO-rich FAQs for prayer pages based on their category.
 * This helps satisfy the "Instructional/Informational" search intent
 * and adds significant Schema markup to thin prayer pages.
 */

interface FAQ {
    question: string;
    answer: string;
}

const COMMON_FAQS: FAQ[] = [
    {
        question: "How do I make this prayer more effective?",
        answer: "Prayer is most effective when done with a sincere heart and consistency. Establish a quiet time, focus on God's presence, and speak honestly. Combining this prayer with fasting or reading Scripture can also deepen your spiritual experience."
    },
    {
        question: "Can I pray this prayer for someone else?",
        answer: "Absolutely. Intercessory prayer (praying for others) is a powerful act of love. Simply mention the person's name and intention as you pray, asking God to pour His grace upon them."
    }
];

const CATEGORY_FAQS: Record<string, FAQ[]> = {
    'healing': [
        {
            question: "Is there a specific saint for healing?",
            answer: "Yes, St. Raphael the Archangel is a powerful patron of healing. St. Peregrine is the patron saint for cancer patients, and St. Jude is often invoked for impossible cases. You can ask for their intercession along with this prayer."
        },
        {
            question: "What does the Bible say about praying for healing?",
            answer: "Scripture encourages us to pray for healing. James 5:14-15 says, 'Is anyone among you sick? Let them call the elders of the church to pray over them... and the prayer offered in faith will make the sick person well.'"
        }
    ],
    'protection': [
        {
            question: "When should I say a prayer for protection?",
            answer: "You can pray for protection anytime you feel afraid, anxious, or are facing spiritual warfare. Many Catholics start their day with the St. Michael Prayer or a Guardian Angel prayer to ask for God's shield throughout the day."
        },
        {
            question: "What is the most powerful Catholic prayer for protection?",
            answer: "The St. Michael the Archangel prayer is widely considered one of the most powerful prayers for spiritual protection being 'defended in battle'. Psalm 91 is also a scriptural stronghold for protection."
        }
    ],
    'devotion': [
        {
            question: "How can I deepen my devotion to this prayer?",
            answer: "To deepen your devotion, try praying it at the same time each day (like the Angelus at noon) or praying it as a Novena for nine consecutive days. Meditating on the words slowly rather than rushing through them also helps."
        }
    ],
    'morning': [
        {
            question: "Why is morning prayer important?",
            answer: "Starting your day with prayer dedicates your thoughts, words, and actions to God. It sets a spiritual tone for the day, arming you with grace and peace before the busyness of life begins."
        }
    ],
    'evening': [
        {
            question: "What is a good evening prayer routine?",
            answer: "A good evening routine includes an Examination of Conscience (reviewing your day), asking for forgiveness, giving thanks for blessings received, and entrusting your sleep and the next day to God's providence."
        }
    ],
    'marian': [
        {
            question: "Why do Catholics pray to Mary?",
            answer: "Catholics do not worship Mary; we honor her as the Mother of God and ask for her intercession, just as we would ask a friend to pray for us. The 'Hail Mary' is scriptural, based on the Angel Gabriel's greeting in Luke 1."
        }
    ]
    // Add more categories as needed
};

export function getPrayerFAQs(category: string, prayerTitle: string): FAQ[] {
    const normalizedCategory = category.toLowerCase();

    // Find matching category keys (partial match allowed, e.g. "healing prayers" matches "healing")
    const categoryKey = Object.keys(CATEGORY_FAQS).find(k => normalizedCategory.includes(k));

    const specificFaqs = categoryKey ? CATEGORY_FAQS[categoryKey] : [];

    // Combine specific + common, and maybe dynamic insertion of prayer title
    const faqs = [...specificFaqs, ...COMMON_FAQS];

    // Personalize answers with the prayer title where appropriate (optional enhancement)
    return faqs.map(f => ({
        question: f.question,
        answer: f.answer.replace('this prayer', `the "${prayerTitle}"`)
    }));
}
