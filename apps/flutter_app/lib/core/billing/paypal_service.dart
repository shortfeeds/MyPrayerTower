import 'package:flutter/material.dart';
import 'package:flutter_paypal_payment/flutter_paypal_payment.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';

final paypalServiceProvider = Provider<PaypalService>((ref) {
  return PaypalService();
});

class PaypalService {
  // Placeholder credentials. In a real app, fetch these from a secure backend or env.
  // For now, these are kept here for demonstration.
  static const String _clientId =
      'AZ3c6O0DJtvSCjr7LTBRSgugVnLfCJSZmIeB27xEFsgslNkjTu7wR92V1E-K2luCnN4ZIAreeCvx1-Fc';
  static const String _secretKey =
      'EHK0ebHCK7vtCuOOznhuoEupHi1rmB3weFoDdnkLbpnm_h7bzjEVhLyUmzSXiub2r-jgCAlGqmnPw9xj';

  Future<void> payWithPaypal({
    required BuildContext context,
    required List<Map<String, dynamic>> items,
    required double totalAmount,
    required Function(Map) onSuccess,
    required Function(dynamic) onError,
    required Function() onCancel,
  }) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
          ),
          backgroundColor: Colors.white,
          insetPadding: const EdgeInsets.all(16),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16.0),
            child: SizedBox(
              height: MediaQuery.of(context).size.height * 0.8,
              width: MediaQuery.of(context).size.width > 600
                  ? 500
                  : double.infinity,
              child: PaypalCheckoutView(
                sandboxMode: kDebugMode,
                clientId: _clientId,
                secretKey: _secretKey,
                transactions: [
                  {
                    "amount": {
                      "total": totalAmount.toStringAsFixed(2),
                      "currency": "USD",
                      "details": {
                        "subtotal": totalAmount.toStringAsFixed(2),
                        "shipping": "0",
                        "shipping_discount": 0,
                      },
                    },
                    "description": "MyPrayerTower Purchase",
                    "item_list": {"items": items},
                  },
                ],
                note: "Contact us for any questions on your order.",
                onSuccess: (Map params) async {
                  onSuccess(params);
                  // The view might pop itself, but if we are in a dialog,
                  // we usually rely on the view traversing the navigator.
                  // PaypalCheckoutView usually calls Navigator.pop on success.
                },
                onError: (error) {
                  // Usually pops itself too
                  onError(error);
                },
                onCancel: (params) {
                  // Usually pops itself too
                  onCancel();
                },
              ),
            ),
          ),
        );
      },
    );
  }
}
