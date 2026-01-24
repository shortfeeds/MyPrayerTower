import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../providers/progress_provider.dart';

class JourneyScreen extends ConsumerWidget {
  const JourneyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(progressProvider);
    final milestones = progress.milestones;

    return PremiumScaffold(
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100),
        child: FloatingActionButton(
          backgroundColor: AppTheme.gold500,
          onPressed: () {
            ref
                .read(progressProvider.notifier)
                .addMilestone(
                  'New Grace',
                  'A personal milestone in your journey.',
                );
          },
          child: const Icon(LucideIcons.plus, color: Colors.black),
        ),
      ),
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
                'My Spiritual Journey',
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

          if (milestones.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Text(
                  'Your journey is just beginning...',
                  style: GoogleFonts.inter(color: Colors.white38),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final milestone = milestones[index];
                  return _buildTimelineItem(
                    year: milestone.date.year.toString(),
                    dayMonth: '${milestone.date.day}/${milestone.date.month}',
                    title: milestone.title,
                    description: milestone.description,
                    icon: milestone.type == 'milestone'
                        ? LucideIcons.footprints
                        : LucideIcons.medal,
                    color: index == 0 ? AppTheme.gold500 : Colors.white24,
                    isLast: index == milestones.length - 1,
                  ).animate(delay: (100 * index).ms).fadeIn().slideX();
                }, childCount: milestones.length),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required String year,
    required String dayMonth,
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Line
          Column(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.sacredNavy800,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: color.withValues(alpha: 0.5),
                    width: 2,
                  ),
                  boxShadow: [
                    if (color == AppTheme.gold500)
                      BoxShadow(
                        color: color.withValues(alpha: 0.2),
                        blurRadius: 10,
                      ),
                  ],
                ),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        dayMonth,
                        style: GoogleFonts.inter(
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          color: Colors.white60,
                        ),
                      ),
                      Text(
                        year,
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (!isLast)
                Expanded(child: Container(width: 1, color: Colors.white12)),
            ],
          ),
          const SizedBox(width: 16),

          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 32),
              child: PremiumGlassCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: GoogleFonts.merriweather(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            description,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: Colors.white70,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Icon(icon, color: color, size: 20),
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
