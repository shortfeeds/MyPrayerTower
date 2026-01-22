import 'package:flutter/material.dart';
import '../models/novena_model.dart';

/// Comprehensive list of 54 Catholic Novenas
final List<NovenaDefinition> allNovenas = [
  // === POPULAR ===
  const NovenaDefinition(
    id: 'divine-mercy',
    name: 'Divine Mercy Novena',
    patron: 'Divine Mercy',
    patronOf: 'God\'s Mercy',
    duration: 'Good Friday - Divine Mercy Sunday',
    description:
        'Prayed from Good Friday to Divine Mercy Sunday, as requested by Jesus to St. Faustina.',
    color: Colors.red,
    colorSecondary: Colors.pink,
    dailyPrayers: _divineMercyPrayers,
    openingPrayer:
        'You expired, Jesus, but the source of life gushed forth for souls...',
    closingPrayer:
        'Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible...',
  ),
  const NovenaDefinition(
    id: 'st-jude',
    name: 'St. Jude Novena',
    patron: 'St. Jude Thaddeus',
    patronOf: 'Hopeless Cases',
    duration: 'Any 9 days',
    description: 'For desperate cases and hopeless situations.',
    color: Colors.green,
    colorSecondary: Colors.teal,
    dailyPrayers: _stJudePrayers,
    openingPrayer:
        'Most holy Apostle, St. Jude, faithful servant and friend of Jesus...',
    closingPrayer:
        'St. Jude, pray for us and for all who invoke your aid. Amen.',
  ),
  const NovenaDefinition(
    id: 'sacred-heart',
    name: 'Sacred Heart Novena',
    patron: 'Sacred Heart',
    patronOf: 'Love of Christ',
    duration: 'Variable',
    description: 'Devotion to the Sacred Heart of Jesus.',
    color: Colors.red,
    colorSecondary: Colors.orange,
    dailyPrayers: _sacredHeartPrayers,
    openingPrayer:
        'O my Jesus, you have said: "Truly I say to you, ask and you will receive..."',
    closingPrayer: 'O Sacred Heart of Jesus, I place all my trust in You.',
  ),
  const NovenaDefinition(
    id: 'our-lady-perpetual-help',
    name: 'Our Lady of Perpetual Help',
    patron: 'Mother of God',
    patronOf: 'Perpetual Help',
    duration: 'Any 9 days',
    description: 'Seeking Mary\'s constant intercession.',
    color: Colors.purple,
    colorSecondary: Colors.deepPurple,
    dailyPrayers: _ourLadyPerpetualHelpPrayers,
    openingPrayer:
        'Behold at thy feet, O Mother of Perpetual Help, a wretched sinner...',
    closingPrayer: 'Mother of Perpetual Help, pray for us. Amen.',
  ),
  const NovenaDefinition(
    id: 'st-anthony',
    name: 'St. Anthony Novena',
    patron: 'St. Anthony',
    patronOf: 'Lost Items',
    duration: 'June 5-13',
    description: 'Patron of lost things and the poor.',
    color: Colors.brown,
    colorSecondary: Colors.grey,
    dailyPrayers: _stAnthonyPrayers,
    openingPrayer:
        'O Holy St. Anthony, gentlest of Saints, your love for God...',
    closingPrayer: 'St. Anthony, pray for us. Amen.',
  ),
  const NovenaDefinition(
    id: 'immaculate-conception',
    name: 'Immaculate Conception Novena',
    patron: 'Virgin Mary',
    patronOf: 'Purity',
    duration: 'Nov 29 - Dec 7',
    description: 'Honoring Mary conceived without sin.',
    color: Colors.blue,
    colorSecondary: Colors.cyan,
    dailyPrayers: _immaculateConceptionPrayers,
    openingPrayer:
        'O God, who by the Immaculate Conception of the Blessed Virgin...',
    closingPrayer:
        'O Mary, conceived without sin, pray for us who have recourse to thee.',
  ),
  const NovenaDefinition(
    id: 'st-joseph',
    name: 'St. Joseph Novena',
    patron: 'St. Joseph',
    patronOf: 'Workers, Fathers',
    duration: 'March 10-18',
    description: 'To the foster father of Jesus.',
    color: Colors.brown,
    colorSecondary: Colors.grey,
    dailyPrayers: _stJosephPrayers,
    openingPrayer:
        'O great St. Joseph, with feelings of unlimited confidence...',
    closingPrayer: 'St. Joseph, pray for us.',
  ),

  // === MARIAN ===
  NovenaDefinition(
    id: 'our-lady-guadalupe',
    name: 'Our Lady of Guadalupe',
    patron: 'Our Lady of Guadalupe',
    patronOf: 'The Americas',
    duration: 'Dec 3-11',
    description: 'Patroness of the Americas and the unborn.',
    color: Colors.teal,
    colorSecondary: Colors.green,
    dailyPrayers: _genericNineDayPrayers('Our Lady of Guadalupe'),
    openingPrayer: 'Our Lady of Guadalupe, Mystical Rose...',
    closingPrayer: 'Our Lady of Guadalupe, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-lourdes',
    name: 'Our Lady of Lourdes',
    patron: 'Our Lady of Lourdes',
    patronOf: 'Healing',
    duration: 'Feb 2-10',
    description: 'Seeking healing through Mary\'s intercession.',
    color: Colors.blue,
    colorSecondary: Colors.lightBlue,
    dailyPrayers: _genericNineDayPrayers('Our Lady of Lourdes'),
    openingPrayer: 'O ever Immaculate Virgin, Mother of Mercy...',
    closingPrayer: 'Our Lady of Lourdes, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-fatima',
    name: 'Our Lady of Fatima',
    patron: 'Our Lady of Fatima',
    patronOf: 'Peace',
    duration: 'May 4-12',
    description: 'Commemorating Mary\'s apparitions at Fatima.',
    color: Colors.blue,
    colorSecondary: Colors.indigo,
    dailyPrayers: _genericNineDayPrayers('Our Lady of Fatima'),
    openingPrayer: 'Most Holy Virgin, who appeared at Fatima...',
    closingPrayer: 'Our Lady of Fatima, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-mount-carmel',
    name: 'Our Lady of Mount Carmel',
    patron: 'Our Lady of Mount Carmel',
    patronOf: 'Carmelites',
    duration: 'July 7-15',
    description: 'Devotion associated with the Brown Scapular.',
    color: Colors.orange[800]!,
    colorSecondary: Colors.amber[900],
    dailyPrayers: _genericNineDayPrayers('Our Lady of Mount Carmel'),
    openingPrayer: 'O beautiful Flower of Carmel, most fruitful vine...',
    closingPrayer: 'Our Lady of Mount Carmel, pray for us.',
  ),
  NovenaDefinition(
    id: 'our-lady-sorrows',
    name: 'Our Lady of Sorrows',
    patron: 'Our Lady of Sorrows',
    patronOf: 'Suffering',
    duration: 'Sept 6-14',
    description: 'Meditating on Mary\'s seven sorrows.',
    color: Colors.purple[800]!,
    colorSecondary: Colors.deepPurple[900],
    dailyPrayers: _genericNineDayPrayers('Sorrowful Mother'),
    openingPrayer: 'Most holy and afflicted Virgin, Queen of Martyrs...',
    closingPrayer: 'Our Lady of Sorrows, pray for us.',
  ),
  NovenaDefinition(
    id: 'assumption',
    name: 'Assumption Novena',
    patron: 'Virgin Mary',
    patronOf: 'Eternal Life',
    duration: 'Aug 6-14',
    description: 'Honoring Mary\'s bodily assumption into Heaven.',
    color: Colors.amber,
    colorSecondary: Colors.orange,
    dailyPrayers: _genericNineDayPrayers('Blessed Mother'),
    openingPrayer: 'O Immaculate Virgin, Mother of God and our Mother...',
    closingPrayer: 'Mary, assumed into Heaven, pray for us.',
  ),
  NovenaDefinition(
    id: 'miraculous-medal',
    name: 'Miraculous Medal Novena',
    patron: 'Our Lady of Miraculous Medal',
    patronOf: 'Miracles',
    duration: 'Nov 18-26',
    description: 'Based on the apparition to St. Catherine Labouré.',
    color: Colors.blue[600]!,
    colorSecondary: Colors.indigo[500],
    dailyPrayers: _genericNineDayPrayers('Our Lady of the Miraculous Medal'),
    openingPrayer: 'O Immaculate Virgin Mary, Mother of Our Lord Jesus...',
    closingPrayer: 'O Mary, conceived without sin, pray for us.',
  ),
  NovenaDefinition(
    id: 'undoer-of-knots',
    name: 'Mary, Undoer of Knots',
    patron: 'Virgin Mary',
    patronOf: 'Difficult Problems',
    duration: 'Any 9 days',
    description: 'For untangling the knots of problems in our lives.',
    color: Colors.pink,
    colorSecondary: Colors.red,
    dailyPrayers: _genericNineDayPrayers('Mary, Undoer of Knots'),
    openingPrayer:
        'Dearest Holy Mother, you are generous with all who call upon you...',
    closingPrayer: 'Mary, Undoer of Knots, pray for us.',
  ),

  // === SAINTS ===
  NovenaDefinition(
    id: 'st-therese',
    name: 'St. Thérèse Novena',
    patron: 'St. Thérèse of Lisieux',
    patronOf: 'Missionaries',
    duration: 'Sept 22 - Oct 1',
    description: 'The Little Flower who promised to spend heaven doing good.',
    color: Colors.pink[300]!,
    colorSecondary: Colors.pinkAccent,
    dailyPrayers: _genericNineDayPrayers('St. Thérèse'),
    openingPrayer: 'O Little Thérèse of the Child Jesus...',
    closingPrayer: 'St. Thérèse, shower roses upon us.',
  ),
  NovenaDefinition(
    id: 'st-rita',
    name: 'St. Rita Novena',
    patron: 'St. Rita',
    patronOf: 'Impossible Causes',
    duration: 'May 13-21',
    description: 'Patroness of impossible causes and abused wives.',
    color: Colors.red[700]!,
    colorSecondary: Colors.red[900],
    dailyPrayers: _genericNineDayPrayers('St. Rita'),
    openingPrayer: 'O holy protectress of those who art in greatest need...',
    closingPrayer: 'St. Rita, advocate of the impossible, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-padre-pio',
    name: 'St. Padre Pio Novena',
    patron: 'St. Padre Pio',
    patronOf: 'Healing',
    duration: 'Sept 14-22',
    description: 'Stigmatist and confessor of Pietrelcina.',
    color: Colors.brown[700]!,
    colorSecondary: Colors.brown[600],
    dailyPrayers: _genericNineDayPrayers('St. Padre Pio'),
    openingPrayer: 'Dear God, You generously blessed Your servant Padre Pio...',
    closingPrayer: 'St. Padre Pio, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-michael',
    name: 'St. Michael Novena',
    patron: 'St. Michael Archangel',
    patronOf: 'Protection',
    duration: 'Sept 20-28',
    description: 'Prince of the Heavenly Host, defender against evil.',
    color: Colors.red[600]!,
    colorSecondary: Colors.red[800],
    dailyPrayers: _genericNineDayPrayers('St. Michael'),
    openingPrayer: 'St. Michael the Archangel, defend us in battle...',
    closingPrayer: 'St. Michael, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-raphael',
    name: 'St. Raphael Novena',
    patron: 'St. Raphael Archangel',
    patronOf: 'Healing, Travelers',
    duration: 'Oct 15-23',
    description: 'Healer, guide of travelers, and patron of happy meetings.',
    color: Colors.green,
    colorSecondary: Colors.teal,
    dailyPrayers: _genericNineDayPrayers('St. Raphael'),
    openingPrayer:
        'Glorious Archangel St. Raphael, great prince of the heavenly court...',
    closingPrayer: 'St. Raphael, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gabriel',
    name: 'St. Gabriel Novena',
    patron: 'St. Gabriel Archangel',
    patronOf: 'Communications',
    duration: 'Sept 20-28',
    description: 'Messenger of God, patron of communications.',
    color: Colors.blue,
    colorSecondary: Colors.lightBlue,
    dailyPrayers: _genericNineDayPrayers('St. Gabriel'),
    openingPrayer: 'O Blessed Archangel Gabriel, we beseech thee...',
    closingPrayer: 'St. Gabriel, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-francis-assisi',
    name: 'St. Francis of Assisi',
    patron: 'St. Francis',
    patronOf: 'Animals, Ecology',
    duration: 'Sept 25 - Oct 3',
    description: 'Patron of animals and the environment.',
    color: Colors.brown[600]!,
    colorSecondary: Colors.green[700],
    dailyPrayers: _genericNineDayPrayers('St. Francis'),
    openingPrayer: 'O God, You enabled St. Francis to imitate Christ...',
    closingPrayer: 'St. Francis, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-clare',
    name: 'St. Clare of Assisi',
    patron: 'St. Clare',
    patronOf: 'Television',
    duration: 'Aug 2-10',
    description: 'Foundress of the Poor Clares.',
    color: Colors.brown[400]!,
    colorSecondary: Colors.grey,
    dailyPrayers: _genericNineDayPrayers('St. Clare'),
    openingPrayer:
        'God of mercy, You inspired St. Clare with the love of poverty...',
    closingPrayer: 'St. Clare, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-monica',
    name: 'St. Monica Novena',
    patron: 'St. Monica',
    patronOf: 'Mothers',
    duration: 'Aug 18-26',
    description: 'Patroness of mothers and those with wayward children.',
    color: Colors.purple,
    colorSecondary: Colors.deepPurple,
    dailyPrayers: _genericNineDayPrayers('St. Monica'),
    openingPrayer: 'Dear St. Monica, troubled wife and mother...',
    closingPrayer: 'St. Monica, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-augustine',
    name: 'St. Augustine Novena',
    patron: 'St. Augustine',
    patronOf: 'Converts',
    duration: 'Aug 19-27',
    description:
        'Doctor of the Church, converted through his mother\'s prayers.',
    color: Colors.red[800]!,
    colorSecondary: Colors.orange[800],
    dailyPrayers: _genericNineDayPrayers('St. Augustine'),
    openingPrayer:
        'O Glorious St. Augustine, who after leading a life of sin...',
    closingPrayer: 'St. Augustine, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-anne',
    name: 'St. Anne Novena',
    patron: 'St. Anne',
    patronOf: 'Mothers, Grandmothers',
    duration: 'July 17-25',
    description: 'Mother of the Blessed Virgin Mary.',
    color: Colors.green,
    colorSecondary: Colors.green[700],
    dailyPrayers: _genericNineDayPrayers('St. Anne'),
    openingPrayer: 'Good St. Anne, mother of her who is our life...',
    closingPrayer: 'St. Anne, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-joachim',
    name: 'St. Joachim Novena',
    patron: 'St. Joachim',
    patronOf: 'Fathers',
    duration: 'July 17-25',
    description: 'Father of the Blessed Virgin Mary.',
    color: Colors.green[700]!,
    colorSecondary: Colors.green[800],
    dailyPrayers: _genericNineDayPrayers('St. Joachim'),
    openingPrayer: 'O Glorious St. Joachim, spouse of St. Anne...',
    closingPrayer: 'St. Joachim, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-philomena',
    name: 'St. Philomena Novena',
    patron: 'St. Philomena',
    patronOf: 'Youth',
    duration: 'Aug 2-10',
    description: 'Virgin and martyr, known as the "Wonder Worker".',
    color: Colors.teal[300]!,
    colorSecondary: Colors.pinkAccent,
    dailyPrayers: _genericNineDayPrayers('St. Philomena'),
    openingPrayer: 'O faithful Virgin and glorious martyr, St. Philomena...',
    closingPrayer: 'St. Philomena, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-peregrine',
    name: 'St. Peregrine Novena',
    patron: 'St. Peregrine',
    patronOf: 'Cancer Patients',
    duration: 'April 23 - May 1',
    description: 'Patron saint of cancer patients.',
    color: Colors.brown[800]!,
    colorSecondary: Colors.black54,
    dailyPrayers: _genericNineDayPrayers('St. Peregrine'),
    openingPrayer: 'O great St. Peregrine, you have been called the Mighty...',
    closingPrayer: 'St. Peregrine, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-dymphna',
    name: 'St. Dymphna Novena',
    patron: 'St. Dymphna',
    patronOf: 'Mental Health',
    duration: 'May 6-14',
    description: 'Patroness of mental illness and anxiety.',
    color: Colors.teal,
    colorSecondary: Colors.green,
    dailyPrayers: _genericNineDayPrayers('St. Dymphna'),
    openingPrayer:
        'Good St. Dymphna, great wonder-worker in every affliction...',
    closingPrayer: 'St. Dymphna, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gerard',
    name: 'St. Gerard Novena',
    patron: 'St. Gerard Majella',
    patronOf: 'Expectant Mothers',
    duration: 'Oct 7-15',
    description: 'Patron of expectant mothers and childbirth.',
    color: Colors.blue[300]!,
    colorSecondary: Colors.cyan,
    dailyPrayers: _genericNineDayPrayers('St. Gerard'),
    openingPrayer: 'O Good St. Gerard, powerful intercessor before God...',
    closingPrayer: 'St. Gerard, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-expedite',
    name: 'St. Expedite Novena',
    patron: 'St. Expedite',
    patronOf: 'Urgent Causes',
    duration: 'April 10-18',
    description: 'Patron of urgent causes and quick solutions.',
    color: Colors.red,
    colorSecondary: Colors.redAccent,
    dailyPrayers: _genericNineDayPrayers('St. Expedite'),
    openingPrayer: 'Our dear martyr and protector, St. Expedite...',
    closingPrayer: 'St. Expedite, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-blaise',
    name: 'St. Blaise Novena',
    patron: 'St. Blaise',
    patronOf: 'Throat Illnesses',
    duration: 'Jan 25 - Feb 2',
    description: 'Patron of throat ailments.',
    color: Colors.red,
    colorSecondary: Colors.purple,
    dailyPrayers: _genericNineDayPrayers('St. Blaise'),
    openingPrayer: 'O Glorious St. Blaise, who by thy martyrdom...',
    closingPrayer: 'St. Blaise, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-lucy',
    name: 'St. Lucy Novena',
    patron: 'St. Lucy',
    patronOf: 'Eye Problems',
    duration: 'Dec 4-12',
    description: 'Patroness of those with eye troubles.',
    color: Colors.red,
    colorSecondary: Colors.pink,
    dailyPrayers: _genericNineDayPrayers('St. Lucy'),
    openingPrayer: 'O St. Lucy, you preferred to let your eyes be torn out...',
    closingPrayer: 'St. Lucy, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-christopher',
    name: 'St. Christopher Novena',
    patron: 'St. Christopher',
    patronOf: 'Travelers',
    duration: 'July 16-24',
    description: 'Patron of travelers and motorists.',
    color: Colors.blue[700]!,
    colorSecondary: Colors.blue[900],
    dailyPrayers: _genericNineDayPrayers('St. Christopher'),
    openingPrayer: 'Dear St. Christopher, patron of travelers...',
    closingPrayer: 'St. Christopher, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-patrick',
    name: 'St. Patrick Novena',
    patron: 'St. Patrick',
    patronOf: 'Ireland',
    duration: 'March 8-16',
    description: 'Apostle of Ireland.',
    color: Colors.green,
    colorSecondary: Colors.green[800],
    dailyPrayers: _genericNineDayPrayers('St. Patrick'),
    openingPrayer:
        'Dear St. Patrick, in your humility you called yourself a sinner...',
    closingPrayer: 'St. Patrick, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-john-paul-ii',
    name: 'St. John Paul II Novena',
    patron: 'St. John Paul II',
    patronOf: 'Families, Youth',
    duration: 'Oct 13-21',
    description: 'Pope and great evangelizer of the modern age.',
    color: Colors.yellow[700]!,
    colorSecondary: Colors.amber,
    dailyPrayers: _genericNineDayPrayers('St. John Paul II'),
    openingPrayer: 'O St. John Paul, from the window of heaven...',
    closingPrayer: 'St. John Paul II, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-faustina',
    name: 'St. Faustina Novena',
    patron: 'St. Faustina',
    patronOf: 'Divine Mercy',
    duration: 'Sept 26 - Oct 4',
    description: 'Apostle of Divine Mercy.',
    color: Colors.red,
    colorSecondary: Colors.pink,
    dailyPrayers: _genericNineDayPrayers('St. Faustina'),
    openingPrayer:
        'O Jesus, You inspired St. Faustina with profound veneration...',
    closingPrayer: 'St. Faustina, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-teresa-calcutta',
    name: 'Mother Teresa Novena',
    patron: 'St. Teresa of Calcutta',
    patronOf: 'The Poor',
    duration: 'Aug 27 - Sept 4',
    description: 'Foundress of the Missionaries of Charity.',
    color: Colors.blue[400]!,
    colorSecondary: Colors.blue,
    dailyPrayers: _genericNineDayPrayers('St. Teresa of Calcutta'),
    openingPrayer: 'God, our Father, You called St. Teresa of Calcutta...',
    closingPrayer: 'St. Teresa of Calcutta, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-maximilian-kolbe',
    name: 'St. Maximilian Kolbe',
    patron: 'St. Maximilian',
    patronOf: 'Prisoners',
    duration: 'Aug 5-13',
    description: 'Martyr of charity at Auschwitz.',
    color: Colors.brown[700]!,
    colorSecondary: Colors.grey[800],
    dailyPrayers: _genericNineDayPrayers('St. Maximilian Kolbe'),
    openingPrayer:
        'O Lord Jesus Christ, who said, "Greater love than this no man has..."',
    closingPrayer: 'St. Maximilian Kolbe, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-thomas-aquinas',
    name: 'St. Thomas Aquinas',
    patron: 'St. Thomas Aquinas',
    patronOf: 'Students',
    duration: 'Jan 19-27',
    description: 'Patron of students and scholars.',
    color: Colors.amber[700]!,
    colorSecondary: Colors.yellow[800],
    dailyPrayers: _genericNineDayPrayers('St. Thomas Aquinas'),
    openingPrayer: 'O God, Who made St. Thomas Aquinas most distinguished...',
    closingPrayer: 'St. Thomas Aquinas, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-ignatius-loyola',
    name: 'St. Ignatius Novena',
    patron: 'St. Ignatius',
    patronOf: 'Educators',
    duration: 'July 22-30',
    description: 'Founder of the Jesuits.',
    color: Colors.brown,
    colorSecondary: Colors.brown[700],
    dailyPrayers: _genericNineDayPrayers('St. Ignatius'),
    openingPrayer: 'O God, who for the greater glory of Your name...',
    closingPrayer: 'St. Ignatius, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-francis-xavier',
    name: 'St. Francis Xavier Novena',
    patron: 'St. Francis Xavier',
    patronOf: 'Missionaries',
    duration: 'Dec 4-12 relative',
    description: 'Patron of missions and foreign missionaries.',
    color: Colors.red,
    colorSecondary: Colors.orange[800],
    dailyPrayers: _genericNineDayPrayers('St. Francis Xavier'),
    openingPrayer: 'O most lovable and loving St. Francis Xavier...',
    closingPrayer: 'St. Francis Xavier, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-john-bosco',
    name: 'St. John Bosco Novena',
    patron: 'St. John Bosco',
    patronOf: 'Youth',
    duration: 'Jan 22-30',
    description: 'Patron of youth and educators.',
    color: Colors.blue[700]!,
    colorSecondary: Colors.indigo,
    dailyPrayers: _genericNineDayPrayers('St. John Bosco'),
    openingPrayer:
        'O glorious Saint John Bosco, who, in order to lead young souls...',
    closingPrayer: 'St. John Bosco, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-maria-goretti',
    name: 'St. Maria Goretti Novena',
    patron: 'St. Maria Goretti',
    patronOf: 'Purity',
    duration: 'June 27 - July 5',
    description: 'Patroness of purity and youth.',
    color: Colors.pink[300]!,
    colorSecondary: Colors.pink,
    dailyPrayers: _genericNineDayPrayers('St. Maria Goretti'),
    openingPrayer: 'O St. Maria Goretti, strengthened by God\'s grace...',
    closingPrayer: 'St. Maria Goretti, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-gianna',
    name: 'St. Gianna Novena',
    patron: 'St. Gianna',
    patronOf: 'Unborn Children',
    duration: 'April 19-27',
    description: 'Patroness of mothers, physicians, and unborn children.',
    color: Colors.pink,
    colorSecondary: Colors.pinkAccent,
    dailyPrayers: _genericNineDayPrayers('St. Gianna'),
    openingPrayer: 'O St. Gianna Beretta Molla, heroic mother...',
    closingPrayer: 'St. Gianna, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-martin-de-porres',
    name: 'St. Martin de Porres',
    patron: 'St. Martin de Porres',
    patronOf: 'Racial Harmony',
    duration: 'Oct 25 - Nov 2',
    description: 'Patron of mixed-race people and hairdressers.',
    color: Colors.brown,
    colorSecondary: Colors.black45,
    dailyPrayers: _genericNineDayPrayers('St. Martin de Porres'),
    openingPrayer: 'Most humble St. Martin de Porres, your burning charity...',
    closingPrayer: 'St. Martin de Porres, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-juan-diego',
    name: 'St. Juan Diego Novena',
    patron: 'St. Juan Diego',
    patronOf: 'Indigenous Peoples',
    duration: 'Dec 1-9',
    description: 'Witness to Our Lady of Guadalupe.',
    color: Colors.orange[800]!,
    colorSecondary: Colors.amber[800],
    dailyPrayers: _genericNineDayPrayers('St. Juan Diego'),
    openingPrayer: 'O God, who through St. Juan Diego showed your love...',
    closingPrayer: 'St. Juan Diego, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-cecilia',
    name: 'St. Cecilia Novena',
    patron: 'St. Cecilia',
    patronOf: 'Musicians',
    duration: 'Nov 13-21',
    description: 'Patroness of musicians.',
    color: Colors.pink,
    colorSecondary: Colors.orange,
    dailyPrayers: _genericNineDayPrayers('St. Cecilia'),
    openingPrayer: 'Dear St. Cecilia, one thing we know for certain...',
    closingPrayer: 'St. Cecilia, pray for us.',
  ),
  NovenaDefinition(
    id: 'st-benedict',
    name: 'St. Benedict Novena',
    patron: 'St. Benedict',
    patronOf: 'Europe, Monks',
    duration: 'July 2-10',
    description: 'Father of Western Monasticism.',
    color: Colors.brown[700]!,
    colorSecondary: Colors.black54,
    dailyPrayers: _genericNineDayPrayers('St. Benedict'),
    openingPrayer:
        'Almighty God, who made St. Benedict an outstanding guide...',
    closingPrayer: 'St. Benedict, pray for us.',
  ),
  NovenaDefinition(
    id: 'holy-spirit',
    name: 'Holy Spirit Novena',
    patron: 'Holy Spirit',
    patronOf: 'Wisdom',
    duration: 'Ascension to Pentecost',
    description: 'Obtaining the seven gifts of the Holy Spirit.',
    color: Colors.red,
    colorSecondary: Colors.orange,
    dailyPrayers: _genericNineDayPrayers('Holy Spirit'),
    openingPrayer: 'Come, Holy Spirit, fill the hearts of Thy faithful...',
    closingPrayer: 'Come, Holy Spirit, come!',
  ),
  NovenaDefinition(
    id: 'infant-of-prague',
    name: 'Infant of Prague Novena',
    patron: 'Infant Jesus',
    patronOf: 'Children',
    duration: 'Any 9 days',
    description: 'Devotion to the Holy Child Jesus.',
    color: Colors.amber,
    colorSecondary: Colors.yellow,
    dailyPrayers: _genericNineDayPrayers('Infant Jesus'),
    openingPrayer: 'O Jesus, Who said, "Ask and you shall receive..."',
    closingPrayer: 'Infant Jesus, bless us.',
  ),
  NovenaDefinition(
    id: 'precious-blood',
    name: 'Precious Blood Novena',
    patron: 'Precious Blood',
    patronOf: 'Redemption',
    duration: 'June 22-30',
    description: 'Devotion to the Blood of Christ shed for our salvation.',
    color: Colors.red[900]!,
    colorSecondary: Colors.red,
    dailyPrayers: _genericNineDayPrayers('Precious Blood'),
    openingPrayer:
        'Almighty and eternal God, You appointed Your only-begotten Son...',
    closingPrayer: 'Precious Blood of Jesus, save us.',
  ),
  NovenaDefinition(
    id: 'holy-souls',
    name: 'Holy Souls Novena',
    patron: 'Holy Souls',
    patronOf: 'The Dead',
    duration: 'Oct 24 - Nov 1',
    description: 'Praying for the faithful departed.',
    color: Colors.grey[700]!,
    colorSecondary: Colors.grey[900],
    dailyPrayers: _genericNineDayPrayers('Holy Souls'),
    openingPrayer: 'O God, the Creator and Redeemer of all the faithful...',
    closingPrayer: 'Eternal rest grant unto them, O Lord.',
  ),
  NovenaDefinition(
    id: 'christmas',
    name: 'Christmas Novena',
    patron: 'Infant Jesus',
    patronOf: 'Christmas',
    duration: 'Dec 16-24',
    description: 'Preparation for the birth of Christ.',
    color: Colors.green[800]!,
    colorSecondary: Colors.red[800],
    dailyPrayers: _genericNineDayPrayers('Baby Jesus'),
    openingPrayer: 'Hail and blessed be the hour and moment...',
    closingPrayer: 'Come, Lord Jesus!',
  ),
];

