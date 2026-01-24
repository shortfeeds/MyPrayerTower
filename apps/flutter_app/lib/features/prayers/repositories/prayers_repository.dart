import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_model.dart';
import '../data/prayers_dataset.dart';

final prayersRepositoryProvider = Provider<PrayersRepository>((ref) {
  return PrayersRepository();
});

class PrayersRepository {
  late final List<Prayer> _allPrayers;

  PrayersRepository() {
    _allPrayers = PrayersDataset.getAllPrayers();
  }

  /// Get prayers with pagination, category filter, and search
  Future<List<Prayer>> getPrayers({
    String? query,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 300));

    var results = _allPrayers;

    // Filter by category
    if (category != null &&
        category.isNotEmpty &&
        category.toLowerCase() != 'all') {
      results = results
          .where((p) => p.category.toLowerCase() == category.toLowerCase())
          .toList();
    }

    // Filter by query (title or content)
    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      results = results.where((p) {
        return p.title.toLowerCase().contains(q) ||
            p.content.toLowerCase().contains(q);
      }).toList();
    }

    // Pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= results.length) return [];

    final endIndex = startIndex + limit;
    return results.sublist(
      startIndex,
      endIndex > results.length ? results.length : endIndex,
    );
  }

  /// Get specific prayer by ID
  Future<Prayer> getPrayerById(int id) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 100));

    return _allPrayers.firstWhere(
      (p) => p.id == id,
      orElse: () => _allPrayers.first, // Fallback
    );
  }

  /// Get multiple prayers by IDs (for favorites/bookmarks)
  Future<List<Prayer>> getPrayersByIds(List<int> ids) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _allPrayers.where((p) => ids.contains(p.id)).toList();
  }

  /// Get categories with counts
  Future<List<Map<String, dynamic>>> getCategories() async {
    await Future.delayed(const Duration(milliseconds: 200));

    final Map<String, int> counts = {};
    final Map<String, String> labels = {};

    for (var p in _allPrayers) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
      labels[p.category] = p.categoryLabel ?? p.category;
    }

    return counts.keys
        .map(
          (key) => {
            'id': key,
            'name': labels[key],
            'count': counts[key],
            'icon': _getIconForCategory(key),
          },
        )
        .toList();
  }

  String _getIconForCategory(String id) {
    switch (id.toLowerCase()) {
      case 'morning':
        return '☀️';
      case 'evening':
        return '🌙';
      case 'healing':
        return '❤️‍🩹';
      case 'marian':
        return '🌹';
      case 'saints':
        return '🙏';
      case 'family':
        return '👨‍👩‍👧';
      case 'mass':
        return '⛪';
      case 'litanies':
        return '📜';
      case 'psalms':
        return '📖';
      case 'core':
        return '✝️';
      default:
        return '✨';
    }
  }
}
