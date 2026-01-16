import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/prayer_request_model.dart';

final prayerWallRepositoryProvider = Provider<PrayerWallRepository>((ref) {
  return PrayerWallRepository(ref.watch(supabaseProvider));
});

class PrayerWallRepository {
  final SupabaseClient _supabase;

  PrayerWallRepository(this._supabase);

  Future<List<PrayerRequest>> getRequests({
    String? category,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      var query = _supabase
          .from('PrayerRequest')
          .select('*, User(firstName, lastName)')
          .eq('status', 'APPROVED');

      if (category != null && category != 'All') {
        query = query.eq('category', category.toUpperCase());
      }

      // Order by createdAt desc
      final orderedQuery = query.order('createdAt', ascending: false);

      final from = (page - 1) * limit;
      final to = from + limit - 1;

      final data = await orderedQuery.range(from, to);

      return (data as List)
          .map((json) => PrayerRequest.fromJson(json))
          .toList();
    } catch (e) {
      // Return empty list on error instead of mock data
      return [];
    }
  }

  Future<bool?> submitRequest({
    required String intention,
    String? userName,
    String? category,
    String? country,
    String? userId,
    String visibility = 'PUBLIC',
    bool isAnonymous = false,
  }) async {
    try {
      final user = _supabase.auth.currentUser;

      await _supabase.from('PrayerRequest').insert({
        'content': intention,
        'userId': user?.id ?? userId, // Fallback if needed
        'category': category?.toUpperCase() ?? 'OTHER',
        'isAnonymous': isAnonymous,
        'visibility': visibility,
        'country': country,
        'status': 'PENDING',
        'prayerCount': 0,
        'createdAt': DateTime.now().toIso8601String(),
        'updatedAt': DateTime.now().toIso8601String(),
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  Future<void> prayForRequest(String id) async {
    try {
      // Use RPC if available, or just increment directly (less safe but works without RPC)
      // await _supabase.rpc('increment_prayer_count', params: {'request_id': id});

      // Using increment trick with stored procedure is better, but falling back to simple update if needed:
      await _supabase.rpc(
        'increment_prayer_request_count',
        params: {'request_id': id},
      );
    } catch (e) {
      // debugPrint('Error praying: $e');
    }
  }

  // Get user's own requests
  Future<List<PrayerRequest>> getUserRequests(String userId) async {
    try {
      final data = await _supabase
          .from('PrayerRequest')
          .select('*, User(firstName, lastName)')
          .eq('userId', userId)
          .order('createdAt', ascending: false);

      return (data as List)
          .map((json) => PrayerRequest.fromJson(json))
          .toList();
    } catch (e) {
      return [];
    }
  }
}
