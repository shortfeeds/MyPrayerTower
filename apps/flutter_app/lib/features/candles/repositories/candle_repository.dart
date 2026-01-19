import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/candle_model.dart';
import 'dart:math';

final candleRepositoryProvider = Provider<CandleRepository>((ref) {
  return CandleRepository(Supabase.instance.client);
});

final activeCandlesProvider = FutureProvider<List<Candle>>((ref) {
  return ref.watch(candleRepositoryProvider).getActiveCandles();
});

class CandleRepository {
  final SupabaseClient _client;

  CandleRepository(this._client);

  // Sample candle data for fallback
  static List<Candle> _sampleCandles() {
    final random = Random();
    return [
      Candle(
        id: 's-1',
        intention: 'For world peace and healing of nations',
        name: 'Maria S.',
        isAnonymous: false,
        duration: 'THIRTY_DAYS',
        litAt: DateTime.now().subtract(const Duration(days: 2)),
        expiresAt: DateTime.now().add(const Duration(days: 28)),
        isActive: true,
        prayerCount: 3500 + random.nextInt(500),
      ),
      Candle(
        id: 's-2',
        intention: 'For my mother\'s recovery from illness',
        name: 'John D.',
        isAnonymous: false,
        duration: 'SEVEN_DAYS',
        litAt: DateTime.now().subtract(const Duration(days: 1)),
        expiresAt: DateTime.now().add(const Duration(days: 6)),
        isActive: true,
        prayerCount: 800 + random.nextInt(200),
      ),
      Candle(
        id: 's-3',
        intention: 'Thanksgiving for answered prayers',
        name: 'Anonymous',
        isAnonymous: true,
        duration: 'THREE_DAYS',
        litAt: DateTime.now().subtract(const Duration(hours: 12)),
        expiresAt: DateTime.now().add(const Duration(days: 2, hours: 12)),
        isActive: true,
        prayerCount: 350 + random.nextInt(100),
      ),
      Candle(
        id: 's-4',
        intention: 'For the souls in purgatory',
        name: 'Fr. Michael',
        isAnonymous: false,
        duration: 'THIRTY_DAYS',
        litAt: DateTime.now().subtract(const Duration(days: 5)),
        expiresAt: DateTime.now().add(const Duration(days: 25)),
        isActive: true,
        prayerCount: 5200 + random.nextInt(800),
      ),
      Candle(
        id: 's-5',
        intention: 'For my children\'s faith journey',
        name: 'Patricia O.',
        isAnonymous: false,
        duration: 'SEVEN_DAYS',
        litAt: DateTime.now().subtract(const Duration(hours: 6)),
        expiresAt: DateTime.now().add(const Duration(days: 6, hours: 18)),
        isActive: true,
        prayerCount: 450 + random.nextInt(150),
      ),
      Candle(
        id: 's-6',
        intention: 'For guidance in my career',
        name: 'David W.',
        isAnonymous: false,
        duration: 'ONE_DAY',
        litAt: DateTime.now().subtract(const Duration(hours: 2)),
        expiresAt: DateTime.now().add(const Duration(hours: 22)),
        isActive: true,
        prayerCount: 120 + random.nextInt(80),
      ),
      Candle(
        id: 's-7',
        intention: 'For healing of broken relationships',
        name: 'Anonymous',
        isAnonymous: true,
        duration: 'SEVEN_DAYS',
        litAt: DateTime.now().subtract(const Duration(days: 3)),
        expiresAt: DateTime.now().add(const Duration(days: 4)),
        isActive: true,
        prayerCount: 1800 + random.nextInt(400),
      ),
      Candle(
        id: 's-8',
        intention: 'In thanksgiving for a new baby',
        name: 'Sarah M.',
        isAnonymous: false,
        duration: 'THIRTY_DAYS',
        litAt: DateTime.now().subtract(const Duration(days: 1)),
        expiresAt: DateTime.now().add(const Duration(days: 29)),
        isActive: true,
        prayerCount: 2100 + random.nextInt(300),
      ),
      Candle(
        id: 's-9',
        intention: 'For protection during travels',
        name: 'Peter L.',
        isAnonymous: false,
        duration: 'THREE_DAYS',
        litAt: DateTime.now().subtract(const Duration(hours: 8)),
        expiresAt: DateTime.now().add(const Duration(days: 2, hours: 16)),
        isActive: true,
        prayerCount: 280 + random.nextInt(70),
      ),
      Candle(
        id: 's-10',
        intention: 'For vocations to the priesthood',
        name: 'Sr. Teresa',
        isAnonymous: false,
        duration: 'SEVEN_DAYS',
        litAt: DateTime.now().subtract(const Duration(hours: 18)),
        expiresAt: DateTime.now().add(const Duration(days: 5, hours: 6)),
        isActive: true,
        prayerCount: 920 + random.nextInt(180),
      ),
    ];
  }

