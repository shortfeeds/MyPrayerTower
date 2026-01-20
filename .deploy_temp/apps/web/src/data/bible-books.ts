// Bible Books and Chapter data
export const BIBLE_BOOKS = {
    oldTestament: [
        { id: 'genesis', name: 'Genesis', chapters: 50 },
        { id: 'exodus', name: 'Exodus', chapters: 40 },
        { id: 'leviticus', name: 'Leviticus', chapters: 27 },
        { id: 'numbers', name: 'Numbers', chapters: 36 },
        { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34 },
        { id: 'joshua', name: 'Joshua', chapters: 24 },
        { id: 'judges', name: 'Judges', chapters: 21 },
        { id: 'ruth', name: 'Ruth', chapters: 4 },
        { id: '1samuel', name: '1 Samuel', chapters: 31 },
        { id: '2samuel', name: '2 Samuel', chapters: 24 },
        { id: '1kings', name: '1 Kings', chapters: 22 },
        { id: '2kings', name: '2 Kings', chapters: 25 },
        { id: '1chronicles', name: '1 Chronicles', chapters: 29 },
        { id: '2chronicles', name: '2 Chronicles', chapters: 36 },
        { id: 'ezra', name: 'Ezra', chapters: 10 },
        { id: 'nehemiah', name: 'Nehemiah', chapters: 13 },
        { id: 'esther', name: 'Esther', chapters: 10 },
        { id: 'job', name: 'Job', chapters: 42 },
        { id: 'psalms', name: 'Psalms', chapters: 150 },
        { id: 'proverbs', name: 'Proverbs', chapters: 31 },
        { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
        { id: 'songofsolomon', name: 'Song of Solomon', chapters: 8 },
        { id: 'isaiah', name: 'Isaiah', chapters: 66 },
        { id: 'jeremiah', name: 'Jeremiah', chapters: 52 },
        { id: 'lamentations', name: 'Lamentations', chapters: 5 },
        { id: 'ezekiel', name: 'Ezekiel', chapters: 48 },
        { id: 'daniel', name: 'Daniel', chapters: 12 },
        { id: 'hosea', name: 'Hosea', chapters: 14 },
        { id: 'joel', name: 'Joel', chapters: 3 },
        { id: 'amos', name: 'Amos', chapters: 9 },
        { id: 'obadiah', name: 'Obadiah', chapters: 1 },
        { id: 'jonah', name: 'Jonah', chapters: 4 },
        { id: 'micah', name: 'Micah', chapters: 7 },
        { id: 'nahum', name: 'Nahum', chapters: 3 },
        { id: 'habakkuk', name: 'Habakkuk', chapters: 3 },
        { id: 'zephaniah', name: 'Zephaniah', chapters: 3 },
        { id: 'haggai', name: 'Haggai', chapters: 2 },
        { id: 'zechariah', name: 'Zechariah', chapters: 14 },
        { id: 'malachi', name: 'Malachi', chapters: 4 },
    ],
    newTestament: [
        { id: 'matthew', name: 'Matthew', chapters: 28 },
        { id: 'mark', name: 'Mark', chapters: 16 },
        { id: 'luke', name: 'Luke', chapters: 24 },
        { id: 'john', name: 'John', chapters: 21 },
        { id: 'acts', name: 'Acts', chapters: 28 },
        { id: 'romans', name: 'Romans', chapters: 16 },
        { id: '1corinthians', name: '1 Corinthians', chapters: 16 },
        { id: '2corinthians', name: '2 Corinthians', chapters: 13 },
        { id: 'galatians', name: 'Galatians', chapters: 6 },
        { id: 'ephesians', name: 'Ephesians', chapters: 6 },
        { id: 'philippians', name: 'Philippians', chapters: 4 },
        { id: 'colossians', name: 'Colossians', chapters: 4 },
        { id: '1thessalonians', name: '1 Thessalonians', chapters: 5 },
        { id: '2thessalonians', name: '2 Thessalonians', chapters: 3 },
        { id: '1timothy', name: '1 Timothy', chapters: 6 },
        { id: '2timothy', name: '2 Timothy', chapters: 4 },
        { id: 'titus', name: 'Titus', chapters: 3 },
        { id: 'philemon', name: 'Philemon', chapters: 1 },
        { id: 'hebrews', name: 'Hebrews', chapters: 13 },
        { id: 'james', name: 'James', chapters: 5 },
        { id: '1peter', name: '1 Peter', chapters: 5 },
        { id: '2peter', name: '2 Peter', chapters: 3 },
        { id: '1john', name: '1 John', chapters: 5 },
        { id: '2john', name: '2 John', chapters: 1 },
        { id: '3john', name: '3 John', chapters: 1 },
        { id: 'jude', name: 'Jude', chapters: 1 },
        { id: 'revelation', name: 'Revelation', chapters: 22 },
    ]
};

export const getAllBooks = () => [
    ...BIBLE_BOOKS.oldTestament,
    ...BIBLE_BOOKS.newTestament
];

export const getBookById = (id: string) =>
    getAllBooks().find(b => b.id === id);

// Curated verses for Verse of the Day (rotates based on day of year)
export const VERSES_OF_THE_DAY = [
    { book: 'john', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { book: 'philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
    { book: 'jeremiah', chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
    { book: 'romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
    { book: 'proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
    { book: 'isaiah', chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.' },
    { book: 'psalms', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
    { book: 'matthew', chapter: 11, verse: 28, text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
    { book: 'romans', chapter: 12, verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind.' },
    { book: 'psalms', chapter: 46, verse: 10, text: 'Be still, and know that I am God.' },
    { book: 'joshua', chapter: 1, verse: 9, text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.' },
    { book: 'matthew', chapter: 6, verse: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.' },
];

export const getVerseOfTheDay = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return VERSES_OF_THE_DAY[dayOfYear % VERSES_OF_THE_DAY.length];
};
