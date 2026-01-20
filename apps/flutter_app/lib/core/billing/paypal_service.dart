import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/payments/services/payment_service.dart';

final paypalServiceProvider = Provider<PaypalService>((ref) {
  return PaypalService(ref.read(paymentServiceProvider));
});

/// PaypalService wraps PaymentService to provide a consistent API
/// for PayPal payments throughout the app.
class PaypalService {
  final PaymentService _paymentService;

  PaypalService(this._paymentService);

  Future<void> payWithPaypal({
    required BuildContext context,
    required List<Map<String, dynamic>> items,
    required double totalAmount,
    required Function(Map) onSuccess,
    required Function(dynamic) onError,
    required Function() onCancel,
  }) async {
    // Build description from items
    final description = items
        .map((item) => item['name'] ?? 'Item')
        .take(3)
        .join(', ');

    await _paymentService.startPayPalPayment(
      context: context,
      amount: totalAmount,
      currency: 'USD',
      description: description.isNotEmpty
          ? description
          : 'MyPrayerTower Purchase',
      onSuccess: (transactionId) {
        onSuccess({'transactionId': transactionId});
      },
      onError: (error) {
        if (error == 'Payment Cancelled') {
          onCancel();
        } else {
          onError(error);
        }
      },
    );
  }
}
