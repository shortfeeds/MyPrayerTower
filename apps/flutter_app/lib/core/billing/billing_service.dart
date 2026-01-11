import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'paypal_service.dart';

final billingServiceProvider = Provider<BillingService>((ref) {
  final paypalService = ref.read(paypalServiceProvider);
  return BillingService(paypalService);
});

final storeProductsProvider = FutureProvider<List<ProductDetails>>((ref) async {
  final billingService = ref.watch(billingServiceProvider);
  // Wait for initialization
  await Future.delayed(const Duration(seconds: 1));
  return billingService.getProducts(_activeProductIds);
});

// Temporary list to avoid import cycle
const Set<String> _activeProductIds = {
  'mass_single',
  'mass_novena',
  'mass_perpetual',
  'mass_gregorian',
  'candle_30d',
  'candle_7d',
  'candle_3d',
  'memorial_premium_upgrade',
  'memorial_offering_consumable',
};

class BillingService {
  final PaypalService _paypalService;
  late final InAppPurchase _iap;
  late StreamSubscription<List<PurchaseDetails>> _subscription;
  bool _isAvailable = false;

  BillingService(this._paypalService) {
    if (kIsWeb) {
      // debugPrint('Billing: Web detected, using PayPal');
      _isAvailable = false;
    } else {
      _iap = InAppPurchase.instance;
      _init();
    }
  }

  Future<void> _init() async {
    try {
      final available = await _iap.isAvailable();
      _isAvailable = available;
      if (available) {
        final purchaseUpdated = _iap.purchaseStream;
        _subscription = purchaseUpdated.listen(
          _onPurchaseUpdate,
          onDone: () {
            _subscription.cancel();
          },
          onError: (error) {
            debugPrint('Billing Error: $error');
          },
        );
      }
    } catch (e) {
      debugPrint('Billing Init Error: $e');
      _isAvailable = false;
    }
  }

  Stream<List<PurchaseDetails>> get purchaseStream =>
      kIsWeb || !_isAvailable ? const Stream.empty() : _iap.purchaseStream;

  Future<void> _onPurchaseUpdate(
    List<PurchaseDetails> purchaseDetailsList,
  ) async {
    for (var purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // Show pending UI
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          // Handle error
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          final valid = await _verifyPurchase(purchaseDetails);
          if (valid) {
            // Deliver product
          }
        }

        if (purchaseDetails.pendingCompletePurchase) {
          await _iap.completePurchase(purchaseDetails);
        }
      }
    }
  }

  Future<bool> _verifyPurchase(PurchaseDetails purchaseDetails) async {
    // NOTE: Verify with backend (Supabase Function) in production
    // debugPrint('Mock verification: ${purchaseDetails.productID}');
    return true;
  }

  Future<bool> isAvailable() async {
    if (kIsWeb) return true; // Web is available via PayPal
    return _isAvailable;
  }

  Future<List<ProductDetails>> getProducts(Set<String> productIds) async {
    if (kIsWeb) {
      // Return mock product details for Web to allow UI to display prices
      // In a real app, these should be fetched from a backend or config
      return productIds
          .map(
            (id) => ProductDetails(
              id: id,
              title: id.replaceAll('_', ' ').toUpperCase(),
              description: 'Web Item',
              price: _getPriceForId(id),
              rawPrice: _getRawPriceForId(id),
              currencyCode: 'USD',
            ),
          )
          .toList();
    }

    if (!_isAvailable) {
      return [];
    }
    try {
      final ProductDetailsResponse response = await _iap.queryProductDetails(
        productIds,
      );
      return response.productDetails;
    } catch (e) {
      debugPrint('Billing Query Error: $e');
      return [];
    }
  }

  // Helper for web prices
  String _getPriceForId(String id) {
    if (id.contains('premium_upgrade')) return '\$49.99';
    if (id.contains('mass')) return '\$15.00';
    if (id.contains('candle')) return '\$5.00';
    return '\$9.99';
  }

  double _getRawPriceForId(String id) {
    if (id.contains('premium_upgrade')) return 49.99;
    if (id.contains('mass')) return 15.00;
    if (id.contains('candle')) return 5.00;
    return 9.99;
  }

  Future<void> buyNonConsumable(ProductDetails product) async {
    if (kIsWeb) {
      debugPrint("Web non-consumable not implemented yet");
      return;
    }
    if (!_isAvailable) return;
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
    await _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }

  Future<void> restorePurchases() async {
    if (kIsWeb) return;
    if (!_isAvailable) return;
    await _iap.restorePurchases();
  }

  Future<void> completePurchase(PurchaseDetails purchase) async {
    if (kIsWeb) return;
    if (!_isAvailable) return;
    await _iap.completePurchase(purchase);
  }

  Future<void> buyConsumable(
    dynamic productOrId, {
    BuildContext? context,
    double? price,
    String? itemName,
  }) async {
    String productId;
    ProductDetails? productDetails;

    if (productOrId is String) {
      productId = productOrId;
    } else if (productOrId is ProductDetails) {
      productId = productOrId.id;
      productDetails = productOrId;
    } else {
      debugPrint('BillingService: Invalid argument type for buyConsumable');
      return;
    }

    if (kIsWeb) {
      // Use PayPal
      if (context == null) {
        debugPrint('Billing Error: Context required for Web/PayPal payment');
        return;
      }

      final payPrice = price ?? _getRawPriceForId(productId);
      final name = itemName ?? productId;

      await _paypalService.payWithPaypal(
        context: context,
        items: [
          {
            "name": name,
            "quantity": 1,
            "price": payPrice.toStringAsFixed(2),
            "currency": "USD",
          },
        ],
        totalAmount: payPrice,
        onSuccess: (params) {
          debugPrint("PayPal Success: $params");
          // Here we should probably trigger a success callback if we had one
          // But since 'buyConsumable' is Future<void>, the await completes.
          // However, Navigator.push is async.
          // The current implementation of payWithPaypal pushes a route.
          // We can return a specific value or just let the caller handle success.
        },
        onError: (err) {
          debugPrint("PayPal Error: $err");
          throw Exception("Payment failed: $err");
        },
        onCancel: () {
          debugPrint("PayPal Cancelled");
          throw Exception("Payment cancelled");
        },
      );
      return;
    }

    final bool available = await _iap.isAvailable();
    if (!available) {
      debugPrint('Billing: Store not available');
      return;
    }

    if (productDetails == null) {
      final ProductDetailsResponse response = await _iap.queryProductDetails({
        productId,
      });
      if (response.notFoundIDs.contains(productId)) {
        debugPrint('Billing: Product $productId not found in store');
        return;
      }
      if (response.productDetails.isEmpty) return;
      productDetails = response.productDetails.first;
    }

    final PurchaseParam purchaseParam = PurchaseParam(
      productDetails: productDetails,
    );
    _iap.buyConsumable(purchaseParam: purchaseParam);
  }
}
