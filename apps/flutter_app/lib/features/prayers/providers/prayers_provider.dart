import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_model.dart';
import '../repositories/prayers_repository.dart';

/// Provider for prayers by category with pagination
final prayersProvider = FutureProvider.autoDispose
    .family<List<Prayer>, String?>((ref, category) {
      return ref
          .watch(prayersRepositoryProvider)
          .getPrayers(category: category, limit: 1000);
    });

/// Provider for paginated prayers in a category
final paginatedPrayersProvider = FutureProvider.autoDispose
    .family<List<Prayer>, ({String categoryId, int page})>((ref, params) {
      return ref
          .watch(prayersRepositoryProvider)
          .getPrayersByCategory(params.categoryId, page: params.page);
    });

/// Provider for all prayer categories from Supabase
final prayerCategoriesFromDbProvider = FutureProvider<List<PrayerCategory>>((
  ref,
) {
  return ref.watch(prayersRepositoryProvider).getCategories();
});

/// Provider for search results
final prayerSearchProvider = FutureProvider.autoDispose
    .family<List<Prayer>, String>((ref, query) {
      return ref.watch(prayersRepositoryProvider).searchPrayers(query);
    });

/// Provider for random trending prayers
final trendingPrayersProvider = FutureProvider.autoDispose<List<Prayer>>((
  ref,
) async {
  // Fetch a larger batch of prayers
  final prayers = await ref
      .watch(prayersRepositoryProvider)
      .getPrayers(limit: 50);
  // Shuffle to randomize "trending" selection
  return prayers..shuffle();
});
