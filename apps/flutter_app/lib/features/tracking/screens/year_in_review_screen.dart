import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../providers/progress_provider.dart';

class YearInReviewScreen extends ConsumerWidget {
  const YearInReviewScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);

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
                '${DateTime.now().year} Wrapped',
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
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildIntroCard().animate().fadeIn().slideY(begin: 0.1, end: 0),
                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        title: 'Prayers',
                        value: progress.totalPrayers.toString(),
                        subtitle: 'Times encountered God',
                        icon: LucideIcons.heart,
                        color: Colors.amber,
                      ).animate(delay: 100.ms).fadeIn().slideX(),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildStatCard(
                        title: 'Minutes',
                        value: progress.focusMinutes.toString(),
                        subtitle: 'Spiritual focus time',
                        icon: LucideIcons.clock,
                        color: Colors.blue,
                      ).animate(delay: 200.ms).fadeIn().slideX(),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                _buildStreakCard(
                  progress.dailyStreak,
                ).animate(delay: 400.ms).fadeIn().slideY(),
                const SizedBox(height: 24),

                Text(
                  'LATEST MILESTONE',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white24,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 12),
                if (progress.milestones.isNotEmpty)
                  _buildMilestonePreview(progress.milestones.first)
                else
                  Text(
                    'No milestones yet. Keep praying!',
                    style: GoogleFonts.inter(
                      color: Colors.white38,
                      fontSize: 13,
                    ),
                  ),

                const SizedBox(height: 32),

                ShinyButton(
                  label: 'Share My Year',
                  icon: LucideIcons.share2,
                  onPressed: () {
                    Share.share(
                      'Check out my ${DateTime.now().year} Spiritual Year in Review on MyPrayerTower! ${progress.totalPrayers} Prayers and ${progress.focusMinutes} Minutes of Grace. #MyPrayerTower',
                    );
                  },
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
          const Icon(LucideIcons.sparkles, size: 48, color: AppTheme.gold500),
          const SizedBox(height: 16),
          Text(
            'A Journey of Grace',
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Reflect on the moments you dedicated to silence, prayer, and growth this year.',
            style: GoogleFonts.inter(
              fontSize: 14,
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
          Icon(icon, color: color.withValues(alpha: 0.8), size: 20),
          const SizedBox(height: 16),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: GoogleFonts.inter(fontSize: 9, color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildStreakCard(int streak) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Current Streak',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    color: Colors.greenAccent,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '$streak Days',
                  style: GoogleFonts.merriweather(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Consistency is the key to peace.',
                  style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
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

  Widget _buildMilestonePreview(Milestone milestone) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const Icon(LucideIcons.medal, color: AppTheme.gold500, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  milestone.title,
                  style: GoogleFonts.merriweather(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  milestone.description,
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white60),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
