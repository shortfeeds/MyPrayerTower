import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'product_ids.dart';

/// Service to handle Google Play Billing
class BillingService {
  final InAppPurchase _iap = InAppPurchase.instance;
  final Ref ref;

  // Stream of purchases
  late StreamSubscription<List<PurchaseDetails>> _subscription;

  BillingService(this.ref) {
    _init();
  }

  void _init() {
    final purchaseUpdated = _iap.purchaseStream;
    _subscription = purchaseUpdated.listen(
      (purchaseDetailsList) {
        _listenToPurchaseUpdated(purchaseDetailsList);
      },
      onDone: () {
        _subscription.cancel();
      },
      onError: (error) {
        debugPrint('Billing Error: $error');
      },
    );
  }

  void dispose() {
    _subscription.cancel();
  }

  /// Initialize and load products
  Future<void> initStore() async {
    await isAvailable();
  }

  /// Check if store is available
  Future<bool> isAvailable() async {
    return _iap.isAvailable();
  }

  /// Expose purchase stream
  Stream<List<PurchaseDetails>> get purchaseStream => _iap.purchaseStream;

  /// Complete purchase
  Future<void> completePurchase(PurchaseDetails purchase) async {
    await _iap.completePurchase(purchase);
  }

  /// Get products
  Future<List<ProductDetails>> getProducts([Set<String>? ids]) async {
    try {
      final bool available = await _iap.isAvailable();
      if (!available) return [];

      final Set<String> _kIds =
          ids ??
          {
            ...ProductIds.subscriptions,
            ...ProductIds.candles,
            ...ProductIds.donations,
            ...ProductIds.massOfferings,
            ...ProductIds.bouquets,
          };

      final ProductDetailsResponse response = await _iap.queryProductDetails(
        _kIds,
      );
      if (response.notFoundIDs.isNotEmpty) {
        debugPrint('Products not found: ${response.notFoundIDs}');
      }
      return response.productDetails;
    } catch (e) {
      debugPrint('Error querying products: $e');
      return [];
    }
  }

  /// Buy a non-consumable (Subscription)
  Future<void> buyNonConsumable(ProductDetails product) async {
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
    await _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }

  /// Buy a consumable (Candle, Mass, Donation)
  Future<void> buyConsumable(ProductDetails product) async {
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
    await _iap.buyConsumable(purchaseParam: purchaseParam, autoConsume: true);
  }

  /// Restore purchases
  Future<void> restorePurchases() async {
    await _iap.restorePurchases();
  }

  /// Internal listener for purchase updates
  void _listenToPurchaseUpdated(List<PurchaseDetails> purchaseDetailsList) {
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // Show pending UI
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          // Handle error
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          // Deliver product
        }
        if (purchaseDetails.pendingCompletePurchase) {
          _iap.completePurchase(purchaseDetails);
        }
      }
    }
  }
}

/// Provider for BillingService
final billingServiceProvider = Provider<BillingService>((ref) {
  final service = BillingService(ref);
  ref.onDispose(() => service.dispose());
  return service;
});

/// Provider for available store products
final storeProductsProvider = FutureProvider<List<ProductDetails>>((ref) async {
  final billing = ref.watch(billingServiceProvider);
  return billing.getProducts();
});
