import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/services/config_service.dart';
import '../../../core/billing/product_ids.dart';

final subscriptionPlansProvider = FutureProvider<List<SubscriptionPlan>>((ref) {
  return ref.watch(configServiceProvider).getSubscriptionPlans();
});

class SubscriptionScreen extends ConsumerWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(storeProductsProvider);
    // Use FutureProvider to fetch plans async
    // 2. Get subscriptions (async)
    ref.watch(subscriptionPlansProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: const Text('Premium Access'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(
                    LucideIcons.crown,
                    size: 64,
                    color: AppTheme.accentGold,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Unlock Full Access',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Get unlimited access to all prayers, saints, and exclusive content.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white.withValues(alpha: 0.7),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),

          productsAsync.when(
            data: (products) {
              // Filter subscription products
              final subs = products
                  .where((p) => ProductIds.subscriptions.contains(p.id))
                  .toList();

              if (subs.isEmpty) {
                return const SliverToBoxAdapter(
                  child: Center(
                    child: Text(
                      'No subscriptions available',
                      style: TextStyle(color: Colors.white54),
                    ),
                  ),
                );
              }

              return SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final product = subs[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 8,
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.sacredNavy800,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppTheme.accentGold.withValues(alpha: 0.5),
                        ),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        title: Text(
                          product.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontSize: 18,
                          ),
                        ),
                        subtitle: Text(
                          product.description,
                          style: const TextStyle(color: Colors.white60),
                        ),
                        trailing: ElevatedButton(
                          onPressed: () {
                            ref
                                .read(billingServiceProvider)
                                .buyNonConsumable(product);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.accentGold,
                            foregroundColor: Colors.black,
                          ),
                          child: Text(product.price), // e.g. $4.99
                        ),
                      ),
                    ),
                  );
                }, childCount: subs.length),
              );
            },
            loading: () => const SliverToBoxAdapter(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, stack) => SliverToBoxAdapter(
              child: Center(
                child: Text(
                  'Store Error: $err',
                  style: const TextStyle(color: Colors.red),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: TextButton(
                onPressed: () =>
                    ref.read(billingServiceProvider).restorePurchases(),
                child: const Text(
                  'Restore Purchases',
                  style: TextStyle(color: Colors.white54),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
