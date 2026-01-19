/// The 14 Stations of the Cross with meditations and prayers
class Station {
  final int number;
  final String title;
  final String scripture;
  final String meditation;
  final String prayer;

  const Station({
    required this.number,
    required this.title,
    required this.scripture,
    required this.meditation,
    required this.prayer,
  });
}

const List<Station> stationsOfTheCross = [
  Station(
    number: 1,
    title: 'Jesus is Condemned to Death',
    scripture:
        '"Pilate said to them, \'What then shall I do with Jesus called Messiah?\' They all said, \'Let him be crucified!\'" - Matthew 27:22',
    meditation:
        'Pilate sentences Jesus to death. Though innocent, Jesus accepts this unjust condemnation in silence. He does this out of love for us, to free us from the condemnation our sins deserve.',
    prayer:
        'Lord Jesus, You were condemned to death for my sins. Help me to accept the injustices I face with patience and love, uniting my sufferings to Yours. Grant me the grace to never condemn others unjustly. Amen.',
  ),
  Station(
    number: 2,
    title: 'Jesus Takes Up His Cross',
    scripture:
        '"Whoever wishes to come after me must deny himself, take up his cross, and follow me." - Matthew 16:24',
    meditation:
        'Jesus embraces the heavy wooden cross, the instrument of His suffering. He carries it willingly, knowing it is the key to our salvation. Each splinter, each weight, He accepts for love of us.',
    prayer:
        'Lord Jesus, You embraced the Cross without complaint. Help me to accept the crosses in my life—illness, disappointment, hardship—as opportunities to grow closer to You. Amen.',
  ),
  Station(
    number: 3,
    title: 'Jesus Falls the First Time',
    scripture:
        '"But he was pierced for our transgressions, crushed for our iniquities." - Isaiah 53:5',
    meditation:
        'Weakened by the scourging and the weight of the cross, Jesus falls to the ground. Yet He rises again. His fall teaches us that though we may stumble in our spiritual journey, we must always get back up.',
    prayer:
        'Lord Jesus, when I fall into sin, give me the strength to rise again. Never let me remain in despair, but always trust in Your mercy and forgiveness. Amen.',
  ),
  Station(
    number: 4,
    title: 'Jesus Meets His Sorrowful Mother',
    scripture: '"And you yourself a sword will pierce." - Luke 2:35',
    meditation:
        'Along the way, Jesus encounters His Mother Mary. Their eyes meet in a moment of profound sorrow and love. Mary shares in His suffering, offering her pain as a prayer for humanity.',
    prayer:
        'Lord Jesus, through the sorrow of Your Mother, teach me to unite my sufferings with Yours. Mary, Mother of Sorrows, pray for me in my times of trial. Amen.',
  ),
  Station(
    number: 5,
    title: 'Simon of Cyrene Helps Jesus Carry the Cross',
    scripture:
        '"They pressed into service a passer-by, Simon, a Cyrenian... to carry his cross." - Mark 15:21',
    meditation:
        'Simon of Cyrene is forced to help Jesus carry the Cross. Initially reluctant, he becomes a witness to Christ\'s love. We too are called to help others carry their burdens.',
    prayer:
        'Lord Jesus, help me to be a Simon for others—to assist those who struggle, even when it is inconvenient. May I see Your face in those who suffer. Amen.',
  ),
  Station(
    number: 6,
    title: 'Veronica Wipes the Face of Jesus',
    scripture:
        '"Whatever you did for one of these least brothers of mine, you did for me." - Matthew 25:40',
    meditation:
        'A woman named Veronica breaks through the crowd to wipe the blood and sweat from Jesus\' face. Her small act of compassion is rewarded with His image imprinted on her cloth.',
    prayer:
        'Lord Jesus, give me the courage to show compassion even when others do not. May my small acts of kindness bring comfort to You and to those who suffer. Amen.',
  ),
  Station(
    number: 7,
    title: 'Jesus Falls the Second Time',
    scripture:
        '"Come to me, all you who labor and are burdened, and I will give you rest." - Matthew 11:28',
    meditation:
        'Exhausted beyond measure, Jesus falls again under the crushing weight. This second fall reminds us of the gravity of sin and the immense price He paid to redeem us.',
    prayer:
        'Lord Jesus, when I fall repeatedly into the same sins, do not abandon me. Strengthen me with Your grace to overcome my weaknesses and rise again. Amen.',
  ),
  Station(
    number: 8,
    title: 'Jesus Meets the Women of Jerusalem',
    scripture:
        '"Daughters of Jerusalem, do not weep for me; weep instead for yourselves and for your children." - Luke 23:28',
    meditation:
        'Jesus stops to console the weeping women, thinking not of His own suffering but of what awaits those who reject God\'s love. His compassion extends even in His agony.',
    prayer:
        'Lord Jesus, teach me to weep for my sins and the sins of the world. Grant me a heart that truly repents and seeks to make amends. Amen.',
  ),
  Station(
    number: 9,
    title: 'Jesus Falls the Third Time',
    scripture:
        '"He humbled himself, becoming obedient to death, even death on a cross." - Philippians 2:8',
    meditation:
        'For the third time, Jesus collapses under the weight of the Cross. Yet He rises once more, determined to complete His mission. His perseverance is a lesson in never giving up.',
    prayer:
        'Lord Jesus, when I feel like giving up—on prayer, on virtue, on hope—remind me of Your third fall and Your unwavering determination. Give me strength to persevere. Amen.',
  ),
  Station(
    number: 10,
    title: 'Jesus is Stripped of His Garments',
    scripture:
        '"They divided my garments among them, and for my vesture they cast lots." - Psalm 22:18',
    meditation:
        'At Calvary, Jesus is stripped of His garments, exposed and humiliated before the crowd. He accepts this shame to restore the dignity we lost through sin.',
    prayer:
        'Lord Jesus, You were stripped and humiliated for me. Strip me of my pride, my attachments, and everything that separates me from You. Clothe me in Your grace. Amen.',
  ),
  Station(
    number: 11,
    title: 'Jesus is Nailed to the Cross',
    scripture: '"They have pierced my hands and my feet." - Psalm 22:16',
    meditation:
        'The soldiers nail Jesus\' hands and feet to the Cross. Each blow of the hammer is caused by our sins. Yet from the Cross, Jesus prays: "Father, forgive them."',
    prayer:
        'Lord Jesus, Your hands that healed were pierced for me. Your feet that walked to bring Good News were nailed for my wandering. Forgive me and help me to forgive others. Amen.',
  ),
  Station(
    number: 12,
    title: 'Jesus Dies on the Cross',
    scripture: '"Father, into your hands I commend my spirit." - Luke 23:46',
    meditation:
        'After three hours of agony, Jesus breathes His last. The sky darkens, the earth shakes, and the veil of the Temple is torn. The Son of God dies so that we might live.',
    prayer:
        'Lord Jesus, at the hour of my death, receive my spirit. May I die in Your grace, trusting in Your mercy and the promise of eternal life. Into Your hands I commend my spirit. Amen.',
  ),
  Station(
    number: 13,
    title: 'Jesus is Taken Down from the Cross',
    scripture:
        '"Joseph of Arimathea... asked Pilate for the body of Jesus." - Mark 15:43',
    meditation:
        'Joseph of Arimathea and Nicodemus take down the body of Jesus and place it in Mary\'s arms. The Pietà—Mary holding her dead Son—is an image of profound grief and love.',
    prayer:
        'Lord Jesus, Mary held Your lifeless body in her arms. Help me to treasure Your presence in my life and never take Your love for granted. Mary, comfort me in my sorrows. Amen.',
  ),
  Station(
    number: 14,
    title: 'Jesus is Laid in the Tomb',
    scripture:
        '"They took the body of Jesus and bound it with burial cloths." - John 19:40',
    meditation:
        'Jesus is laid in a borrowed tomb. The stone is rolled shut. The world is silent. But this is not the end—it is only the prelude to the glory of Resurrection.',
    prayer:
        'Lord Jesus, as You rested in the tomb, grant rest to my soul. May I die to sin and rise with You to new life. I trust in Your Resurrection, which is my hope. Amen.',
  ),
];

/// Opening prayer for the Stations
const String stationsOpeningPrayer = '''
In the name of the Father, and of the Son, and of the Holy Spirit. Amen.

Lord Jesus Christ, as we make this Way of the Cross, 
grant that we may accompany You on Your journey to Calvary with love and sorrow.
May we enter into the mystery of Your suffering 
and emerge transformed by Your grace.
We offer this devotion for our intentions 
and for the souls in Purgatory.

Amen.
''';

/// Closing prayer for the Stations
const String stationsClosingPrayer = '''
Lord Jesus Christ, 
we thank You for allowing us to walk with You on the Way of the Cross.
May the sufferings You endured for our salvation 
inspire us to take up our own crosses with patience and love.
Grant that by meditating on Your Passion, 
we may come to share in the glory of Your Resurrection.

We ask this through Christ our Lord. 
Amen.

May the souls of the faithful departed, 
through the mercy of God, rest in peace. 
Amen.
''';
