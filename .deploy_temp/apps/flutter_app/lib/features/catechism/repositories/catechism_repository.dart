import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

/// Model for a Catechism paragraph
class CatechismParagraph {
  final int number;
  final String text;

  CatechismParagraph({required this.number, required this.text});

  factory CatechismParagraph.fromJson(Map<String, dynamic> json) {
    return CatechismParagraph(
      number: json['paragraph'] as int? ?? 0,
      text: json['content'] as String? ?? '',
    );
  }
}

/// Repository for fetching Catechism of the Catholic Church from GitHub
class CatechismRepository {
  final http.Client _client;
  List<CatechismParagraph>? _cachedParagraphs;

  CatechismRepository({http.Client? client})
    : _client = client ?? http.Client();

  /// Get all catechism paragraphs
  /// Source: https://github.com/aseemsavio/catholicism-in-json
  Future<List<CatechismParagraph>> getAllParagraphs() async {
    if (_cachedParagraphs != null) return _cachedParagraphs!;

    try {
      // Raw GitHub URL for the catechism JSON
      final url = Uri.parse(
        'https://raw.githubusercontent.com/aseemsavio/catholicism-in-json/main/catechism.json',
      );

      final response = await _client.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        _cachedParagraphs = data
            .map((e) => CatechismParagraph.fromJson(e as Map<String, dynamic>))
            .toList();
        return _cachedParagraphs!;
      }
    } catch (e) {
      debugPrint('Catechism API Error: $e');
    }
    return [];
  }

  /// Get paragraphs by range
  Future<List<CatechismParagraph>> getParagraphRange(int start, int end) async {
    final all = await getAllParagraphs();
    return all.where((p) => p.number >= start && p.number <= end).toList();
  }

  /// Get a specific paragraph
  Future<CatechismParagraph?> getParagraph(int number) async {
    final all = await getAllParagraphs();
    try {
      return all.firstWhere((p) => p.number == number);
    } catch (e) {
      return null;
    }
  }

  /// Search catechism by keyword
  Future<List<CatechismParagraph>> search(String query) async {
    final all = await getAllParagraphs();
    final lowerQuery = query.toLowerCase();
    return all.where((p) => p.text.toLowerCase().contains(lowerQuery)).toList();
  }
}

// Providers
final catechismRepositoryProvider = Provider<CatechismRepository>((ref) {
  return CatechismRepository();
});

// All paragraphs provider (cached)
final catechismParagraphsProvider = FutureProvider<List<CatechismParagraph>>((
  ref,
) async {
  final repo = ref.watch(catechismRepositoryProvider);
  return repo.getAllParagraphs();
});

// Paragraph range provider
final catechismRangeProvider =
    FutureProvider.family<List<CatechismParagraph>, ({int start, int end})>((
      ref,
      params,
    ) async {
      final repo = ref.watch(catechismRepositoryProvider);
      return repo.getParagraphRange(params.start, params.end);
    });

// Search provider
final catechismSearchProvider =
    FutureProvider.family<List<CatechismParagraph>, String>((ref, query) async {
      final repo = ref.watch(catechismRepositoryProvider);
      return repo.search(query);
    });
