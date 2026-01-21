import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

class AbandonedCartService {
  final ApiService _api;

  AbandonedCartService(this._api);

  Future<void> saveCart({
    required String type,
    required String email,
    required Map<String, dynamic> data,
    required String step,
    String? name,
    String? phone,
  }) async {
    try {
      await _api.post(
        '/carts/abandoned',
        data: {
          'type': type,
          'email': email,
          'data': data,
          'step': step,
          'source': 'FLUTTER',
          'name': name,
          'phone': phone,
        },
      );
    } catch (e) {
      // Silent error - don't disrupt user experience for background tracking
      debugPrint('Failed to save abandoned cart: $e');
    }
  }
}

final abandonedCartServiceProvider = Provider<AbandonedCartService>((ref) {
  return AbandonedCartService(ref.watch(apiServiceProvider));
});
