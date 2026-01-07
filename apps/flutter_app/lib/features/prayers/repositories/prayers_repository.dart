import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/prayer_model.dart';

final prayersRepositoryProvider = Provider<PrayersRepository>((ref) {
  return PrayersRepository(ref.watch(supabaseProvider));
});

class PrayersRepository {
  final SupabaseClient _supabase;

  PrayersRepository(this._supabase);

  /// Fetch prayers with optional pagination
  /// Set [limit] to -1 to fetch all prayers
  Future<List<Prayer>> getPrayers({
    String? category,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      var query = _supabase.from('Prayer').select();

      if (category != null && category != 'ALL') {
        query = query.ilike('category', category);
      }

      if (limit > 0) {
        // Pagination
        final from = (page - 1) * limit;
        final to = from + limit - 1;
        final data = await query.range(from, to).order('title');
        return (data as List).map((json) => Prayer.fromJson(json)).toList();
      } else {
        // Fetch all
        final data = await query.order('title');
        return (data as List).map((json) => Prayer.fromJson(json)).toList();
      }
    } catch (e) {
      // Return empty list on error
      return [];
    }
  }

  /// Fetch all distinct categories with prayer counts
  Future<List<PrayerCategory>> getCategories() async {
    try {
      // Fetch all prayers to count by category
      final data = await _supabase
          .from('Prayer')
          .select('category, category_label')
          .eq('is_active', true);

      // Group by category
      final categoryMap = <String, PrayerCategory>{};
      for (final row in data as List) {
        final cat = row['category'] as String? ?? 'other';
        final label = row['category_label'] as String? ?? cat;

        if (categoryMap.containsKey(cat)) {
          categoryMap[cat] = categoryMap[cat]!.copyWith(
            count: categoryMap[cat]!.count + 1,
          );
        } else {
          categoryMap[cat] = PrayerCategory(
            id: cat,
            name: label,
            icon: _getCategoryIcon(cat),
            count: 1,
          );
        }
      }

      // Sort by count (highest first)
      final categories = categoryMap.values.toList()
        ..sort((a, b) => b.count.compareTo(a.count));

      return categories;
    } catch (e) {
      return [];
    }
  }

  /// Fetch prayers by category with infinite scroll support
  Future<List<Prayer>> getPrayersByCategory(
    String categoryId, {
    int page = 1,
    int limit = 30,
  }) async {
    try {
      final from = (page - 1) * limit;
      final to = from + limit - 1;

      final data = await _supabase
          .from('Prayer')
          .select()
          .ilike('category', categoryId)
          .eq('is_active', true)
          .order('title')
          .range(from, to);

      return (data as List).map((json) => Prayer.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<Prayer?> getPrayerById(int id) async {
    try {
      final data = await _supabase
          .from('Prayer')
          .select()
          .eq('id', id)
          .single();
      return Prayer.fromJson(data);
    } catch (e) {
      return null;
    }
  }

  /// Search prayers by title or content
  Future<List<Prayer>> searchPrayers(String query) async {
    if (query.isEmpty) return [];

    try {
      final data = await _supabase
          .from('Prayer')
          .select()
          .or('title.ilike.%$query%,content.ilike.%$query%')
          .eq('is_active', true)
          .limit(50);

      return (data as List).map((json) => Prayer.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  String _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'morning':
        return '🌅';
      case 'evening':
        return '🌙';
      case 'rosary':
        return '📿';
      case 'novenas':
        return '🕯️';
      case 'saints':
        return '⭐';
      case 'marian':
        return '🌹';
      case 'mass':
        return '⛪';
      case 'confession':
        return '🛐';
      case 'divine-mercy':
        return '❤️';
      case 'stations':
        return '✝️';
      case 'psalms':
        return '📖';
      case 'litanies':
        return '🙏';
      case 'common':
        return '📜';
      case 'healing':
        return '💚';
      case 'thanksgiving':
        return '🙌';
      case 'protection':
        return '🛡️';
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'children':
        return '👶';
      case 'deceased':
        return '🕊️';
      case 'mental':
        return '🧠';
      case 'other':
      default:
        return '🙏';
    }
  }
}

/// Category model for prayer categories
class PrayerCategory {
  final String id;
  final String name;
  final String icon;
  final int count;

  const PrayerCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.count,
  });

  PrayerCategory copyWith({
    String? id,
    String? name,
    String? icon,
    int? count,
  }) {
    return PrayerCategory(
      id: id ?? this.id,
      name: name ?? this.name,
      icon: icon ?? this.icon,
      count: count ?? this.count,
    );
  }
}
