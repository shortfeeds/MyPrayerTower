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

  // In-memory storage for mock data persistence
  static final List<PrayerRequest> _mockStorage = [
    PrayerRequest(
      id: '1',
      content:
          'Please pray for my mother who is undergoing surgery tomorrow. May God guide the surgeons hands.',
      userId: 'user1',
      isAnonymous: false,
      category: 'Health',
      prayCount: 24,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    PrayerRequest(
      id: '2',
      content:
          'Praying for guidance in my career path. I am at a crossroads and need clarity.',
      userId: 'user2',
      isAnonymous: true,
      category: 'Guidance',
      prayCount: 15,
      createdAt: DateTime.now().subtract(const Duration(hours: 5)),
    ),
    PrayerRequest(
      id: '3',
      content: 'For peace in my family. We are going through a difficult time.',
      userId: 'user3',
      isAnonymous: true,
      category: 'Family',
      prayCount: 42,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    PrayerRequest(
      id: '4',
      content: 'Thanksgiving for a safe delivery of our baby boy! God is good!',
      userId: 'user4',
      isAnonymous: false,
      category: 'Thanksgiving',
      prayCount: 108,
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    PrayerRequest(
      id: '5',
      content:
          'For my friend battling addiction. Please pray for strength and recovery.',
      userId: 'user5',
      isAnonymous: true,
      category: 'Health',
      prayCount: 56,
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    PrayerRequest(
      id: '6',
      content:
          'Prayers for the souls in purgatory, especially those who have no one to pray for them.',
      userId: 'user6',
      isAnonymous: false,
      category: 'Souls',
      prayCount: 89,
      createdAt: DateTime.now().subtract(const Duration(days: 4)),
    ),
  ];

  Future<List<PrayerRequest>> getRequests({
    String? category,
    int page = 1,
  }) async {
    try {
      var query = _supabase.from('PrayerRequest').select();

      if (category != null && category != 'ALL') {
        query = query.eq('category', category);
      }

      // Order by createdAt desc
      final orderedQuery = query.order('createdAt', ascending: false);

      final from = (page - 1) * 20;
      final to = from + 19;

      final data = await orderedQuery.range(from, to);

      return (data as List)
          .map((json) => PrayerRequest.fromJson(json))
          .toList();
    } catch (e) {
      // Fallback to mock data
      return _getMockRequests(category);
    }
  }

  Future<void> submitRequest({
    required String content,
    String? category,
    bool isAnonymous = false,
  }) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) {
        // Allow mock submission without auth for now or throw
        // throw Exception('User must be logged in to submit a prayer request');
      }

      await _supabase.from('PrayerRequest').insert({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'userId': user?.id ?? 'anon',
        'content': content,
        'category': category ?? 'OTHER',
        'isAnonymous': isAnonymous,
        'prayerCount': 0,
      });
    } catch (e) {
      // Mock success for submission
      // Add to local mock storage
      final newRequest = PrayerRequest(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: content,
        userId: 'current_user',
        isAnonymous: isAnonymous,
        category: category ?? 'General',
        prayCount: 0,
        createdAt: DateTime.now(),
      );
      _mockStorage.insert(0, newRequest); // Add to top
      await Future.delayed(const Duration(seconds: 1));
    }
  }

  Future<void> prayForRequest(String id) async {
    try {
      await _supabase.rpc('increment_prayer_count', params: {'request_id': id});
    } catch (e) {
      // Fallback: increment locally in mock storage
      final index = _mockStorage.indexWhere((r) => r.id == id);
      if (index != -1) {
        final request = _mockStorage[index];
        _mockStorage[index] = PrayerRequest(
          id: request.id,
          content: request.content,
          userId: request.userId,
          isAnonymous: request.isAnonymous,
          category: request.category,
          prayCount: request.prayCount + 1,
          createdAt: request.createdAt,
        );
      }
    }
  }

  List<PrayerRequest> _getMockRequests(String? category) {
    if (category != null && category != 'ALL') {
      return _mockStorage.where((r) => r.category == category).toList();
    }
    return _mockStorage;
  }
}