// Helper to generate comprehensive prayer structure with authentic content
List<String> _genericNineDayPrayers(String saint) => [
  '''Day 1: O glorious \u0024saint, 
on this first day of our novena, we humbly come before you.
You who walked faithfully on earth, now intercede for us in heaven.

Lord, have mercy on us.
Christ, have mercy on us.
Lord, have mercy on us.

Our Father, who art in heaven, hallowed be Thy name;
Thy kingdom come; Thy will be done on earth as it is in heaven.
Give us this day our daily bread; and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation, but deliver us from evil. Amen.

Hail Mary, full of grace, the Lord is with thee;
blessed art thou among women, and blessed is the fruit of thy womb, Jesus.
Holy Mary, Mother of God, pray for us sinners,
now and at the hour of our death. Amen.

Glory be to the Father, and to the Son, and to the Holy Spirit,
as it was in the beginning, is now, and ever shall be, world without end. Amen.

O \u0024saint, pray for us, that we may be made worthy of the promises of Christ.''',
  '''Day 2: O blessed \u0024saint, 
on this second day we reflect on your faithfulness to God's will.
You followed Christ with your whole heart; help us to do the same.

Lord, open our hearts to receive Your grace today.
Grant us the virtues we need to persevere in faith.
Through the intercession of \u0024saint, hear our prayer.

Our Father... Hail Mary... Glory Be...

O \u0024saint, you persevered through trials with unwavering trust.
Help us to face our own struggles with the same courage.
Pray for us before the throne of God. Amen.''',
  '''Day 3: O holy \u0024saint, 
on this third day we meditate on your love for God and neighbor.
Your life was a witness of charity; inspire us to love as you loved.

V. \u0024saint, friend of Christ,
R. Pray for us.
V. \u0024saint, model of virtue,
R. Pray for us.
V. \u0024saint, intercessor for the faithful,
R. Pray for us.

Our Father... Hail Mary... Glory Be...

Lord Jesus, You have given us \u0024saint as an example of holiness.
Grant that by imitating their virtues on earth,
we may share their glory in heaven. Amen.''',
  '''Day 4: O loving \u0024saint, 
on this fourth day we ask for your powerful intercession.
You who are close to the Heart of Jesus, present our needs to Him.

Act of Contrition:
O my God, I am heartily sorry for having offended Thee,
and I detest all my sins because of Thy just punishments,
but most of all because they offend Thee, my God,
Who art all-good and deserving of all my love.
I firmly resolve, with the help of Thy grace,
to sin no more and to avoid the near occasion of sin. Amen.

Our Father... Hail Mary... Glory Be...

\u0024saint, pray that we may have true contrition for our sins
and the grace to amend our lives. Amen.''',
  '''Day 5: O glorious \u0024saint, 
on this fifth day we seek your guidance on our spiritual journey.
Lead us closer to Christ in all that we do.

Anima Christi:
Soul of Christ, sanctify me.
Body of Christ, save me.
Blood of Christ, inebriate me.
Water from the side of Christ, wash me.
Passion of Christ, strengthen me.
O good Jesus, hear me.
Within Thy wounds hide me.
Suffer me not to be separated from Thee.
From the malignant enemy defend me.
In the hour of my death call me.
And bid me come unto Thee,
That with Thy Saints I may praise Thee forever and ever. Amen.

Our Father... Hail Mary... Glory Be...

\u0024saint, guide us on the path to holiness. Amen.''',
  '''Day 6: O faithful \u0024saint, 
on this sixth day we ask for the virtue of hope.
Though trials surround us, may we trust in God's providence.

The Memorare:
Remember, O most gracious Virgin Mary,
that never was it known that anyone who fled to thy protection,
implored thy help, or sought thy intercession was left unaided.
Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother;
to thee do I come, before thee I stand, sinful and sorrowful.
O Mother of the Word Incarnate, despise not my petitions,
but in thy mercy hear and answer me. Amen.

Our Father... Hail Mary... Glory Be...

Through the merits of \u0024saint, Lord, increase our hope. Amen.''',
  '''Day 7: O dear \u0024saint, 
on this seventh day we ask for the virtue of charity.
Fill our hearts with love for God and for all His children.

Prayer of St. Francis:
Lord, make me an instrument of Your peace:
where there is hatred, let me sow love;
where there is injury, pardon;
where there is doubt, faith;
where there is despair, hope;
where there is darkness, light;
where there is sadness, joy.

O Divine Master, grant that I may not so much seek
to be consoled as to console,
to be understood as to understand,
to be loved as to love.

For it is in giving that we receive,
it is in pardoning that we are pardoned,
and it is in dying that we are born to eternal life. Amen.

Our Father... Hail Mary... Glory Be...

\u0024saint, obtain for us the grace of true charity. Amen.''',
  '''Day 8: O valiant \u0024saint, 
on this eighth day we pray for perseverance in our faith.
Help us to remain steadfast until the end.

Prayer for Final Perseverance:
O my God, I adore Thee and acknowledge Thee as the sovereign Lord
of all things, on whom I wholly depend.
Grant me the grace of final perseverance,
that I may die in Thy love and friendship,
and so pass from this world to enjoy Thy blessed presence forever.

Through the intercession of \u0024saint and all the Saints,
may we persevere in grace until the end.
Our Father... Hail Mary... Glory Be...

Jesus, Mary, and Joseph, I give you my heart and my soul.
Jesus, Mary, and Joseph, assist me in my last agony.
Jesus, Mary, and Joseph, may I breathe forth my soul in peace with you. Amen.''',
  '''Day 9: O triumphant \u0024saint, 
on this final day of our novena, we thank God for your holy example.
Present all our intentions to the throne of the Most High.

Te Deum (excerpt):
You are God: we praise You;
You are the Lord: we acclaim You;
You are the eternal Father:
All creation worships You.
To You all angels, all the powers of heaven,
Cherubim and Seraphim, sing in endless praise:
Holy, holy, holy Lord, God of power and might,
heaven and earth are full of Your glory.

Our Father... Hail Mary... Glory Be...

We thank you, O Lord, for the gift of \u0024saint to Your Church.
Through their prayers, grant the intentions we have placed before You
during these nine days of prayer.
In Your mercy, hear and answer us.
Through Christ our Lord. Amen.

\u0024saint, pray for us now and always! Amen.''',
];

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

