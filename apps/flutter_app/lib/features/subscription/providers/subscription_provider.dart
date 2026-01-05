import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/constants/app_constants.dart';
import '../repositories/subscription_repository.dart';

class SubscriptionState {
  final List<ProductDetails> products;
  final bool isLoading;
  final String? errorMessage;
  final bool isPurchasing;

  const SubscriptionState({
    this.products = const [],
    this.isLoading = false,
    this.errorMessage,
    this.isPurchasing = false,
  });

  SubscriptionState copyWith({
    List<ProductDetails>? products,
    bool? isLoading,
    String? errorMessage,
    bool? isPurchasing,
  }) {
    return SubscriptionState(
      products: products ?? this.products,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      isPurchasing: isPurchasing ?? this.isPurchasing,
    );
  }
}

final subscriptionProvider =
    StateNotifierProvider<SubscriptionNotifier, SubscriptionState>((ref) {
      return SubscriptionNotifier(
        ref.watch(billingServiceProvider),
        ref.watch(subscriptionRepositoryProvider),
      );
    });

class SubscriptionNotifier extends StateNotifier<SubscriptionState> {
  final BillingService _billingService;
  final SubscriptionRepository _repository;
  StreamSubscription<List<PurchaseDetails>>? _purchaseSubscription;

  SubscriptionNotifier(this._billingService, this._repository)
    : super(const SubscriptionState()) {
    _init();
  }

  Future<void> _init() async {
    state = state.copyWith(isLoading: true);
    final available = await _billingService.isAvailable();
    if (!available) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Store not available',
      );
      return;
    }

    _purchaseSubscription = _billingService.purchaseStream.listen(
      _onPurchaseUpdate,
      onDone: () {
        _purchaseSubscription?.cancel();
      },
      onError: (error) {
        state = state.copyWith(errorMessage: 'Purchase stream error: $error');
      },
    );

    final productIds = {
      ...BillingProducts.subscriptionIds,
      ...BillingProducts.nonConsumableIds,
      ...BillingProducts.consumableIds,
    };

    final products = await _billingService.getProducts(productIds);
    state = state.copyWith(products: products, isLoading: false);
  }

  Future<void> buyProduct(ProductDetails product) async {
    state = state.copyWith(isPurchasing: true, errorMessage: null);
    try {
      final isConsumable = BillingProducts.consumableIds.contains(product.id);

      if (isConsumable) {
        await _billingService.buyConsumable(product);
      } else {
        await _billingService.buyNonConsumable(product);
      }
    } catch (e) {
      state = state.copyWith(
        isPurchasing: false,
        errorMessage: 'Failed to start purchase: $e',
      );
    }
  }

  Future<void> restorePurchases() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _billingService.restorePurchases();
      // Restoration completion is handled by the stream listener
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to restore purchases: $e',
      );
    }
  }

  void _onPurchaseUpdate(List<PurchaseDetails> purchaseDetailsList) {
    for (var purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // Pending logic
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          state = state.copyWith(
            isPurchasing: false,
            errorMessage: purchaseDetails.error?.message,
          );
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          _verifyAndComplete(purchaseDetails);
        }

        if (purchaseDetails.pendingCompletePurchase) {
          _billingService.completePurchase(purchaseDetails);
        }
      }
    }
  }

  Future<void> _verifyAndComplete(PurchaseDetails purchase) async {
    try {
      await _repository.verifyPurchase(
        purchaseId: purchase.purchaseID ?? '',
        verificationData: purchase.verificationData.serverVerificationData,
        source: purchase.verificationData.source,
        productId: purchase.productID,
      );
      state = state.copyWith(isPurchasing: false);
      // Note: User claims/status should be refreshed here or listened to via realtime stream
    } catch (e) {
      state = state.copyWith(
        isPurchasing: false,
        errorMessage: 'Verification failed: $e',
      );
    }
  }

  @override
  void dispose() {
    _purchaseSubscription?.cancel();
    super.dispose();
  }
}
