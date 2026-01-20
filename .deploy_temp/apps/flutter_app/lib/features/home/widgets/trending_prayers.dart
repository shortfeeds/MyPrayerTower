import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../prayers/providers/prayers_provider.dart';
import '../../prayers/models/prayer_model.dart';

/// Trending prayers widget showing popular prayers from the DB (randomized)
class TrendingPrayersWidget extends ConsumerWidget {
  const TrendingPrayersWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trendingAsync = ref.watch(trendingPrayersProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.pink.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      LucideIcons.trendingUp,
                      size: 16,
                      color: Colors.pink,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Trending Prayers',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () => context.push('/prayers'),
                child: Text(
                  'See All',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.gold500,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Trending prayers list
        SizedBox(
          height: 140,
          child: trendingAsync.when(
            data: (prayers) {
              if (prayers.isEmpty) {
                return _buildEmptyState(context);
              }
              // Take top 5 from the shuffled list
              final displayPrayers = prayers.take(5).toList();

              return ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 4),
                itemCount: displayPrayers.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final prayer = displayPrayers[index];
                  return _TrendingPrayerCard(
                    prayer: prayer,
                    // Simulate random count for "trending" feel
                    prayerCount: '${(Random().nextInt(5000) + 500)}',
                    color: _getColorForCategory(prayer.category),
                    icon: _getIconForCategory(prayer.category),
                    onTap: () =>
                        context.push('/prayer/${prayer.id}', extra: prayer),
                  );
                },
              );
            },
            loading: () => const Center(
              child: CircularProgressIndicator(color: AppTheme.gold500),
            ),
            error: (_, __) => const SizedBox.shrink(),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Text(
        'No trending prayers',
        style: GoogleFonts.inter(color: Colors.white54, fontSize: 12),
      ),
    );
  }

  Color _getColorForCategory(String category) {
    final colors = [
      const Color(0xFFF59E0B), // Amber
      const Color(0xFF3B82F6), // Blue
      AppTheme.gold500, // Gold
      const Color(0xFFEF4444), // Red
      const Color(0xFF8B5CF6), // Purple
      const Color(0xFF10B981), // Green
    ];
    return colors[category.length % colors.length];
  }

  IconData _getIconForCategory(String category) {
    // Simple heuristic for icons
    final cat = category.toLowerCase();
    if (cat.contains('marian') || cat.contains('mary')) return LucideIcons.star;
    if (cat.contains('healing')) return LucideIcons.heart;
    if (cat.contains('protect')) return LucideIcons.shield;
    if (cat.contains('family')) return LucideIcons.users;
    if (cat.contains('morning')) return LucideIcons.sun;
    if (cat.contains('evening') || cat.contains('night')) {
      return LucideIcons.moon;
    }
    return LucideIcons.sparkles; // Default
  }
}

class _TrendingPrayerCard extends StatelessWidget {
  final Prayer prayer;
  final String prayerCount;
  final Color color;
  final IconData icon;
  final VoidCallback onTap;

  const _TrendingPrayerCard({
    required this.prayer,
    required this.prayerCount,
    required this.color,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy900,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.2), width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, size: 18, color: color),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        LucideIcons.heart,
                        size: 10,
                        color: Colors.pink.withValues(alpha: 0.8),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _formatCount(prayerCount),
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Spacer(),
            Text(
              prayer.title,
              style: GoogleFonts.merriweather(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              prayer.category,
              style: GoogleFonts.inter(fontSize: 11, color: Colors.white54),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  String _formatCount(String countStr) {
    try {
      final count = int.parse(countStr);
      if (count >= 1000) {
        return '${(count / 1000).toStringAsFixed(1)}K';
      }
      return count.toString();
    } catch (e) {
      return countStr;
    }
  }
}
