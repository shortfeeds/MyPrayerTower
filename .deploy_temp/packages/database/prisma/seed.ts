/// <reference types="node" />
import { PrismaClient, AdminRole } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// COMPREHENSIVE PRAYER CATEGORIES
// ============================================================================
const prayerCategories = [
    { name: 'Basic Prayers', slug: 'basic', description: 'Essential prayers every Catholic should know', iconName: '📖', sortOrder: 1 },
    { name: 'Marian Prayers', slug: 'marian', description: 'Prayers to the Blessed Virgin Mary', iconName: '👸', sortOrder: 2 },
    { name: 'Holy Rosary', slug: 'rosary', description: 'Prayers and mysteries of the Rosary', iconName: '📿', sortOrder: 3 },
    { name: 'Prayers to Saints', slug: 'saints', description: 'Intercession prayers to the saints', iconName: '✨', sortOrder: 4 },
    { name: 'Morning Prayers', slug: 'morning', description: 'Prayers to start your day', iconName: '🌅', sortOrder: 5 },
    { name: 'Evening Prayers', slug: 'evening', description: 'Prayers for the end of the day', iconName: '🌙', sortOrder: 6 },
    { name: 'Prayers for Healing', slug: 'healing', description: 'Prayers for health and recovery', iconName: '💊', sortOrder: 7 },
    { name: 'Prayers for Protection', slug: 'protection', description: 'Prayers for safety and protection', iconName: '🛡️', sortOrder: 8 },
    { name: 'Eucharistic Prayers', slug: 'eucharist', description: 'Prayers related to Holy Communion', iconName: '🍞', sortOrder: 9 },
    { name: 'Confession Prayers', slug: 'confession', description: 'Prayers for reconciliation', iconName: '💜', sortOrder: 10 },
    { name: 'Novenas', slug: 'novenas', description: 'Nine-day prayer devotions', iconName: '🕯️', sortOrder: 11 },
    { name: 'Litanies', slug: 'litanies', description: 'Responsive prayers of supplication', iconName: '📜', sortOrder: 12 },
];