const _stJudePrayers = [
  'Day 1: St. Jude, glorious Apostle and Martyr, great in virtue and rich in miracles...',
  'Day 2: O St. Jude, who was an Apostle and Martyr, great in virtue and rich in miracles...',
  'Day 3: St. Jude, Apostle of Christ and glorious Martyr, I desire to praise God...',
  'Day 4: St. Jude, you who have always been the refuge of those in despair...',
  'Day 5: St. Jude, holy Apostle, who labored so zealously for the conversion of souls...',
  'Day 6: St. Jude, I pray that I may have a great devotion to the Passion of Jesus...',
  'Day 7: St. Jude, Apostle of Mercy, help me to be merciful to others...',
  'Day 8: St. Jude, help me to keep my mind fixed on the eternal joys of heaven...',
  'Day 9: St. Jude, I thank God for the graces He has bestowed upon you...',
];

const _sacredHeartPrayers = [
  'Day 1: O most holy Heart of Jesus, fountain of every blessing, I adore you...',
  'Day 2: O Sacred Heart of Jesus, I have asked you for many favors, but I earnestly ask for this one...',
  'Day 3: O Sacred Heart of Jesus, have mercy on us and on our erring brethren...',
  'Day 4: O Sacred Heart of Jesus, I place all my trust in you, let me not be disappointed...',
  'Day 5: O Sacred Heart of Jesus, I believe in your love for me...',
  'Day 6: O Sacred Heart of Jesus, make my heart like yours...',
  'Day 7: O Sacred Heart of Jesus, I love you; increase my love...',
  'Day 8: O Sacred Heart of Jesus, be my salvation...',
  'Day 9: O Sacred Heart of Jesus, grant me the grace of final perseverance...',
];

