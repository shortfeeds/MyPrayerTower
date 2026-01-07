import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';

/// Model for a virtual candle stored in the database
class CandleData {
  final String id;
  final String userName;
  final String intention;
  final String tier; // 'premium', 'standard', 'basic', 'free'
  final String duration; // 'ONE_DAY', 'THREE_DAYS', 'SEVEN_DAYS', 'THIRTY_DAYS'
  final DateTime createdAt;
  final DateTime expiresAt;
  final int prayerCount;
  final String? userId; // null for anonymous/guest users
  final bool isAnonymous;

  CandleData({
    required this.id,
    required this.userName,
    required this.intention,
    required this.tier,
    required this.duration,
    required this.createdAt,
    required this.expiresAt,
    required this.prayerCount,
    this.userId,
    required this.isAnonymous,
  });

  factory CandleData.fromJson(Map<String, dynamic> json) {
    return CandleData(
      id: json['id'] as String,
      userName: json['user_name'] as String? ?? 'Anonymous',
      intention: json['intention'] as String,
      tier: json['tier'] as String? ?? 'free',
      duration: json['duration'] as String? ?? 'ONE_DAY',
      createdAt: DateTime.parse(json['created_at'] as String),
      expiresAt: DateTime.parse(json['expires_at'] as String),
      prayerCount: json['prayer_count'] as int? ?? 0,
      userId: json['user_id'] as String?,
      isAnonymous: json['is_anonymous'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_name': userName,
      'intention': intention,
      'tier': tier,
      'duration': duration,
      'created_at': createdAt.toIso8601String(),
      'expires_at': expiresAt.toIso8601String(),
      'prayer_count': prayerCount,
      'user_id': userId,
      'is_anonymous': isAnonymous,
    };
  }

  int get remainingHours {
    final now = DateTime.now();
    if (expiresAt.isBefore(now)) return 0;
    return expiresAt.difference(now).inHours;
  }

  bool get isActive => remainingHours > 0;
}

/// Repository for candle operations with Supabase
class CandleRepository {
  final SupabaseClient _client;

  CandleRepository(this._client);

  /// Get all active candles (not expired)
  Future<List<CandleData>> getActiveCandles() async {
    try {
      final response = await _client
          .from('candles')
          .select()
          .gt('expires_at', DateTime.now().toIso8601String())
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => CandleData.fromJson(json))
          .toList();
    } catch (e) {
      // Return empty list if table doesn't exist or other error
      debugPrint('Error fetching candles: $e');
      return [];
    }
  }

  /// Get candles for a specific user
  Future<List<CandleData>> getUserCandles(String userId) async {
    try {
      final response = await _client
          .from('candles')
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => CandleData.fromJson(json))
          .toList();
    } catch (e) {
      debugPrint('Error fetching user candles: $e');
      return [];
    }
  }

  /// Light a new candle (save to database)
  /// Works for both logged-in users and guests
  Future<CandleData?> lightCandle({
    required String userName,
    required String intention,
    required String duration,
    required String tier,
    String? userId,
    required bool isAnonymous,
  }) async {
    try {
      final now = DateTime.now();
      final hours = _getDurationHours(duration);
      final expiresAt = now.add(Duration(hours: hours));

      final data = {
        'user_name': isAnonymous ? 'Anonymous' : userName,
        'intention': intention,
        'tier': tier,
        'duration': duration,
        'created_at': now.toIso8601String(),
        'expires_at': expiresAt.toIso8601String(),
        'prayer_count': 0,
        'user_id': userId,
        'is_anonymous': isAnonymous,
      };

      final response = await _client
          .from('candles')
          .insert(data)
          .select()
          .single();

      return CandleData.fromJson(response);
    } catch (e) {
      debugPrint('Error lighting candle: $e');
      return null;
    }
  }

  /// Increment prayer count for a candle
  Future<void> prayForCandle(String candleId) async {
    try {
      await _client.rpc(
        'increment_candle_prayers',
        params: {'candle_id': candleId},
      );
    } catch (e) {
      // Fallback: direct update if RPC doesn't exist
      try {
        // Get current count first
        final current = await _client
            .from('candles')
            .select('prayer_count')
            .eq('id', candleId)
            .single();

        final currentCount = current['prayer_count'] as int? ?? 0;

        await _client
            .from('candles')
            .update({'prayer_count': currentCount + 1})
            .eq('id', candleId);
      } catch (e2) {
        debugPrint('Error praying for candle: $e2');
      }
    }
  }

  int _getDurationHours(String duration) {
    switch (duration) {
      case 'ONE_DAY':
        return 24;
      case 'THREE_DAYS':
        return 72;
      case 'SEVEN_DAYS':
        return 168;
      case 'THIRTY_DAYS':
        return 720;
      default:
        return 24;
    }
  }
}

void debugPrint(String message) {
  // ignore: avoid_print
  print(message);
}

/// Provider for CandleRepository
final candleRepositoryProvider = Provider<CandleRepository>((ref) {
  final client = ref.watch(supabaseProvider);
  return CandleRepository(client);
});

/// Provider for active candles stream
final activeCandlesProvider = FutureProvider<List<CandleData>>((ref) async {
  final repo = ref.watch(candleRepositoryProvider);
  return repo.getActiveCandles();
});

/// Provider for current user's candles
final userCandlesProvider = FutureProvider.family<List<CandleData>, String?>((
  ref,
  userId,
) async {
  if (userId == null) return [];
  final repo = ref.watch(candleRepositoryProvider);
  return repo.getUserCandles(userId);
});
