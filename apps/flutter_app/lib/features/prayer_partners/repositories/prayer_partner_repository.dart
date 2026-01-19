import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../models/prayer_partner_model.dart';

class PrayerPartnerRepository {
  final ApiService _apiService;

  PrayerPartnerRepository(this._apiService);

  Future<List<PrayerPartner>> getPartners() async {
    final response = await _apiService.get('/prayer-partners');
    return (response.data as List)
        .map((e) => PrayerPartner.fromJson(e))
        .toList();
  }

  Future<List<PartnerRequest>> getPendingRequests() async {
    final response = await _apiService.get('/prayer-partners/requests');
    return (response.data as List)
        .map((e) => PartnerRequest.fromJson(e))
        .toList();
  }

  Future<void> invitePartner(String email) async {
    await _apiService.post('/prayer-partners/invite', data: {'email': email});
  }

  Future<void> respondToInvite(String requestId, bool accept) async {
    await _apiService.post(
      '/prayer-partners/respond/$requestId',
      data: {'accept': accept},
    );
  }

  Future<void> removePartner(String partnerId) async {
    await _apiService.delete('/prayer-partners/$partnerId');
  }
}

final prayerPartnerRepositoryProvider = Provider<PrayerPartnerRepository>((
  ref,
) {
  return PrayerPartnerRepository(ref.watch(apiServiceProvider));
});
