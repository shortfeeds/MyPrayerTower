import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

final billingServiceProvider = Provider<BillingService>((ref) {
  return BillingService();
});

final storeProductsProvider = FutureProvider<List<ProductDetails>>((ref) async {
  final billingService = ref.watch(billingServiceProvider);
  // Wait for initialization
  await Future.delayed(const Duration(seconds: 1));
  // Note: product_ids.dart needs to be imported if we want to use ProductIds.allProducts here directly,
  // but to avoid circular imports or just for simplicity, we can rely on the service knowing the IDs
  // or pass them. However, since we removed the import to fix a lint, we should probably add it back
  // or define the list here.
  // Ideally, BillingService should expose 'allProductIds'.
  // For now, let's hardcode or re-import if needed.
  // Actually, let's re-import product_ids.dart but use 'show' to be specific
  return billingService.getProducts(_activeProductIds);
});

// Temporary list to avoid import cycle if any, or just for immediate fix
const Set<String> _activeProductIds = {
  'mass_single',
  'mass_novena',
  'mass_perpetual',
  'mass_gregorian',
  'candle_30d',
  'candle_7d',
  'candle_3d',
};

class BillingService {
  final InAppPurchase _iap = InAppPurchase.instance;
  late StreamSubscription<List<PurchaseDetails>> _subscription;

  BillingService() {
    _init();
  }

  void _init() {
    final purchaseUpdated = _iap.purchaseStream;
    _subscription = purchaseUpdated.listen(
      _onPurchaseUpdate,
      onDone: () {
        _subscription.cancel();
      },
      onError: (error) {
        // Handle error
        debugPrint('Billing Error: $error');
      },
    );
  }

  Stream<List<PurchaseDetails>> get purchaseStream => _iap.purchaseStream;

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
    debugPrint('Mock verification: ${purchaseDetails.productID}');
    return true;
  }

  Future<bool> isAvailable() async {
    return _iap.isAvailable();
  }

  Future<List<ProductDetails>> getProducts(Set<String> productIds) async {
    final bool available = await _iap.isAvailable();
    if (!available) {
      return [];
    }
    final ProductDetailsResponse response = await _iap.queryProductDetails(
      productIds,
    );
    return response.productDetails;
  }

  Future<void> buyNonConsumable(ProductDetails product) async {
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
    await _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }

  Future<void> restorePurchases() async {
    await _iap.restorePurchases();
  }

  Future<void> completePurchase(PurchaseDetails purchase) async {
    await _iap.completePurchase(purchase);
  }

  // Mock mode for testing without store connection
  bool isMockMode = false;

  Future<void> buyConsumable(dynamic productOrId) async {
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

    if (isMockMode) {
      debugPrint('Billing: Mock purchase started for $productId');
      await Future.delayed(const Duration(seconds: 1));

      final mockPurchase = PurchaseDetails(
        purchaseID: 'mock_id_${DateTime.now().millisecondsSinceEpoch}',
        productID: productId,
        verificationData: PurchaseVerificationData(
          localVerificationData: 'mock_data',
          serverVerificationData: 'mock_data',
          source: 'mock',
        ),
        transactionDate: DateTime.now().toString(),
        status: PurchaseStatus.purchased,
      );

      _onPurchaseUpdate([mockPurchase]);
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
        // For development smooth sailing, fallback to mock if product not found
        if (kDebugMode) {
          debugPrint('Billing: Falling back to mock purchase for debug');
          isMockMode = true;
          await buyConsumable(productId);
          isMockMode = false; // Reset
        }
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
