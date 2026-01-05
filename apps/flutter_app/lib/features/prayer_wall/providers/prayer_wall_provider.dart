import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_request_model.dart';
import '../repositories/prayer_wall_repository.dart';

final prayerWallProvider = FutureProvider.autoDispose
    .family<List<PrayerRequest>, String?>((ref, category) {
      return ref
          .watch(prayerWallRepositoryProvider)
          .getRequests(category: category);
    });

final prayerWallControllerProvider =
    StateNotifierProvider<PrayerWallController, AsyncValue<void>>((ref) {
      return PrayerWallController(ref);
    });

class PrayerWallController extends StateNotifier<AsyncValue<void>> {
  final Ref ref;

  PrayerWallController(this.ref) : super(const AsyncData(null));

  Future<void> submitRequest({
    required String content,
    String? category,
    bool isAnonymous = false,
  }) async {
    state = const AsyncLoading();
    try {
      await ref
          .read(prayerWallRepositoryProvider)
          .submitRequest(
            content: content,
            category: category,
            isAnonymous: isAnonymous,
          );
      // Invalidate the list to refresh data
      ref.invalidate(prayerWallProvider);
      state = const AsyncData(null);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> prayForRequest(String id) async {
    // We don't set loading state for pray click to avoid full UI freeze/spinner,
    // but in a real app we might want optimistic updates.
    try {
      await ref.read(prayerWallRepositoryProvider).prayForRequest(id);
      // Invalidate to update counts
      ref.invalidate(prayerWallProvider);
    } catch (e) {
      // Handle error cleanly
      // debugPrint('Error praying: $e');
    }
  }
}
