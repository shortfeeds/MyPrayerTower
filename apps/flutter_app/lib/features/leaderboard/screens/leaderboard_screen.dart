import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class LeaderboardScreen extends ConsumerWidget {
  const LeaderboardScreen({super.key});

  // Sample leaderboard data
  static final List<_LeaderboardEntry> _entries = [
    const _LeaderboardEntry(rank: 1, name: 'Maria G.', prayers: 2847, streak: 45),
    const _LeaderboardEntry(rank: 2, name: 'John P.', prayers: 2654, streak: 38),
    const _LeaderboardEntry(rank: 3, name: 'Teresa M.', prayers: 2432, streak: 52),
    const _LeaderboardEntry(rank: 4, name: 'Francis A.', prayers: 2156, streak: 29),
    const _LeaderboardEntry(rank: 5, name: 'Catherine S.', prayers: 1987, streak: 33),
    const _LeaderboardEntry(rank: 6, name: 'Joseph B.', prayers: 1876, streak: 21),
    const _LeaderboardEntry(rank: 7, name: 'Anne M.', prayers: 1654, streak: 18),
    const _LeaderboardEntry(rank: 8, name: 'Paul R.', prayers: 1543, streak: 25),
    const _LeaderboardEntry(rank: 9, name: 'Monica L.', prayers: 1432, streak: 15),
    const _LeaderboardEntry(rank: 10, name: 'Peter K.', prayers: 1321, streak: 12),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy950,
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFF1E1B4B), AppTheme.sacredNavy950],
                  ),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: AppTheme.goldGradient,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.gold500.withValues(alpha: 0.4),
                              blurRadius: 20,
                            ),
                          ],
                        ),
                        child: const Icon(
                          LucideIcons.trophy,
                          size: 32,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Prayer Warriors',
                        style: GoogleFonts.merriweather(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Top prayer warriors this week',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.white60,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Leaderboard list
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final entry = _entries[index];
                return _LeaderboardCard(entry: entry);
              }, childCount: _entries.length),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _LeaderboardEntry {
  final int rank;
  final String name;
  final int prayers;
  final int streak;

  const _LeaderboardEntry({
    required this.rank,
    required this.name,
    required this.prayers,
    required this.streak,
  });
}

class _LeaderboardCard extends StatelessWidget {
  final _LeaderboardEntry entry;

  const _LeaderboardCard({required this.entry});

  Color get _rankColor {
    switch (entry.rank) {
      case 1:
        return AppTheme.gold500;
      case 2:
        return Colors.grey.shade400;
      case 3:
        return const Color(0xFFCD7F32); // Bronze
      default:
        return Colors.white38;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isTopThree = entry.rank <= 3;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isTopThree
              ? _rankColor.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
        boxShadow: isTopThree
            ? [
                BoxShadow(
                  color: _rankColor.withValues(alpha: 0.1),
                  blurRadius: 10,
                ),
              ]
            : null,
      ),
      child: Row(
        children: [
          // Rank
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _rankColor.withValues(alpha: isTopThree ? 0.2 : 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: isTopThree
                  ? Icon(
                      entry.rank == 1
                          ? LucideIcons.crown
                          : entry.rank == 2
                          ? LucideIcons.medal
                          : LucideIcons.award,
                      color: _rankColor,
                      size: 20,
                    )
                  : Text(
                      '${entry.rank}',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white60,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 16),

          // Name and prayers
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.name,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      LucideIcons.heart,
                      size: 12,
                      color: Colors.pink.withValues(alpha: 0.8),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${entry.prayers} prayers',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.white54,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Streak
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  LucideIcons.flame,
                  size: 14,
                  color: AppTheme.gold500,
                ),
                const SizedBox(width: 4),
                Text(
                  '${entry.streak}',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.gold500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
