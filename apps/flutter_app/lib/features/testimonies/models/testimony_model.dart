class Testimony {
  final String id;
  final String author;
  final String? avatarUrl;
  final String location;
  final String content;
  final String category; // e.g., "Healing", "Faith", "Gratitude"
  final DateTime date;
  final int amenCount;
  final bool isFeatured;
  final bool isLiked; // Local state for "Amen" tapped

  const Testimony({
    required this.id,
    required this.author,
    this.avatarUrl,
    required this.location,
    required this.content,
    required this.category,
    required this.date,
    this.amenCount = 0,
    this.isFeatured = false,
    this.isLiked = false,
  });

  Testimony copyWith({
    String? id,
    String? author,
    String? avatarUrl,
    String? location,
    String? content,
    String? category,
    DateTime? date,
    int? amenCount,
    bool? isFeatured,
    bool? isLiked,
  }) {
    return Testimony(
      id: id ?? this.id,
      author: author ?? this.author,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      location: location ?? this.location,
      content: content ?? this.content,
      category: category ?? this.category,
      date: date ?? this.date,
      amenCount: amenCount ?? this.amenCount,
      isFeatured: isFeatured ?? this.isFeatured,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
