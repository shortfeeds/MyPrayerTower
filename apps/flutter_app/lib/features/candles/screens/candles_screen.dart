import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/billing/product_ids.dart';
import '../../../core/services/config_service.dart';
import '../../../core/providers/scaffold_key_provider.dart';

class CandlesScreen extends ConsumerStatefulWidget {
  const CandlesScreen({super.key});

  @override
  ConsumerState<CandlesScreen> createState() => _CandlesScreenState();
}

class _CandlesScreenState extends ConsumerState<CandlesScreen> {
  @override
  Widget build(BuildContext context) {
    // 1. Get products (async)
    final productsAsync = ref.watch(storeProductsProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            backgroundColor: AppTheme.sacredNavy950,
            floating: true,
            title: const Text('Light a Candle'),
            leading: IconButton(
              icon: const Icon(LucideIcons.menu),
              onPressed: () =>
                  ref.read(scaffoldKeyProvider).currentState?.openDrawer(),
            ),
            actions: [
              IconButton(
                // Restore purchases
                icon: const Icon(LucideIcons.refreshCcw),
                onPressed: () =>
                    ref.read(billingServiceProvider).restorePurchases(),
                tooltip: 'Restore Purchases',
              ),
            ],
          ),

          // Intro
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Light a virtual candle to offer your intentions. Your contribution supports the maintenance of this app.',
                style: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
              ),
            ),
          ),

          // Candle Grid
          productsAsync.when(
            data: (products) {
              // Filter for candle products
              final candleProducts = products
                  .where((p) => ProductIds.candles.contains(p.id))
                  .toList();
              // Sort by price (mock logic, relying on ID or price string)

              if (candleProducts.isEmpty) {
                // Return mock UI if store not ready (or on web/emulator without connection)
                return _buildMockCandleGrid(context);
              }

              return SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final product = candleProducts[index];
                    return _CandleProductCard(
                      id: product.id,
                      title: product.title, // '1 Day Candle'
                      price: product.price, // '$1.99'
                      description: product.description,
                      onTap: () {
                        ref.read(billingServiceProvider).buyConsumable(product);
                      },
                    );
                  }, childCount: candleProducts.length),
                ),
              );
            },
            loading: () => const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, stack) => SliverToBoxAdapter(
              child: Text(
                'Store unavailable: $err',
                style: const TextStyle(color: Colors.red),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 50)),
        ],
      ),
    );
  }

  // Fallback if no store connection (e.g. emulator)
  Widget _buildMockCandleGrid(BuildContext context) {
    // Manually defined candles based on ProductIds
    final mocks = [
      {'id': 'candle_3day', 'title': '3 Day Candle', 'price': '\$2.99'},
      {'id': 'candle_7day', 'title': '7 Day Candle', 'price': '\$4.99'},
      {'id': 'candle_30day', 'title': '30 Day Candle', 'price': '\$14.99'},
    ];

    return SliverPadding(
      padding: const EdgeInsets.all(16),
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        delegate: SliverChildBuilderDelegate((context, index) {
          final m = mocks[index];
          return _CandleProductCard(
            id: m['id']!,
            title: m['title']!,
            price: m['price']!,
            description: 'Burns for ${m['title']}',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Store not connected in mockup')),
              );
            },
          );
        }, childCount: mocks.length),
      ),
    );
  }
}

class _CandleProductCard extends StatelessWidget {
  final String id;
  final String title;
  final String price;
  final String description;
  final VoidCallback onTap;

  const _CandleProductCard({
    required this.id,
    required this.title,
    required this.price,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy800,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.accentGold.withValues(alpha: 0.3)),
          boxShadow: [
            BoxShadow(
              color: AppTheme.accentGold.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.flame, size: 48, color: AppTheme.accentGold),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              price,
              style: const TextStyle(
                color: AppTheme.accentGold,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                description,
                style: const TextStyle(color: Colors.white54, fontSize: 12),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Light',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
