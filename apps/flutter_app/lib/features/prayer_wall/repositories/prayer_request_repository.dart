import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';

/// Model for a prayer request stored in the database
class PrayerRequestData {
  final String id;
  final String userName;
  final String intention;
  final String? category;
  final DateTime createdAt;
  final int prayerCount;
  final String? userId; // null for anonymous/guest users
  final bool isAnonymous;
  final bool isApproved; // Moderation flag
  final bool isPending; // Pending moderation

  PrayerRequestData({
    required this.id,
    required this.userName,
    required this.intention,
    this.category,
    required this.createdAt,
    required this.prayerCount,
    this.userId,
    required this.isAnonymous,
    required this.isApproved,
    required this.isPending,
  });

  factory PrayerRequestData.fromJson(Map<String, dynamic> json) {
    return PrayerRequestData(
      id: json['id'] as String,
      userName: json['user_name'] as String? ?? 'Anonymous',
      intention: json['intention'] as String,
      category: json['category'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      prayerCount: json['prayer_count'] as int? ?? 0,
      userId: json['user_id'] as String?,
      isAnonymous: json['is_anonymous'] as bool? ?? false,
      isApproved: json['is_approved'] as bool? ?? false,
      isPending: json['is_pending'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_name': userName,
      'intention': intention,
      'category': category,
      'created_at': createdAt.toIso8601String(),
      'prayer_count': prayerCount,
      'user_id': userId,
      'is_anonymous': isAnonymous,
      'is_approved': isApproved,
      'is_pending': isPending,
    };
  }
}

/// Repository for prayer request operations with Supabase
class PrayerRequestRepository {
  final SupabaseClient _client;

  PrayerRequestRepository(this._client);

  /// Get all approved prayer requests (public wall)
  Future<List<PrayerRequestData>> getApprovedRequests() async {
    try {
      final response = await _client
          .from('prayer_requests')
          .select()
          .eq('is_approved', true)
          .order('created_at', ascending: false)
          .limit(50);

      return (response as List)
          .map((json) => PrayerRequestData.fromJson(json))
          .toList();
    } catch (e) {
      _debugPrint('Error fetching approved requests: $e');
      return [];
    }
  }

  /// Get prayer requests for a specific user (including pending)
  Future<List<PrayerRequestData>> getUserRequests(String userId) async {
    try {
      final response = await _client
          .from('prayer_requests')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => PrayerRequestData.fromJson(json))
          .toList();
    } catch (e) {
      _debugPrint('Error fetching user requests: $e');
      return [];
    }
  }

  /// Submit a new prayer request (requires moderation)
  /// Works for both logged-in users and guests
  Future<PrayerRequestData?> submitRequest({
    required String userName,
    required String intention,
    String? category,
    String? userId,
    required bool isAnonymous,
  }) async {
    try {
      final data = {
        'user_name': isAnonymous ? 'Anonymous' : userName,
        'intention': intention,
        'category': category ?? 'General',
        'created_at': DateTime.now().toIso8601String(),
        'prayer_count': 0,
        'user_id': userId,
        'is_anonymous': isAnonymous,
        'is_approved': false, // Requires moderation
        'is_pending': true,
      };

      final response = await _client
          .from('prayer_requests')
          .insert(data)
          .select()
          .single();

      return PrayerRequestData.fromJson(response);
    } catch (e) {
      _debugPrint('Error submitting prayer request: $e');
      return null;
    }
  }

  /// Increment prayer count for a request
  Future<void> prayForRequest(String requestId) async {
    try {
      // Get current count first
      final current = await _client
          .from('prayer_requests')
          .select('prayer_count')
          .eq('id', requestId)
          .single();

      final currentCount = current['prayer_count'] as int? ?? 0;

      await _client
          .from('prayer_requests')
          .update({'prayer_count': currentCount + 1})
          .eq('id', requestId);
    } catch (e) {
      _debugPrint('Error praying for request: $e');
    }
  }

  /// Approve a prayer request (admin only)
  Future<bool> approveRequest(String requestId) async {
    try {
      await _client
          .from('prayer_requests')
          .update({'is_approved': true, 'is_pending': false})
          .eq('id', requestId);
      return true;
    } catch (e) {
      _debugPrint('Error approving request: $e');
      return false;
    }
  }

  /// Reject a prayer request (admin only)
  Future<bool> rejectRequest(String requestId) async {
    try {
      await _client
          .from('prayer_requests')
          .update({'is_approved': false, 'is_pending': false})
          .eq('id', requestId);
      return true;
    } catch (e) {
      _debugPrint('Error rejecting request: $e');
      return false;
    }
  }

  /// Get pending requests for moderation (admin only)
  Future<List<PrayerRequestData>> getPendingRequests() async {
    try {
      final response = await _client
          .from('prayer_requests')
          .select()
          .eq('is_pending', true)
          .order('created_at', ascending: true);

      return (response as List)
          .map((json) => PrayerRequestData.fromJson(json))
          .toList();
    } catch (e) {
      _debugPrint('Error fetching pending requests: $e');
      return [];
    }
  }

  void _debugPrint(String message) {
    // ignore: avoid_print
    print(message);
  }
}

/// Provider for PrayerRequestRepository
final prayerRequestRepositoryProvider = Provider<PrayerRequestRepository>((
  ref,
) {
  final client = ref.watch(supabaseProvider);
  return PrayerRequestRepository(client);
});

/// Provider for approved prayer requests (public wall)
final approvedPrayerRequestsProvider = FutureProvider<List<PrayerRequestData>>((
  ref,
) async {
  final repo = ref.watch(prayerRequestRepositoryProvider);
  return repo.getApprovedRequests();
});

/// Provider for current user's prayer requests
final userPrayerRequestsProvider =
    FutureProvider.family<List<PrayerRequestData>, String?>((
      ref,
      userId,
    ) async {
      if (userId == null) return [];
      final repo = ref.watch(prayerRequestRepositoryProvider);
      return repo.getUserRequests(userId);
    });

/// Provider for pending requests (admin moderation)
final pendingPrayerRequestsProvider = FutureProvider<List<PrayerRequestData>>((
  ref,
) async {
  final repo = ref.watch(prayerRequestRepositoryProvider);
  return repo.getPendingRequests();
});
