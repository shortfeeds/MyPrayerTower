import '../models/novena_model.dart';

/// Comprehensive list of 50+ Catholic Novenas
final List<NovenaDefinition> allNovenas = [
  // === MOST POPULAR ===
  const NovenaDefinition(
    id: 'divine-mercy',
    name: 'Divine Mercy Novena',
    description:
        'Prayed from Good Friday to Divine Mercy Sunday, as requested by Jesus to St. Faustina.',
    patronOf: 'God\'s Mercy',
    dailyPrayers: _divineMercyPrayers,
    openingPrayer:
        'You expired, Jesus, but the source of life gushed forth for souls...',
    closingPrayer:
        'Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible...',
  ),
  NovenaDefinition(
    id: 'st-jude',
    name: 'Novena to St. Jude',
    description: 'Patron of hopeless cases and desperate situations.',
    patronOf: 'Hopeless Cases',
    dailyPrayers: _genericNineDayPrayers('St. Jude'),
    openingPrayer:
        'Most holy Apostle, St. Jude, faithful servant and friend of Jesus...',
    closingPrayer:
        'St. Jude, pray for us and for all who invoke your aid. Amen.',
  ),
  NovenaDefinition(
    id: 'sacred-heart',
    name: 'Novena to the Sacred Heart',
    description: 'Devotion to the Sacred Heart of Jesus, source of all graces.',
    patronOf: 'Love of Christ',
    dailyPrayers: _genericNineDayPrayers('Sacred Heart'),
    openingPrayer:
        'O my Jesus, you have said: "Truly I say to you, ask and you will receive..."',
    closingPrayer: 'O Sacred Heart of Jesus, I place all my trust in You.',
  ),
  NovenaDefinition(
    id: 'our-lady-perpetual-help',
    name: 'Novena to Our Lady of Perpetual Help',
    description: 'Seeking Mary\'s constant intercession in all difficulties.',
    patronOf: 'Perpetual Help',
    dailyPrayers: _genericNineDayPrayers('Our Lady'),
    openingPrayer:
        'Behold at thy feet, O Mother of Perpetual Help, a wretched sinner...',
    closingPrayer: 'Mother of Perpetual Help, pray for us. Amen.',
  ),
  NovenaDefinition(
    id: 'st-anthony',
    name: 'Novena to St. Anthony',
    description: 'Patron of lost things, the poor, and travelers.',
    patronOf: 'Lost Items',
    dailyPrayers: _genericNineDayPrayers('St. Anthony'),
    openingPrayer:
        'O Holy St. Anthony, gentlest of Saints, your love for God...',
    closingPrayer: 'St. Anthony, pray for us. Amen.',
  ),

  // === MARIAN NOVENAS ===
  NovenaDefinition(
    id: 'immaculate-conception',
    name: 'Novena to the Immaculate Conception',
    description: 'Honoring Mary conceived without Original Sin.',
    patronOf: 'Purity',
    dailyPrayers: _genericNineDayPrayers('Immaculate Mary'),
    openingPrayer:
        'O God, who by the Immaculate Conception of the Blessed Virgin...',
    closingPrayer:
        'O Mary, conceived without sin, pray for us who have recourse to thee.',
  ),
  NovenaDefinition(
    id: 'our-lady-fatima',
    name: 'Novena to Our Lady of Fatima',
    description: 'Commemorating Mary\'s apparitions at Fatima, Portugal.',
    patronOf: 'Peace',
    dailyPrayers: _genericNineDayPrayers('Our Lady of Fatima'),
    openingPrayer: 'Most Holy Virgin, who appeared at Fatima...',
    closingPrayer: 'Our Lady of Fatima, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-lourdes',
    name: 'Novena to Our Lady of Lourdes',
    description: 'Seeking healing through Mary\'s intercession at Lourdes.',
    patronOf: 'Healing',
    dailyPrayers: _genericNineDayPrayers('Our Lady of Lourdes'),
    openingPrayer: 'O ever Immaculate Virgin, Mother of Mercy...',
    closingPrayer: 'Our Lady of Lourdes, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-guadalupe',
    name: 'Novena to Our Lady of Guadalupe',
    description: 'Patroness of the Americas and the unborn.',
    patronOf: 'The Americas, Unborn',
    dailyPrayers: _genericNineDayPrayers('Our Lady of Guadalupe'),
    openingPrayer: 'Our Lady of Guadalupe, Mystical Rose...',
    closingPrayer: 'Our Lady of Guadalupe, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-mount-carmel',
    name: 'Novena to Our Lady of Mount Carmel',
    description: 'Devotion associated with the Brown Scapular.',
    patronOf: 'Carmelites',
    dailyPrayers: _genericNineDayPrayers('Our Lady of Mount Carmel'),
    openingPrayer: 'O beautiful Flower of Carmel, most fruitful vine...',
    closingPrayer: 'Our Lady of Mount Carmel, pray for us.',
  ),
  NovenaDefinition(
    id: 'assumption',
    name: 'Novena for the Assumption',
    description: 'Honoring Mary\'s bodily assumption into Heaven.',
    patronOf: 'Eternal Life',
    dailyPrayers: _genericNineDayPrayers('Blessed Mother'),
    openingPrayer: 'O Immaculate Virgin, Mother of God and our Mother...',
    closingPrayer: 'Mary, assumed into Heaven, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-sorrows',
    name: 'Novena to Our Lady of Sorrows',
    description: 'Meditating on Mary\'s seven sorrows.',
    patronOf: 'Those Who Suffer',
    dailyPrayers: _genericNineDayPrayers('Sorrowful Mother'),
    openingPrayer: 'Most holy and afflicted Virgin, Queen of Martyrs...',
    closingPrayer: 'Our Lady of Sorrows, pray for us.',
  ),
  NovenaDefinition(
    id: 'miraculous-medal',
    name: 'Miraculous Medal Novena',
    description: 'Based on the apparition to St. Catherine Labouré.',
    patronOf: 'Miracles',
    dailyPrayers: _genericNineDayPrayers('Our Lady of the Miraculous Medal'),
    openingPrayer: 'O Immaculate Virgin Mary, Mother of Our Lord Jesus...',
    closingPrayer:
        'O Mary, conceived without sin, pray for us who have recourse to thee.',
  ),

  // === SAINTS ===
  NovenaDefinition(
    id: 'st-joseph',
    name: 'Novena to St. Joseph',
    description: 'Patron of workers, fathers, and the Universal Church.',
    patronOf: 'Workers, Fathers',
    dailyPrayers: _genericNineDayPrayers('St. Joseph'),
    openingPrayer: 'O Saint Joseph, whose protection is so great...',
    closingPrayer: 'St. Joseph, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-therese',
    name: 'Novena to St. Thérèse of Lisieux',
    description: 'The Little Flower, patron of missionaries.',
    patronOf: 'Missionaries',
    dailyPrayers: _genericNineDayPrayers('St. Thérèse'),
    openingPrayer: 'O Little Thérèse of the Child Jesus...',
    closingPrayer: 'St. Thérèse, shower roses upon us.',
  ),
  NovenaDefinition(
    id: 'st-rita',
    name: 'Novena to St. Rita',
    description: 'Patroness of impossible causes and abused wives.',
    patronOf: 'Impossible Causes',
    dailyPrayers: _genericNineDayPrayers('St. Rita'),
    openingPrayer: 'O holy protectress of those who art in greatest need...',
    closingPrayer: 'St. Rita, advocate of the impossible, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-padre-pio',
    name: 'Novena to St. Padre Pio',
    description: 'Stigmatist and confessor of Pietrelcina.',
    patronOf: 'Confessors',
    dailyPrayers: _genericNineDayPrayers('St. Padre Pio'),
    openingPrayer: 'Dear God, You generously blessed Your servant Padre Pio...',
    closingPrayer: 'St. Padre Pio, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-michael',
    name: 'Novena to St. Michael the Archangel',
    description: 'Prince of the Heavenly Host, defender against evil.',
    patronOf: 'Protection',
    dailyPrayers: _genericNineDayPrayers('St. Michael'),
    openingPrayer: 'St. Michael the Archangel, defend us in battle...',
    closingPrayer: 'St. Michael, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-raphael',
    name: 'Novena to St. Raphael',
    description: 'Healer, guide of travelers, and patron of happy meetings.',
    patronOf: 'Healing, Travelers',
    dailyPrayers: _genericNineDayPrayers('St. Raphael'),
    openingPrayer:
        'Glorious Archangel St. Raphael, great prince of the heavenly court...',
    closingPrayer: 'St. Raphael, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gabriel',
    name: 'Novena to St. Gabriel',
    description: 'Messenger of God, patron of communications.',
    patronOf: 'Communications',
    dailyPrayers: _genericNineDayPrayers('St. Gabriel'),
    openingPrayer: 'O Blessed Archangel Gabriel, we beseech thee...',
    closingPrayer: 'St. Gabriel, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-francis-assisi',
    name: 'Novena to St. Francis of Assisi',
    description: 'Patron of animals and the environment.',
    patronOf: 'Animals, Ecology',
    dailyPrayers: _genericNineDayPrayers('St. Francis'),
    openingPrayer: 'O God, You enabled St. Francis to imitate Christ...',
    closingPrayer: 'St. Francis, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-clare',
    name: 'Novena to St. Clare of Assisi',
    description: 'Foundress of the Poor Clares.',
    patronOf: 'Television',
    dailyPrayers: _genericNineDayPrayers('St. Clare'),
    openingPrayer:
        'God of mercy, You inspired St. Clare with the love of poverty...',
    closingPrayer: 'St. Clare, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-monica',
    name: 'Novena to St. Monica',
    description: 'Patroness of mothers and those with wayward children.',
    patronOf: 'Mothers',
    dailyPrayers: _genericNineDayPrayers('St. Monica'),
    openingPrayer: 'Dear St. Monica, troubled wife and mother...',
    closingPrayer: 'St. Monica, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-augustine',
    name: 'Novena to St. Augustine',
    description:
        'Doctor of the Church, converted through his mother\'s prayers.',
    patronOf: 'Converts',
    dailyPrayers: _genericNineDayPrayers('St. Augustine'),
    openingPrayer:
        'O Glorious St. Augustine, who after leading a life of sin...',
    closingPrayer: 'St. Augustine, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-anne',
    name: 'Novena to St. Anne',
    description: 'Mother of the Blessed Virgin Mary.',
    patronOf: 'Mothers, Grandmothers',
    dailyPrayers: _genericNineDayPrayers('St. Anne'),
    openingPrayer: 'Good St. Anne, mother of her who is our life...',
    closingPrayer: 'St. Anne, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-joachim',
    name: 'Novena to St. Joachim',
    description: 'Father of the Blessed Virgin Mary.',
    patronOf: 'Fathers, Grandfathers',
    dailyPrayers: _genericNineDayPrayers('St. Joachim'),
    openingPrayer: 'O Glorious St. Joachim, spouse of St. Anne...',
    closingPrayer: 'St. Joachim, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-philomena',
    name: 'Novena to St. Philomena',
    description: 'Virgin and martyr, known as the "Wonder Worker".',
    patronOf: 'Youth',
    dailyPrayers: _genericNineDayPrayers('St. Philomena'),
    openingPrayer: 'O faithful Virgin and glorious martyr, St. Philomena...',
    closingPrayer: 'St. Philomena, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-peregrine',
    name: 'Novena to St. Peregrine',
    description: 'Patron saint of cancer patients.',
    patronOf: 'Cancer Patients',
    dailyPrayers: _genericNineDayPrayers('St. Peregrine'),
    openingPrayer: 'O great St. Peregrine, you have been called the Mighty...',
    closingPrayer: 'St. Peregrine, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-dymphna',
    name: 'Novena to St. Dymphna',
    description: 'Patroness of mental illness and anxiety.',
    patronOf: 'Mental Health',
    dailyPrayers: _genericNineDayPrayers('St. Dymphna'),
    openingPrayer:
        'Good St. Dymphna, great wonder-worker in every affliction...',
    closingPrayer: 'St. Dymphna, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gerard',
    name: 'Novena to St. Gerard Majella',
    description: 'Patron of expectant mothers and childbirth.',
    patronOf: 'Expectant Mothers',
    dailyPrayers: _genericNineDayPrayers('St. Gerard'),
    openingPrayer: 'O Good St. Gerard, powerful intercessor before God...',
    closingPrayer: 'St. Gerard, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-expedite',
    name: 'Novena to St. Expedite',
    description: 'Patron of urgent causes and quick solutions.',
    patronOf: 'Urgent Causes',
    dailyPrayers: _genericNineDayPrayers('St. Expedite'),
    openingPrayer: 'Our dear martyr and protector, St. Expedite...',
    closingPrayer: 'St. Expedite, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-blaise',
    name: 'Novena to St. Blaise',
    description: 'Patron of throat ailments.',
    patronOf: 'Throat Illnesses',
    dailyPrayers: _genericNineDayPrayers('St. Blaise'),
    openingPrayer: 'O Glorious St. Blaise, who by thy martyrdom...',
    closingPrayer: 'St. Blaise, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-lucy',
    name: 'Novena to St. Lucy',
    description: 'Patroness of those with eye troubles.',
    patronOf: 'Eye Problems',
    dailyPrayers: _genericNineDayPrayers('St. Lucy'),
    openingPrayer: 'O St. Lucy, you preferred to let your eyes be torn out...',
    closingPrayer: 'St. Lucy, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-christopher',
    name: 'Novena to St. Christopher',
    description: 'Patron of travelers and motorists.',
    patronOf: 'Travelers',
    dailyPrayers: _genericNineDayPrayers('St. Christopher'),
    openingPrayer: 'Dear St. Christopher, patron of travelers...',
    closingPrayer: 'St. Christopher, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-patrick',
    name: 'Novena to St. Patrick',
    description: 'Apostle of Ireland.',
    patronOf: 'Ireland',
    dailyPrayers: _genericNineDayPrayers('St. Patrick'),
    openingPrayer:
        'Dear St. Patrick, in your humility you called yourself a sinner...',
    closingPrayer: 'St. Patrick, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-john-paul-ii',
    name: 'Novena to St. John Paul II',
    description: 'Pope and great evangelizer of the modern age.',
    patronOf: 'Families, Youth',
    dailyPrayers: _genericNineDayPrayers('St. John Paul II'),
    openingPrayer: 'O St. John Paul, from the window of heaven...',
    closingPrayer: 'St. John Paul II, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-faustina',
    name: 'Novena to St. Faustina',
    description: 'Apostle of Divine Mercy.',
    patronOf: 'Divine Mercy',
    dailyPrayers: _genericNineDayPrayers('St. Faustina'),
    openingPrayer:
        'O Jesus, You inspired St. Faustina with profound veneration...',
    closingPrayer: 'St. Faustina, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-teresa-calcutta',
    name: 'Novena to St. Teresa of Calcutta',
    description: 'Foundress of the Missionaries of Charity.',
    patronOf: 'The Poor',
    dailyPrayers: _genericNineDayPrayers('St. Teresa of Calcutta'),
    openingPrayer: 'God, our Father, You called St. Teresa of Calcutta...',
    closingPrayer: 'St. Teresa of Calcutta, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-maximilian-kolbe',
    name: 'Novena to St. Maximilian Kolbe',
    description: 'Martyr of charity at Auschwitz.',
    patronOf: 'Prisoners, Journalists',
    dailyPrayers: _genericNineDayPrayers('St. Maximilian Kolbe'),
    openingPrayer:
        'O Lord Jesus Christ, who said, "Greater love than this no man has..."',
    closingPrayer: 'St. Maximilian Kolbe, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-thomas-aquinas',
    name: 'Novena to St. Thomas Aquinas',
    description: 'Patron of students and scholars.',
    patronOf: 'Students',
    dailyPrayers: _genericNineDayPrayers('St. Thomas Aquinas'),
    openingPrayer: 'O God, Who made St. Thomas Aquinas most distinguished...',
    closingPrayer: 'St. Thomas Aquinas, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-ignatius-loyola',
    name: 'Novena to St. Ignatius of Loyola',
    description: 'Founder of the Jesuits.',
    patronOf: 'Educators',
    dailyPrayers: _genericNineDayPrayers('St. Ignatius'),
    openingPrayer: 'O God, who for the greater glory of Your name...',
    closingPrayer: 'St. Ignatius, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-francis-xavier',
    name: 'Novena of Grace to St. Francis Xavier',
    description: 'Patron of missions and foreign missionaries.',
    patronOf: 'Missionaries',
    dailyPrayers: _genericNineDayPrayers('St. Francis Xavier'),
    openingPrayer: 'O most lovable and loving St. Francis Xavier...',
    closingPrayer: 'St. Francis Xavier, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-john-bosco',
    name: 'Novena to St. John Bosco',
    description: 'Patron of youth and educators.',
    patronOf: 'Youth',
    dailyPrayers: _genericNineDayPrayers('St. John Bosco'),
    openingPrayer:
        'O glorious Saint John Bosco, who, in order to lead young souls...',
    closingPrayer: 'St. John Bosco, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-maria-goretti',
    name: 'Novena to St. Maria Goretti',
    description: 'Patroness of purity and youth.',
    patronOf: 'Purity',
    dailyPrayers: _genericNineDayPrayers('St. Maria Goretti'),
    openingPrayer: 'O St. Maria Goretti, strengthened by God\'s grace...',
    closingPrayer: 'St. Maria Goretti, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gianna',
    name: 'Novena to St. Gianna Molla',
    description: 'Patroness of mothers, physicians, and unborn children.',
    patronOf: 'Unborn Children',
    dailyPrayers: _genericNineDayPrayers('St. Gianna'),
    openingPrayer: 'O St. Gianna Beretta Molla, heroic mother...',
    closingPrayer: 'St. Gianna, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-martin-de-porres',
    name: 'Novena to St. Martin de Porres',
    description: 'Patron of mixed-race people and hairdressers.',
    patronOf: 'Racial Harmony',
    dailyPrayers: _genericNineDayPrayers('St. Martin de Porres'),
    openingPrayer: 'Most humble St. Martin de Porres, your burning charity...',
    closingPrayer: 'St. Martin de Porres, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-juan-diego',
    name: 'Novena to St. Juan Diego',
    description: 'Witness to Our Lady of Guadalupe.',
    patronOf: 'Indigenous Peoples',
    dailyPrayers: _genericNineDayPrayers('St. Juan Diego'),
    openingPrayer: 'O God, who through St. Juan Diego showed your love...',
    closingPrayer: 'St. Juan Diego, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-cecilia',
    name: 'Novena to St. Cecilia',
    description: 'Patroness of musicians.',
    patronOf: 'Musicians',
    dailyPrayers: _genericNineDayPrayers('St. Cecilia'),
    openingPrayer: 'Dear St. Cecilia, one thing we know for certain...',
    closingPrayer: 'St. Cecilia, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-benedict',
    name: 'Novena to St. Benedict',
    description: 'Father of Western Monasticism.',
    patronOf: 'Europe, Monks',
    dailyPrayers: _genericNineDayPrayers('St. Benedict'),
    openingPrayer:
        'Almighty God, who made St. Benedict an outstanding guide...',
    closingPrayer: 'St. Benedict, pray for us.',
  ),

  // === SPECIAL DEVOTIONS ===
  NovenaDefinition(
    id: 'holy-spirit',
    name: 'Novena to the Holy Spirit',
    description: 'Original novena prayed by the apostles before Pentecost.',
    patronOf: 'Wisdom, Guidance',
    dailyPrayers: _genericNineDayPrayers('Holy Spirit'),
    openingPrayer: 'Come, Holy Spirit, fill the hearts of Thy faithful...',
    closingPrayer: 'Come, Holy Spirit, come!',
  ),
  NovenaDefinition(
    id: 'infant-jesus-prague',
    name: 'Novena to the Infant Jesus of Prague',
    description: 'Devotion to the Christ Child.',
    patronOf: 'Children',
    dailyPrayers: _genericNineDayPrayers('Infant Jesus'),
    openingPrayer: 'O Jesus, Who said, "Ask and you shall receive..."',
    closingPrayer: 'Infant Jesus, bless us.',
  ),
  NovenaDefinition(
    id: 'precious-blood',
    name: 'Novena to the Precious Blood',
    description: 'Devotion to the Blood of Christ shed for our salvation.',
    patronOf: 'Redemption',
    dailyPrayers: _genericNineDayPrayers('Precious Blood'),
    openingPrayer:
        'Almighty and eternal God, You appointed Your only-begotten Son...',
    closingPrayer: 'Precious Blood of Jesus, save us.',
  ),
  NovenaDefinition(
    id: 'holy-souls',
    name: 'Novena for the Holy Souls in Purgatory',
    description: 'Praying for the faithful departed.',
    patronOf: 'The Dead',
    dailyPrayers: _genericNineDayPrayers('Holy Souls'),
    openingPrayer: 'O God, the Creator and Redeemer of all the faithful...',
    closingPrayer: 'Eternal rest grant unto them, O Lord.',
  ),
  NovenaDefinition(
    id: 'christmas',
    name: 'Christmas Novena',
    description: 'Preparation for the birth of Christ.',
    patronOf: 'Christmas',
    dailyPrayers: _genericNineDayPrayers('Baby Jesus'),
    openingPrayer: 'Hail and blessed be the hour and moment...',
    closingPrayer: 'Come, Lord Jesus!',
  ),
];

