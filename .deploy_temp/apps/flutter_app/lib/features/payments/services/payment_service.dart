import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/paypal_screen.dart';

final paymentServiceProvider = Provider((ref) => PaymentService());

class PaymentService {
  // Hardcoded Client ID from web app
  static const String _payPalClientId =
      'AZ3c6O0DJtvSCjr7LTBRSgugVnLfCJSZmIeB27xEFsgslNkjTu7wR92V1E-K2luCnN4ZIAreeCvx1-Fc';
  static const String _payPalClientSecret =
      'EHK0ebHCK7vtCuOOznhuoEupHi1rmB3weFoDdnkLbpnm_h7bzjEVhLyUmzSXiub2r-jgCAlGqmnPw9xj';

  Future<void> startPayPalPayment({
    required BuildContext context,
    required double amount,
    required String currency,
    required String description,
    String? userEmail,
    required Function(String) onSuccess,
    required Function(String) onError,
  }) async {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (BuildContext context) => PayPalScreen(
          clientId: _payPalClientId,
          secretKey: _payPalClientSecret,
          currency: currency,
          amount: amount,
          description: description,
          userEmail: userEmail,
          onSuccess: onSuccess,
          onError: onError,
          onCancel: () => onError('Payment Cancelled'),
        ),
      ),
    );
  }
}
