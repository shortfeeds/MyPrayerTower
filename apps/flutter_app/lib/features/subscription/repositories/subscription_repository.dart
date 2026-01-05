import 'package:flutter_riverpod/flutter_riverpod.dart';

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>((ref) {
  return SubscriptionRepository();
});

class SubscriptionRepository {
  SubscriptionRepository();

  Future<void> verifyPurchase({
    required String purchaseId,
    required String verificationData,
    required String source,
    required String productId,
  }) async {
    // In production, send this to backend for verification
    // await _dio.post('/billing/verify', data: { ... });

    // For now mocking success
    await Future.delayed(const Duration(seconds: 1));
  }
}
