import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../providers/achievements_provider.dart';

class Badge {
  final String id;
  final String name;
  final IconData icon;
  final String description;

  const Badge({
    required this.id,
    required this.name,
    required this.icon,
    required this.description,
  });
}

const List<Badge> _allBadges = [
  Badge(
    id: 'first_prayer',
    name: 'First Prayer',
    icon: LucideIcons.heart,
    description: 'Submit your first prayer',
  ),
  Badge(
    id: 'devoted',
    name: 'Devoted',
    icon: LucideIcons.sparkles,
    description: 'Submit 10 prayers',
  ),
  Badge(
    id: 'faithful',
    name: 'Faithful',
    icon: LucideIcons.flame,
    description: 'Submit 50 prayers',
  ),
  Badge(
    id: 'prayer_warrior',
    name: 'Prayer Warrior',
    icon: LucideIcons.shield,
    description: 'Submit 100 prayers',
  ),
  Badge(
    id: 'week_streak',
    name: 'Weekly Devotion',
    icon: LucideIcons.calendarDays,
    description: '7-day streak',
  ),
  Badge(
    id: 'month_streak',
    name: 'Monthly Devotion',
    icon: LucideIcons.gem,
    description: '30-day streak',
  ),
  Badge(
    id: 'explorer',
    name: 'Explorer',
    icon: LucideIcons.map,
    description: 'Save 5 churches',
  ),
  Badge(
    id: 'helper',
    name: 'Helper',
    icon: LucideIcons.users,
    description: 'Pray for 10 others',
  ),
  Badge(
    id: 'intercessor',
    name: 'Intercessor',
    icon: LucideIcons.star,
    description: 'Pray for 100 others',
  ),
];

class AchievementsScreen extends ConsumerStatefulWidget {
  const AchievementsScreen({super.key});

  @override
  ConsumerState<AchievementsScreen> createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends ConsumerState<AchievementsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final userStats = ref.watch(userStatsProvider);
    final progressPercent = (userStats.xp / userStats.xpToNext).clamp(0.0, 1.0);

    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'My Spiritual Growth',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.gold500, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.gold500.withValues(alpha: 0.2),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Text(
                        '${userStats.level}',
                        style: GoogleFonts.cinzel(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.gold500,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'SPIRITUAL LEVEL',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white60,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // XP Progress
                  PremiumGlassCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Soul Progress',
                              style: GoogleFonts.inter(
                                color: Colors.white70,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${userStats.xp} / ${userStats.xpToNext} XP',
                              style: GoogleFonts.inter(
                                color: AppTheme.gold500,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progressPercent,
                            backgroundColor: Colors.white.withValues(
                              alpha: 0.05,
                            ),
                            valueColor: const AlwaysStoppedAnimation(
                              AppTheme.gold500,
                            ),
                            minHeight: 8,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${userStats.xpToNext - userStats.xp} XP to Level ${userStats.level + 1}',
                          style: GoogleFonts.inter(
                            color: Colors.white38,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Stats Overview
                  Row(
                    children: [
                      _StatItem(
                        icon: LucideIcons.flame,
                        value: userStats.currentStreak.toString(),
                        label: 'Streak',
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 12),
                      _StatItem(
                        icon: LucideIcons.heart,
                        value: userStats.totalPrayers.toString(),
                        label: 'Prayers',
                        color: Colors.pink,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _StatItem(
                        icon: LucideIcons.users,
                        value: userStats.prayedFor.toString(),
                        label: 'Intercessions',
                        color: Colors.blue,
                      ),
                      const SizedBox(width: 12),
                      _StatItem(
                        icon: LucideIcons.trendingUp,
                        value: userStats.longestStreak.toString(),
                        label: 'Best Streak',
                        color: Colors.green,
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Badges Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Heavenly Badges',
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        '${userStats.earnedBadges.length} / ${_allBadges.length}',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Badges Grid
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.85,
                        ),
                    itemCount: _allBadges.length,
                    itemBuilder: (context, index) {
                      final badge = _allBadges[index];
                      final earned = userStats.earnedBadges.contains(badge.id);

                      return _BadgeCard(badge: badge, earned: earned);
                    },
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: PremiumGlassCard(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 12),
            Text(
              value,
              style: GoogleFonts.cinzel(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label.toUpperCase(),
              style: GoogleFonts.inter(
                fontSize: 10,
                color: Colors.white38,
                letterSpacing: 1,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BadgeCard extends StatelessWidget {
  final Badge badge;
  final bool earned;

  const _BadgeCard({required this.badge, required this.earned});

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                badge.icon,
                size: 32,
                color: earned
                    ? AppTheme.gold500
                    : Colors.white.withValues(alpha: 0.05),
              ),
              const SizedBox(height: 12),
              Text(
                badge.name,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: earned ? FontWeight.bold : FontWeight.normal,
                  color: earned ? Colors.white : Colors.white24,
                ),
              ),
              if (!earned)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Icon(
                    LucideIcons.lock,
                    size: 10,
                    color: Colors.white.withValues(alpha: 0.1),
                  ),
                ),
            ],
          ),
        )
        .animate(target: earned ? 1 : 0)
        .shimmer(
          duration: 2.seconds,
          color: AppTheme.gold500.withValues(alpha: 0.3),
        );
  }
}
