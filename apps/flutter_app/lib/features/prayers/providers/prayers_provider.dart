import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/prayers_repository.dart';
import '../models/prayer_model.dart';

// Provider for repo
// final prayersRepositoryProvider is defined in repo file usually, but we can re-export or use it.

// Search Provider
final prayerSearchProvider = FutureProvider.family<List<Prayer>, String>((
  ref,
  query,
) async {
  final repository = ref.watch(prayersRepositoryProvider);
  return repository.getPrayers(query: query);
});

// Trending Provider
final trendingPrayersProvider = FutureProvider<List<Prayer>>((ref) async {
  final repository = ref.watch(prayersRepositoryProvider);
  // Fetch some prayers to show as trending
  final all = await repository.getPrayers(limit: 20);
  return all..shuffle();
});

// Category Provider (Mocked from DB)
final prayerCategoriesFromDbProvider = FutureProvider<List<PrayerCategory>>((
  ref,
) async {
  final repository = ref.watch(prayersRepositoryProvider);
  final rawData = await repository.getCategories();

  return rawData
      .map(
        (e) => PrayerCategory(
          id: e['id'] as String,
          name: e['name'] as String,
          icon: e['icon'] as String,
          count: e['count'] as int,
        ),
      )
      .toList();
});

class PrayerCategory {
  final String id;
  final String name;
  final String icon;
  final int count;

  PrayerCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.count,
  });
}
