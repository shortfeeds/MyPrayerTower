import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/donation_model.dart';

// ... (skip untargeted lines)
/// Create a checkout session (placeholder for Stripe/Cashfree integration)
Future<String> createCheckoutSession({
  required int amount,
  required String email,
  required String successUrl,
  required String cancelUrl,
}) async {
  // NOTE: Integrate with Stripe or Cashfree API in future
  debugPrint('Mock Checkout Session for $email');
  return 'session_${DateTime.now().millisecondsSinceEpoch}';
}

final donationsRepositoryProvider = Provider<DonationsRepository>((ref) {
  return DonationsRepository(ref.watch(supabaseProvider));
});

/// Static donation tiers (can be fetched from DB in future)
final donationTiersProvider = Provider<List<DonationTier>>((ref) {
  return const [
    DonationTier(
      id: 'CANDLE',
      label: '🕯️ Light a Candle',
      icon: '🕯️',
      amount: 1000,
      description: 'A small offering of love',
    ),
    DonationTier(
      id: 'ROSARY',
      label: '📿 Rosary Partner',
      icon: '📿',
      amount: 2000,
      description: 'Support our prayer mission',
    ),
    DonationTier(
      id: 'SUPPORTER',
      label: '⛪ Parish Supporter',
      icon: '⛪',
      amount: 5000,
      description: 'Strengthen our community',
      isPopular: true,
    ),
    DonationTier(
      id: 'GUARDIAN',
      label: '👼 Guardian Angel',
      icon: '👼',
      amount: 10000,
      description: 'Protect those in need',
    ),
    DonationTier(
      id: 'BENEFACTOR',
      label: '🌟 Benefactor',
      icon: '🌟',
      amount: 25000,
      description: 'Major supporter',
    ),
    DonationTier(
      id: 'PATRON',
      label: '💎 Patron',
      icon: '💎',
      amount: 50000,
      description: 'Distinguished patron',
    ),
  ];
});

/// Subscription plans
final subscriptionPlansProvider = Provider<List<SubscriptionPlan>>((ref) {
  return const [
    SubscriptionPlan(
      id: 'PRAYER_PARTNER',
      name: 'Prayer Partner',
      icon: '🙏',
      price: 999,
      perks: [
        '1 Mass offered monthly for your intention',
        '10% off all Mass offerings',
        'Priority prayer wall placement',
        'Exclusive prayer content',
      ],
      isPopular: true,
    ),
    SubscriptionPlan(
      id: 'FAMILY_PLAN',
      name: 'Family Plan',
      icon: '👨‍👩‍👧‍👦',
      price: 1999,
      perks: [
        '3 Masses offered monthly',
        '15% off all Mass offerings',
        'Family intention tracking',
        'Shared prayer goals',
      ],
    ),
    SubscriptionPlan(
      id: 'PATRON_CIRCLE',
      name: 'Patron Circle',
      icon: '💎',
      price: 4999,
      perks: [
        'Unlimited Mass requests',
        'Perpetual Enrollment included',
        '25% off all add-ons',
        'VIP support & recognition',
      ],
    ),
  ];
});

class DonationsRepository {
  final SupabaseClient _supabase;

  DonationsRepository(this._supabase);

  /// Submit a one-time donation
  Future<String> createDonation(DonationRequest request) async {
    try {
      final user = _supabase.auth.currentUser;

      final data = await _supabase
          .from('PlatformDonation')
          .insert({
            'id': DateTime.now().millisecondsSinceEpoch.toString(),
            'orderNumber': 'DON-${DateTime.now().millisecondsSinceEpoch}',
            'amount': request.amount,
            'currency': request.currency,
            'email': request.email,
            'name': request.name,
            'phone': request.phone,
            'isAnonymous': request.isAnonymous,
            'message': request.message,
            'inMemoryOf': request.inMemoryOf,
            'inHonorOf': request.inHonorOf,
            'coversFee': request.coversFee,
            'userId': user?.id,
            'status': 'PENDING',
          })
          .select()
          .single();

      return data['id'] as String;
    } catch (e) {
      throw Exception('Failed to create donation: $e');
    }
  }

  /// Create a checkout session (placeholder for Stripe/Cashfree integration)
  Future<String> createCheckoutSession({
    required int amount,
    required String email,
    required String successUrl,
    required String cancelUrl,
  }) async {
    // NOTE: Integrate with Stripe or Cashfree API in future
    debugPrint('Mock Checkout Session for $email');
    return 'session_${DateTime.now().millisecondsSinceEpoch}';
  }
}
