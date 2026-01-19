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

  // Sample prayer data for fallback - matching web app
  static final List<PrayerRequest> _samplePrayers = [
    PrayerRequest(
      id: 's-1',
      content:
          "For all the victims of natural disasters around the world. May God protect and comfort them in these difficult times.",
      category: 'World',
      prayerCount: 892,
      isAnonymous: false,
      userId: 'sample-1',
      user: const PrayerUser(firstName: 'Fr. Michael', lastName: 'Chen'),
      createdAt: DateTime.now().subtract(const Duration(hours: 3)),
      country: 'Singapore',
    ),
    PrayerRequest(
      id: 's-2',
      content:
          "For my son who is struggling with addiction. Please pray for his healing and strength to overcome this battle.",
      category: 'Health',
      prayerCount: 756,
      isAnonymous: false,
      userId: 'sample-2',
      user: const PrayerUser(firstName: 'Patricia', lastName: "O'Connor"),
      createdAt: DateTime.now().subtract(const Duration(hours: 2, minutes: 30)),
      country: 'United States',
    ),
    PrayerRequest(
      id: 's-3',
      content:
          "For the conversion of sinners worldwide and for peace in our troubled world. Lord, have mercy on us.",
      category: 'Spiritual',
      prayerCount: 634,
      isAnonymous: false,
      userId: 'sample-3',
      user: const PrayerUser(firstName: 'Sr. Teresa', lastName: 'Marie'),
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      country: 'Poland',
    ),
    PrayerRequest(
      id: 's-4',
      content:
          "For all single mothers struggling to provide for their children. God bless them with strength and provision.",
      category: 'Family',
      prayerCount: 589,
      isAnonymous: true,
      userId: 'sample-4',
      user: null,
      createdAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 40)),
      country: 'Nigeria',
    ),
    PrayerRequest(
      id: 's-5',
      content:
          "Thanksgiving for a safe delivery of our baby boy! God is good and we are so grateful for this blessing.",
      category: 'Thanksgiving',
      prayerCount: 478,
      isAnonymous: false,
      userId: 'sample-5',
      user: const PrayerUser(firstName: 'Sarah', lastName: 'Miller'),
      createdAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 30)),
      country: 'Canada',
      isAnswered: true,
    ),
    PrayerRequest(
      id: 's-6',
      content:
          "For my husband's cancer treatment. The doctors say Stage 3, but we believe in God's healing power.",
      category: 'Health',
      prayerCount: 423,
      isAnonymous: false,
      userId: 'sample-6',
      user: const PrayerUser(firstName: 'Maria', lastName: 'Garcia'),
      createdAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 20)),
      country: 'Mexico',
    ),
    PrayerRequest(
      id: 's-7',
      content:
          "For all priests and religious facing persecution. May God give them courage and protection.",
      category: 'Spiritual',
      prayerCount: 367,
      isAnonymous: false,
      userId: 'sample-7',
      user: const PrayerUser(firstName: 'Deacon John', lastName: 'Murphy'),
      createdAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 10)),
      country: 'Ireland',
    ),
    PrayerRequest(
      id: 's-8',
      content:
          "For my daughter starting university abroad. Keep her safe and strengthen her faith.",
      category: 'Family',
      prayerCount: 312,
      isAnonymous: false,
      userId: 'sample-8',
      user: const PrayerUser(firstName: 'Angela', lastName: 'Nwosu'),
      createdAt: DateTime.now().subtract(const Duration(hours: 1, minutes: 5)),
      country: 'Nigeria',
    ),
    PrayerRequest(
      id: 's-9',
      content:
          "Please pray for my grandmother in hospice care. She's been a pillar of faith for our family.",
      category: 'Health',
      prayerCount: 267,
      isAnonymous: false,
      userId: 'sample-9',
      user: const PrayerUser(firstName: 'Anthony', lastName: 'Romano'),
      createdAt: DateTime.now().subtract(const Duration(minutes: 55)),
      country: 'Italy',
    ),
    PrayerRequest(
      id: 's-10',
      content:
          "Pray for peace in my family and reconciliation with my brother. We haven't spoken in years.",
      category: 'Family',
      prayerCount: 198,
      isAnonymous: true,
      userId: 'sample-10',
      user: null,
      createdAt: DateTime.now().subtract(const Duration(minutes: 50)),
      country: 'Ireland',
    ),
  ];

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
      final results = (data as List)
          .map((json) => PrayerRequest.fromJson(json))
          .toList();

      // If Supabase returns empty, use sample data
      if (results.isEmpty && page == 1) {
        return _getSamplePrayers(category, limit);
      }
      return results;
    } catch (e) {
      // Return sample data on error for first page
      if (page == 1) {
        return _getSamplePrayers(category, limit);
      }
      return [];
    }
  }

  List<PrayerRequest> _getSamplePrayers(String? category, int limit) {
    if (category == null || category == 'All') {
      return _samplePrayers.take(limit).toList();
    }
    return _samplePrayers
        .where((p) => p.category?.toLowerCase() == category.toLowerCase())
        .take(limit)
        .toList();
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
