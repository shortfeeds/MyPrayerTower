const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../../node_modules/@prisma/client'));
const prisma = new PrismaClient();

const ENCYCLOPEDIC_PRAYERS_PART3 = [
  // =========================================================================
  // MONASTIC & CANONICAL HOURS (LITURGY OF THE HOURS)
  // =========================================================================
  {
    title: "Dawn Office of Lauds: The Benedictus Canticle of Zechariah",
    slug: "dawn-office-lauds-benedictus-canticle-zechariah",
    category: "morning",
    category_label: "Liturgy of the Hours & Canonical Office",
    tags: ["liturgy-of-the-hours", "morning", "lauds", "benedictus", "sunrise", "praise", "scripture"],
    content: `> 📜 **Historical & Biblical Origin**: Lauds (*Laudes*, Morning Praises) is the traditional dawn hinge of the Divine Office, sanctifying the first rays of light with the canticle of the priest Zechariah upon the birth of John the Baptist (Luke 1:68-79).
> 🕯️ **Liturgical Setting & Posture**: Stand facing East at sunrise. Make the Sign of the Cross at the opening verse: "Blessed be the Lord, the God of Israel."

**Opening Versicle:**
V. O God, come to my assistance.
R. O Lord, make haste to help me.
Glory to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and will be for ever. Amen. Alleluia.

**The Canticle of Zechariah (Benedictus - Luke 1:68-79):**
Blessed be the Lord, the God of Israel;
for He has come to His people and set them free.
He has raised up for us a mighty Savior,
born of the house of His servant David.

Through His holy prophets He promised of old
that He would save us from our enemies,
from the hands of all who hate us.
He promised to show mercy to our fathers
and to remember His holy covenant.

This was the oath He swore to our father Abraham:
to set us free from the hands of our enemies,
free to worship Him without fear,
holy and righteous in His sight all the days of our life.

And you, child, shall be called the prophet of the Most High,
for you will go before the Lord to prepare His way,
to give His people knowledge of salvation
by the forgiveness of their sins.

In the tender compassion of our God
the dawn from on high shall break upon us,
to shine on those who dwell in darkness and the shadow of death,
and to guide our feet into the way of peace.

**Concluding Collect:**
Lord God, King of heaven and earth, direct and sanctify, rule and govern our hearts and bodies, our thoughts, words, and deeds this day in Thy law and in the work of Thy commandments; that here and in eternity, by Thy help, we may be saved and freed, O Savior of the world, who livest and reignest for ever and ever. Amen.`
  },
  {
    title: "The Midday Office of Sext: Consecration of Noon Labor and the Passion Hour",
    slug: "midday-office-sext-noon-labor-passion-hour",
    category: "work",
    category_label: "Liturgy of the Hours & Canonical Office",
    tags: ["liturgy-of-the-hours", "work", "noon", "sext", "cross", "passion", "midday"],
    content: `> 📜 **Historical & Biblical Origin**: The Sixth Hour (*Sext*, approximately 12:00 noon) commemorates the moment Jesus was nailed to the Cross on Mount Calvary when darkness covered the whole earth (Luke 23:44). It calls workers to pause mid-day, release workplace anxiety, and consecrate the second half of the working day.
> 🕯️ **Liturgical Setting & Posture**: Stop all work and screens at noon. Sit or stand quietly for two minutes before a crucifix.

**Opening:**
V. O God, come to my assistance.
R. O Lord, make haste to help me.
Glory to the Father, and to the Son, and to the Holy Spirit. Amen.

**The Passion Noon Hymn:**
O God of truth, O Lord of might,
Who orderest time and change aright,
Who send'st the early morning ray,
And light'st the glow of perfect day:

Extinguish Thou each sinful fire,
And banish every ill desire;
And while Thou keep'st the body whole,
Shed forth Thy peace upon the soul.

**Midday Psalmody (Psalm 121):**
I lift up my eyes to the mountains;
from where shall come my help?
My help comes from the Lord,
who made heaven and earth.
He will not let your foot be moved,
and He who watches over you will not sleep.
The sun shall not strike you by day,
nor the moon by night.
The Lord shall preserve you from all evil;
He shall preserve your soul.
The Lord shall preserve your going out and your coming in,
from this time forth and for evermore.

**Prayer:**
Lord Jesus Christ, who at the sixth hour didst mount the wood of the Cross for the redemption of the world, and didst stretch out Thine innocent hands in love: forgive our past shortcomings, strengthen our weary hands for the remainder of this day's work, and keep our hearts anchored in Thy peace. Who livest and reignest world without end. Amen.`
  },
  {
    title: "Evening Vespers: The Magnificat Canticle of the Blessed Virgin Mary",
    slug: "evening-vespers-magnificat-canticle-mary",
    category: "evening",
    category_label: "Liturgy of the Hours & Canonical Office",
    tags: ["liturgy-of-the-hours", "evening", "vespers", "magnificat", "mary", "thanksgiving", "twilight"],
    content: `> 📜 **Historical & Biblical Origin**: Vespers (*Lucernarium*, Evening Evening Praise) is recited at twilight as the lamps are lit, singing Mary's revolutionary hymn of praise from the Visitation (Luke 1:46-55), proclaiming God's mercy to the poor and humble.
> 🕯️ **Liturgical Setting & Posture**: Stand facing the window or domestic altar as evening falls. Make the Sign of the Cross at the words: "My soul proclaims the greatness of the Lord."

**Opening:**
V. O God, come to my assistance.
R. O Lord, make haste to help me.
Glory to the Father, and to the Son, and to the Holy Spirit. Amen.

**The Canticle of the Blessed Virgin Mary (Magnificat - Luke 1:46-55):**
My soul proclaims the greatness of the Lord,
my spirit rejoices in God my Savior;
for He has looked with favor on His lowly servant.

From this day all generations will call me blessed:
the Almighty has done great things for me,
and holy is His Name.

He has mercy on those who fear Him
in every generation.
He has shown the strength of His arm,
He has scattered the proud in their conceit.

He has cast down the mighty from their thrones,
and has lifted up the lowly.
He has filled the hungry with good things,
and the rich He has sent away empty.

He has come to the help of His servant Israel
for He has remembered His promise of mercy,
the promise He made to our fathers,
to Abraham and his children for ever.

Glory to the Father, and to the Son, and to the Holy Spirit:
as it was in the beginning, is now, and will be for ever. Amen.

**Evening Collect:**
Stay with us, Lord, for it is almost evening and the day is now far spent. Be our light in the darkness, our solace in solitude, and our companion on the road of life. For Thou livest and reignest with the Father and the Holy Spirit, God, for ever and ever. Amen.`
  },

  // =========================================================================
  // CLASSICAL DOCTORS & MYSTICS
  // =========================================================================
  {
    title: "St. John of the Cross: Prayer in the Dark Night of the Soul and Spiritual Aridity",
    slug: "st-john-of-the-cross-dark-night-soul-prayer",
    category: "peace",
    category_label: "Carmelite Mysticism & Aridity",
    tags: ["tradition:carmelite", "century:16th", "dark-night", "aridity", "depression", "john-of-the-cross", "contemplation"],
    content: `> 📜 **Historical & Biblical Origin**: Written by Saint John of the Cross (1542–1591), Doctor of the Church and Carmelite reformer, addressing the painful season when sensible consolations disappear, prayer feels dry as dust, and God feels utterly distant.
> 🕯️ **Instructions & Posture**: Kneel in silence with open empty hands resting upon your knees. Do not force words or seek emotional highs; rest in bare, passive faith.

O Divine Beloved, Lord of the Dark Night:

My soul is parched like a desert land without water. The sweetness I once tasted in prayer has vanished; the fervor of my youth has grown cold; and shadows seem to enclose my spirit on every side.

Yet I know by faith that this darkness is not Thine absence, but the blinding excess of Thy divine light, purifying the secret corners of my soul from self-love, spiritual pride, and attachment to earthly consolations.

I surrender to this holy darkness. I ask not for sensible sweetness, nor for visions, nor for consolations. Give me only the grace of steadfast endurance.

Teach me to abide in quiet, peaceful, and loving attentiveness toward Thee, without anxiety to produce thoughts or perform great deeds. Strip away all that is not of Thee, that my soul, empty of all creatures, may be filled with the uncreated flame of Thy divine charity.

In Thee, O Lord, have I hoped; let me never be confounded. Amen.`
  },
  {
    title: "St. Catherine of Siena: Dialogue on the Bridge of Christ Over the World",
    slug: "st-catherine-of-siena-dialogue-bridge-of-christ",
    category: "faith",
    category_label: "Dominican Mysticism",
    tags: ["tradition:dominican", "century:14th", "catherine-of-siena", "bridge-of-christ", "salvation", "mercy"],
    content: `> 📜 **Historical & Biblical Origin**: Dictated by St. Catherine of Siena (1347–1380), Doctor of the Church and Patroness of Europe, in *The Dialogue* (Treatise on Divine Providence), where the Father revealed Christ crucified as the living Bridge linking heaven and earth across the raging river of sin.
> 🕯️ **Liturgical Setting & Posture**: Stand or kneel with eyes fixed upon the Crucifix. Contemplate the Three Steps of the Bridge: the Pierced Feet (reformation of conduct), the Wounded Side (the heart of divine love), and the Holy Mouth (peace and divine union).

O Inestimable Charity!
Thou didst see our ruin, our blindness, and the stormy torrent of this world drowning Thy children in pride and despair.
And out of the sheer excess of Thy love, Thou didst build for us a Bridge:
Thy only-begotten Son, Jesus Christ!

A Bridge whose stones are mortared with His own Precious Blood,
whose roof is divine mercy sheltering us from the storm,
and whose gate is the Holy Cross.

Grant me, O Father, the courage never to step off this Bridge into the deceitful river of worldly vanity.
Let me mount the first stair: kissing the wounded feet of my Savior, leaving behind every sin.
Let me climb to the second stair: entering His pierced side, drinking deeply of the inexhaustible fountain of His divine heart.
Let me reach the third stair: resting upon His holy mouth, receiving His peace and tasting the sweetness of divine union.

O Eternal Trinity, Mystery profound, Sea into which the more I enter, the more I find, and the more I find, the more I seek! Enkindle my soul with Thy holy fire, and let my life be consumed for the honor of Thy Church. Amen.`
  },
  {
    title: "St. Francis de Sales: Prayer for Gentle Patience with Oneself and Inner Calm",
    slug: "st-francis-de-sales-gentle-patience-inner-calm",
    category: "peace",
    category_label: "Salesian Spirituality & Gentleness",
    tags: ["tradition:salesian", "century:17th", "gentleness", "patience", "anxiety", "francis-de-sales", "perfectionism"],
    content: `> 📜 **Historical & Biblical Origin**: Written by Saint Francis de Sales (1567–1622), Bishop of Geneva, Doctor of the Church, and author of the *Introduction to the Devout Life*, teaching the art of gentle humility against self-criticism, impatience, and anxiety.
> 🕯️ **Instructions & Posture**: Breathe deeply. Place a hand over your heart. Recite whenever irritated with your own moral weaknesses, failures, or slowness of spiritual progress.

O my God, teach me to be gentle toward myself.
When I stumble into faults and repeat the weaknesses I have so often wept over,
preserve my soul from the bitter storm of self-reproach, anger, and despair.

Remind me that harshness toward myself is not holy humility, but disguised pride,
which is astonished that it has fallen once again.

Give me the grace, Lord, immediately upon falling,
to rise quietly, to look up into Thy merciful face with a gentle smile of contrition,
and to say: "See, Lord, what I am capable of doing when left to myself!
Forgive me; help me to begin again this very hour."

Deliver my heart from hurry, turbulence, and scrupulous agitation.
Let me do all things with tranquil diligence, trusting that Thy grace works gently,
like the dew falling silently upon the meadows in the night.

Make my heart meek and humble, like the heart of Thy Beloved Son. Amen.`
  },

  // =========================================================================
  // SACRAMENTAL RITES FOR LAYPEOPLE
  // =========================================================================
  {
    title: "Solemn Examination of Conscience and Contrition Before Sacramental Confession",
    slug: "examination-of-conscience-contrition-confession",
    category: "repentance",
    category_label: "Sacraments & Reconciliation",
    tags: ["sacraments:confession", "reconciliation", "examination-of-conscience", "penance", "contrition", "sin", "forgiveness"],
    content: `> 📜 **Historical & Biblical Origin**: Grounded in the Catholic Church's ancient discipline for the Sacrament of Penance (Catechism of the Catholic Church §1450-1460), providing a thorough moral audit against the Ten Commandments and the Precepts of the Gospel.
> 🕯️ **Instructions**: Sit in a quiet church or chapel before entering the confessional. Review each station prayerfully, acknowledging sins without excuses, and conclude with the Act of Contrition.

**Prayer for Light:**
Come, Holy Spirit, Source of eternal light, illuminate my conscience. Reveal to me every sin, omission, and compromise I have made against God and my neighbors, and give me the sorrow of heart necessary to make a sincere confession.

**The Ten Stations of Conscience:**
1. *First Commandment*: Have I placed wealth, success, digital approval, or pleasures before God? Have I doubted His mercy or practiced superstition?
2. *Second Commandment*: Have I used the holy Name of God, Jesus, or Mary carelessly, in anger, or as a vulgar curse?
3. *Third Commandment*: Have I missed Sunday Mass or Holy Days of Obligation through my own fault? Have I kept Sunday holy as a day of family rest?
4. *Fourth Commandment*: Have I shown disrespect, coldness, or neglect to my parents, family, or lawful authorities?
5. *Fifth Commandment*: Have I harbored hatred, resentment, or a desire for revenge? Have I injured others by harsh words, road rage, or gossip? Have I harmed my own body through alcohol, drugs, or gluttony?
6. *Sixth & Ninth Commandments*: Have I entertained unchaste thoughts, watched pornography, or engaged in unchaste behavior alone or with others?
7. *Seventh & Tenth Commandments*: Have I stolen, cheated, padded expense reports, wasted company time, or envied the possessions and prosperity of others?
8. *Eighth Commandment*: Have I lied, slandered, broken confidences, or ruined another's reputation by gossip and rash judgment?

**Act of Contrition:**
O my God, I am heartily sorry for having offended Thee,
and I detest all my sins because of Thy just punishments,
but most of all because they offend Thee, my God,
who art all-good and deserving of all my love.

I firmly resolve, with the help of Thy grace,
to sin no more, to avoid the near occasions of sin,
and to do penance. Through Jesus Christ our Savior. Amen.`
  },
  {
    title: "Thanksgiving After Holy Communion: St. Bonaventure's Transfige Dulcissime Domine",
    slug: "thanksgiving-after-holy-communion-st-bonaventure",
    category: "thanksgiving",
    category_label: "Sacraments & Eucharist",
    tags: ["sacraments:eucharist", "thanksgiving", "communion", "bonaventure", "adoration", "mass"],
    content: `> 📜 **Historical & Biblical Origin**: Composed by Saint Bonaventure (1221–1274), Franciscan Cardinal, Doctor of the Church (*Doctor Seraphicus*), traditionally prayed during the quiet minutes of thanksgiving following the reception of the Holy Eucharist at Mass.
> 🕯️ **Liturgical Setting & Posture**: Kneel in reverent silence after receiving Holy Communion. Close your eyes, resting with Christ dwelling sacramentally within your bodily temple.

Pierce, O most sweet Lord Jesus,
my inmost soul with the most joyous and healthful wound of Thy love,
with true, serene, and most holy apostolic charity,
that my soul may ever languish and melt with love and longing for Thee alone.

May my soul ever thirst for Thee, the Fountain of Life,
the Fountain of Wisdom and Knowledge,
the Fountain of Eternal Light,
the Torrent of Divine Pleasure, the Fullness of the House of God.

May my soul ever hunger after Thee, the Bread of Angels,
the Refreshment of holy souls, our daily supersubstantial Bread,
having all sweetness and savor and every delightful taste.

May my heart ever thirst after Thee and drink of Thee,
upon whom the angels desire to gaze.
May my soul be filled with the sweetness of Thy presence.

Let Thee alone be ever my hope, my whole trust, my riches,
my delight, my joy, my gladness, my rest and tranquility,
my peace, my sweetness, my fragrance, my food, my refreshment,
my refuge, my help, my wisdom, my portion, my possession, my treasure,
in whom may my mind and my heart be firmly and unchangeably fixed and rooted,
henceforth and for evermore. Amen.`
  },
  {
    title: "Act of Spiritual Communion (When Unable to Attend Holy Mass in Person)",
    slug: "act-of-spiritual-communion-st-alphonsus-liguori",
    category: "faith",
    category_label: "Sacramental Devotions",
    tags: ["eucharist", "spiritual-communion", "illness", "homebound", "alphonsus-liguori", "mass", "devotion"],
    content: `> 📜 **Historical & Biblical Origin**: Authored by Saint Alphonsus Liguori (1696–1787), Doctor of the Church and founder of the Redemptorists, formulated for the sick, homebound, imprisoned, or those unable to receive the physical Sacrament of the Altar.
> 🕯️ **Liturgical Setting & Posture**: Kneel before a home crucifix, Bible, or live-streamed Mass. Cultivate an intense desire of the heart to unite with Christ.

My Jesus, I believe that Thou art present in the Most Holy Sacrament of the Altar.
I love Thee above all things, and I desire to receive Thee into my soul.

Since I cannot now receive Thee sacramentally,
come at least spiritually into my heart.

*(Pause in silence, welcoming Jesus into the center of your heart)*

I embrace Thee as if Thou wert already there,
and unite myself wholly to Thee.
Never permit me to be separated from Thee.

O Sacred Heart of Jesus, living Tabernacle of the Divinity,
dwell within my spirit this day.
Let Thy Precious Blood circulate through my intentions, thoughts, and deeds,
that though separated by distance and affliction from Thine earthly altar,
I may abide in inseparable communion with Thy divine life. Amen.`
  },

  // =========================================================================
  // MODERN CIVIC, ECONOMIC & SOCIAL CALLINGS
  // =========================================================================
  {
    title: "Prayer for Election Day: Voting with an Informed Conscience and for the Common Good",
    slug: "prayer-election-day-voting-informed-conscience",
    category: "guidance",
    category_label: "Civic Duty & Nation",
    tags: ["civic", "voting", "election", "conscience", "nation", "peace", "justice", "leaders"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in Catholic Social Teaching on faithful citizenship (1 Timothy 2:1-4 and Gaudium et Spes §75), directing the civic exercise of the vote toward the protection of human dignity, religious liberty, peace, and the vulnerable.
> 🕯️ **Liturgical Setting & Posture**: Prayed on the morning of an election before heading to polling stations or marking an absentee ballot.

Lord God of Nations, Sovereign of history and Ruler of kings:

As citizens called to participate in the governing of our society,
we stand before the ballot box with deep humility and gravity of spirit.

Send Thy Holy Spirit to illuminate our conscience.
Free our minds from political bitterness, tribal hatred, and the deception of false promises.
Grant us the wisdom to evaluate every candidate, law, and referendum not through the lens of selfish gain,
but through the timeless commandments of Thy Gospel.

Guide us to vote for the defense of human dignity from conception to natural death;
for the protection of the poor, the immigrant, the elderly, and the defenseless;
for religious liberty, justice, and the promotion of family life and the common good.

Deliver our nation from division, civil strife, violence, and corruption.
Raise up leaders with hearts of humility, integrity, and truth, who fear Thy Name and serve the people in peace.
May Thy Kingdom come and Thy righteous will be done in our land. Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Prayer During Unemployment and Persistent Job Search (In Honor of St. Cajetan)",
    slug: "prayer-unemployment-job-search-st-cajetan",
    category: "work",
    category_label: "Employment & Career Crises",
    tags: ["work", "unemployment", "job-search", "interviews", "st-cajetan", "finances", "career"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Saint Cajetan (1480–1547), Patron Saint of the unemployed and job seekers, renowned for his radical trust in Divine Providence when human resources failed.
> 🕯️ **Instructions & Posture**: Recite each morning before submitting job applications, attending interviews, or networking. Hold a resume or work credentials before God.

Glorious Saint Cajetan, Father of Divine Providence,
who didst trust unreservedly that God feeds the birds of the air and clothes the lilies of the field:

Look with compassion upon my present affliction.
Thou knowest the heavy burden of unemployment: the rejection emails, the silence after interviews,
the economic anxiety pressing upon my family, and the loss of dignity that comes from idle hands.

Intercede for me before the Throne of God.
Open doors of honest employment suited to my skills, training, and experience.
Give me favor in the eyes of hiring managers and employers.
Help me to prepare for interviews with confidence, clarity, and peace.

When discouragement tempts me to despair, strengthen my resolve.
Remind me that my worth is rooted in being a beloved child of God, not in a job title or salary.
Provide for my daily bread this day, and grant that when employment is granted,
I may work with excellence, gratitude, and generosity toward those still seeking.
Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Prayer Before Buying, Selling, or Relocating a Family Home (In Honor of St. Joseph)",
    slug: "prayer-buying-selling-home-relocation-st-joseph",
    category: "family",
    category_label: "Home & Property Blessings",
    tags: ["home", "real-estate", "st-joseph", "relocation", "family", "house-selling", "moving"],
    content: `> 📜 **Historical & Biblical Origin**: St. Joseph, Head of the Holy Family of Nazareth, has been invoked for centuries by families seeking housing, moving to new cities, or buying and selling real estate with fairness and peace.
> 🕯️ **Instructions & Ritual**: Stand in the center of the home or on the prospective property, invoking the intercession of the Protector of the Holy Family.

O Blessed Saint Joseph, guardian of the Holy Family and builder of the home at Nazareth:

Thou who didst seek shelter in Bethlehem when there was no room at the inn,
and who didst lead Mary and the Christ Child through the foreign wilderness into Egypt:
thou knowest the anxieties of establishing a safe, peaceful roof over our household.

We place into thy hands the purchase / sale / relocation of this home.
Guide all negotiations, contracts, inspections, and financial transactions.
Preserve us from hidden defects, fraud, and unreasonable financial burdens.
Bring us buyers / sellers of goodwill, honesty, and fairness.

If it be God's will for us to dwell here, let this house become a sanctuary of Christian hospitality,
a shelter of peace for our children, and a place where Christ is always the unseen Guest.
If our path lies elsewhere, guide our footsteps to the dwelling place the Lord has prepared for us.

Saint Joseph, Pillar of Families and Protector of Homes, pray for us. Amen.`
  },
  {
    title: "St. Monica's Tears: Prayer for Wayward Adult Children Who Have Left the Faith",
    slug: "st-monica-tears-prayer-wayward-children-left-faith",
    category: "family",
    category_label: "Family & Spiritual Return",
    tags: ["family", "children", "st-monica", "conversion", "prodigal-son", "faith-loss", "mother-prayer"],
    content: `> 📜 **Historical & Biblical Origin**: Inspired by Saint Monica (332–387 AD), whose relentless tears, fasting, and intercession for seventeen years won the miraculous conversion of her wayward son, Saint Augustine of Hippo.
> 🕯️ **Liturgical Setting & Posture**: Light a vigil candle before an icon of St. Monica or the Crucifix. Name your son, daughter, or grandchild specifically, releasing all nagging and argument into prayer.

O Holy Mother Saint Monica, whose persistent tears and unceasing prayers were heard at the Throne of Grace, bringing your brilliant, wayward son Augustine out of heresy and immorality into the light of Christ:

Look with motherly compassion upon the heartbreak in my chest.
I bring before thee my beloved child, [Name], who has wandered away from the sacraments,
abandoned the Catholic faith of their youth, and embraced the empty philosophies of the world.

Thou knowest how words can fail, how lectures push hearts further away,
and how deep the wound cuts when our children reject the pearl of great price.

Join thy powerful prayers with mine. Where my voice cannot reach, let the Holy Spirit speak.
Awaken within [Name] a divine hunger that the world cannot satisfy.
Strip away the blinders of pride, cynicism, and worldly deception.
Place holy mentors, books, and provident circumstances in their path.

Give me the patience never to despair, the wisdom to love without compromise,
and the faith to believe that no soul is beyond the reach of divine mercy.
May I live to see my child return with tears of joy to the Father's house.
Through Christ our Lord. Amen.`
  },

  // =========================================================================
  // ENVIRONMENTAL & COMMUNITY EMERGENCIES
  // =========================================================================
  {
    title: "Rogation Days Litany for Bountiful Harvest, Favorable Weather, and the Soil",
    slug: "rogation-days-litany-harvest-favorable-weather",
    category: "guidance",
    category_label: "Agriculture, Creation & Seasons",
    tags: ["creation", "harvest", "agriculture", "weather", "farmers", "soil", "rogation-days", "crops"],
    content: `> 📜 **Historical & Biblical Origin**: The ancient Christian *Rogation Days* (from the Latin *rogare*, to ask) originated in 5th-century Gaul amidst volcanic eruptions and crop failures, blessing the fields, seeds, rain, and soil before harvest season.
> 🕯️ **Instructions & Ritual**: Walk the boundaries of your garden, farm, or neighborhood park at sunrise, holding blessed soil or seeds, making the Sign of the Cross over the earth.

Lord, have mercy on us.
Christ, have mercy on us.
Lord, have mercy on us.

God the Father, Creator of the soil, the rain, and the sunshine, *Have mercy on us.*
God the Son, the True Vine who feeds the branches, *Have mercy on us.*
God the Holy Spirit, who renewest the face of the earth, *Have mercy on us.*

From drought, hail, flood, frost, and unseasonable storms, *Good Lord, deliver us.*
From blight, locusts, pests, disease, and pollution of water, *Good Lord, deliver us.*
From famine, economic ruin, and the greed of monopolists, *Good Lord, deliver us.*

That it may please Thee to bless the tilled ground and fertile fields, *We beseech Thee, hear us.*
That it may please Thee to send temperate showers and gentle breezes in due season, *We beseech Thee, hear us.*
That it may please Thee to preserve the labor of farmers, ranch hands, and agricultural workers, *We beseech Thee, hear us.*
That it may please Thee to satisfy the poor with bread and teach us to share Thy abundance, *We beseech Thee, hear us.*

**Collect:**
O Almighty God, who by Thy word hast caused the earth to produce fruit in abundance for the sustenance of man: hear the prayers of Thy people, and bless the crops and fields, that our harvest may be joyful, our households nourished, and our lives devoted to Thy praise. Through Christ our Lord. Amen.`
  },
  {
    title: "Prayer for Victims of Natural Disasters: Earthquakes, Hurricanes, Fires, and Floods",
    slug: "prayer-victims-natural-disasters-hurricanes-fires-floods",
    category: "crises",
    category_label: "Emergency & Disaster Relief",
    tags: ["disaster", "hurricane", "flood", "earthquake", "wildfire", "emergency", "relief", "victims", "comfort"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Christ who calmed the wind and the waves on the Sea of Galilee (Mark 4:39), providing spiritual solidarity, emergency consolation, and intercession for emergency first responders and devastated communities.
> 🕯️ **Liturgical Setting & Posture**: Light a vigil candle of solidarity. Offer an intention for those who have lost homes, livelihoods, or loved ones in sudden catastrophe.

Lord Jesus Christ, Master of wind and sea,
Who in the boat on Galilee didst command the raging waves: "Peace, be still!"

We cry out to Thee for our brothers and sisters stricken by sudden natural catastrophe.
For those whose homes have been swallowed by floods or reduced to ashes by wildfire;
for those trapped beneath rubble in earthquakes, or displaced by roaring hurricanes and tornadoes.

Comfort the terrified children; uphold the elderly and infirm who cannot flee.
Embrace into Thine eternal light the souls of those whose lives were cut short.
Dry the tears of those weeping over ruins, possessions lost, and memories swept away.

Strengthen the hands of rescue workers, firefighters, National Guardsmen, and relief volunteers.
Open the hearts and wallets of our communities to pour forth generous aid, shelter, food, and clean water.

In the midst of ruin, let hope not be extinguished.
Remind us that while earthly dwellings perish, Thy love is our everlasting fortress,
and nothing in heaven or earth can separate us from Thy divine mercy.
Through Christ our Lord. Amen.`
  }
];

async function seedEncyclopedicPrayersPart3() {
  console.log(`Starting to seed ${ENCYCLOPEDIC_PRAYERS_PART3.length} encyclopedic prayers (Part 3)...`);

  for (const prayer of ENCYCLOPEDIC_PRAYERS_PART3) {
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

seedEncyclopedicPrayersPart3()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
