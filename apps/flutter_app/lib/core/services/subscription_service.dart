import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Service for managing user subscription status
class SubscriptionService {
  final SupabaseClient _supabase;

  SubscriptionService(this._supabase);

  /// Get current user's subscription status
  Future<UserSubscription?> getCurrentSubscription() async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return null;

    try {
      final response = await _supabase
          .from('Subscription')
          .select('*')
          .eq('userId', userId)
          .eq('status', 'active')
          .order('createdAt', ascending: false)
          .limit(1)
          .maybeSingle();

      if (response == null) return null;
      return UserSubscription.fromJson(response);
    } catch (e) {
      return null;
    }
  }

  /// Check if user has premium access (active subscription)
  Future<bool> hasPremiumAccess() async {
    // Phase 1: Unlock all features for free (Ad-supported model)
    return true;
  }

  /// Get subscription benefits based on plan
  Future<List<String>> getSubscriptionBenefits() async {
    final subscription = await getCurrentSubscription();
    if (subscription == null) return [];

    switch (subscription.planId) {
      case 'prayer_partner':
        return [
          'Ad-free experience',
          'Priority prayer requests',
          'Exclusive devotionals',
        ];
      case 'family':
        return [
          'All Prayer Partner benefits',
          'Up to 5 family members',
          'Family rosary tracking',
          'Shared prayer intentions',
        ];
      case 'patron':
        return [
          'All Family Plan benefits',
          'Monthly Mass intention',
          'Patron recognition',
          'Direct support line',
        ];
      default:
        return [];
    }
  }

  /// Sync subscription status with Play Store
  Future<void> syncWithPlayStore(String purchaseToken) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) return;

    // Call backend to verify and update subscription
    await _supabase.functions.invoke(
      'verify-purchase',
      body: {
        'userId': userId,
        'purchaseToken': purchaseToken,
        'platform': 'android',
      },
    );
  }

  /// Cancel subscription
  Future<bool> cancelSubscription() async {
    final subscription = await getCurrentSubscription();
    if (subscription == null) return false;

    try {
      await _supabase
          .from('Subscription')
          .update({
            'status': 'cancelled',
            'cancelledAt': DateTime.now().toIso8601String(),
          })
          .eq('id', subscription.id);
      return true;
    } catch (e) {
      return false;
    }
  }
}

/// User subscription model
class UserSubscription {
  final String id;
  final String userId;
  final String planId;
  final String status;
  final DateTime startDate;
  final DateTime? endDate;
  final DateTime? cancelledAt;

  UserSubscription({
    required this.id,
    required this.userId,
    required this.planId,
    required this.status,
    required this.startDate,
    this.endDate,
    this.cancelledAt,
  });

  bool get isActive =>
      status == 'active' &&
      (endDate == null || endDate!.isAfter(DateTime.now()));

  factory UserSubscription.fromJson(Map<String, dynamic> json) {
    return UserSubscription(
      id: json['id'] as String,
      userId: json['userId'] as String,
      planId: json['planId'] as String,
      status: json['status'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: json['endDate'] != null
          ? DateTime.parse(json['endDate'] as String)
          : null,
      cancelledAt: json['cancelledAt'] != null
          ? DateTime.parse(json['cancelledAt'] as String)
          : null,
    );
  }
}

/// Provider for SubscriptionService
final subscriptionServiceProvider = Provider<SubscriptionService>((ref) {
  return SubscriptionService(Supabase.instance.client);
});

/// Provider for current subscription status
final currentSubscriptionProvider = FutureProvider<UserSubscription?>((
  ref,
) async {
  return ref.watch(subscriptionServiceProvider).getCurrentSubscription();
});

/// Provider for premium access status
final hasPremiumAccessProvider = FutureProvider<bool>((ref) async {
  return ref.watch(subscriptionServiceProvider).hasPremiumAccess();
});