/// Helper to generate generic prayer structure
List<String> _genericNineDayPrayers(String saint) => List.generate(
  9,
  (i) =>
      'Day ${i + 1}: O glorious $saint, '
      'on this ${_ordinal(i + 1)} day of our novena, '
      'we humbly ask for your intercession. '
      'Please bring our intentions before the throne of God. Amen.',
);

String _ordinal(int n) {
  if (n == 1) return 'first';
  if (n == 2) return 'second';
  if (n == 3) return 'third';
  if (n == 4) return 'fourth';
  if (n == 5) return 'fifth';
  if (n == 6) return 'sixth';
  if (n == 7) return 'seventh';
  if (n == 8) return 'eighth';
  return 'ninth';
}

/// Divine Mercy Novena specific prayers
const _divineMercyPrayers = [
  'Day 1: Today bring to Me all mankind, especially all sinners...',
  'Day 2: Today bring to Me the souls of priests and religious...',
  'Day 3: Today bring to Me all devout and faithful souls...',
  'Day 4: Today bring to Me the pagans and those who do not yet know Me...',
  'Day 5: Today bring to Me the souls of heretics and schismatics...',
  'Day 6: Today bring to Me the meek and humble souls and the souls of little children...',
  'Day 7: Today bring to Me the souls who especially venerate and glorify My mercy...',
  'Day 8: Today bring to Me the souls who are in the prison of Purgatory...',
  'Day 9: Today bring to Me souls who have become lukewarm...',
];
