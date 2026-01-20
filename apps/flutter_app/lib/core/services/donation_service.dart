import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/app_constants.dart';

/// Service for managing donation history
class DonationService {
  final SupabaseClient _supabase;

  DonationService(this._supabase);

  /// Get current user's donation history
  Future<List<Donation>> getDonationHistory() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return [];

    try {
      final response = await _supabase
          .from('Donation')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', ascending: false)
          .limit(50);

      return (response as List).map((json) => Donation.fromJson(json)).toList();
    } catch (e) {
      return [];
    }
  }

  /// Get total donations for current user
  Future<double> getTotalDonations() async {
    final donations = await getDonationHistory();
    double total = 0.0;
    for (final d in donations) {
      total += d.amount;
    }
    return total;
  }

  /// Create a new donation via backend API (for payment verification)
  Future<Map<String, dynamic>?> createDonationViaApi({
    required double amount,
    required String type,
    String? paymentId,
    String? intention,
    String? name,
    String? email,
  }) async {
    final user = _supabase.auth.currentUser;
    final accessToken = _supabase.auth.currentSession?.accessToken;

    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/donations/checkout'),
        headers: {
          'Content-Type': 'application/json',
          if (accessToken != null) 'Authorization': 'Bearer $accessToken',
        },
        body: jsonEncode({
          'amount': (amount * 100).toInt(), // Convert to cents
          'email': email ?? user?.email ?? '',
          'name': name ?? user?.userMetadata?['full_name'] ?? 'Anonymous',
          'paypalOrderId': paymentId,
          'intention': intention,
          'tier': 'CUSTOM',
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        debugPrint('Donation recorded via API: ${data['orderNumber']}');
        return data;
      } else {
        debugPrint(
          'API Donation Error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      debugPrint('API Donation Exception: $e');
    }
    return null;
  }

  /// Create a new donation record (Supabase fallback)
  Future<Donation?> createDonation({
    required double amount,
    required String type, // 'one_time', 'recurring', 'mass_offering'
    String? paymentId,
    String? intention,
  }) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return null;

    try {
      final response = await _supabase
          .from('Donation')
          .insert({
            'userId': userId,
            'amount': amount,
            'type': type,
            'paymentId': paymentId,
            'intention': intention,
            'status': 'completed',
            'createdAt': DateTime.now().toIso8601String(),
          })
          .select()
          .single();

      return Donation.fromJson(response);
    } catch (e) {
      return null;
    }
  }

  /// Get mass offering history
  Future<List<MassOffering>> getMassOfferingHistory() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return [];

    try {
      final response = await _supabase
          .from('MassOffering')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', ascending: false)
          .limit(50);

      return (response as List)
          .map((json) => MassOffering.fromJson(json))
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Get virtual candle history
  Future<List<VirtualCandle>> getCandleHistory() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return [];

    try {
      final response = await _supabase
          .from('VirtualCandle')
          .select('*')
          .eq('userId', userId)
          .order('createdAt', ascending: false)
          .limit(50);

      return (response as List)
          .map((json) => VirtualCandle.fromJson(json))
          .toList();
    } catch (e) {
      return [];
    }
  }
}

/// Donation model
class Donation {
  final String id;
  final String userId;
  final double amount;
  final String type;
  final String status;
  final String? paymentId;
  final String? intention;
  final DateTime createdAt;

  Donation({
    required this.id,
    required this.userId,
    required this.amount,
    required this.type,
    required this.status,
    this.paymentId,
    this.intention,
    required this.createdAt,
  });

  factory Donation.fromJson(Map<String, dynamic> json) {
    return Donation(
      id: json['id'] as String,
      userId: json['userId'] as String,
      amount: (json['amount'] as num).toDouble(),
      type: json['type'] as String,
      status: json['status'] as String,
      paymentId: json['paymentId'] as String?,
      intention: json['intention'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

/// Mass offering model
class MassOffering {
  final String id;
  final String userId;
  final String type; // 'REGULAR', 'EXPEDITED', 'PERPETUAL'
  final double amount;
  final String intention;
  final String? recipientName;
  final String status;
  final DateTime createdAt;

  MassOffering({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    required this.intention,
    this.recipientName,
    required this.status,
    required this.createdAt,
  });

  factory MassOffering.fromJson(Map<String, dynamic> json) {
    return MassOffering(
      id: json['id'] as String,
      userId: json['userId'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      intention: json['intention'] as String,
      recipientName: json['recipientName'] as String?,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

/// Virtual candle model
class VirtualCandle {
  final String id;
  final String userId;
  final String type; // 'vigil', 'novena', 'perpetual'
  final double amount;
  final String intention;
  final DateTime expiresAt;
  final DateTime createdAt;

  VirtualCandle({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    required this.intention,
    required this.expiresAt,
    required this.createdAt,
  });

  bool get isActive => DateTime.now().isBefore(expiresAt);

  factory VirtualCandle.fromJson(Map<String, dynamic> json) {
    return VirtualCandle(
      id: json['id'] as String,
      userId: json['userId'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      intention: json['intention'] as String,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

/// Provider for DonationService
final donationServiceProvider = Provider<DonationService>((ref) {
  return DonationService(Supabase.instance.client);
});

/// Provider for donation history
final donationHistoryProvider = FutureProvider<List<Donation>>((ref) async {
  return ref.watch(donationServiceProvider).getDonationHistory();
});

/// Provider for total donations
final totalDonationsProvider = FutureProvider<double>((ref) async {
  return ref.watch(donationServiceProvider).getTotalDonations();
});

/// Provider for mass offering history
final massOfferingHistoryProvider = FutureProvider<List<MassOffering>>((
  ref,
) async {
  return ref.watch(donationServiceProvider).getMassOfferingHistory();
});

/// Provider for candle history
final candleHistoryProvider = FutureProvider<List<VirtualCandle>>((ref) async {
  return ref.watch(donationServiceProvider).getCandleHistory();
});
