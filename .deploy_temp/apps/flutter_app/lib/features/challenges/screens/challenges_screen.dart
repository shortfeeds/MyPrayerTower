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
    _leaderboard = _generateLeaderboard();
  }

  List<_LeaderboardEntry> _generateLeaderboard() {
    final names = [
      'Maria G.',
      'John P.',
      'Sarah L.',
      'Michael K.',
      'Anna R.',
      'David S.',
      'Grace C.',
      'Peter M.',
      'Teresa B.',
      'James H.',
      'Elizabeth T.',
      'Joseph W.',
      'Catherine D.',
      'Francis X.',
      'Clare A.',
      'Anthony V.',
      'Rose M.',
      'Benedict P.',
      'Monica L.',
      'Augustine J.',
      'Lucy F.',
      'Paul R.',
      'Rita C.',
      'Stephen K.',
      'Agnes W.',
      'Dominic G.',
      'Bernadette S.',
      'Jerome H.',
      'Cecilia B.',
      'Patrick O.',
      'Bridget M.',
      'Thomas A.',
      'Veronica L.',
      'Simon P.',
      'Jude T.',
      'Martha K.',
      'Luke D.',
      'Matthew R.',
      'Mark B.',
      'Andrew G.',
      'Philip H.',
      'Bartholomew J.',
      'Ignatius L.',
      'Xavier P.',
      'Therese M.',
      'Faustina K.',
      'Maximilian Kolbe',
      'Gianna M.',
      'Pier G.',
      'Chiara L.',
      'Carlo A.',
      'Kateri T.',
      'Juan Diego',
      'Leo G.',
      'Gregory H.',
      'Ambrose B.',
      'Jerome C.',
      'Basil D.',
      'Cyril E.',
      'Hilary F.',
      'Athanasius G.',
      'Ephrem H.',
      'Albert I.',
      'Bonaventure J.',
      'Robert K.',
      'Lawrence L.',
      'Sebastian M.',
      'George N.',
      'Christopher O.',
      'Blaise P.',
      'Valentine Q.',
      'Patrick R.',
      'Nicholas S.',
      'Martin T.',
      'Hubert U.',
      'Vincent V.',
      'William W.',
      'Edward X.',
      'Charles Y.',
      'Henry Z.',
      'Louis A.',
      'Fernando B.',
      'Isabella C.',
      'Sofia D.',
      'Mateo E.',
      'Lucas F.',
      'Elena G.',
      'Diego H.',
      'Valentina I.',
      'Santiago J.',
      'Camila K.',
      'Gabriel L.',
      'Victoria M.',
      'Samuel N.',
      'Daniel O.',
      'Hannah P.',
      'Isaac Q.',
      'Rachel R.',
      'Caleb S.',
      'Leah T.',
      'Joshua U.',
      'Miriam V.',
      'Ethan W.',
      'Abigail X.',
    ];

    List<_LeaderboardEntry> entries = [];
    int basePoints = 5000;

    // Top users
    for (int i = 0; i < names.length; i++) {
      // Decrease points realistically
      basePoints -= (i < 10 ? 150 : (i < 50 ? 50 : 20));
      if (basePoints < 0) basePoints = 100;

      entries.add(
        _LeaderboardEntry(
          rank: i + 1,
          name: names[i],
          points:
              basePoints + (DateTime.now().millisecond % 50), // Add variance
          isCurrentUser: false,
        ),
      );
    }

    // Insert current user around rank 25 for motivation
    entries.insert(
      25,
      _LeaderboardEntry(
        rank: 26,
        name: 'You',
        points: entries[24].points - 10,
        isCurrentUser: true,
      ),
    );

    // Re-rank after insertion
    for (int i = 0; i < entries.length; i++) {
      // We can't modify final fields, but we created a new list locally first inside the function logic if we wanted to be pure.
      // But _LeaderboardEntry has final fields. So we constructed them correctly in the loop above for the static ones.
      // For the user insertion, we need to adjust subsequent ranks.
      // Since this is a simple mock, just rebuilding the list with correct ranks is easier or just accepting the offset.
      // Let's just return the list as is, but we need to ensure the ranks are sequential visually if we display them from index + 1.
    }
    // Actually, let's just regenerate the whole list properly with the user included in the source data "sort of".
    // Or just manually fix the ranks in the builder.
    // The builder uses `_getRankEmoji(entry.rank)`.
    // Let's just fix the rank in the object for the user and subsequent.

    return List.generate(entries.length, (index) {
      final e = entries[index];
      return _LeaderboardEntry(
        rank: index + 1,
        name: e.name,
        points: e.points,
        isCurrentUser: e.isCurrentUser,
      );
    });
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
      progress: 0,
      total: 7,
      reward: 100,
      daysLeft: 7,
    ),
    _Challenge(
      id: '2',
      title: 'Scripture Reader',
      description: 'Read 3 Bible chapters this week',
      icon: '📖',
      progress: 0,
      total: 3,
      reward: 50,
      daysLeft: 7,
    ),
    _Challenge(
      id: '3',
      title: 'Prayer Warrior',
      description: 'Open the app 14 days in a row',
      icon: '🔥',
      progress: 0,
      total: 14,
      reward: 200,
      daysLeft: 14,
    ),
    _Challenge(
      id: '4',
      title: 'Candle Lighter',
      description: 'Light 5 prayer candles this month',
      icon: '🕯️',
      progress: 0,
      total: 5,
      reward: 75,
      daysLeft: 30,
    ),
    _Challenge(
      id: '5',
      title: 'Confession Prep',
      description: 'Complete the Examen 3 times this week',
      icon: '✝️',
      progress: 0,
      total: 3,
      reward: 60,
      daysLeft: 7,
    ),
    _Challenge(
      id: '6',
      title: 'Mass Devotee',
      description: 'Request 2 Mass offerings this month',
      icon: '⛪',
      progress: 0,
      total: 2,
      reward: 150,
      daysLeft: 30,
    ),
    _Challenge(
      id: '7',
      title: 'Intercessor',
      description: 'Pray for 50 people on the Prayer Wall',
      icon: '🙏',
      progress: 0,
      total: 50,
      reward: 300,
      daysLeft: 30,
    ),
    _Challenge(
      id: '8',
      title: 'Novena Novice',
      description: 'Complete your first Novena',
      icon: '📅',
      progress: 0,
      total: 9,
      reward: 100,
      daysLeft: 9,
    ),
    _Challenge(
      id: '9',
      title: 'Early Riser',
      description: 'Complete Morning Prayer 5 days in a row',
      icon: '🌅',
      progress: 0,
      total: 5,
      reward: 80,
      daysLeft: 7,
    ),
    _Challenge(
      id: '10',
      title: 'Charitable Heart',
      description: 'Light a candle for a stranger',
      icon: '❤️',
      progress: 0,
      total: 1,
      reward: 50,
      daysLeft: 30,
    ),
    _Challenge(
      id: '11',
      title: 'Bible Scholar',
      description: 'Read all 4 Gospels',
      icon: '📚',
      progress: 0,
      total: 4,
      reward: 500,
      daysLeft: 90,
    ),
    _Challenge(
      id: '12',
      title: 'Saintly Friend',
      description: 'Read about 10 different Saints',
      icon: '🕊️',
      progress: 0,
      total: 10,
      reward: 120,
      daysLeft: 30,
    ),
  ];

  late final List<_LeaderboardEntry> _leaderboard;

  final List<_Badge> _badges = [
    _Badge(icon: '🙏', name: 'First Prayer', earned: false),
    _Badge(icon: '📿', name: 'Rosary Master', earned: false),
    _Badge(icon: '🔥', name: '7 Day Streak', earned: false),
    _Badge(icon: '📖', name: 'Bible Reader', earned: false),
    _Badge(icon: '⛪', name: 'Mass Goer', earned: false),
    _Badge(icon: '🏆', name: '30 Day Streak', earned: false),
    _Badge(icon: '🌟', name: 'Top 10', earned: false),
    _Badge(icon: '💎', name: 'Benefactor', earned: false),
    _Badge(icon: '🕯️', name: 'Light Bearer', earned: false),
    _Badge(icon: '🛡️', name: 'Guardian', earned: false),
    _Badge(icon: '❤️', name: 'Intercessor', earned: false),
    _Badge(icon: '📅', name: 'Novena Master', earned: false),
    _Badge(icon: '🌅', name: 'Early Bird', earned: false),
    _Badge(icon: '🌙', name: 'Night Watch', earned: false),
    _Badge(icon: '✝️', name: 'Penitent', earned: false),
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
                      '0',
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
                        'Rank #8',
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
