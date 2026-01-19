import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../models/prayer_group_model.dart';

class PrayerGroupRepository {
  final ApiService _apiService;

  PrayerGroupRepository(this._apiService);

  Future<List<PrayerGroup>> getUserGroups() async {
    final response = await _apiService.get('/prayer-groups');
    return (response.data as List).map((e) => PrayerGroup.fromJson(e)).toList();
  }

  Future<PrayerGroup> getGroup(String id) async {
    final response = await _apiService.get('/prayer-groups/$id');
    return PrayerGroup.fromJson(response.data);
  }

  Future<PrayerGroup> createGroup(
    String name,
    String description,
    bool isPrivate,
  ) async {
    final response = await _apiService.post(
      '/prayer-groups',
      data: {'name': name, 'description': description, 'isPrivate': isPrivate},
    );
    return PrayerGroup.fromJson(response.data);
  }

  Future<void> inviteToGroup(String groupId, String email) async {
    await _apiService.post(
      '/prayer-groups/$groupId/invite',
      data: {'email': email},
    );
  }

  Future<void> addPrayer(String groupId, String content) async {
    await _apiService.post(
      '/prayer-groups/$groupId/prayers',
      data: {'content': content},
    );
  }

  Future<void> leaveGroup(String groupId) async {
    await _apiService.delete('/prayer-groups/$groupId/leave');
  }
}

final prayerGroupRepositoryProvider = Provider<PrayerGroupRepository>((ref) {
  return PrayerGroupRepository(ref.watch(apiServiceProvider));
});
