export interface IntentionHub {
    slug: string;
    title: string;
    shortTitle: string;
    badge: string;
    metaTitle: string;
    metaDescription: string;
    scripture: {
        verse: string;
        citation: string;
    };
    theologicalIntro: string;
    categories: string[];
    searchTerms: string[];
    patronSaint: {
        name: string;
        slug: string;
        title: string;
        quote: string;
    };
    faqs: {
        question: string;
        answer: string;
    }[];
}

export const CATHOLIC_INTENTIONS: Record<string, IntentionHub> = {
    'healing': {
        slug: 'healing',
        title: 'Catholic Prayers for Healing, Health & Physical Recovery',
        shortTitle: 'Healing & Health',
        badge: 'Physical & Spiritual Healing',
        metaTitle: 'Catholic Prayers for Healing & Physical Recovery | 3,900+ Prayers',
        metaDescription: 'Discover powerful Catholic prayers for healing of sickness, surgery, chronic illness, and emotional woundedness. Intercessions of St. Raphael and St. Peregrine.',
        scripture: {
            verse: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.',
            citation: 'Jeremiah 17:14'
        },
        theologicalIntro: 'Catholic tradition recognizes Christ as the Divine Physician who ministers to our bodily and spiritual illnesses. When we pray for healing, we surrender our pain to the Cross, asking for physical restoration while uniting our suffering with the Passion of Christ for our sanctification.',
        categories: ['healing'],
        searchTerms: ['heal', 'sickness', 'illness', 'recovery', 'physician', 'hospital', 'surgery'],
        patronSaint: {
            name: 'St. Raphael the Archangel & St. Peregrine',
            slug: 'saint-peregrine',
            title: 'Patrons of the Sick & Cancer Patients',
            quote: 'God\'s medicine brings wholeness to both soul and body.'
        },
        faqs: [
            {
                question: 'Which Catholic saints are invoked for healing?',
                answer: 'St. Raphael the Archangel ("God heals"), St. Peregrine Laziosi (patron of cancer patients), St. Agatha (diseases of the breast), and St. Camillus de Lellis (patron of the sick and hospitals) are among the most revered intercessors for health.'
            },
            {
                question: 'How should a Catholic pray when healing does not happen immediately?',
                answer: 'Catholics pray with steadfast trust that God hears every petition. Unanswered prayers for physical recovery are embraced through redemptive suffering, asking for spiritual strength, holy patience, and eternal salvation.'
            },
            {
                question: 'Is it appropriate to ask a priest for the Sacrament of the Anointing of the Sick?',
                answer: 'Yes. Anyone facing serious illness, major surgery, advanced age, or a medical crisis is encouraged to receive the Sacrament of the Anointing of the Sick for spiritual comfort and bodily strength.'
            }
        ]
    },
    'anxiety-peace': {
        slug: 'anxiety-peace',
        title: 'Catholic Prayers for Anxiety, Inner Peace & Calming the Mind',
        shortTitle: 'Anxiety & Inner Peace',
        badge: 'Mental Wellness & Peace',
        metaTitle: 'Catholic Prayers for Anxiety, Stress & Inner Peace | MyPrayerTower',
        metaDescription: 'Traditional Catholic prayers for anxiety, depression, panic, and overwhelming thoughts. Find serene peace through Christ and St. Dymphna.',
        scripture: {
            verse: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
            citation: 'John 14:27'
        },
        theologicalIntro: 'St. Teresa of Avila reminded the Church: "Let nothing disturb you, let nothing frighten you. All things are passing away: God never changes." Surrendering worry to God in prayer transforms acute anxiety into supernatural confidence in His Divine Providence.',
        categories: ['peace', 'strength'],
        searchTerms: ['peace', 'anxiety', 'worry', 'stress', 'fear', 'calm', 'rest', 'depression'],
        patronSaint: {
            name: 'St. Dymphna',
            slug: 'saint-dymphna',
            title: 'Patron Saint of Mental Health & Nervous Disorders',
            quote: 'Let nothing disturb you; patience obtains all things.'
        },
        faqs: [
            {
                question: 'Who is the Catholic patron saint for anxiety and mental health?',
                answer: 'St. Dymphna is the principal patron saint for those suffering from anxiety, mental illness, neurological conditions, and emotional distress.'
            },
            {
                question: 'What quick prayer can I recite during an anxiety attack?',
                answer: 'The Jesus Prayer: "Lord Jesus Christ, Son of God, have mercy on me, a sinner," or simply reciting "Jesus, I trust in You" repeated slowly with calm breathing restores focus to Christ\'s real presence.'
            },
            {
                question: 'Can Catholic prayers be combined with therapy and medicine?',
                answer: 'Absolutely. The Catholic Church affirms that God works through medical professionals, counselors, and medicine. Spiritual prayer and medical treatment complement one another harmoniously.'
            }
        ]
    },
    'financial-help': {
        slug: 'financial-help',
        title: 'Catholic Prayers for Financial Help, Employment & Provision',
        shortTitle: 'Finances & Work',
        badge: 'Providence & Work',
        metaTitle: 'Catholic Prayers for Financial Help, Debt Relief & Jobs | MyPrayerTower',
        metaDescription: 'Catholic prayers for financial breakthrough, finding employment, paying debts, and divine provision through the intercession of St. Joseph the Worker.',
        scripture: {
            verse: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
            citation: 'Philippians 4:19'
        },
        theologicalIntro: 'God understands the material necessities of daily living and family care. Catholic prayer for employment and financial assistance is grounded in trust that God is our provider (Jehovah Jireh), while asking for the dignity of meaningful work and honest compensation.',
        categories: ['work'],
        searchTerms: ['financial', 'job', 'work', 'debt', 'employment', 'money', 'provider', 'bread'],
        patronSaint: {
            name: 'St. Joseph the Worker & St. Matthew',
            slug: 'saint-joseph',
            title: 'Patrons of Workers, Employment & Financial Stewardship',
            quote: 'Go to Joseph; whatever he says to you, do it.'
        },
        faqs: [
            {
                question: 'Which saint should I pray to when looking for a job?',
                answer: 'St. Joseph the Worker and St. Cajetan (patron saint of job seekers and the unemployed) are powerful intercessors when seeking employment and ethical career opportunities.'
            },
            {
                question: 'Is it selfish to pray for money or financial relief in Catholic tradition?',
                answer: 'Not at all. In the Lord\'s Prayer, Jesus taught us to pray "Give us this day our daily bread." Asking God for the resources to support your family, pay honest debts, and live in dignity is virtuous and humble.'
            }
        ]
    },
    'family-marriage': {
        slug: 'family-marriage',
        title: 'Catholic Prayers for Family, Marriage, Children & Homes',
        shortTitle: 'Family & Marriage',
        badge: 'Domestic Church',
        metaTitle: 'Catholic Prayers for Family, Children & Marriage Reconciliation',
        metaDescription: 'Strengthen your domestic church with Catholic prayers for spouses, children, marriage healing, family unity, and wayward sons and daughters.',
        scripture: {
            verse: 'As for me and my household, we will serve the Lord.',
            citation: 'Joshua 24:15'
        },
        theologicalIntro: 'The Second Vatican Council called the Catholic family the "Ecclesia Domestica" — the Domestic Church. Prayer within and for the family sanctifies the matrimonial bond, guards children against spiritual danger, and opens the door for reconciliation and generational blessings.',
        categories: ['family', 'marriage', 'children'],
        searchTerms: ['family', 'marriage', 'husband', 'wife', 'children', 'son', 'daughter', 'parents', 'home'],
        patronSaint: {
            name: 'The Holy Family & St. Monica',
            slug: 'saint-monica',
            title: 'Patrons of Marriages & Mothers Praying for Wayward Children',
            quote: 'A child of so many tears shall never be lost.'
        },
        faqs: [
            {
                question: 'What saint should parents pray to for children who left the Catholic faith?',
                answer: 'St. Monica prayed with relentless tears for 17 years for her wayward son, who eventually converted and became St. Augustine, one of the greatest Doctors of the Church.'
            },
            {
                question: 'How can couples pray together daily in Catholic life?',
                answer: 'A nightly decade of the Rosary, a shared blessing over the children before bed, and an Act of Contrition together form an unbreakable spiritual fortress around Christian marriage.'
            }
        ]
    },
    'protection': {
        slug: 'protection',
        title: 'Catholic Prayers for Protection, Spiritual Warfare & Defense',
        shortTitle: 'Protection & Defense',
        badge: 'Spiritual Warfare',
        metaTitle: 'Catholic Prayers for Spiritual Protection & Warfare | St. Michael',
        metaDescription: 'Armor of God Catholic prayers against evil, demonic oppression, danger, and spiritual warfare. St. Michael the Archangel and Guardian Angel prayers.',
        scripture: {
            verse: 'Put on the full armor of God, so that you can take your stand against the devil’s schemes.',
            citation: 'Ephesians 6:11'
        },
        theologicalIntro: 'The Catholic Church has always acknowledged the reality of spiritual warfare. Through Christ\'s supreme victory on the Cross, believers are endowed with spiritual weapons — the Holy Name of Jesus, the Precious Blood, the St. Michael prayer, and sacramentals — to rebuke evil and remain safe.',
        categories: ['protection'],
        searchTerms: ['protect', 'evil', 'defense', 'shield', 'armor', 'enemy', 'michael', 'danger'],
        patronSaint: {
            name: 'St. Michael the Archangel',
            slug: 'saint-michael-archangel',
            title: 'Prince of the Heavenly Host & Defender in Battle',
            quote: 'Quis ut Deus? Who is like unto God?'
        },
        faqs: [
            {
                question: 'What is the most powerful Catholic prayer for protection?',
                answer: 'The St. Michael the Archangel Prayer, composed by Pope Leo XIII in 1884, is the most celebrated Catholic prayer for spiritual defense against the snares of the devil.'
            },
            {
                question: 'What Psalm is known as the Soldier\'s Prayer of Protection?',
                answer: 'Psalm 91 ("He who dwells in the shelter of the Most High") is historically prayed each night at Compline (Night Prayer) for heavenly protection against pestilence and terror.'
            }
        ]
    },
    'impossible-cases': {
        slug: 'impossible-cases',
        title: 'Catholic Prayers for Impossible & Hopeless Cases',
        shortTitle: 'Impossible Cases',
        badge: 'Desperate Circumstances',
        metaTitle: 'Catholic Prayers for Impossible Cases & Miracles | St. Jude & St. Rita',
        metaDescription: 'Turn to St. Jude Thaddeus and St. Rita of Cascia with Catholic prayers for impossible, hopeless, and desperate causes when all earthly solutions fail.',
        scripture: {
            verse: 'For nothing will be impossible with God.',
            citation: 'Luke 1:37'
        },
        theologicalIntro: 'When every human avenue is exhausted and circumstance appears hopeless, Catholic faith shines brightest. God often allows us to reach the end of our own strength so that His glory and supernatural intervention may be unmistakably revealed.',
        categories: ['faith', 'intercession'],
        searchTerms: ['impossible', 'hopeless', 'miracle', 'desperate', 'jude', 'rita', 'urgent', 'crisis'],
        patronSaint: {
            name: 'St. Jude Thaddeus & St. Rita of Cascia',
            slug: 'saint-jude',
            title: 'Patron Saints of Impossible Causes & Desperate Situations',
            quote: 'What is impossible with man is possible with God.'
        },
        faqs: [
            {
                question: 'Why is St. Jude the patron of hopeless cases?',
                answer: 'Because St. Jude shared a name with Judas Iscariot, many early believers hesitated to pray to him until all other saints were petitioned. When his intercession produced extraordinary miracles, he became renowned as the apostle of last resort.'
            },
            {
                question: 'How long should I pray for an impossible intention?',
                answer: 'Tradition recommends praying a 9-day Novena with persistent faith, daily Mass attendance, and receiving the Sacrament of Reconciliation with total trust in Divine Providence.'
            }
        ]
    },
    'departed-souls': {
        slug: 'departed-souls',
        title: 'Catholic Prayers for the Holy Souls in Purgatory & Deceased Loved Ones',
        shortTitle: 'Departed Souls',
        badge: 'Communion of Saints',
        metaTitle: 'Catholic Prayers for Souls in Purgatory & the Faithful Departed',
        metaDescription: 'Prayers for deceased parents, spouses, friends, and the holy souls in purgatory. The Requiem Aeternam, De Profundis, and St. Gertrude prayer.',
        scripture: {
            verse: 'It is a holy and wholesome thought to pray for the dead, that they may be loosed from sins.',
            citation: '2 Maccabees 12:46'
        },
        theologicalIntro: 'The Catholic doctrine of the Communion of Saints unites the Church Militant (on earth), the Church Suffering (in purgatory), and the Church Triumphant (in Heaven). Our prayers, Masses, and indulgences hasten the purification of our beloved dead into the beatific vision.',
        categories: ['eternal'],
        searchTerms: ['dead', 'deceased', 'purgatory', 'departed', 'requiem', 'eternal rest', 'funeral', 'mourning'],
        patronSaint: {
            name: 'St. Gertrude the Great & St. Nicholas of Tolentino',
            slug: 'saint-gertrude',
            title: 'Advocates for the Holy Souls in Purgatory',
            quote: 'Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.'
        },
        faqs: [
            {
                question: 'What is the St. Gertrude prayer for the souls in purgatory?',
                answer: 'Tradition attributes a promise from Christ to St. Gertrude that reciting this prayer releases 1,000 souls from purgatory each time it is said with devotional love: "Eternal Father, I offer Thee the Most Precious Blood of Thy Divine Son, Jesus..."'
            },
            {
                question: 'Why do Catholics pray for the dead?',
                answer: 'Scripture and Apostolic Tradition teach that those who die in God\'s grace but not yet fully purified undergo purgation. Our prayers and sacrifices assist their final cleansing before entering heavenly bliss.'
            }
        ]
    },
    'guidance-discernment': {
        slug: 'guidance-discernment',
        title: 'Catholic Prayers for Guidance, Wisdom & Discernment',
        shortTitle: 'Guidance & Discernment',
        badge: 'Holy Spirit & Wisdom',
        metaTitle: 'Catholic Prayers for Guidance, Wisdom & Making Major Decisions',
        metaDescription: 'Invoke the seven gifts of the Holy Spirit with Catholic prayers for discernment of vocation, career decisions, wisdom, and clarity in life.',
        scripture: {
            verse: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
            citation: 'James 1:5'
        },
        theologicalIntro: 'Discernment in Catholic spirituality, especially as taught by St. Ignatius of Loyola, is not mere logical analysis but an active listening to the movements of the Holy Spirit within the heart. Praying for guidance aligns our human desires with the eternal will of God.',
        categories: ['guidance'],
        searchTerms: ['guidance', 'wisdom', 'discernment', 'direction', 'decision', 'spirit', 'path', 'clarity'],
        patronSaint: {
            name: 'St. Ignatius of Loyola & St. Thomas Aquinas',
            slug: 'saint-ignatius',
            title: 'Master of Discernment of Spirits & Doctor of Divine Wisdom',
            quote: 'Teach us to give and not to count the cost, to fight and not to heed the wounds.'
        },
        faqs: [
            {
                question: 'Which prayer to the Holy Spirit is best for guidance?',
                answer: 'The traditional "Veni Creator Spiritus" (Come Holy Spirit) or the shorter invocation: "Come, Holy Spirit, fill the hearts of Thy faithful and enkindle in them the fire of Thy love."'
            },
            {
                question: 'How do I know if a decision aligns with God\'s will?',
                answer: 'St. Ignatius taught that choices from God are characterized by deep, lasting spiritual peace, joy, charity, and alignment with Church teaching, rather than fleeting worldly anxiety or pride.'
            }
        ]
    },
    'strength-hope': {
        slug: 'strength-hope',
        title: 'Catholic Prayers for Strength, Endurance & Renewed Hope',
        shortTitle: 'Strength & Hope',
        badge: 'Endurance & Fortitude',
        metaTitle: 'Catholic Prayers for Strength, Hope & Courage | MyPrayerTower',
        metaDescription: 'Prayers for fortitude during trials, spiritual burnout, despair, and grief. Discover the strength of Christ that empowers the weary soul.',
        scripture: {
            verse: 'I can do all things through Christ who strengthens me.',
            citation: 'Philippians 4:13'
        },
        theologicalIntro: 'Fortitude is one of the four cardinal virtues and a foundational gift of the Holy Spirit. Christian hope is not wishful thinking; it is the confident assurance that God\'s promises are trustworthy and that no darkness can conquer the light of Christ.',
        categories: ['strength', 'faith'],
        searchTerms: ['strength', 'hope', 'courage', 'weary', 'burden', 'fortitude', 'endurance', 'cross'],
        patronSaint: {
            name: 'St. Joan of Arc & St. Paul the Apostle',
            slug: 'saint-joan-of-arc',
            title: 'Patrons of Courage, Fortitude & Resilience',
            quote: 'I am not afraid; I was born to do this.'
        },
        faqs: [
            {
                question: 'What prayer helps when feeling spiritually exhausted?',
                answer: 'The Serenity Prayer, the Prayer of St. Francis ("Lord make me an instrument of your peace"), or simply sitting silently before the Blessed Sacrament with Psalm 23 restores spiritual energy.'
            },
            {
                question: 'What is the virtue of Fortitude in Catholic life?',
                answer: 'Fortitude ensures firmness in difficulties and constancy in the pursuit of the good. It strengthens the resolve to resist temptation and conquer fear, even of death.'
            }
        ]
    },
    'thanksgiving-gratitude': {
        slug: 'thanksgiving-gratitude',
        title: 'Catholic Prayers of Thanksgiving, Gratitude & Praise',
        shortTitle: 'Thanksgiving & Praise',
        badge: 'Gratitude & Eucharistic Heart',
        metaTitle: 'Catholic Prayers of Thanksgiving & Praise to God | MyPrayerTower',
        metaDescription: 'Offer heartfelt gratitude with traditional Catholic prayers of thanksgiving for blessings received, answered prayers, and God\'s boundless love.',
        scripture: {
            verse: 'Give thanks to the Lord, for he is good; his love endures forever.',
            citation: 'Psalm 107:1'
        },
        theologicalIntro: 'The Greek word "Eucharistia" means Thanksgiving. At the very center of Catholic life is the Mass — the supreme prayer of gratitude to the Father. Cultivating a thankful heart turns every daily event into an offering of worship.',
        categories: ['thanksgiving'],
        searchTerms: ['thanks', 'gratitude', 'praise', 'blessing', 'magnificat', 'te deum', 'adoration'],
        patronSaint: {
            name: 'Blessed Virgin Mary (The Magnificat)',
            slug: 'our-lady',
            title: 'Queen of Heaven & Model of Perfect Thanksgiving',
            quote: 'My soul proclaims the greatness of the Lord, my spirit rejoices in God my Savior.'
        },
        faqs: [
            {
                question: 'What is the Church\'s greatest prayer of thanksgiving?',
                answer: 'The Holy Sacrifice of the Mass is the highest Catholic thanksgiving. Other historic canticles include the "Te Deum" and the "Magnificat" (Mary\'s Canticle of Praise).'
            },
            {
                question: 'Why is gratitude so essential to the spiritual life?',
                answer: 'Gratitude guards against pride and cynicism, opens the heart to deeper grace, and recognizes that every breath, talent, and blessing is an unearned gift from a loving Father.'
            }
        ]
    }
};
