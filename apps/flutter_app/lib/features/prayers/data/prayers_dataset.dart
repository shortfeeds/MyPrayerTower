import '../models/prayer_model.dart';

class PrayersDataset {
  /// Featured / Core Prayers to ensure high quality content is always present
  static final List<Prayer> corePrayers = [
    const Prayer(
      id: 1,
      title: 'The Lord\'s Prayer',
      slug: 'lords-prayer',
      content: 'Our Father, who art in heaven, hallowed be thy name...',
      category: 'core',
      categoryLabel: 'Common',
    ),
    const Prayer(
      id: 2,
      title: 'Hail Mary',
      slug: 'hail-mary',
      content: 'Hail Mary, full of grace, the Lord is with thee...',
      category: 'marian',
      categoryLabel: 'Marian',
    ),
    const Prayer(
      id: 3,
      title: 'Glory Be',
      slug: 'glory-be',
      content:
          'Glory be to the Father, and to the Son, and to the Holy Spirit...',
      category: 'core',
      categoryLabel: 'Common',
    ),
    const Prayer(
      id: 4,
      title: 'Apostles\' Creed',
      slug: 'apostles-creed',
      content:
          'I believe in God, the Father almighty, Creator of heaven and earth...',
      category: 'creed',
      categoryLabel: 'Creed',
    ),
    const Prayer(
      id: 5,
      title: 'Act of Contrition',
      slug: 'act-of-contrition',
      content: 'O my God, I am heartily sorry for having offended Thee...',
      category: 'confession',
      categoryLabel: 'Confession',
    ),
    const Prayer(
      id: 6,
      title: 'Angelus',
      slug: 'the-angelus',
      content: 'The Angel of the Lord declared unto Mary...',
      category: 'marian',
      categoryLabel: 'Marian',
    ),
    const Prayer(
      id: 7,
      title: 'Memorare',
      slug: 'memorare',
      content:
          'Remember, O most gracious Virgin Mary, that never was it known...',
      category: 'marian',
      categoryLabel: 'Marian',
    ),
    const Prayer(
      id: 8,
      title: 'Salve Regina',
      slug: 'salve-regina',
      content:
          'Hail, holy Queen, Mother of mercy, hail, our life, our sweetness and our hope...',
      category: 'marian',
      categoryLabel: 'Marian',
    ),
    const Prayer(
      id: 9,
      title: 'Prayer to St. Michael',
      slug: 'st-michael',
      content: 'St. Michael the Archangel, defend us in battle...',
      category: 'saints',
      categoryLabel: 'Saints',
    ),
    const Prayer(
      id: 10,
      title: 'Guardian Angel Prayer',
      slug: 'guardian-angel',
      content:
          'Angel of God, my guardian dear, to whom God\'s love commits me here...',
      category: 'core',
      categoryLabel: 'Common',
    ),
  ];

  static final List<String> _titles = [
    'Prayer for Guidance',
    'Morning Offering',
    'Evening Meditation',
    'Prayer for Peace',
    'Prayer for Healing',
    'Prayer for Strength',
    'Act of Faith',
    'Act of Hope',
    'Act of Charity',
    'Prayer for Families',
    'Prayer for the Sick',
    'Prayer for the Dead',
    'Invocation of the Holy Spirit',
    'Litany of Humility',
    'Litany of the Saints',
    'Prayer before Mass',
    'Thanksgiving after Mass',
    'Prayer for Vocations',
    'Psalm 23',
    'Psalm 51',
    'Magnificat',
    'Benedictus',
    'Nunc Dimittis',
    'Te Deum',
  ];

  static final List<String> _categories = [
    'morning',
    'evening',
    'healing',
    'marian',
    'saints',
    'family',
    'mass',
    'litanies',
    'psalms',
  ];

  static final Map<String, String> _categoryLabels = {
    'morning': 'Morning',
    'evening': 'Evening',
    'healing': 'Healing',
    'marian': 'Marian',
    'saints': 'Saints',
    'family': 'Family',
    'mass': 'Mass',
    'litanies': 'Litanies',
    'psalms': 'Psalms',
  };

  /// Generates a massive dataset of 3900+ prayers
  static List<Prayer> getAllPrayers() {
    final List<Prayer> generated = [];

    // Add core prayers first
    generated.addAll(corePrayers);

    // Generate remaining to reach ~3950
    for (int i = corePrayers.length; i < 3950; i++) {
      final categoryKey = _categories[i % _categories.length];
      final titleBase = _titles[i % _titles.length];

      generated.add(
        Prayer(
          id: i + 1,
          title:
              '$titleBase ${i ~/ _titles.length + 1}', // e.g. "Prayer for Guidance 5"
          slug: 'generated-prayer-$i',
          content:
              'This is a simulated prayer content for demonstration purposes. '
              'It represents a traditional Catholic prayer for $categoryKey intentions. '
              'Grant us grace and peace. Amen.',
          category: categoryKey,
          categoryLabel: _categoryLabels[categoryKey] ?? 'General',
          tags: [categoryKey, 'traditional', 'catholic'],
          isActive: true,
        ),
      );
    }

    return generated;
  }
}
