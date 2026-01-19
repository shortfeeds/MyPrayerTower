import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/sacred_shimmer.dart';
import '../providers/prayers_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';

/// Prayer Library Screen - Sacred Digital Space Theme
class PrayersScreen extends ConsumerWidget {
  const PrayersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(prayerCategoriesFromDbProvider);

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          // Hero Header
          SliverToBoxAdapter(child: _buildHeroHeader(context, ref)),

          // Quick Access Paths
          SliverToBoxAdapter(child: _buildQuickPaths(context)),

          // Section Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.library,
                    size: 18,
                    color: AppTheme.gold500,
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      'All Categories',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Categories Grid
          categoriesAsync.when(
            data: (categories) => SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 200,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.0,
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
            loading: () => SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 200,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.0,
                ),
                delegate: SliverChildBuilderDelegate((context, index) {
                  return const SacredShimmer.rectangular(height: 160);
                }, childCount: 8),
              ),
            ),
            error: (err, _) => SliverToBoxAdapter(
              child: _buildErrorState(ref, err.toString()),
            ),
          ),

          // Bottom Padding for Floating Nav
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }

  Widget _buildHeroHeader(BuildContext context, WidgetRef ref) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppTheme.royalPurple900, AppTheme.sacredNavy900],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Row
              Row(
                children: [
                  const AppBarMenuButton(iconColor: Colors.white70),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(LucideIcons.search, color: Colors.white70),
                    onPressed: () => _showSearchDialog(context, ref),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppTheme.gold500.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      LucideIcons.bookOpen,
                      size: 14,
                      color: AppTheme.gold400,
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        'Catholic Treasury',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppTheme.gold400,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                'Library of',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [AppTheme.gold400, AppTheme.gold600],
                ).createShader(bounds),
                child: Text(
                  'Sacred Prayers',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              Text(
                'Explore our comprehensive collection of traditional Catholic prayers, litanies, and novenas.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.white.withValues(alpha: 0.7),
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 20),

              // Search Bar
              GestureDetector(
                onTap: () => _showSearchDialog(context, ref),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        LucideIcons.search,
                        size: 20,
                        color: Colors.white.withValues(alpha: 0.5),
                      ),
                      const SizedBox(width: 12),
                      Flexible(
                        child: Text(
                          'Search prayers, novenas, litanies...',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: Colors.white.withValues(alpha: 0.5),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickPaths(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PRAYER PATHS',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppTheme.textMuted,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _PathChip(
                  icon: LucideIcons.sun,
                  label: 'Morning',
                  onTap: () => context.push('/prayers/morning'),
                ),
                const SizedBox(width: 8),
                _PathChip(
                  icon: LucideIcons.moon,
                  label: 'Evening',
                  onTap: () => context.push('/prayers/evening'),
                ),
                const SizedBox(width: 8),
                _PathChip(
                  icon: LucideIcons.heart,
                  label: 'Healing',
                  onTap: () => context.push('/prayers/healing'),
                ),
                const SizedBox(width: 8),
                _PathChip(
                  icon: LucideIcons.star,
                  label: 'Marian',
                  onTap: () => context.push('/prayers/marian'),
                ),
                const SizedBox(width: 8),
                _PathChip(
                  icon: LucideIcons.users,
                  label: 'Family',
                  onTap: () => context.push('/prayers/family'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(WidgetRef ref, String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              LucideIcons.alertCircle,
              color: AppTheme.error,
              size: 48,
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load prayers',
              style: GoogleFonts.playfairDisplay(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => ref.invalidate(prayerCategoriesFromDbProvider),
              icon: const Icon(LucideIcons.refreshCcw, size: 16),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                foregroundColor: AppTheme.sacredNavy900,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showSearchDialog(BuildContext context, WidgetRef ref) {
    showDialog(context: context, builder: (context) => const _SearchDialog());
  }
}

// Path Chip Widget
class _PathChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _PathChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy900,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: AppTheme.gold500),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ... (existing imports will be handled by context if I target correctly, but I need to add the import at top)

// ...

// Category Card Widget
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
    return PremiumGlassCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: Stack(
        children: [
          // 1. Watermark Icon (Background)
          Positioned(
            right: -10,
            bottom: -15,
            child: Transform.rotate(
              angle: -0.2,
              child: Text(
                icon,
                style: TextStyle(
                  fontSize: 80,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
            ),
          ),

          // 2. Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Icon & Count Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.gold500.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppTheme.gold500.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(icon, style: const TextStyle(fontSize: 24)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black26,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '$count',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),

                // Title
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    name,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),

          // 3. Subtle Active Indicator line at bottom
          Positioned(
            bottom: 0,
            left: 20,
            right: 20,
            child: Container(
              height: 2,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    AppTheme.gold500.withValues(alpha: 0.5),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Search Dialog
class _SearchDialog extends ConsumerStatefulWidget {
  const _SearchDialog();

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
        : const AsyncValue<List<dynamic>>.data([]);

    return Dialog(
      backgroundColor: AppTheme.sacredNavy900,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(maxHeight: 500, maxWidth: 400),
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    autofocus: true,
                    style: GoogleFonts.inter(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Search prayers...',
                      hintStyle: GoogleFonts.inter(color: AppTheme.textMuted),
                      prefixIcon: const Icon(
                        LucideIcons.search,
                        color: AppTheme.gold500,
                      ),
                      filled: true,
                      fillColor: AppTheme.deepSpace,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (value) => setState(() => _query = value),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(LucideIcons.x, color: AppTheme.textMuted),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Flexible(
              child: searchResults.when(
                data: (prayers) {
                  if (_query.length < 2) {
                    return Center(
                      child: Text(
                        'Type at least 2 characters to search',
                        style: GoogleFonts.inter(color: AppTheme.textMuted),
                      ),
                    );
                  }
                  if (prayers.isEmpty) {
                    return Center(
                      child: Text(
                        'No prayers found',
                        style: GoogleFonts.inter(color: AppTheme.textMuted),
                      ),
                    );
                  }
                  return ListView.builder(
                    shrinkWrap: true,
                    itemCount: prayers.length,
                    itemBuilder: (context, index) {
                      final prayer = prayers[index];
                      return ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            LucideIcons.bookOpen,
                            size: 18,
                            color: AppTheme.gold500,
                          ),
                        ),
                        title: Text(
                          prayer.title,
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.w500,
                            color: Colors.white,
                          ),
                        ),
                        subtitle: Text(
                          prayer.categoryLabel,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppTheme.textMuted,
                          ),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          context.push('/prayer/${prayer.id}');
                        },
                      );
                    },
                  );
                },
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppTheme.gold500),
                ),
                error: (_, __) => Center(
                  child: Text(
                    'Search failed',
                    style: GoogleFonts.inter(color: AppTheme.error),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