const _ourLadyPerpetualHelpPrayers = [
  'Day 1: O Mother of Perpetual Help, grant that I may ever invoke your powerful name...',
  'Day 2: O Mother of Perpetual Help, grant that I may ever love and serve God...',
  'Day 3: O Mother of Perpetual Help, grant that I may ever be a true child of God...',
  'Day 4: O Mother of Perpetual Help, grant that I may ever be faithful to the Church...',
  'Day 5: O Mother of Perpetual Help, grant that I may ever be a true follower of Christ...',
  'Day 6: O Mother of Perpetual Help, grant that I may ever lead a holy life...',
  'Day 7: O Mother of Perpetual Help, grant that I may ever die a holy death...',
  'Day 8: O Mother of Perpetual Help, grant that I may ever be with you in heaven...',
  'Day 9: O Mother of Perpetual Help, grant that I may ever praise and thank God...',
];

const _stAnthonyPrayers = [
  'Day 1: O Holy St. Anthony, gentlest of Saints, your love for God...',
  'Day 2: O miracle-worker, St. Anthony, remember that it never has been heard...',
  'Day 3: O Holy St. Anthony, who by your miracles have obtained the power...',
  'Day 4: O Holy St. Anthony, you who have obtained from God the power...',
  'Day 5: O Holy St. Anthony, whom God has chosen to be the comforter...',
  'Day 6: O Holy St. Anthony, who have been called the "Hammer of Heretics"...',
  'Day 7: O Holy St. Anthony, who have been called the "Ark of the Covenant"...',
  'Day 8: O Holy St. Anthony, who have been called the "Star of the Sea"...',
  'Day 9: O Holy St. Anthony, who have been called the "Light of the World"...',
];