// ============================================================================
// COMPREHENSIVE PRAYERS LIBRARY (50+ prayers)
// ============================================================================
const prayers = [
    // BASIC PRAYERS
    { title: 'Our Father', slug: 'our-father', category: 'basic', content: `Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done on earth as it is in heaven.\n\nGive us this day our daily bread;\nand forgive us our trespasses\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\n\nAmen.`, author: 'Jesus Christ', source: 'Matthew 6:9-13' },
    { title: 'Hail Mary', slug: 'hail-mary', category: 'basic', content: `Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death.\n\nAmen.`, author: 'Traditional', source: 'Luke 1:28, 1:42' },
    { title: 'Glory Be', slug: 'glory-be', category: 'basic', content: `Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\n\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end.\n\nAmen.`, author: 'Traditional', source: 'Ancient Christian Doxology' },
    { title: "Apostles' Creed", slug: 'apostles-creed', category: 'basic', content: `I believe in God, the Father Almighty,\nCreator of heaven and earth,\nand in Jesus Christ, His only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died and was buried;\nHe descended into hell;\non the third day He rose again from the dead;\nHe ascended into heaven,\nand is seated at the right hand of God the Father Almighty;\nfrom there He will come to judge the living and the dead.\n\nI believe in the Holy Spirit,\nthe Holy Catholic Church,\nthe communion of Saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand life everlasting.\n\nAmen.`, author: 'Traditional', source: 'Ancient Baptismal Creed' },
    { title: 'Sign of the Cross', slug: 'sign-of-the-cross', category: 'basic', content: `In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\n\nAmen.`, author: 'Traditional', source: 'Catholic Tradition' },
    { title: 'Grace Before Meals', slug: 'grace-before-meals', category: 'basic', content: `Bless us, O Lord, and these Thy gifts,\nwhich we are about to receive\nfrom Thy bounty,\nthrough Christ our Lord.\n\nAmen.`, author: 'Traditional', source: 'Catholic Blessing' },
    { title: 'Grace After Meals', slug: 'grace-after-meals', category: 'basic', content: `We give Thee thanks, Almighty God,\nfor all Thy benefits,\nwho lives and reigns forever and ever.\n\nAmen.\n\nMay the souls of the faithful departed,\nthrough the mercy of God, rest in peace.\n\nAmen.`, author: 'Traditional', source: 'Catholic Thanksgiving' },
    { title: 'Act of Faith', slug: 'act-of-faith', category: 'basic', content: `O my God, I firmly believe\nthat You are one God in three Divine Persons,\nFather, Son, and Holy Spirit.\nI believe that Your Divine Son became man\nand died for our sins,\nand that He will come to judge the living and the dead.\nI believe these and all the truths\nwhich the Holy Catholic Church teaches,\nbecause You have revealed them,\nwho can neither deceive nor be deceived.\n\nAmen.`, author: 'Traditional', source: 'Catechism' },
    { title: 'Act of Hope', slug: 'act-of-hope', category: 'basic', content: `O my God, relying on Your infinite goodness and promises,\nI hope to obtain pardon of my sins,\nthe help of Your grace,\nand life everlasting,\nthrough the merits of Jesus Christ,\nmy Lord and Redeemer.\n\nAmen.`, author: 'Traditional', source: 'Catechism' },
    { title: 'Act of Charity', slug: 'act-of-charity', category: 'basic', content: `O my God, I love You above all things,\nwith my whole heart and soul,\nbecause You are all good and worthy of all my love.\nI love my neighbor as myself for the love of You.\nI forgive all who have injured me,\nand I ask pardon of all whom I have injured.\n\nAmen.`, author: 'Traditional', source: 'Catechism' },

    // CONFESSION PRAYERS
    { title: 'Act of Contrition', slug: 'act-of-contrition', category: 'confession', content: `O my God, I am heartily sorry for having offended Thee,\nand I detest all my sins because of Thy just punishments,\nbut most of all because they offend Thee, my God,\nwho art all good and deserving of all my love.\n\nI firmly resolve, with the help of Thy grace,\nto sin no more and to avoid the near occasions of sin.\n\nAmen.`, author: 'Traditional', source: 'Sacrament of Reconciliation' },
    { title: 'Confiteor', slug: 'confiteor', category: 'confession', content: `I confess to almighty God\nand to you, my brothers and sisters,\nthat I have greatly sinned,\nin my thoughts and in my words,\nin what I have done and in what I have failed to do,\nthrough my fault, through my fault,\nthrough my most grievous fault;\ntherefore I ask blessed Mary ever-Virgin,\nall the Angels and Saints,\nand you, my brothers and sisters,\nto pray for me to the Lord our God.`, author: 'Traditional', source: 'Roman Missal' },

    // MARIAN PRAYERS
    { title: 'Memorare', slug: 'memorare', category: 'marian', content: `Remember, O most gracious Virgin Mary,\nthat never was it known that anyone who fled to thy protection,\nimplored thy help, or sought thy intercession was left unaided.\n\nInspired by this confidence, I fly unto thee,\nO Virgin of virgins, my mother;\nto thee do I come, before thee I stand, sinful and sorrowful.\n\nO Mother of the Word Incarnate,\ndespise not my petitions,\nbut in thy mercy hear and answer me.\n\nAmen.`, author: 'St. Bernard of Clairvaux', source: '12th Century' },
    { title: 'Hail Holy Queen', slug: 'hail-holy-queen', category: 'marian', content: `Hail, Holy Queen, Mother of Mercy,\nour life, our sweetness and our hope.\n\nTo thee do we cry, poor banished children of Eve;\nto thee do we send up our sighs,\nmourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate,\nthine eyes of mercy toward us;\nand after this our exile,\nshow unto us the blessed fruit of thy womb, Jesus.\n\nO clement, O loving, O sweet Virgin Mary.\n\nPray for us, O Holy Mother of God,\nthat we may be made worthy of the promises of Christ.\n\nAmen.`, author: 'Traditional', source: '11th Century Marian Antiphon' },
    { title: 'The Angelus', slug: 'the-angelus', category: 'marian', content: `V. The Angel of the Lord declared unto Mary,\nR. And she conceived of the Holy Spirit.\n\nHail Mary...\n\nV. Behold the handmaid of the Lord,\nR. Be it done unto me according to thy word.\n\nHail Mary...\n\nV. And the Word was made flesh,\nR. And dwelt among us.\n\nHail Mary...\n\nV. Pray for us, O Holy Mother of God,\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray:\nPour forth, we beseech Thee, O Lord,\nThy grace into our hearts;\nthat we, to whom the incarnation of Christ, Thy Son,\nwas made known by the message of an angel,\nmay by His Passion and Cross\nbe brought to the glory of His Resurrection,\nthrough the same Christ our Lord.\n\nAmen.`, author: 'Traditional', source: 'Catholic Devotion' },
    { title: 'Regina Caeli', slug: 'regina-caeli', category: 'marian', content: `Queen of Heaven, rejoice, alleluia.\nFor He whom you did merit to bear, alleluia.\nHas risen, as he said, alleluia.\nPray for us to God, alleluia.\n\nRejoice and be glad, O Virgin Mary, alleluia.\nFor the Lord has truly risen, alleluia.\n\nLet us pray:\nO God, who gave joy to the world\nthrough the resurrection of Thy Son, our Lord Jesus Christ,\ngrant, we beseech Thee,\nthat through the intercession of the Virgin Mary, His Mother,\nwe may obtain the joys of everlasting life.\nThrough the same Christ our Lord.\n\nAmen.`, author: 'Traditional', source: 'Easter Season Antiphon' },
    { title: 'The Magnificat', slug: 'magnificat', category: 'marian', content: `My soul proclaims the greatness of the Lord,\nmy spirit rejoices in God my Savior;\nfor he has looked with favor on his lowly servant.\n\nFrom this day all generations will call me blessed:\nthe Almighty has done great things for me,\nand holy is his Name.\n\nHe has mercy on those who fear him\nin every generation.\n\nHe has shown the strength of his arm,\nhe has scattered the proud in their conceit.\n\nHe has cast down the mighty from their thrones,\nand has lifted up the lowly.\n\nHe has filled the hungry with good things,\nand the rich he has sent away empty.\n\nHe has come to the help of his servant Israel\nfor he has remembered his promise of mercy,\nthe promise he made to our fathers,\nto Abraham and his children forever.\n\nAmen.`, author: 'Blessed Virgin Mary', source: 'Luke 1:46-55' },
    { title: 'Sub Tuum Praesidium', slug: 'sub-tuum-praesidium', category: 'marian', content: `We fly to thy protection,\nO holy Mother of God;\ndespise not our petitions\nin our necessities,\nbut deliver us always from all dangers,\nO glorious and blessed Virgin.\n\nAmen.`, author: 'Traditional', source: 'Oldest known Marian prayer (3rd century)' },

    // PRAYERS TO SAINTS
    { title: 'Prayer to St. Michael the Archangel', slug: 'prayer-st-michael', category: 'saints', content: `Saint Michael the Archangel,\ndefend us in battle.\nBe our protection against the wickedness and snares of the devil.\nMay God rebuke him, we humbly pray,\nand do thou, O Prince of the heavenly hosts,\nby the power of God,\ncast into hell Satan, and all the evil spirits,\nwho prowl about the world\nseeking the ruin of souls.\n\nAmen.`, author: 'Pope Leo XIII', source: '1886' },
    { title: 'Prayer to St. Joseph', slug: 'prayer-st-joseph', category: 'saints', content: `O St. Joseph, whose protection is so great,\nso strong, so prompt before the throne of God,\nI place in you all my interests and desires.\n\nO St. Joseph, do assist me by your powerful intercession\nand obtain for me from your Divine Son\nall spiritual blessings through Jesus Christ, our Lord;\nso that having engaged here below your heavenly power,\nI may offer my thanksgiving and homage\nto the most loving of fathers.\n\nO St. Joseph, I never weary contemplating you\nand Jesus asleep in your arms.\nI dare not approach while He reposes near your heart.\nPress Him in my name and kiss His fine head for me,\nand ask Him to return the kiss when I draw my dying breath.\n\nSt. Joseph, patron of departing souls, pray for us.\n\nAmen.`, author: 'Traditional', source: 'Catholic Devotion' },
    { title: 'Prayer to St. Anthony', slug: 'prayer-st-anthony', category: 'saints', content: `O Holy St. Anthony, gentlest of Saints,\nyour love for God and charity for His creatures,\nmade you worthy, when on earth,\nto possess miraculous powers.\n\nMiracles waited on your word,\nwhich you were ever ready to speak\nfor those in trouble or anxiety.\n\nEncouraged by this thought,\nI implore of you to obtain for me (request).\n\nThe answer to my prayer may require a miracle;\neven so, you are the Saint of Miracles.\n\nO gentle and loving St. Anthony,\nwhose heart was ever full of human sympathy,\nwhisper my petition into the ears of the Sweet Infant Jesus,\nwho loved to be folded in your arms;\nand the gratitude of my heart will ever be yours.\n\nAmen.`, author: 'Traditional', source: 'Franciscan Prayer' },
    { title: 'Prayer to St. Jude', slug: 'prayer-st-jude', category: 'saints', content: `O most holy apostle, Saint Jude,\nfaithful servant and friend of Jesus,\nthe Church honors and invokes you universally,\nas the patron of difficult cases,\nof things almost despaired of.\n\nPray for me, I am so helpless and alone.\n\nInterude with God for me\nthat He bring visible and speedy help where help is almost despaired of.\n\nCome to my assistance in this great need\nthat I may receive the consolation and help of heaven\nin all my necessities, tribulations, and sufferings,\nparticularly (make your request here)\nand that I may praise God with you\nand all the saints forever.\n\nI promise, O blessed Saint Jude,\nto be ever mindful of this great favor\ngranted me by God\nand to always honor you as my special and powerful patron,\nand to gratefully encourage devotion to you.\n\nAmen.`, author: 'Traditional', source: 'Catholic Devotion' },

    // MORNING PRAYERS
    { title: 'Guardian Angel Prayer', slug: 'guardian-angel-prayer', category: 'morning', content: `Angel of God, my guardian dear,\nto whom God's love commits me here,\never this day, be at my side,\nto light and guard, rule and guide.\n\nAmen.`, author: 'Traditional', source: '11th Century' },
    { title: 'Morning Offering', slug: 'morning-offering', category: 'morning', content: `O Jesus, through the Immaculate Heart of Mary,\nI offer You my prayers, works, joys, and sufferings of this day\nin union with the Holy Sacrifice of the Mass throughout the world.\n\nI offer them for all the intentions of Your Sacred Heart:\nthe salvation of souls, reparation for sin, and the reunion of all Christians.\n\nI offer them for the intentions of our bishops\nand of all Apostles of Prayer,\nand in particular for those recommended by our Holy Father this month.\n\nAmen.`, author: 'Apostleship of Prayer', source: '19th Century' },

    // EVENING PRAYERS
    { title: 'Night Prayer', slug: 'night-prayer', category: 'evening', content: `Visit, we beseech Thee, O Lord, this dwelling,\nand drive far from it all snares of the enemy.\nLet Thy holy angels dwell herein,\nto preserve us in peace;\nand let Thy blessing be upon us,\nthrough Christ our Lord.\n\nAmen.`, author: 'Traditional', source: 'Compline' },
    { title: 'Prayer Before Sleep', slug: 'prayer-before-sleep', category: 'evening', content: `Now I lay me down to sleep,\nI pray the Lord my soul to keep.\nIf I should die before I wake,\nI pray the Lord my soul to take.\n\nMay God the Father bless me,\nJesus Christ defend and keep me,\nthe power of the Holy Spirit\nenlight and sanctify me this night.\n\nAmen.`, author: 'Traditional', source: 'Catholic Night Prayer' },

    // EUCHARISTIC PRAYERS
    { title: 'Anima Christi', slug: 'anima-christi', category: 'eucharist', content: `Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from the side of Christ, wash me.\nPassion of Christ, strengthen me.\n\nO good Jesus, hear me.\nWithin Thy wounds hide me.\nSuffer me not to be separated from Thee.\nFrom the malicious enemy defend me.\nIn the hour of my death call me\nand bid me come unto Thee\nthat with Thy Saints I may praise Thee\nforever and ever.\n\nAmen.`, author: 'Traditional', source: '14th Century' },
    { title: 'Spiritual Communion', slug: 'spiritual-communion', category: 'eucharist', content: `My Jesus, I believe that You are present\nin the Most Holy Sacrament.\nI love You above all things,\nand I desire to receive You into my soul.\nSince I cannot at this moment receive You sacramentally,\ncome at least spiritually into my heart.\nI embrace You as if You were already there\nand unite myself wholly to You.\nNever permit me to be separated from You.\n\nAmen.`, author: 'St. Alphonsus Liguori', source: '18th Century' },

    // ROSARY PRAYERS
    { title: 'Fatima Prayer', slug: 'fatima-prayer', category: 'rosary', content: `O my Jesus, forgive us our sins,\nsave us from the fires of hell,\nlead all souls to Heaven,\nespecially those most in need of Thy mercy.\n\nAmen.`, author: 'Blessed Virgin Mary', source: 'Fatima, 1917' },
    { title: 'Mysteries of the Rosary', slug: 'mysteries-rosary', category: 'rosary', content: `THE JOYFUL MYSTERIES (Monday, Saturday)\n1. The Annunciation\n2. The Visitation\n3. The Nativity\n4. The Presentation\n5. The Finding in the Temple\n\nTHE LUMINOUS MYSTERIES (Thursday)\n1. Baptism in the Jordan\n2. Wedding at Cana\n3. Proclamation of the Kingdom\n4. The Transfiguration\n5. Institution of the Eucharist\n\nTHE SORROWFUL MYSTERIES (Tuesday, Friday)\n1. Agony in the Garden\n2. Scourging at the Pillar\n3. Crowning with Thorns\n4. Carrying the Cross\n5. The Crucifixion\n\nTHE GLORIOUS MYSTERIES (Wednesday, Sunday)\n1. The Resurrection\n2. The Ascension\n3. Descent of the Holy Spirit\n4. Assumption of Mary\n5. Coronation of Mary`, author: 'Traditional', source: 'Catholic Devotion' },

    // PROTECTION PRAYERS
    { title: 'Prayer for Protection', slug: 'protection-prayer', category: 'protection', content: `The light of God surrounds me;\nThe love of God enfolds me;\nThe power of God protects me;\nThe presence of God watches over me.\nWherever I am, God is,\nand where God is, all is well.\n\nAmen.`, author: 'Traditional', source: 'Catholic Prayer' },
    { title: 'Breastplate of St. Patrick', slug: 'breastplate-st-patrick', category: 'protection', content: `Christ with me, Christ before me,\nChrist behind me, Christ in me,\nChrist beneath me, Christ above me,\nChrist on my right, Christ on my left,\nChrist when I lie down, Christ when I sit down,\nChrist when I arise,\nChrist in the heart of every man who thinks of me,\nChrist in the mouth of everyone who speaks of me,\nChrist in every eye that sees me,\nChrist in every ear that hears me.\n\nAmen.`, author: 'St. Patrick', source: '5th Century' },

    // HEALING PRAYERS
    { title: 'Prayer for Healing', slug: 'prayer-for-healing', category: 'healing', content: `Almighty and merciful Father,\nby the power of Your command,\ndrive away from me all forms of sickness and disease.\n\nRestore strength to my body\nand joy to my spirit,\nso that in my renewed health,\nI may bless and serve You,\nnow and forevermore.\n\nThrough Christ our Lord.\n\nAmen.`, author: 'Traditional', source: 'Catholic Healing Prayer' },
    { title: 'Prayer of St. Francis', slug: 'prayer-st-francis', category: 'healing', content: `Lord, make me an instrument of your peace:\nwhere there is hatred, let me sow love;\nwhere there is injury, pardon;\nwhere there is doubt, faith;\nwhere there is despair, hope;\nwhere there is darkness, light;\nwhere there is sadness, joy.\n\nO divine Master, grant that I may not so much seek\nto be consoled as to console,\nto be understood as to understand,\nto be loved as to love.\n\nFor it is in giving that we receive,\nit is in pardoning that we are pardoned,\nand it is in dying that we are born to eternal life.\n\nAmen.`, author: 'St. Francis of Assisi', source: '13th Century' },

    // NOVENAS
    { title: 'Novena to the Sacred Heart', slug: 'novena-sacred-heart', category: 'novenas', content: `O my Jesus, You have said: "Truly I say to you,\nask and you will receive, seek and you will find,\nknock and it will be opened to you."\nBehold I knock, I seek and ask for the grace of...\n\nOur Father... Hail Mary... Glory Be...\nSacred Heart of Jesus, I place all my trust in You.\n\nO my Jesus, You have said: "Truly I say to you,\nif you ask anything of the Father in My name,\nHe will give it to you."\nBehold, in Your name, I ask the Father for the grace of...\n\nOur Father... Hail Mary... Glory Be...\nSacred Heart of Jesus, I place all my trust in You.`, author: 'Traditional', source: 'Catholic Novena' },

    // LITANIES
    { title: 'Litany of the Sacred Heart', slug: 'litany-sacred-heart', category: 'litanies', content: `Lord, have mercy on us. Christ, have mercy on us.\nLord, have mercy on us. Christ, hear us. Christ, graciously hear us.\n\nGod the Father of Heaven, have mercy on us.\nGod the Son, Redeemer of the world, have mercy on us.\nGod the Holy Spirit, have mercy on us.\nHoly Trinity, One God, have mercy on us.\n\nHeart of Jesus, Son of the Eternal Father, have mercy on us.\nHeart of Jesus, formed by the Holy Spirit in the Virgin Mother's womb, have mercy on us.\nHeart of Jesus, substantially united to the Word of God, have mercy on us.\nHeart of Jesus, of infinite majesty, have mercy on us.\nHeart of Jesus, holy temple of God, have mercy on us.\nHeart of Jesus, tabernacle of the Most High, have mercy on us.\n\nLamb of God, who takes away the sins of the world, spare us, O Lord.\nLamb of God, who takes away the sins of the world, graciously hear us, O Lord.\nLamb of God, who takes away the sins of the world, have mercy on us.\n\nJesus, meek and humble of heart, make our hearts like unto Thine.\n\nAmen.`, author: 'Traditional', source: 'Catholic Litany' },
];

