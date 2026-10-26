const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../../node_modules/@prisma/client'));
const prisma = new PrismaClient();

const ENCYCLOPEDIC_PRAYERS_PART2 = [
  // =========================================================================
  // BYZANTINE, EASTERN ORTHODOX & SYRIAC PATRISTIC ROOTS
  // =========================================================================
  {
    title: "The Trisagion Prayers (The Thrice-Holy Opening of the Eastern Liturgy)",
    slug: "trisagion-prayers-eastern-orthodox-byzantine",
    category: "historical",
    category_label: "Eastern Orthodox & Byzantine Roots",
    tags: ["tradition:eastern-orthodox", "tradition:byzantine", "century:5th", "holy-trinity", "liturgy", "ancient"],
    content: `> 📜 **Historical & Biblical Origin**: The Trisagion hymn was revealed in Constantinople in the 5th century during the patriarchate of St. Proclus amidst earthquakes. It echoes the heavenly vision of Isaiah 6:3 and Revelation 4:8, and stands as the universal foundation of all Orthodox and Byzantine daily prayer rules.
> 🕯️ **Liturgical Setting & Posture**: Stand facing the East or before your icon corner. At each repetition of "Holy God...", make the Sign of the Cross and a metanoia (reverent bow from the waist).

In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.

Glory to Thee, our God, glory to Thee!

O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere present and fillest all things; Treasury of blessings and Giver of life, come and abide in us, and cleanse us from all impurity, and save our souls, O Good One.

Holy God, Holy Mighty, Holy Immortal, have mercy on us. *(Bow)*
Holy God, Holy Mighty, Holy Immortal, have mercy on us. *(Bow)*
Holy God, Holy Mighty, Holy Immortal, have mercy on us. *(Bow)*

Glory to the Father, and to the Son, and to the Holy Spirit, both now and ever, and unto the ages of ages. Amen.

O All-Holy Trinity, have mercy on us. Lord, cleanse us from our sins. Master, pardon our transgressions. Holy One, visit and heal our infirmities for Thy Name's sake.

Lord, have mercy. Lord, have mercy. Lord, have mercy.

Glory to the Father, and to the Son, and to the Holy Spirit, both now and ever, and unto the ages of ages. Amen.

Our Father, Who art in heaven, hallowed be Thy Name. Thy Kingdom come; Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from the evil one. 

For Thine is the Kingdom, and the power, and the glory, of the Father, and of the Son, and of the Holy Spirit, now and ever, and unto the ages of ages. Amen.`
  },
  {
    title: "The Morning Prayer of the Optina Monastery Elders",
    slug: "optina-elders-morning-prayer-peace",
    category: "morning",
    category_label: "Optina Hermitage & Spiritual Direction",
    tags: ["tradition:eastern-orthodox", "peace", "morning", "surrender", "optina-elders", "patience", "anxiety"],
    content: `> 📜 **Historical & Biblical Origin**: Composed by the holy spiritual fathers (*startsy*) of the Optina Hermitage in 19th-century Russia (including St. Ambrose and St. Macarius), this prayer has become one of Christianity's most beloved petitions for spiritual peace, calm temperament, and absolute trust in Divine Providence.
> 🕯️ **Liturgical Setting & Posture**: Recite this prayer every morning upon rising, before speaking to any person or looking at digital notifications. Stand quietly, allowing each sentence to calm the heart.

O Lord, grant that I may greet the coming day in peace.
Help me in all things to rely upon Thy holy will.
In every hour of this day, reveal unto me Thy guidance and preserve me.

Whatever tidings I may receive today, teach me to accept them with tranquility of soul and the firm conviction that Thy holy will governeth all things.

In all my deeds and words, guide my thoughts and feelings.
In unforeseen circumstances, let me not forget that all are sent by Thee.

Teach me to act firmly and wisely with all members of my family and all whom I encounter, without confounding or embittering any.

O Lord, grant me the strength to bear the fatigue of the coming day and all that it shall bring.
Direct my will, and teach me to pray, to believe, to hope, to endure, to forgive, and to love. Amen.`
  },
  {
    title: "St. Isaac the Syrian's Prayer for the Entire Creation and a Merciful Heart",
    slug: "st-isaac-syrian-prayer-entire-creation-compassion",
    category: "historical",
    category_label: "Syriac Mysticism & Patristics",
    tags: ["tradition:syriac", "century:7th", "creation", "compassion", "mercy", "nature", "animals", "patristic"],
    content: `> 📜 **Historical & Biblical Origin**: St. Isaac the Syrian (Bishop of Nineveh, 7th century) wrote profound spiritual homilies on the "merciful heart" (*libba rahmana*). His mystical theology sees the divine love embracing not just humanity, but animals, birds, enemies, and all created cosmos.
> 🕯️ **Liturgical Setting & Posture**: Best prayed in nature, during quiet contemplation at dawn, or when interceding for the healing of animals, troubled souls, and the suffering world.

What is a merciful heart?
It is a heart on fire for the whole of creation,
for humanity, for the birds, for the animals,
for the demons, and for all that exists.

By the recollection of them, the eyes of a merciful person pour forth tears in abundance.
By reason of the vehemence and intensity of the compassion that grips the heart,
and by its great endurance, the heart is made small, and cannot bear to hear or see
any injury or the slightest sorrow suffered by anything in creation.

For this reason, offering prayers also for animals, for the enemies of truth,
and for those who harm it, at every hour with tears,
that they may be guarded and granted mercy;
and so too for the reptiles, out of the immense compassion that is poured out in the heart
without measure in the likeness of God.

O Lord God of mercy and compassion, soften our stony hearts.
Kindle within us this holy flame of love, that we may see Thy glory in all Thou hast created,
and walk upon the earth with tender reverence, harming nothing,
and reflecting the universal charity of Jesus Christ our Savior. Amen.`
  },

  // =========================================================================
  // MONASTIC OFFICES & SCHOLASTIC / MYSTICAL CLASSICS
  // =========================================================================
  {
    title: "St. Thomas Aquinas' Student Prayer Before Study and Exams (Creator Ineffabilis)",
    slug: "st-thomas-aquinas-prayer-before-study-exams",
    category: "guidance",
    category_label: "Dominican & Scholastic Wisdom",
    tags: ["tradition:dominican", "century:13th", "exams", "study", "wisdom", "intellect", "students", "thomas-aquinas"],
    content: `> 📜 **Historical & Biblical Origin**: Composed by St. Thomas Aquinas (1225–1274), the "Angelic Doctor" and Patron Saint of students, academies, and universities. Legend states he recited this prayer daily before dictating the *Summa Theologiae* and lecturing at the University of Paris.
> 🕯️ **Liturgical Setting & Posture**: Recite while sitting or kneeling at your study desk before opening textbooks, entering an examination hall, beginning research, or preparing a lecture.

Creator ineffable, who out of the treasures of Thy wisdom hast appointed three hierarchies of angels and placed them in wonderful order above the highest heaven, and hast disposed the diverse parts of the universe in such marvelous harmony:

Thou, who art called the true Fountain of Light and Source of Wisdom, deign to cast a beam of Thy brightness upon the darkness of my intellect, removing from me the double darkness of sin and ignorance in which I was born.

Thou, who makest eloquent the tongues of little children, fashion my words and pour upon my lips the grace of Thy blessing.

Grant me sharpness in understanding, capacity for retaining, subtlety in interpreting, facility in learning, and copious grace in speaking.

Guide the beginning of my work, direct its progress, and bring it to a happy completion, through Christ our Lord. Amen.`
  },
  {
    title: "The Daily Examen and Suscipe Offering of St. Ignatius of Loyola",
    slug: "st-ignatius-loyola-daily-examen-suscipe",
    category: "evening",
    category_label: "Ignatian Discernment & Contemplation",
    tags: ["tradition:jesuit", "century:16th", "examen", "evening", "discernment", "suscipe", "peace", "surrender"],
    content: `> 📜 **Historical & Biblical Origin**: Established in the *Spiritual Exercises* of St. Ignatius of Loyola (1491–1556), the Examen is a daily five-step prayerful review of God's presence throughout the day's events, culminating in the complete surrender of the *Suscipe*.
> 🕯️ **Instructions for the 5 Steps**: Sit in stillness for 10-15 minutes at twilight or before bed. Move deliberately through each station:

**Step 1: Thanksgiving & Gratitude**
"Lord, I pause to thank You for every breath, every kindness, and every hidden grace of this day..."

**Step 2: Petition for Light**
"Come, Holy Spirit, illuminate my memory. Let me see my day not through the lens of self-deception or harsh judgment, but through Your eyes of mercy."

**Step 3: Review of the Day**
"Where did I experience Your peace, patience, and love today? Where was I hurried, angry, selfish, or defensive? I walk hour-by-hour through my encounters."

**Step 4: Repentance & Healing**
"Father, for the moments I turned away from grace, forgive me. Wash my heart in the cleansing blood of Jesus."

**Step 5: Hope & Offering for Tomorrow (The Suscipe)**
Take, Lord, and receive all my liberty,
my memory, my understanding, and my entire will,
all that I have and possess.

Thou hast given all to me; to Thee, O Lord, I return it.
All is Thine; dispose of it wholly according to Thy will.
Give me only Thy love and Thy grace; for this is sufficient for me,
and I ask for nothing more. Amen.`
  },
  {
    title: "St. Teresa of Avila's Bookmark Prayer (Nada Te Turbe)",
    slug: "st-teresa-avila-bookmark-prayer-nada-te-turbe",
    category: "peace",
    category_label: "Carmelite Mysticism",
    tags: ["tradition:carmelite", "century:16th", "peace", "anxiety", "teresa-of-avila", "overwhelmed", "trust"],
    content: `> 📜 **Historical & Biblical Origin**: Found handwritten in the prayer breviary bookmark of St. Teresa of Ávila (1515–1582), Doctor of the Church and reformer of the Carmelite Order, after her death in Alba de Tormes.
> 🕯️ **Liturgical Setting & Posture**: When struck by sudden panic, heartbreak, economic fear, or illness, breathe deeply and repeat these holy lines slowly three times.

Let nothing disturb you,
Let nothing frighten you,
All things are passing away:
God never changes.

Patience obtains all things.
Whoever has God lacks nothing;
God alone suffices.

*(Solo Dios basta)*

O God, who didst kindle in the heart of Blessed Mother Teresa an unquenchable flame of divine love, anchor my restless soul in Thy unchanging eternity. When the ground trembles beneath my feet and shadows lengthen over my life, remind me that Thou art my unchanging rock, my eternal reward, and my everlasting peace. 

Through Christ our Lord. Amen.`
  },
  {
    title: "Night Prayer of Compline (The Liturgy of the Hours Before Sleep)",
    slug: "night-prayer-compline-liturgy-of-the-hours",
    category: "evening",
    category_label: "Liturgy of the Hours & Canonical Office",
    tags: ["tradition:benedictine", "liturgy-of-the-hours", "night", "sleep", "insomnia", "nunc-dimittis", "psalm-91"],
    content: `> 📜 **Historical & Biblical Origin**: Compline (*Completorium*, meaning completion) has been the universal night prayer of the Christian Church since the Rule of St. Benedict (c. 530 AD), uniting the protective shelter of Psalm 91 with the Canticle of Simeon (*Nunc Dimittis*, Luke 2:29-32).
> 🕯️ **Liturgical Setting & Posture**: Dim all lights in the bedroom. Light a single candle. Make the Sign of the Cross at the opening versicle.

**Opening Versicle:**
V. The Lord Almighty grant us a quiet night and a perfect end.
R. Amen.

V. Our help is in the name of the Lord.
R. Who made heaven and earth.

**The Psalm of Nocturnal Protection (Psalm 91:4-6):**
He will cover you with His feathers,
and under His wings you will find refuge;
His faithfulness will be your shield and rampart.
You will not fear the terror of night,
nor the arrow that flies by day,
nor the pestilence that stalks in the darkness,
nor the plague that destroys at midday.

**The Canticle of Simeon (Nunc Dimittis):**
Now, Master, You may let Your servant go in peace,
according to Your word.
For my eyes have seen Your salvation,
which You have prepared in the presence of all peoples:
A light for revelation to the Gentiles,
and the glory of Your people Israel.

**Concluding Prayer:**
Visit this house, we beseech Thee, O Lord, and drive far from it all snares of the enemy. Let Thy holy angels dwell herein to preserve us in peace, and let Thy blessing be always upon us. Through Jesus Christ our Lord, who liveth and reigneth with Thee in the unity of the Holy Spirit, God, for ever and ever. Amen.`
  },
  {
    title: "St. Benedict's Prayer for Daily Work and Overcoming Temptation (Ora et Labora)",
    slug: "st-benedict-prayer-daily-work-overcoming-temptation",
    category: "work",
    category_label: "Benedictine Tradition & Labor",
    tags: ["tradition:benedictine", "century:6th", "work", "focus", "spiritual-warfare", "ora-et-labora", "discipline"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in the 6th-century Rule of Saint Benedict, father of Western monasticism and Patron Saint of Europe, this prayer sanctifies daily manual and intellectual labor according to the timeless maxim: *Ora et Labora* (Pray and Work).
> 🕯️ **Liturgical Setting & Posture**: Recite at the start of your shift, workday, or farm labor. Carry or touch the Cross of St. Benedict.

Gracious and Holy Father,
grant us intellect to understand Thee,
reason to discern Thee,
diligence to seek Thee,
wisdom to find Thee,
a spirit to know Thee,
a heart to meditate upon Thee,
and hands willing to labour for Thy glory.

Let the light of Thy presence sanctify the tasks before us this day. Let our labor not be driven by vain ambition or anxiety for wealth, but by a holy desire to serve our neighbors, provide honest bread for our households, and cultivate the earth Thou hast entrusted to our care.

Crux Sacra Sit Mihi Lux! (May the Holy Cross be my light!)
Non Draco Sit Mihi Dux! (May the dragon never be my guide!)

Ward away from our workplace the whispers of malice, envy, bitterness, and despair. Keep us steadfast in charity, faithful in duty, and vigilant in prayer, until the day's labor is accomplished and our rest is sweet in Thy peace. Through Christ our Lord. Amen.`
  },

  // =========================================================================
  // LIFE MILESTONES, OCCASIONS & CRITICAL VOCATIONS
  // =========================================================================
  {
    title: "Blessing of a Motor Vehicle and Driver's Protection (In Honor of St. Christopher)",
    slug: "blessing-motor-vehicle-drivers-protection-st-christopher",
    category: "travel",
    category_label: "Travel & Vehicle Blessings",
    tags: ["occasion:driving", "travel", "protection", "car-blessing", "st-christopher", "safety", "highway"],
    content: `> 📜 **Historical & Biblical Origin**: St. Christopher (*Christ-bearer*) has been invoked by travelers, wayfarers, and drivers since antiquity to preserve travelers from sudden peril on highways, bridges, and mountain passes.
> 🕯️ **Instructions & Ritual**: Sit inside the vehicle with ignition off or stand beside it. Make the Sign of the Cross over the steering wheel and dashboard with holy water if available, placing a St. Christopher medal in the car.

O God, who art present everywhere and whose watchful providence oversees every road, sea, and highway:

Hear our prayers and bless this vehicle. Appoint Thy holy angels to accompany all who travel within it, guarding them against mechanical failure, hazardous roads, careless drivers, and unforeseen perils.

Grant, O Lord, to the driver a steady hand, clear eyes, a patient temperament, and a sober mind. Restrain within us all reckless haste, anger on the road, and selfish driving. Teach us so to use this vehicle as never to endanger the lives of others, but to bring aid to those in need and return safely to our loved ones.

As Saint Christopher bore the Christ-child across the rushing torrent, may we carry Thy loving presence wherever our journey leads.

May the blessing of Almighty God, the Father, the Son, and the Holy Spirit, descend upon this vehicle and remain with all who ride within it, now and for evermore. Amen.`
  },
  {
    title: "Solemn Renewal of Marital Covenant (For 25th or 50th Wedding Anniversaries)",
    slug: "wedding-anniversary-renewal-of-vows-25th-50th",
    category: "marriage",
    category_label: "Sacraments & Milestones",
    tags: ["occasion:anniversary", "marriage", "covenant", "silver-anniversary", "golden-anniversary", "fidelity", "love"],
    content: `> 📜 **Historical & Biblical Origin**: The Sacrament of Matrimony reflects the eternal, self-giving covenant between Christ and His Church (Ephesians 5:25-33). This prayer is designed for spouses renewing their mutual dedication after decades of shared trials, sorrows, and joy.
> 🕯️ **Liturgical Setting & Posture**: Husband and wife stand facing each other before the home crucifix or parish altar, joining their right hands, reciting these solemn words together.

Eternal God, Creator and Preserver of all mankind, Giver of all spiritual grace, the Author of everlasting life:

On this blessed anniversary day, we stand before Thy presence in awe and gratitude for the years Thou hast granted us to walk together as husband and wife.

Through seasons of youth and aging, through sickness and health, through joy and sorrow, through abundance and hardship, Thy grace has been the mortar holding our house firm upon the rock.

Where we have failed each other in patience, forgive us. Where we have grown weary, rekindle within our hearts the sacred flame of our youth, refined now by the gold of mature fidelity and mutual forgiveness.

We renew this day the solemn promises of our wedding day: to love, honor, cherish, and comfort each other, in unswerving loyalty, until death parts our earthly journey.

Bless our children, our home, and our descendants. Grant that the remainder of our earthly days may shine with peace, holiness, and steadfast hope, until we are united together at the eternal Marriage Supper of the Lamb. Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Quinceañera & Coming-of-Age Rite of Thanksgiving and Consecration",
    slug: "quinceanera-coming-of-age-thanksgiving-consecration",
    category: "children",
    category_label: "Youth & Coming of Age",
    tags: ["occasion:quinceanera", "milestone:15th-birthday", "youth", "consecration", "chastity", "daughter", "blessing"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in ancient biblical rites of dedication and Catholic Hispanic tradition (*Misa de Acción de Gracias*), marking the transition of a young woman from childhood into religious and social maturity, modeling the fidelity of the Virgin Mary at the Annunciation (Luke 1:38).
> 🕯️ **Liturgical Setting & Posture**: The celebrant or parents lay their hands upon the youth's head while she kneels before the altar or image of Our Lady of Guadalupe.

Heavenly Father, I praise and thank Thee for the precious gift of my life,
and for bringing me safely to this milestone of fifteen years.

I thank Thee for my parents, whose sacrifices, prayers, and sleepless nights have nurtured me; for my godparents, family, and community whose love has sustained me.

Today, as I leave behind the days of my childhood and step into the responsibilities of young womanhood, I place my future, my body, my heart, and my mind entirely into Thy holy hands.

Give me the courage to walk in purity, the wisdom to choose righteous companions, and the strength to resist the fleeting temptations of this world. Like the Blessed Virgin Mary, may I always answer Thy divine call with a joyful and fearless "Yes: Behold the handmaid of the Lord, be it done unto me according to Thy word."

Keep me steadfast in the Catholic faith, generous toward the poor, and faithful in prayer, that my life may bring honor to my family and glory to Thy Holy Name. Through Christ our Lord. Amen.`
  },
  {
    title: "Solemn Blessing and Consecration of a New Business, Farm, or Livelihood",
    slug: "blessing-new-business-farm-enterprise-consecration",
    category: "work",
    category_label: "Business & Economic Enterprise",
    tags: ["occasion:new-business", "work", "finances", "blessing", "integrity", "prosperity", "farm"],
    content: `> 📜 **Historical & Biblical Origin**: From the *Rituale Romanum* for the blessing of newly established places of commerce, workshops, and agriculture, invoking Deuteronomy 28:8: "The Lord shall command the blessing upon thee in thy storehouses, and in all that thou settest thine hand unto."
> 🕯️ **Instructions & Ritual**: Walk through the rooms of the office, shop, or perimeter of the field, sprinkling holy water or blessed salt in each quadrant.

O Almighty God, Lord of heaven and earth, who hast commanded mankind to work with diligence and to deal with justice and fairness toward one another:

We beseech Thee to look with favor upon this new enterprise and place of work. Fill these offices, counters, rooms, and fields with the grace of Thy Holy Spirit.

Let honesty, fairness, and generosity govern every transaction conducted beneath this roof. Preserve our hearts from the snare of greed, deceit, and unrighteous gain. Grant that our employees may be treated with dignity, receiving fair wages and safe protection, and that all who do business with us may experience integrity and goodwill.

Shield this building and enterprise from fire, flood, fraud, vandalism, and all economic ruin. Crown our honest sweat and toil with such prosperity as shall provide for our families and enable us to be generous patrons to the poor and to the works of Thy Holy Church.

May the Archangel Saint Michael defend this enterprise against all malice, and may Saint Joseph the Worker guide all our decisions. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.`
  },
  {
    title: "Retirement Blessing and Transition into the Season of Wisdom",
    slug: "retirement-blessing-entering-season-of-wisdom",
    category: "guidance",
    category_label: "Life Transitions & Elderhood",
    tags: ["occasion:retirement", "life-transition", "elderhood", "wisdom", "peace", "legacy", "thanksgiving"],
    content: `> 📜 **Historical & Biblical Origin**: Reflects the biblical transition from secular striving to the wisdom of elderhood (Psalm 92:14: "They shall still bring forth fruit in old age; they shall be fat and flourishing"), dedicating the golden years to intercession and guidance.
> 🕯️ **Liturgical Setting & Posture**: Prayed on the final day of formal employment or during a retirement thanksgiving dinner with family and colleagues.

Lord God of our fathers,
Thou hast accompanied my steps through all the years of my earthly labor.
Thou hast been with me in the pressure of deadlines, the sweat of difficult days,
the triumph of honest accomplishments, and the humbling lessons of failure.

Now, as I close the door upon this season of formal career and employment,
I surrender into Thy hands all titles, offices, and striving.
I thank Thee for the strength that sustained me, the colleagues who walked with me,
and the daily bread Thou didst faithfully provide for my household.

Lord, let this not be an entrance into idleness or selfish ease,
but a holy consecration into the fruitful season of wisdom.
Teach me how to number my days, that I may apply my heart unto wisdom.

Use my remaining years, my free hours, and my life's experience to mentor the young,
to comfort the lonely, to pray unceasingly for my descendants and the Church,
and to prepare my soul in peace for the eternal home Thou hast prepared for me.
Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Prayer for a Soldier or Servicemember Deployed in Harm's Way (The Psalm 91 Shield)",
    slug: "prayer-soldier-servicemember-deployed-combat-protection",
    category: "protection",
    category_label: "Military & National Defense",
    tags: ["profession:military", "soldier", "combat", "protection", "st-michael", "deployed", "peace"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Psalm 91, the traditional soldier's armor, and Saint Michael the Archangel, Patron of armed forces and warriors for righteousness.
> 🕯️ **Liturgical Setting & Posture**: Prayed by deployed soldiers before patrol or combat operations, and by family members keeping vigil back home.

O Lord God of Hosts, Commander of the armies of heaven,
Thou who art the rock of my refuge and the horn of my salvation:

Cover with the shadow of Thy wings our soldiers, sailors, airmen, and marines deployed in foreign lands and dangerous waters. Stand beside them in the hour of battle, amidst incoming fire, explosive ambushes, and hidden traps.

Send Saint Michael the Archangel, invincible warrior of heaven, to surround them with a legion of holy angels. Give to our warriors clear judgment under pressure, courage when terror strikes, and compassionate discipline to protect the innocent and restrain unnecessary violence.

Guard their minds from the wounds of trauma, desolation, and despair. Keep their hearts gentle and their faith unshakeable.

Preserve them in life and limb, and bring them home safely to the embrace of their families and children, that they may live in peace and give Thee glory. Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Prayer of Grandparents for Grandchildren Across Generations",
    slug: "grandparents-prayer-for-grandchildren-generations",
    category: "family",
    category_label: "Family Generations & Heritage",
    tags: ["family", "grandchildren", "grandparents", "intercession", "heritage", "faith-passing", "st-joachim-anne"],
    content: `> 📜 **Historical & Biblical Origin**: Inspired by Saints Joachim and Anne, parents of the Blessed Virgin Mary and grandparents of Jesus Christ, invoking the generational promises of Psalm 103:17: "The mercy of the Lord is from everlasting to everlasting upon them that fear him, and his righteousness unto children's children."
> 🕯️ **Liturgical Setting & Posture**: Hold photographs of your grandchildren before the family altar or during Eucharistic Adoration.

O Blessed Saints Joachim and Anne, parents of Mary and grandparents of our Savior Jesus Christ:

Look with tenderness upon our grandchildren whom we love beyond measure.
In this noisy, confusing, and tempting world, preserve their youthful innocence.
Shield them from the subtle deceptions of the culture, the snare of digital addictions,
and the loss of religious faith.

When our earthly voices can no longer reach them, let the silent power of our prayers surround them like an invisible fortress. When they face moral dilemmas, whispered temptations, or lonely despairs, send their Guardian Angels to whisper words of truth and courage.

Grant to us, their grandparents, the patience to listen, the wisdom to counsel without judging, and the grace to be living examples of joyful, steadfast Catholic faith.

Keep all our family lineage rooted in the vine of Christ, until one day we stand together before the heavenly throne, not one child lost. Through Christ our Lord. Amen.`
  },
  {
    title: "Prayer of Deliverance from Spiritual Oppression and Demonic Harassment",
    slug: "deliverance-prayer-spiritual-oppression-demonic-harassment",
    category: "spiritual-warfare",
    category_label: "Spiritual Warfare & Deliverance",
    tags: ["spiritual-warfare", "deliverance", "st-michael", "protection", "evil", "oppression", "jesus-name"],
    content: `> 📜 **Historical & Biblical Origin**: Formulated from the ancient Catholic rites of deliverance approved for the laity (Auxilium Christianorum), invoking the supreme Authority of the Holy Name and Precious Blood of Jesus Christ (Philippians 2:9-10).
> 🕯️ **Instructions & Posture**: Stand firmly with back straight, holding a crucifix or the Medal of Saint Benedict in the right hand. Recite with calm, absolute faith, making the Sign of the Cross at every † symbol.

In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.

In the Name of Jesus Christ, our Lord and God, through the intercession of the Immaculate Virgin Mary, Mother of God, of Saint Michael the Archangel, of the holy Apostles Peter and Paul, and of all the Saints:

I claim the cleansing, protective, and redeeming Blood of Jesus Christ over myself, my family, my mind, my body, my home, and my property.

Any spirit of fear, panic, anxiety, lust, depression, suicide, addiction, division, or malice that seeks to oppress me: I bind you in the Name of Jesus Christ! †
I strip you of all authority, power, and influence over my life.
I command you, by the power of the living God, to depart immediately and go directly to the feet of Jesus Christ, never to return.

The Precious Blood of Jesus stands between me and every power of darkness!
The Cross of Christ is my shield and my victory! †

Father in heaven, fill every room of my heart and home with Thy Holy Spirit. Surround us with Thy holy warrior angels, and let Thy peace which passes all understanding guard our hearts and minds in Christ Jesus our Lord. Amen.`
  },
  {
    title: "Prayer for Reconciliation Between Estranged Relatives and Siblings",
    slug: "prayer-reconciliation-estranged-relatives-siblings",
    category: "family",
    category_label: "Family Reconciliation & Forgiveness",
    tags: ["family", "reconciliation", "estranged", "siblings", "forgiveness", "healing", "peace", "quarrels"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in Christ's teaching on the Sermon on the Mount (Matthew 5:23-24) and the reconciliation of Jacob and Esau (Genesis 33), invoking the healing of ancient family wounds, inheritance disputes, and unspoken bitterness.
> 🕯️ **Liturgical Setting & Posture**: Light a white reconciliation candle. Place the names of estranged brothers, sisters, parents, or in-laws before Christ, holding no desire for self-justification.

Lord Jesus Christ, Prince of Peace,
Who didst pray on the cross for those who pierced Thee:
"Father, forgive them, for they know not what they do."

I bring before Thy sacred wounds the brokenness and silence in my family.
Thou knowest the pain of estrangement, the harsh words spoken,
the pride that refuses to bend, and the years of lost love and shared meals.

Lord, where I have been at fault—by anger, coldness, self-righteousness,
or lack of charity—give me the humility to recognize it and the grace to apologize.
Where I have been wounded, I choose today, by an act of my will,
to release every grievance, grudge, and resentment into Thy hands.
I forgive [Name], as Thou hast forgiven me.

Melt the ice of silence between our hearts. Break down the walls of suspicion and mistrust.
Give us an opportunity to speak with gentleness, to listen without defense,
and to restore the bond of kinship which Thou didst establish from our mother's womb.

Let Thy cross be the bridge across the chasm of our estrangement.
Through Christ our Lord. Amen.`
  }
];

async function seedEncyclopedicPrayersPart2() {
  console.log(`Starting to seed ${ENCYCLOPEDIC_PRAYERS_PART2.length} encyclopedic prayers (Part 2)...`);

  for (const prayer of ENCYCLOPEDIC_PRAYERS_PART2) {
    try {
      const existing = await prisma.prayer.findFirst({
        where: { slug: prayer.slug }
      });

      if (existing) {
        await prisma.prayer.update({
          where: { id: existing.id },
          data: {
            title: prayer.title,
            category: prayer.category,
            category_label: prayer.category_label,
            content: prayer.content,
            tags: prayer.tags,
            is_active: true
          }
        });
        console.log(`Updated prayer: "${prayer.title}"`);
      } else {
        const created = await prisma.prayer.create({
          data: {
            title: prayer.title,
            slug: prayer.slug,
            category: prayer.category,
            category_label: prayer.category_label,
            content: prayer.content,
            tags: prayer.tags,
            is_active: true
          }
        });
        console.log(`Created prayer [ID: ${created.id}]: "${prayer.title}"`);
      }
    } catch (err) {
      console.error(`Error processing prayer "${prayer.title}":`, err.message);
    }
  }

  const count = await prisma.prayer.count();
  console.log(`Done! Total prayers in database: ${count}`);
}

seedEncyclopedicPrayersPart2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
