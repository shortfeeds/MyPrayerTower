import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/achievements_provider.dart';

class Badge {
  final String id;
  final String name;
  final String icon; // Emoji character
  final String description;

  const Badge({
    required this.id,
    required this.name,
    required this.icon,
    required this.description,
  });
}

class LeaderboardUser {
  final int rank;
  final String name;
  final int streak;
  final int level;
  final String? badge;

  const LeaderboardUser({
    required this.rank,
    required this.name,
    required this.streak,
    required this.level,
    this.badge,
  });
}

const List<Badge> _allBadges = [
  Badge(
    id: 'first_prayer',
    name: 'First Prayer',
    icon: '🙏',
    description: 'Submit your first prayer',
  ),
  Badge(
    id: 'devoted',
    name: 'Devoted',
    icon: '✨',
    description: 'Submit 10 prayers',
  ),
  Badge(
    id: 'faithful',
    name: 'Faithful',
    icon: '🕯️',
    description: 'Submit 50 prayers',
  ),
  Badge(
    id: 'prayer_warrior',
    name: 'Prayer Warrior',
    icon: '⚔️',
    description: 'Submit 100 prayers',
  ),
  Badge(
    id: 'week_streak',
    name: 'Weekly Devotion',
    icon: '🔥',
    description: '7-day streak',
  ),
  Badge(
    id: 'month_streak',
    name: 'Monthly Devotion',
    icon: '💎',
    description: '30-day streak',
  ),
  Badge(
    id: 'explorer',
    name: 'Explorer',
    icon: '🗺️',
    description: 'Save 5 churches',
  ),
  Badge(
    id: 'helper',
    name: 'Helper',
    icon: '🤝',
    description: 'Pray for 10 others',
  ),
  Badge(
    id: 'intercessor',
    name: 'Intercessor',
    icon: '🌟',
    description: 'Pray for 100 others',
  ),
];

// Mock leaderboard for now
const List<LeaderboardUser> _leaderboard = [
  LeaderboardUser(
    rank: 1,
    name: 'Maria S.',
    streak: 156,
    level: 24,
    badge: '👑',
  ),
  LeaderboardUser(
    rank: 2,
    name: 'John D.',
    streak: 134,
    level: 21,
    badge: '🥈',
  ),
  LeaderboardUser(
    rank: 3,
    name: 'Sarah M.',
    streak: 98,
    level: 18,
    badge: '🥉',
  ),
  LeaderboardUser(rank: 4, name: 'Peter L.', streak: 87, level: 16),
  LeaderboardUser(rank: 5, name: 'Anna K.', streak: 72, level: 14),
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
    // Watch real user stats
    final userStats = ref.watch(userStatsProvider);
    final progressPercent = (userStats.xp / userStats.xpToNext).clamp(0.0, 1.0);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Your Achievements',
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Header Stats
          Container(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Colors.amber, Colors.orange],
                                  ),
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(
                                        alpha: 0.2,
                                      ),
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  '${userStats.level}',
                                  style: GoogleFonts.inter(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Level ${userStats.level}',
                                    style: GoogleFonts.inter(
                                      color: Colors.purple.shade100,
                                      fontSize: 13,
                                    ),
                                  ),
                                  Text(
                                    'Prayer Champion',
                                    style: GoogleFonts.merriweather(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'Global Rank',
                                style: GoogleFonts.inter(
                                  color: Colors.purple.shade100,
                                  fontSize: 12,
                                ),
                              ),
                              Text(
                                '#${userStats.rank > 0 ? userStats.rank : "--"}',
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // XP Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${userStats.xp} XP',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                          Text(
                            '${userStats.xpToNext} XP',
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: progressPercent,
                          backgroundColor: Colors.white24,
                          valueColor: const AlwaysStoppedAnimation(
                            Colors.amber,
                          ),
                          minHeight: 8,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${userStats.xpToNext - userStats.xp} XP to Level ${userStats.level + 1}',
                        style: TextStyle(
                          color: Colors.purple.shade100,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Stats Grid - Overlapping
          Transform.translate(
            offset: const Offset(0, -20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _StatCard(
                    icon: LucideIcons.flame,
                    value: userStats.currentStreak,
                    label: 'Streak',
                    countLabel: 'days',
                    color: Colors.orange,
                  ),
                  const SizedBox(width: 8),
                  _StatCard(
                    icon: LucideIcons.trendingUp,
                    value: userStats.longestStreak,
                    label: 'Best',
                    countLabel: 'days',
                    color: Colors.green,
                  ),
                  const SizedBox(width: 8),
                  _StatCard(
                    icon: LucideIcons.target,
                    value: userStats.totalPrayers,
                    label: 'Prayers',
                    color: Colors.blue,
                  ),
                  const SizedBox(width: 8),
                  _StatCard(
                    icon: LucideIcons.star,
                    value: userStats.prayedFor,
                    label: 'Helped',
                    color: Colors.purple,
                  ),
                ],
              ),
            ),
          ),

          // Tabs
          TabBar(
            controller: _tabController,
            labelColor: Colors.purple.shade700,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.purple.shade700,
            tabs: const [
              Tab(text: 'Badges', icon: Icon(LucideIcons.medal)),
              Tab(text: 'Leaderboard', icon: Icon(LucideIcons.trophy)),
            ],
          ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Badges Tab
                GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.8,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: _allBadges.length,
                  itemBuilder: (context, index) {
                    final badge = _allBadges[index];
                    final earned = userStats.earnedBadges.contains(badge.id);

                    return Opacity(
                      opacity: earned ? 1.0 : 0.5,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              badge.icon,
                              style: const TextStyle(fontSize: 32),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              badge.name,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(height: 4),
                            if (earned)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.green.shade50,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'Earned',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.green.shade700,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),

                // Leaderboard Tab (Mock for now)
                ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _leaderboard.length,
                  itemBuilder: (context, index) {
                    final user = _leaderboard[index];
                    final isTop3 = index < 3;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                        gradient: isTop3
                            ? LinearGradient(
                                colors: [
                                  Colors.amber.shade50.withValues(alpha: 0.5),
                                  Colors.white,
                                ],
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                              )
                            : null,
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: index == 0
                                  ? Colors.amber
                                  : index == 1
                                  ? Colors.grey.shade400
                                  : index == 2
                                  ? Colors.orange.shade400
                                  : Colors.grey.shade100,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              user.badge ?? '${user.rank}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: index < 3
                                    ? Colors.white
                                    : Colors.grey.shade600,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  user.name,
                                  style: GoogleFonts.inter(
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFF1E293B),
                                  ),
                                ),
                                Text(
                                  'Level ${user.level}',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(
                                LucideIcons.flame,
                                size: 16,
                                color: Colors.orange,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${user.streak}',
                                style: GoogleFonts.inter(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange.shade700,
                                ),
                              ),
                              const Text(
                                ' days',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final dynamic value;
  final String label;
  final String? countLabel;
  final MaterialColor color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    this.countLabel,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 4),
            Text(
              '$value',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1E293B),
              ),
            ),
            Text(
              countLabel ?? label,
              style: GoogleFonts.inter(
                fontSize: 10,
                color: const Color(0xFF64748B),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
