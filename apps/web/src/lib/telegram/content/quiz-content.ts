export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number; // 0-3
    explanation?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "Who is the Patron Saint of lost things?",
        options: ["St. Anthony", "St. Jude", "St. Francis", "St. Peter"],
        correctIndex: 0,
        explanation: "St. Anthony of Padua is widely invoked for finding lost articles."
    },
    {
        id: 2,
        question: "How many days is a Novena?",
        options: ["3", "7", "9", "40"],
        correctIndex: 2,
        explanation: "The word 'Novena' comes from the Latin 'novem', meaning nine."
    },
    {
        id: 3,
        question: "What is the first book of the Bible?",
        options: ["Exodus", "Genesis", "Leviticus", "Matthew"],
        correctIndex: 1,
        explanation: "Genesis recounts the creation of the world."
    },
    {
        id: 4,
        question: "Who was the first Pope?",
        options: ["St. Paul", "St. John", "St. Peter", "St. Linus"],
        correctIndex: 2,
        explanation: "Jesus gave the keys of the Kingdom to Peter (Matthew 16:19)."
    },
    {
        id: 5,
        question: "What prayer did Jesus teach us?",
        options: ["Hail Mary", "The Lord's Prayer", "Glory Be", "Act of Contrition"],
        correctIndex: 1,
        explanation: "Also known as the 'Our Father' (Matthew 6:9-13)."
    },
    {
        id: 6,
        question: "What is the center of Catholic life?",
        options: [" The Rosary", "The Eucharist", "The Saints", "The Bible"],
        correctIndex: 1,
        explanation: "The Eucharist is the 'source and summit' of the Christian life."
    },
    {
        id: 7,
        question: "How many decades are in a standard Rosary?",
        options: ["3", "4", "5", "15"],
        correctIndex: 2,
        explanation: "A standard Rosary consists of 5 decades."
    },
    {
        id: 8,
        question: "Where was Jesus born?",
        options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"],
        correctIndex: 2,
        explanation: "Jesus was born in Bethlehem of Judea."
    },
    {
        id: 9,
        question: "Who is the mother of John the Baptist?",
        options: ["Mary", "Elizabeth", "Anne", "Martha"],
        correctIndex: 1,
        explanation: "Elizabeth, the cousin of Mary, is John the Baptist's mother."
    },
    {
        id: 10,
        question: "What day do we celebrate the Resurrection?",
        options: ["Good Friday", "Easter Sunday", "Christmas", "Pentecost"],
        correctIndex: 1,
        explanation: "Easter Sunday marks the Resurrection of the Lord."
    },
    {
        id: 11,
        question: "How many Apostles did Jesus choose?",
        options: ["10", "12", "7", "40"],
        correctIndex: 1,
        explanation: "Jesus chose 12 Apostles."
    },
    {
        id: 12,
        question: "Who betrayed Jesus?",
        options: ["Judas Iscariot", "Peter", "Thomas", "Pilate"],
        correctIndex: 0,
        explanation: "Judas betrayed Jesus for 30 pieces of silver."
    },
    {
        id: 13,
        question: "What sacrament welcomes us into the Church?",
        options: ["Confirmation", "Eucharist", "Baptism", "Marriage"],
        correctIndex: 2,
        explanation: "Baptism is the gateway to the other sacraments."
    },
    {
        id: 14,
        question: "Who is the Patron Saint of workers?",
        options: ["St. Joseph", "St. Patrick", "St. Paul", "St. Luke"],
        correctIndex: 0,
        explanation: "St. Joseph the Worker is the patron saint of all workers."
    },
    {
        id: 15,
        question: "What color does the priest wear during Ordinary Time?",
        options: ["Red", "White", "Green", "Purple"],
        correctIndex: 2,
        explanation: "Green symbolizes hope and growth."
    },
    {
        id: 16,
        question: "What is the season before Christmas?",
        options: ["Lent", "Advent", "Easter", "Pentecost"],
        correctIndex: 1,
        explanation: "Advent is the season of preparation for Christmas."
    },
    {
        id: 17,
        question: "Where did Jesus perform his first miracle?",
        options: ["Cana", "Jericho", "Bethany", "Capernaum"],
        correctIndex: 0,
        explanation: "At the wedding feast at Cana."
    },
    {
        id: 18,
        question: "Who appeared to Mary at the Annunciation?",
        options: ["The Holy Spirit", "Angel Gabriel", "Angel Michael", "St. Joseph"],
        correctIndex: 1,
        explanation: "The Archangel Gabriel announced the birth of Jesus."
    },
    {
        id: 19,
        question: "What do we call the 40 days before Easter?",
        options: ["Advent", "Lent", "Epiphany", "Triduum"],
        correctIndex: 1,
        explanation: "Lent is the 40-day period of fasting and prayer."
    },
    {
        id: 20,
        question: "Who led the Israelites out of Egypt?",
        options: ["Abraham", "David", "Moses", "Joshua"],
        correctIndex: 2,
        explanation: "Moses led the Exodus."
    },
    {
        id: 21,
        question: "What is the 'Golden Rule'?",
        options: ["Love God", "Do unto others as you would have them do unto you", "Thou shall not kill", "Pray always"],
        correctIndex: 1,
        explanation: "Matthew 7:12."
    },
    {
        id: 22,
        question: "Who wiped the face of Jesus on the way to Calvary?",
        options: ["Mary", "Veronica", "Mary Magdalene", "Simon"],
        correctIndex: 1,
        explanation: "St. Veronica is traditionally known for this act of kindness."
    },
    {
        id: 23,
        question: "Who doubted Jesus' resurrection until he touched His wounds?",
        options: ["Peter", "John", "Thomas", "James"],
        correctIndex: 2,
        explanation: "Hence the phrase 'Doubting Thomas'."
    },
    {
        id: 24,
        question: "Which Saint saw the vision of the Divine Mercy?",
        options: ["St. Faustina", "St. Therese", "St. Bernadette", "St. Clare"],
        correctIndex: 0,
        explanation: "St. Maria Faustina Kowalska."
    },
    {
        id: 25,
        question: "What language was the New Testament originally written in?",
        options: ["Hebrew", "Latin", "Greek", "Aramaic"],
        correctIndex: 2,
        explanation: "Koine Greek."
    },
    // Add more to reach 50 if needed, starting with 25 diverse questions
];
