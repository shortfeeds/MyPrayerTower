import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_partner_model.dart';
import '../repositories/prayer_partner_repository.dart';

// State for partners list
final prayerPartnersProvider = FutureProvider<List<PrayerPartner>>((ref) async {
  final repository = ref.watch(prayerPartnerRepositoryProvider);
  return repository.getPartners();
});

// State for pending requests
final pendingPartnerRequestsProvider = FutureProvider<List<PartnerRequest>>((
  ref,
) async {
  final repository = ref.watch(prayerPartnerRepositoryProvider);
  return repository.getPendingRequests();
});

// Controller for actions
final prayerPartnerControllerProvider =
    StateNotifierProvider<PrayerPartnerController, AsyncValue<void>>((ref) {
      return PrayerPartnerController(ref);
    });

class PrayerPartnerController extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;

  PrayerPartnerController(this._ref) : super(const AsyncValue.data(null));

  Future<void> invitePartner(String email) async {
    state = const AsyncValue.loading();
    try {
      await _ref.read(prayerPartnerRepositoryProvider).invitePartner(email);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> respondToRequest(String requestId, bool accept) async {
    state = const AsyncValue.loading();
    try {
      await _ref
          .read(prayerPartnerRepositoryProvider)
          .respondToInvite(requestId, accept);
      // Refresh lists
      _ref.invalidate(prayerPartnersProvider);
      _ref.invalidate(pendingPartnerRequestsProvider);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> removePartner(String partnerId) async {
    state = const AsyncValue.loading();
    try {
      await _ref.read(prayerPartnerRepositoryProvider).removePartner(partnerId);
      // Refresh list
      _ref.invalidate(prayerPartnersProvider);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