const _immaculateConceptionPrayers = [
  'Day 1: O most Holy Virgin, who was pleasing to the Lord and became His Mother...',
  'Day 2: O most Holy Virgin, in your Immaculate Conception you were preserved...',
  'Day 3: O most Holy Virgin, you are the glory of Jerusalem and the joy of Israel...',
  'Day 4: O most Holy Virgin, you are the lily among thorns...',
  'Day 5: O most Holy Virgin, you are the refuge of sinners...',
  'Day 6: O most Holy Virgin, you are the comforter of the afflicted...',
  'Day 7: O most Holy Virgin, you are the help of Christians...',
  'Day 8: O most Holy Virgin, you are the Queen of Angels...',
  'Day 9: O most Holy Virgin, you are the Queen of All Saints...',
];

const _stJosephPrayers = [
  'Day 1: O great St. Joseph, with feelings of unlimited confidence...',
  'Day 2: O great St. Joseph, you were chosen by God to be the foster-father...',
  'Day 3: O great St. Joseph, you were the faithful guardian of the Holy Family...',
  'Day 4: O great St. Joseph, you were the model of laborers...',
  'Day 5: O great St. Joseph, you were the pillar of families...',
  'Day 6: O great St. Joseph, you are the comfort of the afflicted...',
  'Day 7: O great St. Joseph, you are the hope of the sick...',
  'Day 8: O great St. Joseph, you are the patron of the dying...',
  'Day 9: O great St. Joseph, you are the terror of demons...',
];
