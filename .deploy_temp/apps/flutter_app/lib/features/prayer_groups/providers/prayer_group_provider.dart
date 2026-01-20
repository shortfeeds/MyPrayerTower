import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_group_model.dart';
import '../repositories/prayer_group_repository.dart';

// State for user's groups
final userGroupsProvider = FutureProvider<List<PrayerGroup>>((ref) async {
  final repository = ref.watch(prayerGroupRepositoryProvider);
  return repository.getUserGroups();
});

// State for a specific group (family)
final groupDetailProvider = FutureProvider.family<PrayerGroup, String>((
  ref,
  groupId,
) async {
  final repository = ref.watch(prayerGroupRepositoryProvider);
  return repository.getGroup(groupId);
});

// Controller for actions
final prayerGroupControllerProvider =
    StateNotifierProvider<PrayerGroupController, AsyncValue<void>>((ref) {
      return PrayerGroupController(ref);
    });

class PrayerGroupController extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;

  PrayerGroupController(this._ref) : super(const AsyncValue.data(null));

  Future<PrayerGroup?> createGroup(
    String name,
    String description,
    bool isPrivate,
  ) async {
    state = const AsyncValue.loading();
    try {
      final group = await _ref
          .read(prayerGroupRepositoryProvider)
          .createGroup(name, description, isPrivate);
      _ref.invalidate(userGroupsProvider);
      state = const AsyncValue.data(null);
      return group;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  Future<void> inviteToGroup(String groupId, String email) async {
    state = const AsyncValue.loading();
    try {
      await _ref
          .read(prayerGroupRepositoryProvider)
          .inviteToGroup(groupId, email);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addPrayer(String groupId, String content) async {
    state = const AsyncValue.loading();
    try {
      await _ref
          .read(prayerGroupRepositoryProvider)
          .addPrayer(groupId, content);
      _ref.invalidate(groupDetailProvider(groupId));
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> leaveGroup(String groupId) async {
    state = const AsyncValue.loading();
    try {
      await _ref.read(prayerGroupRepositoryProvider).leaveGroup(groupId);
      _ref.invalidate(userGroupsProvider);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
