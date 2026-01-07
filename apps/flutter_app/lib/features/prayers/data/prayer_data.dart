import '../models/prayer_model.dart';

const List<Prayer> kAllPrayers = [
  // Common Prayers
  Prayer(
    id: 1,
    title: 'The Sign of the Cross',
    content:
        'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['basics', 'sign of the cross'],
  ),
  Prayer(
    id: 2,
    title: 'Our Father',
    content:
        'Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['basics', 'lords prayer'],
  ),
  Prayer(
    id: 3,
    title: 'Hail Mary',
    content:
        'Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['basics', 'marian'],
  ),
  Prayer(
    id: 4,
    title: 'Glory Be',
    content:
        'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['basics', 'doxology'],
  ),
  Prayer(
    id: 5,
    title: 'Apostles\' Creed',
    content:
        'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['creed', 'basics'],
  ),

  // Morning Prayers
  Prayer(
    id: 6,
    title: 'Morning Offering',
    content:
        'O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys, and sufferings of this day for all the intentions of your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.',
    category: 'morning',
    categoryLabel: 'Morning Prayers',
    tags: ['morning', 'offering'],
  ),
  Prayer(
    id: 7,
    title: 'The Angelus',
    content:
        'V. The Angel of the Lord declared unto Mary.\nR. And she conceived of the Holy Spirit.\n\nHail Mary...\n\nV. Behold the handmaid of the Lord.\nR. Be it done unto me according to Thy word.\n\nHail Mary...\n\nV. And the Word was made flesh.\nR. And dwelt among us.\n\nHail Mary...\n\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.\n\nLet us pray:\nPour forth, we beseech Thee, O Lord, Thy grace into our hearts, that we to whom the Incarnation of Christ Thy Son was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ Our Lord. Amen.',
    category: 'morning',
    categoryLabel: 'Morning Prayers',
    tags: ['morning', 'noon', 'evening', 'marian'],
  ),

  // Evening Prayers
  Prayer(
    id: 8,
    title: 'Act of Contrition',
    content:
        'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve with the help of Thy grace to sin no more and to avoid the near occasion of sin. Amen.',
    category: 'evening',
    categoryLabel: 'Evening Prayers',
    tags: ['confession', 'penance', 'evening'],
  ),
  Prayer(
    id: 9,
    title: 'Guardian Angel Prayer',
    content:
        'Angel of God, my guardian dear, to whom God\'s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
    category: 'evening',
    categoryLabel: 'Evening Prayers',
    tags: ['protection', 'angels'],
  ),

  // Marian Prayers
  Prayer(
    id: 10,
    title: 'Hail Holy Queen',
    content:
        'Hail, holy Queen, Mother of mercy, hail, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve: to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus, O clement, O loving, O sweet Virgin Mary. Amen.',
    category: 'marian',
    categoryLabel: 'Marian Prayers',
    tags: ['rosary', 'marian'],
  ),
  Prayer(
    id: 11,
    title: 'The Memorare',
    content:
        'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.',
    category: 'marian',
    categoryLabel: 'Marian Prayers',
    tags: ['intercession', 'marian', 'st bernard'],
  ),
  Prayer(
    id: 12,
    title: 'The Magnificat',
    content:
        'My soul proclaims the greatness of the Lord, my spirit rejoices in God my Savior, for he has looked with favor on his lowly servant. From this day all generations will call me blessed: the Almighty has done great things for me, and holy is his Name. He has mercy on those who fear him in every generation. He has shown the strength of his arm, he has scattered the proud in their conceit. He has cast down the mighty from their thrones, and has lifted up the lowly. He has filled the hungry with good things, and the rich he has sent away empty. He has come to the help of his servant Israel for he has remembered his promise of mercy, the promise he made to our fathers, to Abraham and his children for ever.',
    category: 'marian',
    categoryLabel: 'Marian Prayers',
    tags: ['bible', 'luke', 'marian'],
  ),

  // Saints
  Prayer(
    id: 13,
    title: 'Prayer to St. Michael',
    content:
        'St. Michael the Archangel, defend us in battle. Be our defense against the wickedness and snares of the Devil. May God rebuke him, we humbly pray, and do thou, O Prince of the heavenly hosts, by the power of God, thrust into hell Satan, and all the evil spirits, who prowl about the world seeking the ruin of souls. Amen.',
    category: 'saints',
    categoryLabel: 'Saints Prayers',
    tags: ['protection', 'spiritual warfare'],
  ),
  Prayer(
    id: 14,
    title: 'Prayer of St. Francis',
    content:
        'Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy.\n\nO divine Master, grant that I may not so much seek to be consoled as to console, to be understood as to understand, to be loved as to love. For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in dying that we are born to eternal life. Amen.',
    category: 'saints',
    categoryLabel: 'Saints Prayers',
    tags: ['peace', 'service'],
  ),

  // Divine Mercy
  Prayer(
    id: 15,
    title: 'Divine Mercy Chaplet (Opening)',
    content:
        'You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.',
    category: 'divine-mercy',
    categoryLabel: 'Divine Mercy',
    tags: ['mercy', 'chaplet'],
  ),
  Prayer(
    id: 16,
    title: '3 O\'Clock Prayer',
    content:
        'O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You!',
    category: 'divine-mercy',
    categoryLabel: 'Divine Mercy',
    tags: ['mercy', 'short'],
  ),

  // Mass & Eucharist
  Prayer(
    id: 17,
    title: 'Anima Christi',
    content:
        'Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within Thy wounds hide me. Suffer me not to be separated from Thee. From the malignant enemy defend me. In the hour of my death call me. And bid me come unto Thee, that with all Thy Saints I may praise Thee forever and ever. Amen.',
    category: 'mass',
    categoryLabel: 'Mass & Eucharist',
    tags: ['communion', 'after mass'],
  ),
  Prayer(
    id: 18,
    title: 'Spiritual Communion',
    content:
        'My Jesus, I believe that You are present in the Most Holy Sacrament. I love You above all things, and I desire to receive You into my soul. Since I cannot at this moment receive You sacramentally, come at least spiritually into my heart. I embrace You as if You were already there and unite myself wholly to You. Never permit me to be separated from You. Amen.',
    category: 'mass',
    categoryLabel: 'Mass & Eucharist',
    tags: ['spiritual communion', 'mass'],
  ),

  // Litanies
  Prayer(
    id: 19,
    title: 'Litany of Humility',
    content:
        'O Jesus! meek and humble of heart, Hear me.\n\nFrom the desire of being esteemed, Deliver me, Jesus.\nFrom the desire of being loved, Deliver me, Jesus.\nFrom the desire of being extolled, Deliver me, Jesus.\nFrom the desire of being honored, Deliver me, Jesus.\nFrom the desire of being praised, Deliver me, Jesus.\nFrom the desire of being preferred to others, Deliver me, Jesus.\nFrom the desire of being consulted, Deliver me, Jesus.\nFrom the desire of being approved, Deliver me, Jesus.\n\nFrom the fear of being humiliated, Deliver me, Jesus.\nFrom the fear of being despised, Deliver me, Jesus.\nFrom the fear of suffering rebukes, Deliver me, Jesus.\nFrom the fear of being calumniated, Deliver me, Jesus.\nFrom the fear of being forgotten, Deliver me, Jesus.\nFrom the fear of being ridiculed, Deliver me, Jesus.\nFrom the fear of being wronged, Deliver me, Jesus.\nFrom the fear of being suspected, Deliver me, Jesus.\n\nThat others may be loved more than I, Jesus, grant me the grace to desire it.\nThat others may be esteemed more than I, Jesus, grant me the grace to desire it.\nThat, in the opinion of the world, others may increase and I may decrease, Jesus, grant me the grace to desire it.\nThat others may be chosen and I set aside, Jesus, grant me the grace to desire it.\nThat others may be praised and I unnoticed, Jesus, grant me the grace to desire it.\nThat others may be preferred to me in everything, Jesus, grant me the grace to desire it.\nThat others may become holier than I, provided that I may become as holy as I should, Jesus, grant me the grace to desire it.',
    category: 'litanies',
    categoryLabel: 'Litanies',
    tags: ['humility', 'virtue'],
  ),

  // Psalms
  Prayer(
    id: 20,
    title: 'Psalm 23',
    content:
        'The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures: he leadeth me beside the still waters.\nHe restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.\nYea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.\nThou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.\nSurely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.',
    category: 'psalms',
    categoryLabel: 'Psalms',
    tags: ['bible', 'comfort'],
  ),
  Prayer(
    id: 21,
    title: 'Psalm 51 (Miserere)',
    content:
        'Have mercy on me, O God, according to your steadfast love; according to your abundant mercy blot out my transgressions. Wash me thoroughly from my iniquity, and cleanse me from my sin! For I know my transgressions, and my sin is ever before me...',
    category: 'psalms',
    categoryLabel: 'Psalms',
    tags: ['bible', 'penance', 'confession'],
  ),

  // Others
  Prayer(
    id: 22,
    title: 'Come, Holy Spirit',
    content:
        'Come, Holy Spirit, fill the hearts of Thy faithful and kindle in them the fire of Thy love. Send forth Thy Spirit and they shall be created. And Thou shalt renew the face of the earth.\n\nLet us pray. O God, who by the light of the Holy Spirit, didst instruct the hearts of the faithful, grant that by the same Holy Spirit we may be truly wise and ever enjoy His consolations, Through Christ our Lord, Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['holy spirit', 'pentecost'],
  ),
  Prayer(
    id: 23,
    title: 'Grace Before Meals',
    content:
        'Bless us, O Lord, and these thy gifts, which we are about to receive from thy bounty, through Christ our Lord. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['meals', 'gratitude'],
  ),
  Prayer(
    id: 24,
    title: 'Grace After Meals',
    content:
        'We give thee thanks, for all thy benefits, almighty God, who livest and reignest world without end. Amen. May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.',
    category: 'common',
    categoryLabel: 'Common Prayers',
    tags: ['meals', 'gratitude'],
  ),
];