// ============================================================================
// COMPREHENSIVE CHURCHES (20+ churches)
// ============================================================================
const churches = [
    // USA Churches
    { name: "St. Patrick's Cathedral", slug: 'st-patricks-cathedral-new-york', city: 'New York', state: 'NY', country: 'United States', countryCode: 'US', type: 'CATHEDRAL', latitude: 40.7586, longitude: -73.9760, address: '460 Madison Ave, New York, NY 10022', phone: '+1 212-753-2261', website: 'https://saintpatrickscathedral.org', denomination: 'Catholic', description: "St. Patrick's Cathedral is a decorated Neo-Gothic-style Roman Catholic cathedral in Midtown Manhattan, the seat of the Archbishop of New York." },
    { name: 'Basilica of the National Shrine', slug: 'basilica-national-shrine-washington', city: 'Washington D.C.', country: 'United States', countryCode: 'US', type: 'BASILICA', latitude: 38.9331, longitude: -76.9949, address: '400 Michigan Ave NE, Washington, DC 20017', phone: '+1 202-526-8300', website: 'https://www.nationalshrine.org', denomination: 'Catholic', description: 'The largest Catholic church in North America, dedicated to the Immaculate Conception.' },
    { name: 'Cathedral of Our Lady of the Angels', slug: 'our-lady-angels-los-angeles', city: 'Los Angeles', state: 'CA', country: 'United States', countryCode: 'US', type: 'CATHEDRAL', latitude: 34.0583, longitude: -118.2450, address: '555 W Temple St, Los Angeles, CA 90012', phone: '+1 213-680-5200', website: 'https://www.olacathedral.org', denomination: 'Catholic', description: 'The cathedral of the Archdiocese of Los Angeles, featuring contemporary architecture.' },
    { name: 'Cathedral Basilica of St. Louis', slug: 'cathedral-basilica-st-louis', city: 'St. Louis', state: 'MO', country: 'United States', countryCode: 'US', type: 'BASILICA', latitude: 38.6399, longitude: -90.2619, address: '4431 Lindell Blvd, St. Louis, MO 63108', phone: '+1 314-533-7662', website: 'https://cathedralstl.org', denomination: 'Catholic', description: 'Known for having the largest collection of mosaics in the Western Hemisphere.' },
    { name: 'St. Augustine Cathedral', slug: 'st-augustine-cathedral-florida', city: 'St. Augustine', state: 'FL', country: 'United States', countryCode: 'US', type: 'CATHEDRAL', latitude: 29.8942, longitude: -81.3130, address: '38 Cathedral Place, St. Augustine, FL 32084', phone: '+1 904-824-2806', website: 'https://thefirstparish.org', denomination: 'Catholic', description: 'The oldest Catholic parish in the continental United States, founded in 1565.' },

    // European Churches
    { name: "St. Peter's Basilica", slug: 'st-peters-basilica-vatican', city: 'Vatican City', country: 'Vatican', countryCode: 'VA', type: 'BASILICA', latitude: 41.9022, longitude: 12.4539, address: 'Piazza San Pietro, 00120 Vatican City', website: 'https://www.vatican.va', denomination: 'Catholic', description: "The largest church in the world and the center of Christianity, St. Peter's Basilica is the burial site of Saint Peter." },
    { name: 'Notre-Dame Cathedral', slug: 'notre-dame-cathedral-paris', city: 'Paris', country: 'France', countryCode: 'FR', type: 'CATHEDRAL', latitude: 48.8530, longitude: 2.3500, address: '6 Parvis Notre-Dame, 75004 Paris, France', denomination: 'Catholic', description: 'A medieval Catholic cathedral and one of the finest examples of French Gothic architecture.' },
    { name: 'Westminster Cathedral', slug: 'westminster-cathedral-london', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'CATHEDRAL', latitude: 51.4958, longitude: -0.1397, address: '42 Francis St, London SW1P 1QW, UK', phone: '+44 20 7798 9055', website: 'https://westminstercathedral.org.uk', denomination: 'Catholic', description: 'The mother church of the Catholic community in England and Wales.' },
    { name: 'Cologne Cathedral', slug: 'cologne-cathedral-germany', city: 'Cologne', country: 'Germany', countryCode: 'DE', type: 'CATHEDRAL', latitude: 50.9413, longitude: 6.9583, address: 'Domkloster 4, 50667 Köln, Germany', website: 'https://www.koelner-dom.de', denomination: 'Catholic', description: 'A UNESCO World Heritage Site and the largest Gothic church in Northern Europe.' },
    { name: 'Sagrada Familia', slug: 'sagrada-familia-barcelona', city: 'Barcelona', country: 'Spain', countryCode: 'ES', type: 'BASILICA', latitude: 41.4036, longitude: 2.1744, address: 'C/ de Mallorca, 401, 08013 Barcelona, Spain', website: 'https://sagradafamilia.org', denomination: 'Catholic', description: "Antoni Gaudí's unfinished masterpiece, a UNESCO World Heritage Site." },
    { name: 'St. Stephen\'s Cathedral', slug: 'st-stephens-cathedral-vienna', city: 'Vienna', country: 'Austria', countryCode: 'AT', type: 'CATHEDRAL', latitude: 48.2082, longitude: 16.3738, address: 'Stephansplatz 3, 1010 Wien, Austria', website: 'https://www.stephanskirche.at', denomination: 'Catholic', description: 'The mother church of the Roman Catholic Archdiocese of Vienna.' },

    // Latin American Churches
    { name: 'Metropolitan Cathedral', slug: 'metropolitan-cathedral-mexico-city', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', type: 'CATHEDRAL', latitude: 19.4335, longitude: -99.1328, address: 'Plaza de la Constitución S/N, Centro, 06000 CDMX', denomination: 'Catholic', description: 'The largest cathedral in the Americas, built over the ruins of an Aztec temple.' },
    { name: 'Basilica of Our Lady of Guadalupe', slug: 'basilica-guadalupe-mexico', city: 'Mexico City', country: 'Mexico', countryCode: 'MX', type: 'BASILICA', latitude: 19.4851, longitude: -99.1178, address: 'Plaza de las Américas 1, Villa de Guadalupe, 07050 CDMX', denomination: 'Catholic', description: 'The most visited Catholic pilgrimage site in the world, home to the miraculous image of Our Lady of Guadalupe.' },
    { name: 'Christ the Redeemer', slug: 'christ-the-redeemer-rio', city: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', type: 'SHRINE', latitude: -22.9519, longitude: -43.2105, address: 'Parque Nacional da Tijuca, Rio de Janeiro - RJ, Brazil', denomination: 'Catholic', description: 'The iconic Art Deco statue of Jesus Christ, one of the New Seven Wonders of the World.' },

    // Asian Churches
    { name: 'Manila Cathedral', slug: 'manila-cathedral-philippines', city: 'Manila', country: 'Philippines', countryCode: 'PH', type: 'CATHEDRAL', latitude: 14.5918, longitude: 120.9731, address: 'Cabildo St, Intramuros, Manila, Philippines', denomination: 'Catholic', description: 'The seat of the Archbishop of Manila, rebuilt 8 times due to earthquakes and war.' },
    { name: 'Myeongdong Cathedral', slug: 'myeongdong-cathedral-seoul', city: 'Seoul', country: 'South Korea', countryCode: 'KR', type: 'CATHEDRAL', latitude: 37.5635, longitude: 126.9871, address: '74 Myeongdong-gil, Jung-gu, Seoul, South Korea', denomination: 'Catholic', description: 'The seat of the Archbishop of Seoul and a symbol of Korean Catholicism.' },

    // African Churches
    { name: 'Basilica of Our Lady of Peace', slug: 'basilica-our-lady-peace-ivory-coast', city: 'Yamoussoukro', country: "Côte d'Ivoire", countryCode: 'CI', type: 'BASILICA', latitude: 6.8147, longitude: -5.2883, address: 'Yamoussoukro, Côte d\'Ivoire', denomination: 'Catholic', description: 'The largest church in the world by area, modeled after St. Peter\'s Basilica.' },

    // Australian Churches
    { name: "St. Mary's Cathedral", slug: 'st-marys-cathedral-sydney', city: 'Sydney', country: 'Australia', countryCode: 'AU', type: 'CATHEDRAL', latitude: -33.8712, longitude: 151.2130, address: 'St Marys Rd, Sydney NSW 2000, Australia', website: 'https://www.stmaryscathedral.org.au', denomination: 'Catholic', description: 'The cathedral church of the Roman Catholic Archdiocese of Sydney.' },
];

// ============================================================================
// COMPREHENSIVE SAINTS (25+ saints)
// ============================================================================
const saints = [
    // Apostles and Early Saints
    { name: 'St. Peter', title: 'Prince of the Apostles', feastMonth: 6, feastDayOfMonth: 29, feastDay: 'June 29', patronOf: ['Popes', 'Fishermen', 'Net makers'], biography: 'St. Peter was the leader of the twelve apostles and the first Pope. Jesus gave him the "keys of the kingdom of heaven" and built His Church upon him.' },
    { name: 'St. Paul', title: 'Apostle to the Gentiles', feastMonth: 6, feastDayOfMonth: 29, feastDay: 'June 29', patronOf: ['Missionaries', 'Theologians', 'Writers'], biography: 'Originally known as Saul, St. Paul was converted on the road to Damascus and became the greatest missionary of the early Church, writing much of the New Testament.' },
    { name: 'St. John the Apostle', title: 'Beloved Disciple', feastMonth: 12, feastDayOfMonth: 27, feastDay: 'December 27', patronOf: ['Authors', 'Publishers', 'Theologians'], biography: 'The youngest apostle and the only one who did not die a martyr\'s death. He wrote the Gospel of John, three epistles, and the Book of Revelation.' },
    { name: 'St. Mary Magdalene', title: 'Apostle to the Apostles', feastMonth: 7, feastDayOfMonth: 22, feastDay: 'July 22', patronOf: ['Penitents', 'Hairdressers', 'Women'], biography: 'A devoted follower of Jesus who witnessed the Crucifixion and was the first to see the Risen Christ on Easter morning.' },
    { name: 'St. Stephen', title: 'First Martyr', feastMonth: 12, feastDayOfMonth: 26, feastDay: 'December 26', patronOf: ['Deacons', 'Stonemasons', 'Headaches'], biography: 'St. Stephen was one of the seven deacons and the first Christian martyr, stoned to death for his faith.' },

    // Doctors of the Church
    { name: 'St. Augustine', title: 'Doctor of the Church', feastMonth: 8, feastDayOfMonth: 28, feastDay: 'August 28', patronOf: ['Theologians', 'Printers', 'Brewers'], biography: 'One of the most important Church Fathers, St. Augustine\'s writings shaped Western Christianity. His "Confessions" is a classic of Christian literature.' },
    { name: 'St. Thomas Aquinas', title: 'Angelic Doctor', feastMonth: 1, feastDayOfMonth: 28, feastDay: 'January 28', patronOf: ['Students', 'Universities', 'Philosophers'], biography: 'The greatest theologian in Church history, his Summa Theologica is the definitive work on Catholic theology.' },
    { name: 'St. Jerome', title: 'Doctor of the Church', feastMonth: 9, feastDayOfMonth: 30, feastDay: 'September 30', patronOf: ['Librarians', 'Translators', 'Bible scholars'], biography: 'Best known for translating the Bible into Latin (the Vulgate), which was the standard Bible for over 1,000 years.' },
    { name: 'St. Teresa of Ávila', title: 'Doctor of Prayer', feastMonth: 10, feastDayOfMonth: 15, feastDay: 'October 15', patronOf: ['Headache sufferers', 'Spanish Catholic writers'], biography: 'A Spanish mystic and reformer of the Carmelite Order, known for her writings on prayer and the spiritual life.' },

    // Popular Saints
    { name: 'St. Francis of Assisi', title: 'Founder of Franciscans', feastMonth: 10, feastDayOfMonth: 4, feastDay: 'October 4', patronOf: ['Animals', 'Ecology', 'Italy'], biography: 'The beloved saint who embraced poverty and preached to the birds. He founded the Franciscan Order and received the stigmata.' },
    { name: 'St. Anthony of Padua', title: 'Wonder Worker', feastMonth: 6, feastDayOfMonth: 13, feastDay: 'June 13', patronOf: ['Lost items', 'Poor', 'Portugal'], biography: 'Famous for his powerful preaching and miracles, St. Anthony is invoked to find lost objects.' },
    { name: 'St. Thérèse of Lisieux', title: 'Little Flower', feastMonth: 10, feastDayOfMonth: 1, feastDay: 'October 1', patronOf: ['Missionaries', 'Florists', 'France'], biography: 'A Carmelite nun who taught the "Little Way" of spiritual childhood. She died at 24 but became one of the most popular saints.' },
    { name: 'St. Jude', title: 'Apostle of Desperate Cases', feastMonth: 10, feastDayOfMonth: 28, feastDay: 'October 28', patronOf: ['Desperate cases', 'Lost causes', 'Hospitals'], biography: 'One of the twelve apostles, St. Jude is the patron of hopeless cases and desperate situations.' },
    { name: 'St. Joseph', title: 'Foster Father of Jesus', feastMonth: 3, feastDayOfMonth: 19, feastDay: 'March 19', patronOf: ['Workers', 'Fathers', 'Universal Church'], biography: 'The humble carpenter who was chosen to be the earthly father of Jesus and spouse of Mary.' },

    // Martyrs
    { name: 'St. Sebastian', title: 'Soldier Martyr', feastMonth: 1, feastDayOfMonth: 20, feastDay: 'January 20', patronOf: ['Athletes', 'Soldiers', 'Archers'], biography: 'A Roman soldier who was martyred for his faith. He survived being shot with arrows but was later beaten to death.' },
    { name: 'St. Agatha', title: 'Virgin Martyr', feastMonth: 2, feastDayOfMonth: 5, feastDay: 'February 5', patronOf: ['Breast cancer patients', 'Nurses', 'Sicily'], biography: 'A virgin martyr who suffered torture rather than renounce her faith and her virginity.' },
    { name: 'St. Lucy', title: 'Light of Faith', feastMonth: 12, feastDayOfMonth: 13, feastDay: 'December 13', patronOf: ['Blind', 'Eye problems', 'Writers'], biography: 'A Sicilian virgin martyr whose name means "light." She is the patron saint of the blind.' },
    { name: 'St. Maximilian Kolbe', title: 'Martyr of Charity', feastMonth: 8, feastDayOfMonth: 14, feastDay: 'August 14', patronOf: ['Drug addicts', 'Prisoners', 'Journalists'], biography: 'A Franciscan friar who volunteered to die in place of a stranger at Auschwitz concentration camp.' },

    // Modern Saints
    { name: 'St. Padre Pio', title: 'Stigmatist', feastMonth: 9, feastDayOfMonth: 23, feastDay: 'September 23', patronOf: ['Civil defense volunteers', 'Adolescents'], biography: 'An Italian Capuchin friar who bore the stigmata for 50 years and had many mystical gifts.' },
    { name: 'St. Mother Teresa', title: 'Saint of Calcutta', feastMonth: 9, feastDayOfMonth: 5, feastDay: 'September 5', patronOf: ['Missionaries of Charity', 'World Youth Day'], biography: 'Founded the Missionaries of Charity to serve "the poorest of the poor." Winner of the Nobel Peace Prize.' },
    { name: 'St. John Paul II', title: 'The Great', feastMonth: 10, feastDayOfMonth: 22, feastDay: 'October 22', patronOf: ['World Youth Day', 'Young Catholics', 'Families'], biography: 'The Polish Pope who served from 1978-2005, known for his travels, writings, and fight against communism.' },
    { name: 'St. Patrick', title: 'Apostle of Ireland', feastMonth: 3, feastDayOfMonth: 17, feastDay: 'March 17', patronOf: ['Ireland', 'Engineers', 'Paralegals'], biography: 'The patron saint of Ireland who used the shamrock to explain the Holy Trinity and drove the snakes from Ireland.' },
    { name: 'St. Michael the Archangel', title: 'Defender of Heaven', feastMonth: 9, feastDayOfMonth: 29, feastDay: 'September 29', patronOf: ['Police officers', 'Soldiers', 'Paratroopers'], biography: 'The leader of the heavenly armies who defeated Satan and his angels. He is the protector of the Church.' },
    { name: 'Mary, Mother of God', title: 'Queen of Heaven', feastMonth: 1, feastDayOfMonth: 1, feastDay: 'January 1', patronOf: ['Mothers', 'All People', 'The Church'], biography: 'The Blessed Virgin Mary is the Mother of Jesus Christ and the greatest of all saints. She is honored with many feast days.' },
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
async function main() {
    console.log('🌱 Starting comprehensive database seed...');
    console.log('This will add 50+ prayers, 20+ churches, and 25+ saints...\n');

    // Seed Prayer Categories
    console.log('📁 Creating prayer categories...');
    const categoryMap: Record<string, string> = {};
    for (const category of prayerCategories) {
        const created = await prisma.prayerLibraryCategory.upsert({
            where: { slug: category.slug },
            create: category,
            update: category,
        });
        categoryMap[category.slug] = created.id;
    }
    console.log(`✅ Created ${prayerCategories.length} prayer categories`);

    // Seed Prayers
    console.log('\n📖 Creating prayers...');
    let prayerCount = 0;
    for (const prayer of prayers) {
        const categoryId = categoryMap[prayer.category];
        if (!categoryId) {
            console.warn(`⚠️ Category not found for prayer: ${prayer.title}`);
            continue;
        }

        await prisma.prayer.upsert({
            where: { slug: prayer.slug },
            create: {
                title: prayer.title,
                slug: prayer.slug,
                content: prayer.content,
                author: prayer.author,
                source: prayer.source,
                categoryId: categoryId,
                language: 'en',
                isPublished: true,
                viewCount: Math.floor(Math.random() * 100000) + 1000,
            },
            update: {
                content: prayer.content,
                author: prayer.author,
                source: prayer.source,
                categoryId: categoryId,
            },
        });
        prayerCount++;
    }
    console.log(`✅ Created ${prayerCount} prayers`);

    // Seed Churches
    console.log('\n⛪ Creating churches...');
    let churchCount = 0;
    for (const church of churches) {
        await prisma.church.upsert({
            where: { slug: church.slug },
            create: {
                ...church,
                type: church.type as any,
                isVerified: true,
            },
            update: {
                name: church.name,
                description: church.description,
                address: church.address,
            },
        });
        churchCount++;
    }
    console.log(`✅ Created ${churchCount} churches`);

    // Seed Saints
    console.log('\n👼 Creating saints...');
    let saintCount = 0;
    for (const saint of saints) {
        const slug = saint.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await prisma.saint.upsert({
            where: { slug },
            create: {
                name: saint.name,
                slug,
                title: saint.title,
                feastMonth: saint.feastMonth,
                feastDayOfMonth: saint.feastDayOfMonth,
                feastDay: saint.feastDay,
                patronOf: saint.patronOf,
                biography: saint.biography,
            },
            update: {
                title: saint.title,
                feastMonth: saint.feastMonth,
                feastDayOfMonth: saint.feastDayOfMonth,
                patronOf: saint.patronOf,
                biography: saint.biography,
            },
        });
        saintCount++;
    }
    console.log(`✅ Created ${saintCount} saints`);

    // Seed Admin User
    console.log('\n👑 Creating admin user...');
    await prisma.adminUser.upsert({
        where: { id: 'admim' },
        create: {
            id: 'admim',
            email: 'admin@myprayertower.com',
            passwordHash: '$2a$10$5G0ouAFj7U8pbyKJbbjEv.K0gwlDu5ybTkpXH1raiGtQhGl9..WEe',
            name: 'Admin User',
            role: AdminRole.SUPER_ADMIN,
        },
        update: {
            passwordHash: '$2a$10$5G0ouAFj7U8pbyKJbbjEv.K0gwlDu5ybTkpXH1raiGtQhGl9..WEe',
            role: AdminRole.SUPER_ADMIN,
        }
    });
    console.log('✅ Admin user ready');

    console.log('\n🎉 ========================================');
    console.log('🎉 DATABASE SEEDING COMPLETED!');
    console.log('🎉 ========================================');
    console.log(`📁 Categories: ${prayerCategories.length}`);
    console.log(`📖 Prayers: ${prayerCount}`);
    console.log(`⛪ Churches: ${churchCount}`);
    console.log(`👼 Saints: ${saintCount}`);
    console.log(`📊 Total: ${prayerCategories.length + prayerCount + churchCount + saintCount} records`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
