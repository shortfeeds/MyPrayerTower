import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
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
                  Text(
                    'Unlock Full Access',
                    style: GoogleFonts.merriweather(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Get unlimited access to all prayers, saints, and exclusive content.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.white.withValues(alpha: 0.7),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),

          // Show mock UI on Web, real billing on mobile
          if (kIsWeb)
            _buildMockSubscriptionList(context)
          else
            _buildRealSubscriptionList(ref),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: TextButton(
                onPressed: kIsWeb
                    ? null
                    : () => ref.read(billingServiceProvider).restorePurchases(),
                child: const Text(
                  'Restore Purchases',
                  style: TextStyle(
                    color: kIsWeb ? Colors.white24 : Colors.white54,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMockSubscriptionList(BuildContext context) {
    final mockPlans = [
      {
        'name': 'Monthly Premium',
        'price': '\$4.99/month',
        'desc': 'Full access, billed monthly',
      },
      {
        'name': 'Annual Premium',
        'price': '\$29.99/year',
        'desc': 'Save 50%, billed annually',
      },
    ];

    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        final plan = mockPlans[index];
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Container(
            decoration: BoxDecoration(
              color: AppTheme.sacredNavy800,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: index == 1
                    ? AppTheme.accentGold
                    : AppTheme.accentGold.withValues(alpha: 0.3),
                width: index == 1 ? 2 : 1,
              ),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              title: Row(
                children: [
                  Text(
                    plan['name']!,
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                  if (index == 1) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.accentGold,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'BEST VALUE',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  plan['desc']!,
                  style: const TextStyle(color: Colors.white60),
                ),
              ),
              trailing: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Billing available on mobile app only'),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accentGold,
                  foregroundColor: Colors.black,
                ),
                child: Text(plan['price']!),
              ),
            ),
          ),
        );
      }, childCount: mockPlans.length),
    );
  }

  Widget _buildRealSubscriptionList(WidgetRef ref) {
    final productsAsync = ref.watch(storeProductsProvider);

    return productsAsync.when(
      data: (products) {
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
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
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
                    child: Text(product.price),
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
    );
  }
}
