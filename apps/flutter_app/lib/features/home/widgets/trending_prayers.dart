import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Trending prayers widget showing popular prayers from the community
class TrendingPrayersWidget extends StatelessWidget {
  const TrendingPrayersWidget({super.key});

  // Sample trending prayers - in production, fetch from API
  static final List<_TrendingPrayer> _prayers = [
    const _TrendingPrayer(
      title: 'Morning Offering',
      category: 'Daily',
      prayerCount: 2847,
      icon: LucideIcons.sun,
      color: Color(0xFFF59E0B),
    ),
    const _TrendingPrayer(
      title: 'Hail Mary',
      category: 'Marian',
      prayerCount: 5234,
      icon: LucideIcons.star,
      color: Color(0xFF3B82F6),
    ),
    const _TrendingPrayer(
      title: 'Our Father',
      category: 'Essential',
      prayerCount: 8127,
      icon: LucideIcons.crown,
      color: AppTheme.gold500,
    ),
    const _TrendingPrayer(
      title: 'Act of Contrition',
      category: 'Confession',
      prayerCount: 1456,
      icon: LucideIcons.heart,
      color: Color(0xFFEF4444),
    ),
    const _TrendingPrayer(
      title: 'St. Michael Prayer',
      category: 'Protection',
      prayerCount: 3892,
      icon: LucideIcons.shield,
      color: Color(0xFF8B5CF6),
    ),
  ];

  String _formatCount(int count) {
    if (count >= 1000) {
      return '${(count / 1000).toStringAsFixed(1)}K';
    }
    return count.toString();
  }

  @override
  Widget build(BuildContext context) {
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

        // Trending prayers horizontal list
        SizedBox(
          height: 140,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 4),
            itemCount: _prayers.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final prayer = _prayers[index];
              return _TrendingPrayerCard(
                prayer: prayer,
                prayerCount: _formatCount(prayer.prayerCount),
                onTap: () => context.push('/prayers'),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _TrendingPrayer {
  final String title;
  final String category;
  final int prayerCount;
  final IconData icon;
  final Color color;

  const _TrendingPrayer({
    required this.title,
    required this.category,
    required this.prayerCount,
    required this.icon,
    required this.color,
  });
}

class _TrendingPrayerCard extends StatelessWidget {
  final _TrendingPrayer prayer;
  final String prayerCount;
  final VoidCallback onTap;

  const _TrendingPrayerCard({
    required this.prayer,
    required this.prayerCount,
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
          border: Border.all(
            color: prayer.color.withValues(alpha: 0.2),
            width: 1,
          ),
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
                    color: prayer.color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(prayer.icon, size: 18, color: prayer.color),
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
                        prayerCount,
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
            ),
          ],
        ),
      ),
    );
  }
}
