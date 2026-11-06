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
        metaTitle: 'Catholic Prayers for Healing & Physical Recovery | MyPrayerTower',
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

    'cancer-healing': {
        slug: 'cancer-healing',
        title: 'Catholic Prayers for Cancer Patients, Chemotherapy & Tumor Healing',
        shortTitle: 'Cancer Healing',
        badge: 'Oncology & Chronic Illness',
        metaTitle: 'Catholic Prayers for Cancer Patients & Chemotherapy | St. Peregrine',
        metaDescription: 'Miraculous Catholic prayers for cancer patients, tumor shrinkage, radiation strength, and remission through the powerful intercession of St. Peregrine.',
        scripture: {
            verse: 'Lord my God, I called to you for help, and you healed me.',
            citation: 'Psalm 30:2'
        },
        theologicalIntro: 'Cancer diagnosis carries immense fear and vulnerability. In Catholic spirituality, Saint Peregrine, who was himself cured of bone cancer on the eve of his leg amputation after a vision of Christ, stands as a tireless heavenly advocate for all undergoing oncology treatments.',
        categories: ['healing'],
        searchTerms: ['cancer', 'tumor', 'chemotherapy', 'radiation', 'peregrine', 'oncology', 'remission'],
        patronSaint: {
            name: 'St. Peregrine Laziosi',
            slug: 'saint-peregrine',
            title: 'Patron Saint of Cancer Patients & Incurable Diseases',
            quote: 'Christ touched my leg and removed the sickness that doctors could not cure.'
        },
        faqs: [
            {
                question: 'What is the traditional Catholic prayer to St. Peregrine for cancer?',
                answer: 'The St. Peregrine Novena asks for his direct intercession before the throne of Christ for tumor reduction, endurance through chemotherapy, pain relief, and complete physical recovery.'
            },
            {
                question: 'Can you light a vigil candle for a cancer patient online?',
                answer: 'Yes. Lighting a vigil candle on MyPrayerTower creates an ongoing visual offering of prayer that burns before the community as an act of solidarity and persistent intercession.'
            }
        ]
    },

    'surgery-recovery': {
        slug: 'surgery-recovery',
        title: 'Catholic Prayers Before Surgery & for Post-Operative Recovery',
        shortTitle: 'Surgery & Recovery',
        badge: 'Surgical Peace & Care',
        metaTitle: 'Catholic Prayers Before Surgery & Post-Op Recovery | MyPrayerTower',
        metaDescription: 'Prayers for calmness before undergoing surgery, guidance for surgeons and medical staff, and smooth post-operative healing under the care of Our Lady of Lourdes.',
        scripture: {
            verse: 'The Lord will watch over your coming and going both now and forevermore.',
            citation: 'Psalm 121:8'
        },
        theologicalIntro: 'Approaching the operating room requires surrendering human control into the skillful hands of surgeons and the supreme care of God. Catholics invoke Christ and Luke the Beloved Physician to guide the doctors\' hands and grant peace that surpasses understanding.',
        categories: ['healing'],
        searchTerms: ['surgery', 'operation', 'surgeon', 'hospital', 'operating room', 'anesthesia', 'recovery'],
        patronSaint: {
            name: 'St. Luke the Evangelist & Our Lady of Lourdes',
            slug: 'our-lady',
            title: 'The Beloved Physician & Health of the Sick',
            quote: 'Do not be afraid, only believe, and she will be well.'
        },
        faqs: [
            {
                question: 'What should I pray right before being wheeled into surgery?',
                answer: 'A short prayer of total trust: "Jesus, guide the surgeon’s hands, be present in the operating room, and bring me through this operation safely. Sacred Heart of Jesus, I place all my trust in You."'
            },
            {
                question: 'Which saint protects during anesthesia and medical operations?',
                answer: 'St. René Goupil (patron of anesthesiologists) and St. Luke the Evangelist are traditionally petitioned for divine protection during surgical procedures.'
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
        searchTerms: ['peace', 'anxiety', 'worry', 'stress', 'fear', 'calm', 'rest', 'panic'],
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

    'depression-mental-health': {
        slug: 'depression-mental-health',
        title: 'Catholic Prayers for Depression, Grief & Emotional Healing',
        shortTitle: 'Depression & Healing',
        badge: 'Emotional Comfort',
        metaTitle: 'Catholic Prayers for Depression & Mental Darkness | MyPrayerTower',
        metaDescription: 'Find divine solace in Catholic prayers for depression, chronic grief, and dark nights of the soul through St. Dymphna and St. John of God.',
        scripture: {
            verse: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
            citation: 'Psalm 34:18'
        },
        theologicalIntro: 'Catholic spirituality deeply respects the anguish of emotional darkness. Many great saints, including St. John of the Cross and St. Mother Teresa, endured seasons of profound spiritual and interior dryness. In depression, Christ enters our deepest wounds.',
        categories: ['peace', 'strength'],
        searchTerms: ['depression', 'sadness', 'mental health', 'despair', 'darkness', 'brokenhearted', 'dymphna'],
        patronSaint: {
            name: 'St. John of God & St. Dymphna',
            slug: 'saint-dymphna',
            title: 'Patrons of the Depressed & Psychiatric Conditions',
            quote: 'Labour without ceasing; do all the good work you can while you still have time.'
        },
        faqs: [
            {
                question: 'Does the Catholic Church consider depression a sin or lack of faith?',
                answer: 'No. The Church views depression as a medical and emotional suffering, not a sin. God looks upon those who suffer with tender mercy and compassion.'
            },
            {
                question: 'What prayer brings comfort when feeling numb or spiritually empty?',
                answer: 'Fr. Dolindo Ruotolo’s Surrender Novena: "O Jesus, I surrender myself to You, take care of everything!" releases the crushing pressure to fix emotional distress alone.'
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

    'employment-jobs': {
        slug: 'employment-jobs',
        title: 'Catholic Prayers for Finding a Job, Career Success & Interviews',
        shortTitle: 'Employment & Career',
        badge: 'Career & Purpose',
        metaTitle: 'Catholic Prayers for Finding a Job & Job Interviews | St. Cajetan',
        metaDescription: 'Prayers for job seekers, passing crucial interviews, career transitions, and finding noble work under the patronage of St. Cajetan and St. Joseph.',
        scripture: {
            verse: 'May the favor of the Lord our God rest on us; establish the work of our hands for us.',
            citation: 'Psalm 90:17'
        },
        theologicalIntro: 'Human work is a participation in God’s ongoing creation. When facing unemployment or job interviews, Catholic prayers request the dignity of labor, ethical colleagues, fair wages, and clarity to use our unique God-given talents.',
        categories: ['work'],
        searchTerms: ['interview', 'career', 'unemployed', 'promotion', 'resume', 'workplace', 'cajetan'],
        patronSaint: {
            name: 'St. Cajetan',
            slug: 'saint-joseph',
            title: 'Patron Saint of Job Seekers & The Unemployed',
            quote: 'Do not fear, for God will provide for all those who put their trust in Him.'
        },
        faqs: [
            {
                question: 'What prayer can I say right before a job interview?',
                answer: '"Holy Spirit, give me the wisdom to speak clearly, grant me favor in the eyes of the interviewers, and let Your will be done in my career. St. Joseph, pray for me."'
            },
            {
                question: 'Why is St. Cajetan known as the saint of job seekers?',
                answer: 'St. Cajetan founded the Theatines and established pawnshops and non-profit lending institutions to protect workers and the poor from loan sharks, dedicating his life to economic justice.'
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

    'marriage-healing': {
        slug: 'marriage-healing',
        title: 'Catholic Prayers for Troubled Marriage, Healing & Reconciliation',
        shortTitle: 'Marriage Healing',
        badge: 'Sacrament of Matrimony',
        metaTitle: 'Catholic Prayers to Save Troubled Marriage & Stop Divorce',
        metaDescription: 'Powerful intercessory prayers for marriage healing, restoring broken trust, emotional intimacy, and stopping divorce through St. Rita of Cascia.',
        scripture: {
            verse: 'What therefore God has joined together, let not man put asunder.',
            citation: 'Mark 10:9'
        },
        theologicalIntro: 'Holy Matrimony is an indissoluble supernatural sacrament representing Christ’s love for the Church. When infidelity, resentment, or coldness threatens a marriage, Catholic prayers invoke the Holy Spirit to melt hard hearts and restore sacrificial covenant love.',
        categories: ['marriage', 'family'],
        searchTerms: ['divorce', 'spouse', 'infidelity', 'reconciliation', 'marital', 'husband', 'wife', 'rita'],
        patronSaint: {
            name: 'St. Rita of Cascia',
            slug: 'saint-rita',
            title: 'Patroness of Difficult Marriages & Hopeless Causes',
            quote: 'Love conquers all bitterness when anchored in Christ’s wounds.'
        },
        faqs: [
            {
                question: 'Can prayer really save a marriage on the brink of divorce?',
                answer: 'Countless Catholic marriages have been miraculously restored through dedicated novenas to St. Rita and Our Lady, Undoer of Knots, combined with humble communication and pastoral counseling.'
            },
            {
                question: 'What novena is best for marital knots and disputes?',
                answer: 'The Novena to Mary, Undoer of Knots (fostered by Pope Francis) is specifically prayed to untangle deep-seated emotional knots in marriages.'
            }
        ]
    },

    'future-spouse': {
        slug: 'future-spouse',
        title: 'Catholic Prayers to Find a Spouse, Courtship & Vocations',
        shortTitle: 'Finding a Spouse',
        badge: 'Christian Courtship',
        metaTitle: 'Catholic Prayers to Find a Godly Spouse & Discern Courtship',
        metaDescription: 'Catholic prayers for dating discernment, finding a holy husband or wife, and preparing your heart for Holy Matrimony with St. Raphael.',
        scripture: {
            verse: 'He who finds a wife finds what is good and receives favor from the Lord.',
            citation: 'Proverbs 18:22'
        },
        theologicalIntro: 'Dating and courtship in Catholic spirituality are acts of joyful discernment. Praying for your future spouse before even meeting them consecrates your future family to God, asking St. Raphael to guide your paths toward a partner of virtue and faith.',
        categories: ['marriage', 'guidance'],
        searchTerms: ['dating', 'spouse', 'courtship', 'husband', 'wife', 'single', 'raphael', 'chastity'],
        patronSaint: {
            name: 'St. Raphael the Archangel & St. Anne',
            slug: 'saint-raphael',
            title: 'Patron of Christian Courtship & Finding a True Match',
            quote: 'I am Raphael, one of the seven holy angels who present the prayers of the saints.'
        },
        faqs: [
            {
                question: 'Why is St. Raphael the patron of finding a spouse?',
                answer: 'In the Book of Tobit, the Archangel Raphael guided Tobias on his journey to find and marry Sarah, delivering her from demonic affliction and blessing their marriage.'
            },
            {
                question: 'What is the traditional prayer for a future spouse?',
                answer: 'The St. Raphael Prayer for Courtship asks for purity of heart, patience in single life, and heavenly guidance to recognize the person God has prepared for you.'
            }
        ]
    },

    'children-protection': {
        slug: 'children-protection',
        title: 'Catholic Prayers for Children, Sons, Daughters & Grandchildren',
        shortTitle: 'Children\'s Blessing',
        badge: 'Purity & Protection',
        metaTitle: 'Catholic Prayers for Protection and Blessing of Children',
        metaDescription: 'Catholic blessing prayers over babies, young children, school students, and adult sons and daughters under the Guardian Angels and Holy Family.',
        scripture: {
            verse: 'Children are a heritage from the Lord, offspring a reward from him.',
            citation: 'Psalm 127:3'
        },
        theologicalIntro: 'Parents hold a sacerdotal privilege to bless and protect their offspring in the domestic church. Catholic prayers surround children with the armor of God against moral corruption, bullying, physical danger, and anxiety.',
        categories: ['family', 'children'],
        searchTerms: ['son', 'daughter', 'kids', 'baby', 'toddler', 'school', 'guardian angel', 'protection'],
        patronSaint: {
            name: 'Holy Guardian Angels & St. Philomena',
            slug: 'our-lady',
            title: 'Guardians of Little Ones & Youth',
            quote: 'Angel of God, my guardian dear, to whom God’s love commits me here.'
        },
        faqs: [
            {
                question: 'How do Catholic parents bless their children at bedtime?',
                answer: 'Tracing the Sign of the Cross on their forehead with holy water and saying: "May the Lord bless you and keep you; may His face shine upon you and grant you peace."'
            }
        ]
    },

    'wayward-children': {
        slug: 'wayward-children',
        title: 'Catholic Prayers for Wayward Children & Fallen-Away Catholics',
        shortTitle: 'Wayward Children',
        badge: 'Conversion & Return',
        metaTitle: 'Catholic Prayers for Children Who Left Church | St. Monica',
        metaDescription: 'Heartfelt Catholic prayers for sons, daughters, and family members who abandoned the Catholic faith and sacraments. The power of St. Monica\'s tears.',
        scripture: {
            verse: 'For this son of mine was dead and is alive again; he was lost and is found.',
            citation: 'Luke 15:24'
        },
        theologicalIntro: 'Seeing a beloved child drift away from the Catholic faith causes parents profound grief. St. Monica wept and prayed for 17 years for St. Augustine. St. Ambrose assured her: "It is impossible that the child of so many tears should perish."',
        categories: ['family', 'conversion'],
        searchTerms: ['fallen away', 'left church', 'atheist child', 'prodigal', 'monica', 'conversion', 'faith'],
        patronSaint: {
            name: 'St. Monica',
            slug: 'saint-monica',
            title: 'Patron Saint of Mothers Praying for Wayward Sons & Daughters',
            quote: 'A child of so many tears shall never be lost.'
        },
        faqs: [
            {
                question: 'What is the most effective prayer for children who stopped going to Mass?',
                answer: 'The St. Monica Novena, combined with offering Holy Communion and First Saturday Masses for their conversion without constant arguing, allows God\'s grace to soften their hearts.'
            }
        ]
    },

    'fertility-pregnancy': {
        slug: 'fertility-pregnancy',
        title: 'Catholic Prayers for Infertility, Conception & Safe Pregnancy',
        shortTitle: 'Fertility & Conception',
        badge: 'Gift of Life',
        metaTitle: 'Catholic Prayers for Fertility, Conceiving & Safe Childbirth',
        metaDescription: 'Miraculous Catholic prayers for couples struggling with infertility, healthy pregnancy, and safe delivery through St. Gerard Majella and St. Gianna Molla.',
        scripture: {
            verse: 'Before I formed you in the womb I knew you, before you were born I set you apart.',
            citation: 'Jeremiah 1:5'
        },
        theologicalIntro: 'Children are the supreme gift of marriage. For couples bearing the cross of infertility, Catholic prayers offer deep spiritual accompaniment, invoking St. Gerard Majella and St. Gianna Beretta Molla for fruitful conception and healthy deliveries.',
        categories: ['family', 'healing'],
        searchTerms: ['pregnancy', 'fertility', 'infertility', 'conceive', 'childbirth', 'labor', 'gerard', 'gianna'],
        patronSaint: {
            name: 'St. Gerard Majella & St. Gianna Beretta Molla',
            slug: 'saint-gerard',
            title: 'Patrons of Expectant Mothers, Safe Deliveries & Infertility',
            quote: 'Here the will of God is done, as God wills, and as long as God wills.'
        },
        faqs: [
            {
                question: 'Who is the Catholic patron saint of pregnant mothers and fertility?',
                answer: 'St. Gerard Majella is revered worldwide as the patron of expectant mothers and safe childbirth, while St. Gianna Molla is a modern patroness of mothers and unborn life.'
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

    'protection-evil': {
        slug: 'protection-evil',
        title: 'Catholic Prayers Against Evil, Nightmares & Demonic Oppression',
        shortTitle: 'Against Evil & Dark',
        badge: 'Spiritual Shield',
        metaTitle: 'Catholic Prayers Against Evil, Nightmares & Spiritual Darkness',
        metaDescription: 'Catholic prayers for protection against witchcraft, demonic harassment, night terrors, and evil spirits through the St. Benedict Medal prayer.',
        scripture: {
            verse: 'The Lord is faithful, and he will strengthen you and protect you from the evil one.',
            citation: '2 Thessalonians 3:3'
        },
        theologicalIntro: 'The Saint Benedict medal carries ancient exorcistic inscriptions (Vade Retro Satana — "Begone, Satan"). Catholic spiritual tradition provides authoritative prayers of protection for homes, bedtime peace, and banishing nightmares.',
        categories: ['protection'],
        searchTerms: ['evil', 'nightmares', 'oppression', 'benedict', 'demonic', 'darkness', 'haunted', 'fear'],
        patronSaint: {
            name: 'St. Benedict of Nursia',
            slug: 'saint-benedict',
            title: 'Patron Against Poison, Evil & Diabolical Attacks',
            quote: 'Crux Sacra Sit Mihi Lux! May the Holy Cross be my light!'
        },
        faqs: [
            {
                question: 'What is the Latin prayer on the St. Benedict Medal?',
                answer: '"Crux Sacra Sit Mihi Lux, Non Draco Sit Mihi Dux. Vade Retro Satana, Nunquam Suade Mihi Vana. Sunt Mala Quae Libas, Ipse Venena Bibas."'
            }
        ]
    },

    'deliverance-cleansing': {
        slug: 'deliverance-cleansing',
        title: 'Catholic Prayers for Deliverance, Healing from Curses & Cleansing',
        shortTitle: 'Deliverance & Freedom',
        badge: 'Precious Blood Freedom',
        metaTitle: 'Catholic Deliverance Prayers & Precious Blood Cleansing',
        metaDescription: 'Reverent Catholic deliverance prayers for breaking sinful bondages, generational trauma, and negative attachments through the Precious Blood of Jesus.',
        scripture: {
            verse: 'They triumphed over him by the blood of the Lamb and by the word of their testimony.',
            citation: 'Revelation 12:11'
        },
        theologicalIntro: 'Deliverance in Catholic theology is grounded in baptismal grace. Minor exorcisms and personal prayers of deliverance invite Christ\'s Precious Blood to cleanse memories, cut unholy attachments, and restore interior spiritual liberty.',
        categories: ['protection', 'deliverance'],
        searchTerms: ['deliverance', 'precious blood', 'curses', 'bondage', 'cleansing', 'freedom', 'attachments'],
        patronSaint: {
            name: 'St. Anthony the Great & St. Padre Pio',
            slug: 'saint-padre-pio',
            title: 'Victors in Spiritual Combat & Heavenly Protectors',
            quote: 'Pray, hope, and don’t worry. Worry is useless. God is merciful and will hear your prayer.'
        },
        faqs: [
            {
                question: 'Can laity pray Catholic deliverance prayers?',
                answer: 'Yes. Lay Catholics can pray prayers of deliverance for themselves and their immediate families (spouses and minor children) using prayers of petition rather than commanding spirits directly.'
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

    'urgent-needs': {
        slug: 'urgent-needs',
        title: 'Catholic Prayers for Urgent Needs & Immediate Financial Help',
        shortTitle: 'Urgent Needs',
        badge: 'Emergency Petition',
        metaTitle: 'Catholic Prayers for Urgent Needs & Fast Help | St. Expedite',
        metaDescription: 'Urgent Catholic prayers for immediate intervention, emergency money, impending deadlines, and crises through St. Expedite and the Infant Jesus.',
        scripture: {
            verse: 'God is our refuge and strength, an ever-present help in trouble.',
            citation: 'Psalm 46:1'
        },
        theologicalIntro: 'In acute crises where time is critical, Catholic piety turns to Saint Expedite, who rejected procrastination (saying "Hodie" — Today, rather than "Cras" — Tomorrow), asking God for swift resolution of pressing temporal and spiritual needs.',
        categories: ['intercession'],
        searchTerms: ['urgent', 'emergency', 'fast', 'immediate', 'expedite', 'deadline', 'crisis'],
        patronSaint: {
            name: 'St. Expedite',
            slug: 'saint-expedite',
            title: 'Patron Saint of Urgent Causes & Prompt Solutions',
            quote: 'Hodie! Do not leave for tomorrow what must be resolved today in Christ.'
        },
        faqs: [
            {
                question: 'What is the unfailing prayer to St. Expedite for urgent needs?',
                answer: 'The St. Expedite prayer implores his speedy intercession before Jesus for imminent danger, rent/mortgage deadlines, and critical circumstances.'
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

    'grief-consolation': {
        slug: 'grief-consolation',
        title: 'Catholic Prayers for Grief, Bereavement & Loss of a Loved One',
        shortTitle: 'Grief & Consolation',
        badge: 'Mourning & Hope',
        metaTitle: 'Catholic Prayers for Grief, Mourning & Loss of a Loved One',
        metaDescription: 'Comfort your broken heart with Catholic prayers for grief after the death of a parent, spouse, or child under Our Lady of Sorrows.',
        scripture: {
            verse: 'Blessed are those who mourn, for they will be comforted.',
            citation: 'Matthew 5:4'
        },
        theologicalIntro: 'At the foot of the Cross, Mary experienced supreme bereavement as she held her crucified Son. In Catholic grieving, tears are not signs of weak faith, but expressions of love sanctified by Christian hope in the Resurrection of the body.',
        categories: ['eternal', 'peace'],
        searchTerms: ['grief', 'mourning', 'loss', 'death', 'bereavement', 'sorrow', 'crying', 'broken'],
        patronSaint: {
            name: 'Our Lady of Sorrows (Mater Dolorosa)',
            slug: 'our-lady',
            title: 'Mother of the Afflicted & Consoler of the Mourning',
            quote: 'At the cross her station keeping, stood the mournful mother weeping.'
        },
        faqs: [
            {
                question: 'What Catholic prayer helps immediately after hearing tragic news?',
                answer: 'The De Profundis (Psalm 130): "Out of the depths I cry to You, O Lord; Lord, hear my voice!" or simply: "Jesus, Mary, and Joseph, be with me in this agony."'
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

    'exam-studies': {
        slug: 'exam-studies',
        title: 'Catholic Prayers for Exams, Students, Studying & Memory',
        shortTitle: 'Exams & Studies',
        badge: 'Intellectual Clarity',
        metaTitle: 'Catholic Prayers Before Exams & Studying | St. Joseph of Cupertino',
        metaDescription: 'Catholic prayers for passing difficult exams, retaining knowledge, overcoming test anxiety, and clarity of mind with St. Joseph of Cupertino.',
        scripture: {
            verse: 'For the Lord gives wisdom; from his mouth come knowledge and understanding.',
            citation: 'Proverbs 2:6'
        },
        theologicalIntro: 'Intellectual endeavor is a holy task when undertaken for the glory of God and the service of neighbor. St. Joseph of Cupertino and St. Thomas Aquinas guide students through study fatigue, exam panic, and clarity of memory.',
        categories: ['guidance'],
        searchTerms: ['exam', 'test', 'study', 'student', 'school', 'university', 'memory', 'cupertino', 'thomas aquinas'],
        patronSaint: {
            name: 'St. Joseph of Cupertino & St. Thomas Aquinas',
            slug: 'saint-thomas-aquinas',
            title: 'Patrons of Test Takers, Students & Academic Excellence',
            quote: 'Study as if you were to live forever; live as if you were to die tomorrow.'
        },
        faqs: [
            {
                question: 'What is the famous student prayer to St. Joseph of Cupertino?',
                answer: '"O Great St. Joseph of Cupertino, who by your prayer obtained from God to be asked at your examination only the propositions which you knew, grant me favor in this upcoming test."'
            }
        ]
    },

    'court-legal-cases': {
        slug: 'court-legal-cases',
        title: 'Catholic Prayers for Court Cases, Legal Battles & True Justice',
        shortTitle: 'Court & Legal Battles',
        badge: 'Divine Justice',
        metaTitle: 'Catholic Prayers for Court Cases & Favorable Verdicts',
        metaDescription: 'Prayers for justice in court hearings, lawsuits, custody disputes, and fair verdicts through St. Thomas More and St. Ivo of Kermartin.',
        scripture: {
            verse: 'Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless; plead the case of the widow.',
            citation: 'Isaiah 1:17'
        },
        theologicalIntro: 'Entering the courtroom can feel isolating and intimidating. Catholics petition Christ the Righteous Judge and St. Thomas More (Lord Chancellor of England who died for his conscience) to ensure the truth shines clearly and fairness prevails.',
        categories: ['protection', 'guidance'],
        searchTerms: ['court', 'judge', 'legal', 'lawsuit', 'lawyer', 'custody', 'trial', 'verdict', 'justice'],
        patronSaint: {
            name: 'St. Thomas More & St. Ivo',
            slug: 'saint-thomas-more',
            title: 'Patrons of Lawyers, Judges & Truth in Court',
            quote: 'I die the King’s good servant, and God’s first.'
        },
        faqs: [
            {
                question: 'Which saint do Catholics pray to for legal and court cases?',
                answer: 'St. Thomas More and St. Ivo of Kermartin (the "Advocate of the Poor") are the principal patron saints invoked for favorable and just outcomes in legal matters.'
            }
        ]
    },

    'forgiveness-repentance': {
        slug: 'forgiveness-repentance',
        title: 'Catholic Prayers for Forgiveness, Repentance & Confession Preparation',
        shortTitle: 'Forgiveness & Mercy',
        badge: 'Sacrament of Penance',
        metaTitle: 'Catholic Prayers for Forgiveness & Act of Contrition',
        metaDescription: 'Traditional Catholic prayers of repentance, forgiving those who hurt you, and preparing for the Sacrament of Reconciliation with Psalm 51 (Miserere).',
        scripture: {
            verse: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
            citation: '1 John 1:9'
        },
        theologicalIntro: 'Contrition is sorrow of the soul and detestation for sin committed, together with the resolution not to sin again. Catholic prayers of repentance restore our friendship with God and empower us to forgive those who have deeply wounded us.',
        categories: ['repentance', 'forgiveness'],
        searchTerms: ['forgiveness', 'repentance', 'confession', 'sin', 'contrition', 'mercy', 'miserere'],
        patronSaint: {
            name: 'St. Peter the Apostle & St. Maria Goretti',
            slug: 'saint-peter',
            title: 'Models of Tearful Repentance & Radical Forgiveness',
            quote: 'Lord, you know everything; you know that I love you.'
        },
        faqs: [
            {
                question: 'What is the full traditional text of the Act of Contrition?',
                answer: '"O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all-good and deserving of all my love..."'
            }
        ]
    },

    'addiction-recovery': {
        slug: 'addiction-recovery',
        title: 'Catholic Prayers for Addiction Recovery, Sobriety & Deliverance',
        shortTitle: 'Addiction & Sobriety',
        badge: 'Sobriety & Freedom',
        metaTitle: 'Catholic Prayers for Addiction Recovery & Sobriety | Venerable Matt Talbot',
        metaDescription: 'Catholic prayers for breaking chains of alcoholism, drug addiction, pornography, and gambling through Venerable Matt Talbot and St. Maximilian Kolbe.',
        scripture: {
            verse: 'So if the Son sets you free, you will be free indeed.',
            citation: 'John 8:36'
        },
        theologicalIntro: 'Addiction enslaves both spirit and body. Catholic spirituality approaches sobriety not with shame, but through the healing power of the sacraments and the intercession of Venerable Matt Talbot, who overcame chronic alcoholism through prayer, daily Mass, and fasting.',
        categories: ['healing', 'deliverance'],
        searchTerms: ['addiction', 'alcoholism', 'drugs', 'sobriety', 'talbot', 'chains', 'pornography', 'gambling'],
        patronSaint: {
            name: 'Venerable Matt Talbot & St. Maximilian Kolbe',
            slug: 'venerable-matt-talbot',
            title: 'Patrons of Alcoholics & Those Battling Addiction',
            quote: 'Never be afraid of loving the Blessed Virgin too much. You can never love her more than Jesus did.'
        },
        faqs: [
            {
                question: 'Who is the Catholic patron saint of addicts and alcoholics?',
                answer: 'Venerable Matt Talbot (patron of alcoholics and recovering addicts) and St. Maximilian Kolbe (patron of the addicted and imprisoned) are the greatest spiritual companions in recovery.'
            }
        ]
    },

    'purity-chastity': {
        slug: 'purity-chastity',
        title: 'Catholic Prayers for Purity, Chastity & Overcoming Lust',
        shortTitle: 'Purity & Chastity',
        badge: 'Virtue of Purity',
        metaTitle: 'Catholic Prayers for Purity, Chastity & Overcoming Temptation',
        metaDescription: 'Defend your heart and eyes with Catholic prayers for chastity, purity of mind, and the Cord of St. Thomas Aquinas against temptations of the flesh.',
        scripture: {
            verse: 'Blessed are the pure in heart, for they will see God.',
            citation: 'Matthew 5:8'
        },
        theologicalIntro: 'Chastity is the successful integration of sexuality within the human person, creating inner freedom to love truly. Catholic prayers for purity invoke Mary Immaculate and St. Thomas Aquinas to shield the eyes, discipline thoughts, and preserve modesty.',
        categories: ['purity'],
        searchTerms: ['purity', 'chastity', 'lust', 'temptation', 'eyes', 'modesty', 'goretti', 'thomas aquinas'],
        patronSaint: {
            name: 'St. Maria Goretti & St. Thomas Aquinas',
            slug: 'saint-thomas-aquinas',
            title: 'Martyr of Purity & The Angelic Doctor',
            quote: 'I forgive him with all my heart, and I want him to be with me in Paradise.'
        },
        faqs: [
            {
                question: 'What is the Angelic Warfare Confraternity prayer for chastity?',
                answer: 'The prayer to St. Thomas Aquinas for purity asks for the angelic cord of chastity to extinguish every spark of lust and keep heart and body unsullied.'
            }
        ]
    },

    'loneliness-abandonment': {
        slug: 'loneliness-abandonment',
        title: 'Catholic Prayers for Loneliness, Feeling Abandoned & Solitude',
        shortTitle: 'Loneliness & Solitude',
        badge: 'Presence of Christ',
        metaTitle: 'Catholic Prayers for Loneliness & Feeling Abandoned',
        metaDescription: 'Find comforting friendship with Jesus in Catholic prayers for loneliness, isolation, and widowhood with St. Charles de Foucauld.',
        scripture: {
            verse: 'And surely I am with you always, to the very end of the age.',
            citation: 'Matthew 28:20'
        },
        theologicalIntro: 'Loneliness is among the deepest pains of the modern era. When family or friends depart, Christ remains waiting in every tabernacle across the earth. Surrendering isolation into sacred solitude unites the soul with Jesus in Gethsemane.',
        categories: ['peace', 'strength'],
        searchTerms: ['lonely', 'loneliness', 'alone', 'abandoned', 'solitude', 'widow', 'isolated'],
        patronSaint: {
            name: 'St. Charles de Foucauld & St. Rita',
            slug: 'saint-rita',
            title: 'Universal Brother & Friend of the Abandoned',
            quote: 'Father, I abandon myself into your hands; do with me what you will.'
        },
        faqs: [
            {
                question: 'What prayer helps most when feeling completely isolated and forgotten?',
                answer: 'The Prayer of Abandonment by St. Charles de Foucauld: "Father, I abandon myself into your hands; do with me what you will. Whatever you may do, I thank you."'
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
    },

    'travel-safety': {
        slug: 'travel-safety',
        title: 'Catholic Prayers for Travel, Safe Journey & Motorists',
        shortTitle: 'Travel & Safe Journey',
        badge: 'Safe Passage',
        metaTitle: 'Catholic Prayers for Safe Travel, Flights & Road Trips | St. Christopher',
        metaDescription: 'Catholic travel prayers for road trips, airline flights, daily commutes, and safe return home through St. Christopher and the Archangel Raphael.',
        scripture: {
            verse: 'For he will command his angels concerning you to guard you in all your ways.',
            citation: 'Psalm 91:11'
        },
        theologicalIntro: 'Travel has always carried unpredictability. Catholics invoke Saint Christopher, who bore the Christ Child across a turbulent river, and Saint Raphael the Archangel to accompany journeys and grant safe arrivals.',
        categories: ['protection'],
        searchTerms: ['travel', 'flight', 'road trip', 'drive', 'motorist', 'safe journey', 'christopher', 'commute'],
        patronSaint: {
            name: 'St. Christopher & St. Raphael the Archangel',
            slug: 'saint-christopher',
            title: 'Patrons of Travelers, Motorists & Safe Journeys',
            quote: 'Behold St. Christopher, then go your way with safety.'
        },
        faqs: [
            {
                question: 'What is the Motorist’s Prayer to St. Christopher?',
                answer: '"Grant me, O Lord, a steady hand and watchful eye, that no one shall be hurt as I pass by. St. Christopher, protect me and lead me safely to my destiny."'
            }
        ]
    },

    'peace-nations': {
        slug: 'peace-nations',
        title: 'Catholic Prayers for World Peace, Ending War & Leaders',
        shortTitle: 'Peace in Nations',
        badge: 'Peace & Reconciliation',
        metaTitle: 'Catholic Prayers for World Peace, Ending War & Government Leaders',
        metaDescription: 'Catholic prayers for ending conflict, protecting innocent civilians, conversion of leaders, and true peace through Our Lady of Fatima.',
        scripture: {
            verse: 'Blessed are the peacemakers, for they will be called children of God.',
            citation: 'Matthew 5:9'
        },
        theologicalIntro: 'At Fatima, Our Lady revealed that daily recitation of the Holy Rosary brings peace to nations and halts wars. True peace is the tranquility of divine order, requiring justice, mercy, and prayer for national leaders.',
        categories: ['peace'],
        searchTerms: ['peace', 'war', 'nations', 'fatima', 'soldiers', 'civilians', 'conflict', 'leaders'],
        patronSaint: {
            name: 'Our Lady of Fatima & St. Francis of Assisi',
            slug: 'our-lady',
            title: 'Queen of Peace & Herald of Reconciliation',
            quote: 'Lord, make me an instrument of your peace: where there is hatred, let me sow love.'
        },
        faqs: [
            {
                question: 'What prayer did Our Lady of Fatima ask everyone to pray for peace?',
                answer: 'She asked the faithful to pray the Holy Rosary daily and make reparation through the Five First Saturdays devotion for world peace.'
            }
        ]
    },

    'priests-vocations': {
        slug: 'priests-vocations',
        title: 'Catholic Prayers for Priests, Bishops, Pope & Holy Vocations',
        shortTitle: 'Priests & Vocations',
        badge: 'Holy Priesthood',
        metaTitle: 'Catholic Prayers for Priests, Seminarians & Holy Vocations',
        metaDescription: 'Support your shepherds with Catholic prayers for priests, holy bishops, protection against scandal, and increase of vocations through St. John Vianney.',
        scripture: {
            verse: 'The harvest is plentiful but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into his harvest field.',
            citation: 'Matthew 9:37-38'
        },
        theologicalIntro: 'The priesthood is the love of the Heart of Jesus, as the Curé of Ars taught. Without priests, there is no Holy Sacrifice of the Mass and no absolution of sins. Faithful intercession shields priests from burnout, spiritual attack, and discouragement.',
        categories: ['vocations'],
        searchTerms: ['priest', 'priesthood', 'vocations', 'seminarian', 'bishop', 'pope', 'vianney'],
        patronSaint: {
            name: 'St. John Vianney (Curé of Ars)',
            slug: 'saint-john-vianney',
            title: 'Patron Saint of Parish Priests & Confessors',
            quote: 'The Priesthood is the love of the heart of Jesus.'
        },
        faqs: [
            {
                question: 'What is the St. Thérèse prayer for priests?',
                answer: '"O Jesus, eternal Priest, keep Thy priests within the shelter of Thy Sacred Heart, where none may touch them. Bless their labors with abundant fruit..."'
            }
        ]
    },

    'elderly-aging': {
        slug: 'elderly-aging',
        title: 'Catholic Prayers for Elderly Parents, Grandparents & Aging with Grace',
        shortTitle: 'Elderly & Grandparents',
        badge: 'Wisdom of Elders',
        metaTitle: 'Catholic Prayers for Elderly Parents & Grandparents | St. Joachim & Anne',
        metaDescription: 'Prayers for aging parents, physical frailty, dementia comfort, and grandparents\' blessings under the patronage of Jesus\' grandparents, Sts. Joachim and Anne.',
        scripture: {
            verse: 'Even to your old age and gray hairs I am he, I am he who will sustain you.',
            citation: 'Isaiah 46:4'
        },
        theologicalIntro: 'Holy Scripture venerates the silver crown of old age. Catholic prayers for aging elders honor their lifelong sacrifices, ask for patience in infirmity, and surround them with the loving embrace of Sts. Joachim and Anne.',
        categories: ['family', 'healing'],
        searchTerms: ['elderly', 'aging', 'grandparents', 'parents', 'dementia', 'nursing home', 'memory', 'joachim', 'anne'],
        patronSaint: {
            name: 'Sts. Joachim and Anne',
            slug: 'saint-anne',
            title: 'Grandparents of Jesus & Patrons of the Elderly',
            quote: 'In age and frailty, God remains our eternal youth.'
        },
        faqs: [
            {
                question: 'Who are the patron saints of grandparents and older adults?',
                answer: 'St. Joachim and St. Anne, the holy grandparents of Jesus and parents of the Blessed Virgin Mary, are the universal patrons of grandparents and the elderly.'
            }
        ]
    },

    'sick-pets-animals': {
        slug: 'sick-pets-animals',
        title: 'Catholic Prayers for Sick Pets, Dogs, Cats & Animal Blessings',
        shortTitle: 'Sick Pets & Animals',
        badge: 'Creation & Animals',
        metaTitle: 'Catholic Prayers for Sick Pets & Blessing of Animals | St. Francis',
        metaDescription: 'Gentle Catholic prayers for sick dogs, cats, animal recovery, and pet loss through the tender intercession of St. Francis of Assisi.',
        scripture: {
            verse: 'Let everything that has breath praise the Lord.',
            citation: 'Psalm 150:6'
        },
        theologicalIntro: 'Saint Francis of Assisi saw in all creatures the loving hand of the Creator. Praying for domestic animals and sick companions reflects stewardship over God’s creation and gratitude for the faithful companionship pets provide.',
        categories: ['healing', 'creation'],
        searchTerms: ['pet', 'dog', 'cat', 'animal', 'vet', 'sick pet', 'francis of assisi', 'companion'],
        patronSaint: {
            name: 'St. Francis of Assisi',
            slug: 'saint-francis',
            title: 'Patron Saint of Animals, Ecology & Pets',
            quote: 'Praised be You, my Lord, with all Your creatures.'
        },
        faqs: [
            {
                question: 'Can Catholics pray for sick dogs and pets?',
                answer: 'Yes. The Catholic Church has an official blessing of animals (traditionally performed around St. Francis’ feast day on October 4), acknowledging pets as gifts from God.'
            }
        ]
    },

    'trust-divine-providence': {
        slug: 'trust-divine-providence',
        title: 'Catholic Prayers for Trust in Divine Providence & Surrender to God',
        shortTitle: 'Trust & Surrender',
        badge: 'Divine Will',
        metaTitle: 'Catholic Prayers of Surrender & Trust in Divine Providence',
        metaDescription: 'Overcome need for control with Catholic prayers of surrender to God\'s will, Fr. Dolindo\'s Surrender Novena, and Jesus I Trust in You.',
        scripture: {
            verse: 'Trust in the Lord with all your heart and lean not on your own understanding.',
            citation: 'Proverbs 3:5'
        },
        theologicalIntro: 'Divine Providence is the dispositions by which God guides His creation toward its ultimate perfection. When we surrender our anxiety and desire for control, Christ takes our burdens and transforms our lives according to His perfect plan.',
        categories: ['faith', 'peace'],
        searchTerms: ['trust', 'surrender', 'providence', 'divine will', 'dolindo', 'jesus i trust in you', 'control'],
        patronSaint: {
            name: 'St. Faustina Kowalska & Fr. Dolindo Ruotolo',
            slug: 'saint-faustina',
            title: 'Apostles of Divine Mercy & Absolute Surrender',
            quote: 'Jesus, I trust in You! O Jesus, I surrender myself to You, take care of everything!'
        },
        faqs: [
            {
                question: 'What is the Surrender Novena by Father Dolindo Ruotolo?',
                answer: 'A powerful 9-day novena where Jesus speaks directly to the soul, promising to resolve difficult situations when you surrender them with the words: "O Jesus, I surrender myself to You, take care of everything!"'
            }
        ]
    }
};
