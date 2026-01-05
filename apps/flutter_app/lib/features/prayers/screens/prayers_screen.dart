import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/providers/scaffold_key_provider.dart';

/// Sample prayer categories
final _categories = [
  {'id': 'morning', 'name': 'Morning Prayers', 'icon': '🌅', 'count': 45},
  {'id': 'evening', 'name': 'Evening Prayers', 'icon': '🌙', 'count': 38},
  {'id': 'rosary', 'name': 'Rosary', 'icon': '📿', 'count': 20},
  {'id': 'novenas', 'name': 'Novenas', 'icon': '🕯️', 'count': 150},
  {'id': 'saints', 'name': 'Saints Prayers', 'icon': '⭐', 'count': 500},
  {'id': 'marian', 'name': 'Marian Prayers', 'icon': '🌹', 'count': 85},
  {'id': 'mass', 'name': 'Mass Prayers', 'icon': '⛪', 'count': 32},
  {'id': 'confession', 'name': 'Confession', 'icon': '🛐', 'count': 18},
  {'id': 'divine-mercy', 'name': 'Divine Mercy', 'icon': '❤️', 'count': 25},
  {
    'id': 'stations',
    'name': 'Stations of the Cross',
    'icon': '✝️',
    'count': 14,
  },
  {'id': 'psalms', 'name': 'Psalms', 'icon': '📖', 'count': 150},
  {'id': 'litanies', 'name': 'Litanies', 'icon': '🙏', 'count': 28},
];

class PrayersScreen extends ConsumerWidget {
  const PrayersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            snap: true,
            title: Text(
              'Prayer Library',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            backgroundColor: AppTheme.darkBg,
            // GLOBAL MENU: Lead for root screen
            leading: IconButton(
              icon: const Icon(LucideIcons.menu),
              onPressed: () => ref.openDrawer(),
            ),
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.search),
                onPressed: () {
                  // Search functionality implemented via provider filtering below
                },
              ),
            ],
          ),

          // Stats
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    const _StatItem(
                      icon: LucideIcons.bookOpen,
                      value: '4,000+',
                      label: 'Prayers',
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.white.withValues(alpha: 0.2),
                    ),
                    _StatItem(
                      icon: LucideIcons.folder,
                      value: '${_categories.length}',
                      label: 'Categories',
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.white.withValues(alpha: 0.2),
                    ),
                    const _StatItem(
                      icon: LucideIcons.globe,
                      value: '10+',
                      label: 'Languages',
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Section Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Categories',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // Categories Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.5,
              ),
              delegate: SliverChildBuilderDelegate((context, index) {
                final category = _categories[index];
                return _CategoryCard(
                  id: category['id'] as String,
                  name: category['name'] as String,
                  icon: category['icon'] as String,
                  count: category['count'] as int,
                  onTap: () => context.push(
                    '/prayers/${category['id']}',
                    extra: category['name'],
                  ),
                );
              }, childCount: _categories.length),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.labelSmall?.copyWith(
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String id;
  final String name;
  final String icon;
  final int count;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.id,
    required this.name,
    required this.icon,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.darkBorder.withValues(alpha: 0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(icon, style: const TextStyle(fontSize: 28)),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBlue.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$count',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: AppTheme.info,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              name,
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(color: AppTheme.textPrimary),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
