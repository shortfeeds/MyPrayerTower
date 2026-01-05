import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

/// Model for a Bible verse
class BibleVerse {
  final int verse;
  final String text;

  BibleVerse({required this.verse, required this.text});

  factory BibleVerse.fromJson(Map<String, dynamic> json) {
    return BibleVerse(
      verse: json['verse'] as int? ?? 0,
      text: json['text'] as String? ?? '',
    );
  }
}

/// Model for a Bible chapter response
class BibleChapter {
  final String reference;
  final String translationName;
  final List<BibleVerse> verses;
  final String text;

  BibleChapter({
    required this.reference,
    required this.translationName,
    required this.verses,
    required this.text,
  });

  factory BibleChapter.fromJson(Map<String, dynamic> json) {
    final versesJson = json['verses'] as List<dynamic>? ?? [];
    return BibleChapter(
      reference: json['reference'] as String? ?? 'Unknown',
      translationName: json['translation_name'] as String? ?? 'WEB',
      verses: versesJson.map((v) => BibleVerse.fromJson(v)).toList(),
      text: json['text'] as String? ?? '',
    );
  }
}

/// Repository for fetching Bible data from bible-api.com
class BibleRepository {
  final http.Client _client;

  // book name mappings for API compatibility
  static const Map<String, String> _bookMappings = {
    '1 Samuel': '1Samuel',
    '2 Samuel': '2Samuel',
    '1 Kings': '1Kings',
    '2 Kings': '2Kings',
    '1 Chronicles': '1Chronicles',
    '2 Chronicles': '2Chronicles',
    '1 Maccabees': '1Maccabees',
    '2 Maccabees': '2Maccabees',
    'Song of Songs': 'Song of Solomon',
    '1 Corinthians': '1Corinthians',
    '2 Corinthians': '2Corinthians',
    '1 Thessalonians': '1Thessalonians',
    '2 Thessalonians': '2Thessalonians',
    '1 Timothy': '1Timothy',
    '2 Timothy': '2Timothy',
    '1 Peter': '1Peter',
    '2 Peter': '2Peter',
    '1 John': '1John',
    '2 John': '2John',
    '3 John': '3John',
  };

  BibleRepository({http.Client? client}) : _client = client ?? http.Client();

  /// Get a chapter from the Bible
  Future<BibleChapter?> getChapter(String book, int chapter) async {
    try {
      final apiBook = _bookMappings[book] ?? book;
      final reference = Uri.encodeComponent('$apiBook $chapter');

      // bible-api.com uses the World English Bible by default (public domain)
      final url = Uri.parse('https://bible-api.com/$reference');

      final response = await _client.get(
        url,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return BibleChapter.fromJson(data);
      }
    } catch (e) {
      print('Bible API Error: $e');
    }
    return null;
  }

  /// Get a specific verse
  Future<BibleChapter?> getVerse(String book, int chapter, int verse) async {
    try {
      final apiBook = _bookMappings[book] ?? book;
      final reference = Uri.encodeComponent('$apiBook $chapter:$verse');

      final url = Uri.parse('https://bible-api.com/$reference');

      final response = await _client.get(
        url,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return BibleChapter.fromJson(data);
      }
    } catch (e) {
      print('Bible API Verse Error: $e');
    }
    return null;
  }

  /// Get a random verse (for verse of the day functionality)
  Future<BibleChapter?> getRandomVerse() async {
    // Popular verses for "Verse of the Day"
    final popularVerses = [
      'John 3:16',
      'Philippians 4:13',
      'Jeremiah 29:11',
      'Romans 8:28',
      'Proverbs 3:5-6',
      'Isaiah 41:10',
      'Psalm 23:1',
      'Matthew 11:28',
      'Romans 12:2',
      'Galatians 5:22-23',
    ];

    final verse = popularVerses[DateTime.now().day % popularVerses.length];

    try {
      final url = Uri.parse(
        'https://bible-api.com/${Uri.encodeComponent(verse)}',
      );

      final response = await _client.get(
        url,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return BibleChapter.fromJson(data);
      }
    } catch (e) {
      print('Bible API Random Error: $e');
    }
    return null;
  }
}

// Providers
final bibleRepositoryProvider = Provider<BibleRepository>((ref) {
  return BibleRepository();
});

// Chapter provider family
final bibleChapterProvider =
    FutureProvider.family<BibleChapter?, ({String book, int chapter})>((
      ref,
      params,
    ) async {
      final repo = ref.watch(bibleRepositoryProvider);
      return repo.getChapter(params.book, params.chapter);
    });

// Verse of the day provider
final verseOfTheDayProvider = FutureProvider<BibleChapter?>((ref) async {
  final repo = ref.watch(bibleRepositoryProvider);
  return repo.getRandomVerse();
});
