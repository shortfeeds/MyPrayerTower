class Chant {
  final String id;
  final String title;
  final String category; // e.g., "Marian", "Mass", "Hymn"
  final String audioUrl;
  final String coverUrl;
  final String latinLyrics;
  final String englishLyrics;
  final Duration duration;
  final bool isFavorite;

  const Chant({
    required this.id,
    required this.title,
    required this.category,
    required this.audioUrl,
    required this.coverUrl,
    required this.latinLyrics,
    required this.englishLyrics,
    required this.duration,
    this.isFavorite = false,
  });

  Chant copyWith({
    String? id,
    String? title,
    String? category,
    String? audioUrl,
    String? coverUrl,
    String? latinLyrics,
    String? englishLyrics,
    Duration? duration,
    bool? isFavorite,
  }) {
    return Chant(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      audioUrl: audioUrl ?? this.audioUrl,
      coverUrl: coverUrl ?? this.coverUrl,
      latinLyrics: latinLyrics ?? this.latinLyrics,
      englishLyrics: englishLyrics ?? this.englishLyrics,
      duration: duration ?? this.duration,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
