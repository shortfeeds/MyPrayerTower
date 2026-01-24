enum HymnCategory {
  traditional,
  marian,
  eucharistic,
  seasonal,
  psalms,
  contemporary,
}

class Hymn {
  final String id;
  final String title;
  final String? latinTitle;
  final HymnCategory category;
  final String? composer;
  final String? tune;
  final String lyrics;
  final String? firstLine;
  final List<String> tags;
  final String? recordingUrl;

  const Hymn({
    required this.id,
    required this.title,
    this.latinTitle,
    required this.category,
    this.composer,
    this.tune,
    required this.lyrics,
    this.firstLine,
    this.tags = const [],
    this.recordingUrl,
  });

  String get displayTitle =>
      latinTitle != null ? "$title ($latinTitle)" : title;
}