  Future<List<Candle>> getActiveCandles() async {
    try {
      final candles = await _fetchCandles('PrayerCandle');
      if (candles.isEmpty) {
        return _sampleCandles();
      }
      return candles;
    } catch (e) {
      // If PascalCase fails (e.g. 404), try snake_case which is common in Supabase
      try {
        final candles = await _fetchCandles('prayer_candle');
        if (candles.isEmpty) {
          return _sampleCandles();
        }
        return candles;
      } catch (e2) {
        debugPrint('Error fetching candles: $e2');
        return _sampleCandles();
      }
    }
  }

  Future<List<Candle>> _fetchCandles(String tableName) async {
    final response = await _client
        .from(tableName)
        .select()
        .eq('isActive', true)
        .gt('expiresAt', DateTime.now().toIso8601String())
        .eq('paymentStatus', 'PAID') // Only paid/confirmed candles
        .order('litAt', ascending: false)
        .limit(50);

    final data = response as List<dynamic>;

    return data.map((json) {
      // Handle potential case differences or missing fields
      final duration = json['duration'] as String;

      // Calculate fallback prayer count similar to Web App
      int fallbackCount = 100;
      final random = Random();
      if (duration == 'THIRTY_DAYS') {
        fallbackCount = 3000 + random.nextInt(27000);
      } else if (duration == 'SEVEN_DAYS') {
        fallbackCount = 600 + random.nextInt(600);
      } else if (duration == 'THREE_DAYS') {
        fallbackCount = 100 + random.nextInt(500);
      } else {
        fallbackCount = 90 + random.nextInt(210);
      }

      // We use the JSON directly but add our calculated prayer count
      final Map<String, dynamic> candleMap = Map<String, dynamic>.from(json);
      candleMap['prayerCount'] =
          fallbackCount; // Supabase doesn't store this, we follow web logic

      return Candle.fromJson(candleMap);
    }).toList();
  }

  Future<Candle?> lightCandle({
    required String intention,
    String? name,
    bool isAnonymous = false,
    required String duration, // ONE_DAY, etc.
    String? userId,
    required int amountInCents,
  }) async {
    // Logic for creating a candle row
    // Note: Payment usually happens before or we create as PENDING
    // This method might be used for free candles or after payment

    final expiresAt = DateTime.now().add(
      Duration(days: _getDurationDays(duration)),
    );

    final response = await _client
        .from('PrayerCandle')
        .insert({
          'intention': intention,
          'name': name,
          'isAnonymous': isAnonymous,
          'duration': duration,
          'userId': userId,
          'amount': amountInCents,
          'litAt': DateTime.now().toIso8601String(),
          'expiresAt': expiresAt.toIso8601String(),
          'isActive': true, // Auto-active for now (assumes payment checked)
          'paymentStatus': 'PAID',
        })
        .select()
        .single();

    // Map response to Candle object so UI can use it
    // Add default prayer count since it's new
    final data = Map<String, dynamic>.from(response);
    data['prayerCount'] = 0;

    return Candle.fromJson(data);
  }

  int _getDurationDays(String duration) {
    switch (duration) {
      case 'ONE_DAY':
        return 1;
      case 'THREE_DAYS':
        return 3;
      case 'SEVEN_DAYS':
        return 7;
      case 'THIRTY_DAYS':
        return 30;
      default:
        return 1;
    }
  }
}
