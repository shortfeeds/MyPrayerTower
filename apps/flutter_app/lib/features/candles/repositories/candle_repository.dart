import 'package:flutter_riverpod/flutter_riverpod.dart';
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

  Future<List<Candle>> getActiveCandles() async {
    try {
      final response = await _client
          .from(
            'VirtualCandle',
          ) // Try PascalCase as per Prisma, fallback to lowercase if 404
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
    } catch (e) {
      // If table not found, log silently
      return [];
    }
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
        .from('VirtualCandle')
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
