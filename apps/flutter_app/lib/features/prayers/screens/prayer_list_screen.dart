import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../ads/widgets/smart_ad_banner.dart';
import '../providers/prayers_provider.dart';

class PrayerListScreen extends ConsumerWidget {
  final String categoryId;
  final String categoryName;

  const PrayerListScreen({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prayersAsync = ref.watch(prayersProvider(categoryId));

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        title: Text(
          categoryName,
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.darkBg,
        centerTitle: true,
      ),
      body: prayersAsync.when(
        data: (prayers) {
          if (prayers.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    LucideIcons.bookOpen,
                    size: 48,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No prayers found',
                    style: GoogleFonts.inter(color: Colors.grey),
                  ),
                ],
              ),
            );
          }
          return Column(
            children: [
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: prayers.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final prayer = prayers[index];
                    return _PrayerCard(
                      title: prayer.title,
                      preview: prayer.content,
                      category: categoryName,
                      onTap: () => context.push('/prayer/${prayer.id}'),
                    );
                  },
                ),
              ),
              const SmartAdBanner(page: 'prayer_list', position: 'bottom'),
              const SizedBox(height: 120), // Footer spacing
            ],
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.gold500),
        ),
        error: (e, s) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _PrayerCard extends StatelessWidget {
  final String title;
  final String preview;
  final String category;
  final VoidCallback onTap;

  const _PrayerCard({
    required this.title,
    required this.preview,
    required this.category,
    required this.onTap,
  });

  IconData _getIcon() {
    if (category.contains('Morning')) return LucideIcons.sun;
    if (category.contains('Evening')) return LucideIcons.moon;
    if (category.contains('Mary') || category.contains('Marian')) {
      return LucideIcons.star;
    }
    if (category.contains('Heal')) return LucideIcons.heart;
    if (category.contains('Family')) return LucideIcons.users;
    if (category.contains('Saint')) return LucideIcons.user;
    return LucideIcons.bookOpen;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_getIcon(), color: AppTheme.gold500, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        preview,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.textMuted,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  LucideIcons.chevronRight,
                  color: Colors.white24,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
