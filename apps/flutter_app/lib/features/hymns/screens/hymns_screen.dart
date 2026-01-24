import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../models/hymn_model.dart';
import '../providers/hymns_provider.dart';
import '../widgets/hymn_card.dart';

// Legacy Hymn model removed to use hymn_model.dart

// Old _hymns list removed

class HymnsScreen extends ConsumerWidget {
  const HymnsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(hymnsProvider);
    final notifier = ref.read(hymnsProvider.notifier);

    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context),
          _buildSearchAndFilters(context, ref, state, notifier),
          _buildHymnList(context, state),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      floating: true,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      title: Text(
        'Hymn Library',
        style: GoogleFonts.merriweather(
          fontWeight: FontWeight.bold,
          fontSize: 22,
          color: Colors.white,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(LucideIcons.listMusic, color: AppTheme.gold500),
          onPressed: () {},
        ),
      ],
    );
  }

  Widget _buildSearchAndFilters(
    BuildContext context,
    WidgetRef ref,
    HymnsState state,
    HymnsNotifier notifier,
  ) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          children: [
            // Search Bar
            TextField(
              onChanged: notifier.setSearchQuery,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search 100+ hymns...',
                hintStyle: const TextStyle(color: Colors.white38),
                prefixIcon: const Icon(
                  LucideIcons.search,
                  color: AppTheme.gold500,
                ),
                filled: true,
                fillColor: Colors.white.withValues(alpha: 0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Category Filter
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _CategoryChip(
                    label: 'All',
                    isSelected: state.selectedCategory == null,
                    onTap: () => notifier.setCategory(null),
                  ),
                  ...HymnCategory.values.map(
                    (cat) => _CategoryChip(
                      label: _capitalize(cat.name),
                      isSelected: state.selectedCategory == cat,
                      onTap: () => notifier.setCategory(cat),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildHymnList(BuildContext context, HymnsState state) {
    if (state.filteredHymns.isEmpty) {
      return const SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(LucideIcons.music2, size: 48, color: Colors.white10),
              SizedBox(height: 16),
              Text('No hymns found', style: TextStyle(color: Colors.white38)),
            ],
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate((context, index) {
          final hymn = state.filteredHymns[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: HymnCard(
              hymn: hymn,
              onTap: () => context.push('/hymn-detail', extra: hymn),
            ),
          );
        }, childCount: state.filteredHymns.length),
      ),
    );
  }

  String _capitalize(String s) => s[0].toUpperCase() + s.substring(1);
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? AppTheme.gold500
                : Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected
                  ? Colors.transparent
                  : Colors.white.withValues(alpha: 0.1),
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? Colors.black : Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
