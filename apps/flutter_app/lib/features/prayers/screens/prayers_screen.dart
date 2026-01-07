import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/prayers_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';

class PrayersScreen extends ConsumerWidget {
  const PrayersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Use the new database categories provider
    final categoriesAsync = ref.watch(prayerCategoriesFromDbProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            snap: true,
            backgroundColor: AppTheme.sacredNavy950,
            title: Text(
              'Prayer Library',
              style: GoogleFonts.merriweather(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            leading: const AppBarMenuButton(
              iconColor: Colors.white,
              showBackground: false,
            ),
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.search, color: Colors.white),
                onPressed: () => _showSearchDialog(context, ref),
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
                  gradient: AppTheme.goldGradient,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: categoriesAsync.when(
                  data: (categories) => Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatItem(
                        icon: LucideIcons.bookOpen,
                        value:
                            '${categories.fold<int>(0, (sum, c) => sum + c.count)}+',
                        label: 'Prayers',
                      ),
                      Container(
                        width: 1,
                        height: 40,
                        color: Colors.black.withValues(alpha: 0.2),
                      ),
                      _StatItem(
                        icon: LucideIcons.folder,
                        value: '${categories.length}',
                        label: 'Categories',
                      ),
                      Container(
                        width: 1,
                        height: 40,
                        color: Colors.black.withValues(alpha: 0.2),
                      ),
                      const _StatItem(
                        icon: LucideIcons.globe,
                        value: '10+',
                        label: 'Languages',
                      ),
                    ],
                  ),
                  loading: () => const Center(
                    child: CircularProgressIndicator(color: Colors.black),
                  ),
                  error: (_, __) => const Text('Failed to load stats'),
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
                style: GoogleFonts.merriweather(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // Categories Grid
          categoriesAsync.when(
            data: (categories) => SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.5,
                ),
                delegate: SliverChildBuilderDelegate((context, index) {
                  final category = categories[index];
                  return _CategoryCard(
                    id: category.id,
                    name: category.name,
                    icon: category.icon,
                    count: category.count,
                    onTap: () => context.push(
                      '/prayers/${category.id}',
                      extra: category.name,
                    ),
                  );
                }, childCount: categories.length),
              ),
            ),
            loading: () => const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, _) => SliverToBoxAdapter(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      LucideIcons.alertCircle,
                      color: Colors.red,
                      size: 48,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load categories',
                      style: GoogleFonts.inter(color: Colors.white),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '$err',
                      style: GoogleFonts.inter(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  void _showSearchDialog(BuildContext context, WidgetRef ref) {
    showDialog(context: context, builder: (context) => _SearchDialog());
  }
}

class _SearchDialog extends ConsumerStatefulWidget {
  @override
  ConsumerState<_SearchDialog> createState() => _SearchDialogState();
}

class _SearchDialogState extends ConsumerState<_SearchDialog> {
  final _controller = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchResults = _query.length >= 2
        ? ref.watch(prayerSearchProvider(_query))
        : null;

    return AlertDialog(
      backgroundColor: AppTheme.sacredNavy900,
      title: TextField(
        controller: _controller,
        autofocus: true,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Search prayers...',
          hintStyle: TextStyle(color: Colors.grey[500]),
          prefixIcon: const Icon(LucideIcons.search, color: AppTheme.gold500),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: AppTheme.sacredNavy800,
        ),
        onChanged: (value) {
          setState(() => _query = value);
        },
      ),
      content: SizedBox(
        width: double.maxFinite,
        height: 400,
        child: searchResults == null
            ? Center(
                child: Text(
                  'Type at least 2 characters to search',
                  style: GoogleFonts.inter(color: Colors.grey),
                ),
              )
            : searchResults.when(
                data: (prayers) {
                  if (prayers.isEmpty) {
                    return Center(
                      child: Text(
                        'No prayers found',
                        style: GoogleFonts.inter(color: Colors.grey),
                      ),
                    );
                  }
                  return ListView.builder(
                    itemCount: prayers.length,
                    itemBuilder: (context, index) {
                      final prayer = prayers[index];
                      return ListTile(
                        title: Text(
                          prayer.title,
                          style: const TextStyle(color: Colors.white),
                        ),
                        subtitle: Text(
                          prayer.categoryLabel,
                          style: TextStyle(color: Colors.grey[400]),
                        ),
                        trailing: const Icon(
                          LucideIcons.chevronRight,
                          color: AppTheme.gold500,
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          context.push('/prayer/${prayer.id}');
                        },
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text('Error: $e')),
              ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Close'),
        ),
      ],
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
        Icon(icon, color: Colors.black, size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.inter(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.inter(
            color: Colors.black.withValues(alpha: 0.7),
            fontSize: 12,
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
          color: AppTheme.sacredNavy800,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
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
                    color: AppTheme.gold500.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$count',
                    style: GoogleFonts.inter(
                      color: AppTheme.gold500,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              name,
              style: GoogleFonts.inter(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
