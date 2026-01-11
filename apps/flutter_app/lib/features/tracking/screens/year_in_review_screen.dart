import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import '../../../core/widgets/premium_scaffold.dart';

class YearInReviewScreen extends StatelessWidget {
  const YearInReviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                '2025 Wrapped',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildIntroCard().animate().fadeIn().slideY(begin: 0.1, end: 0),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        title: 'Prayers',
                        value: '1,248',
                        subtitle: 'Top 5% of users',
                        icon: LucideIcons.heart,
                        color: Colors.amber,
                      ).animate(delay: 100.ms).fadeIn().slideX(),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        title: 'Hours',
                        value: '142',
                        subtitle: 'Time in prayer',
                        icon: LucideIcons.clock,
                        color: Colors.blue,
                      ).animate(delay: 200.ms).fadeIn().slideX(),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                _buildTopPrayerCard().animate(delay: 300.ms).fadeIn().slideY(),
                const SizedBox(height: 16),

                _buildStreakCard().animate(delay: 400.ms).fadeIn().slideY(),
                const SizedBox(height: 16),

                ShinyButton(
                  label: 'Share My Year',
                  icon: LucideIcons.share2,
                  onPressed: () {},
                  color: AppTheme.gold500,
                ).animate(delay: 500.ms).fadeIn(),

                const SizedBox(height: 50),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIntroCard() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(
            LucideIcons.partyPopper,
            size: 48,
            color: AppTheme.gold500,
          ),
          const SizedBox(height: 16),
          Text(
            'What a Year of Grace!',
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'You have grown closer to God through daily prayer and sacraments. Here is a look back at your spiritual journey.',
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white70,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: GoogleFonts.inter(fontSize: 10, color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildTopPrayerCard() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Most Prayed',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    color: AppTheme.gold500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'The Holy Rosary',
                  style: GoogleFonts.merriweather(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Prayed 156 times',
                  style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
                ),
              ],
            ),
          ),
          Icon(
            LucideIcons.crown,
            size: 48,
            color: AppTheme.gold500.withValues(alpha: 0.2),
          ),
        ],
      ),
    );
  }

  Widget _buildStreakCard() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Longest Streak',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    color: Colors.greenAccent,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '42 Days',
                  style: GoogleFonts.merriweather(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Oct 12 - Nov 23',
                  style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
                ),
              ],
            ),
          ),
          Icon(
            LucideIcons.flame,
            size: 48,
            color: Colors.deepOrange.withValues(alpha: 0.5),
          ),
        ],
      ),
    );
  }
}
