import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Challenges & Leaderboard screen for gamification
class ChallengesScreen extends ConsumerStatefulWidget {
  const ChallengesScreen({super.key});

  @override
  ConsumerState<ChallengesScreen> createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends ConsumerState<ChallengesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  final List<_Challenge> _activeChallenges = [
    _Challenge(
      id: '1',
      title: 'Daily Rosary',
      description: 'Pray the Rosary every day for 7 days',
      icon: '📿',
      progress: 5,
      total: 7,
      reward: 100,
      daysLeft: 2,
    ),
    _Challenge(
      id: '2',
      title: 'Scripture Reader',
      description: 'Read 3 Bible chapters this week',
      icon: '📖',
      progress: 1,
      total: 3,
      reward: 50,
      daysLeft: 5,
    ),
    _Challenge(
      id: '3',
      title: 'Prayer Warrior',
      description: 'Open the app 14 days in a row',
      icon: '🔥',
      progress: 9,
      total: 14,
      reward: 200,
      daysLeft: 5,
    ),
  ];

  final List<_LeaderboardEntry> _leaderboard = [
    _LeaderboardEntry(
      rank: 1,
      name: 'Mary M.',
      points: 2450,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(
      rank: 2,
      name: 'John P.',
      points: 2280,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(
      rank: 3,
      name: 'Sarah L.',
      points: 2100,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(rank: 4, name: 'You', points: 1850, isCurrentUser: true),
    _LeaderboardEntry(
      rank: 5,
      name: 'Michael K.',
      points: 1720,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(
      rank: 6,
      name: 'Anna R.',
      points: 1650,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(
      rank: 7,
      name: 'David S.',
      points: 1580,
      isCurrentUser: false,
    ),
    _LeaderboardEntry(
      rank: 8,
      name: 'Grace C.',
      points: 1490,
      isCurrentUser: false,
    ),
  ];

  final List<_Badge> _badges = [
    _Badge(icon: '🙏', name: 'First Prayer', earned: true),
    _Badge(icon: '📿', name: 'Rosary Master', earned: true),
    _Badge(icon: '🔥', name: '7 Day Streak', earned: true),
    _Badge(icon: '📖', name: 'Bible Reader', earned: true),
    _Badge(icon: '⛪', name: 'Mass Goer', earned: false),
    _Badge(icon: '🏆', name: '30 Day Streak', earned: false),
    _Badge(icon: '🌟', name: 'Top 10', earned: false),
    _Badge(icon: '💎', name: 'Benefactor', earned: false),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Challenges',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.gold500,
          labelColor: AppTheme.gold500,
          unselectedLabelColor: AppTheme.textSecondary,
          tabs: const [
            Tab(text: 'Active'),
            Tab(text: 'Leaderboard'),
            Tab(text: 'Badges'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildActiveChallenges(),
          _buildLeaderboard(),
          _buildBadges(),
        ],
      ),
    );
  }

  Widget _buildActiveChallenges() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Points summary
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Your Points',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.black54,
                      ),
                    ),
                    Text(
                      '1,850',
                      style: GoogleFonts.inter(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        LucideIcons.trophy,
                        color: Colors.black,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Rank #4',
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          Text(
            'Active Challenges',
            style: GoogleFonts.merriweather(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),

          ...(_activeChallenges.map(
            (challenge) => _buildChallengeCard(challenge),
          )),
        ],
      ),
    );
  }

  Widget _buildChallengeCard(_Challenge challenge) {
    final progress = challenge.progress / challenge.total;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Text(challenge.icon, style: const TextStyle(fontSize: 32)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      challenge.title,
                      style: GoogleFonts.inter(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      challenge.description,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      LucideIcons.star,
                      size: 14,
                      color: AppTheme.gold500,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '+${challenge.reward}',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Progress bar
          Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${challenge.progress}/${challenge.total}',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  Text(
                    '${challenge.daysLeft} days left',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: progress,
                backgroundColor: AppTheme.sacredNavy900,
                valueColor: AlwaysStoppedAnimation(
                  progress >= 1.0 ? Colors.green : AppTheme.gold500,
                ),
                borderRadius: BorderRadius.circular(4),
                minHeight: 8,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboard() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _leaderboard.length,
      itemBuilder: (context, index) {
        final entry = _leaderboard[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: entry.isCurrentUser
                ? AppTheme.gold500.withValues(alpha: 0.15)
                : AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: entry.isCurrentUser
                ? Border.all(color: AppTheme.gold500)
                : null,
          ),
          child: Row(
            children: [
              SizedBox(
                width: 40,
                child: Text(
                  _getRankEmoji(entry.rank),
                  style: const TextStyle(fontSize: 24),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  entry.name,
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: entry.isCurrentUser
                        ? AppTheme.gold500
                        : Colors.white,
                  ),
                ),
              ),
              Text(
                '${entry.points} pts',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _getRankEmoji(int rank) {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '$rank';
    }
  }

  Widget _buildBadges() {
    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _badges.length,
      itemBuilder: (context, index) {
        final badge = _badges[index];
        return Container(
          decoration: BoxDecoration(
            color: badge.earned ? AppTheme.darkCard : AppTheme.sacredNavy900,
            borderRadius: BorderRadius.circular(16),
            border: badge.earned
                ? Border.all(color: AppTheme.gold500.withValues(alpha: 0.5))
                : null,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                badge.icon,
                style: TextStyle(
                  fontSize: 32,
                  color: badge.earned ? null : Colors.grey,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                badge.name,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: badge.earned ? Colors.white : Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
              if (!badge.earned)
                const Icon(LucideIcons.lock, size: 12, color: Colors.grey),
            ],
          ),
        );
      },
    );
  }
}

class _Challenge {
  final String id;
  final String title;
  final String description;
  final String icon;
  final int progress;
  final int total;
  final int reward;
  final int daysLeft;

  _Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.progress,
    required this.total,
    required this.reward,
    required this.daysLeft,
  });
}

class _LeaderboardEntry {
  final int rank;
  final String name;
  final int points;
  final bool isCurrentUser;

  _LeaderboardEntry({
    required this.rank,
    required this.name,
    required this.points,
    required this.isCurrentUser,
  });
}

class _Badge {
  final String icon;
  final String name;
  final bool earned;

  _Badge({required this.icon, required this.name, required this.earned});
}
