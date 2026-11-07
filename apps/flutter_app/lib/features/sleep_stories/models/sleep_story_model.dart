class SleepStory {
  final String id;
  final String title;
  final String subtitle;
  final String saintOrTheme;
  final int durationMinutes;
  final String audioUrl;
  final String scripture;
  final String excerpt;
  final String ambientType; // 'rain', 'wind', 'monastery', 'silence'
  final String narrator;

  const SleepStory({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.saintOrTheme,
    required this.durationMinutes,
    required this.audioUrl,
    required this.scripture,
    required this.excerpt,
    required this.ambientType,
    required this.narrator,
  });
}

final List<SleepStory> kCatholicSleepStories = [
  const SleepStory(
    id: 'benedict-cloister',
    title: 'Night in the Monastic Cloister',
    subtitle: 'Surrender the day’s labors to God’s holy peace',
    saintOrTheme: 'St. Benedict & Mount Cassino',
    durationMinutes: 18,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89e248b64.mp3', // Relaxing ambient
    scripture: '"In peace I will lie down and sleep, for You alone, Lord, make me dwell in safety." — Psalm 4:8',
    excerpt: 'As dusk settles over the monastery abbey, the ancient cloister bells ring the final Compline. The stone corridors grow cool, and silence settles over the sanctuary. Release every anxious thought of tomorrow into the hands of the Father who never slumbers.',
    ambientType: 'monastery',
    narrator: 'Brother Thomas',
  ),
  const SleepStory(
    id: 'therese-little-way',
    title: 'Resting in the Arms of the Father',
    subtitle: 'The Little Way of childlike abandonment and trust',
    saintOrTheme: 'St. Thérèse of Lisieux',
    durationMinutes: 15,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf7b088.mp3',
    scripture: '"Truly I tell you, unless you change and become like little children, you will never enter the kingdom of heaven." — Matthew 18:3',
    excerpt: 'Imagine yourself as a tiny bird resting beneath the protective wings of the Divine Eagle. St. Thérèse teaches us that holiness is not about great feats, but about falling asleep peacefully in the arms of Jesus, knowing He loves your smallness.',
    ambientType: 'wind',
    narrator: 'Sister Claire',
  ),
  const SleepStory(
    id: 'galilee-night',
    title: 'Peace Upon the Sea of Galilee',
    subtitle: 'Hear Christ whisper peace over the troubled waters of life',
    saintOrTheme: 'Christ Calming the Storm',
    durationMinutes: 22,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    scripture: '"He got up, rebuked the wind and said to the waves, ‘Quiet! Be still!’ Then the wind died down and it was completely calm." — Mark 4:39',
    excerpt: 'The evening breeze carries the gentle scent of water and cedar wood across the lake. The stars above Capernaum reflect on the glass-like water. Jesus rests at the stern of the boat, reminding you that with Him in your vessel, no storm can ever harm you.',
    ambientType: 'rain',
    narrator: 'Father Anthony',
  ),
  const SleepStory(
    id: 'ignatian-night-examen',
    title: 'The Sacred Night Examen',
    subtitle: 'A gentle review of today’s blessings with gratitude',
    saintOrTheme: 'St. Ignatius of Loyola',
    durationMinutes: 14,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d1ef957ec.mp3',
    scripture: '"Give thanks to the Lord, for He is good; His love endures forever." — Psalm 107:1',
    excerpt: 'Slow down your breath. Breathe in the grace of the Holy Spirit, and breathe out the fatigue of the day. Walk gently through your morning, afternoon, and evening, noting where God’s silent hand brought you light, patience, or peace.',
    ambientType: 'silence',
    narrator: 'Michael',
  ),
  const SleepStory(
    id: 'francis-la-verna',
    title: 'Starlight over Mount La Verna',
    subtitle: 'Praising the Creator beneath the silent mountain stars',
    saintOrTheme: 'St. Francis of Assisi',
    durationMinutes: 20,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    scripture: '"Praised be You, my Lord, through Sister Moon and the stars, in heaven You have formed them light and precious and beautiful." — Canticle of the Sun',
    excerpt: 'High in the Apennine forests, pine needles cushion each step. The air is crisp and filled with the scent of wild thyme. St. Francis stands in silent contemplation, his heart beating in harmony with all created things.',
    ambientType: 'wind',
    narrator: 'Brother Francis',
  ),
];
