import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/streak_service.dart';

/// Widget displaying the user's current streak with milestone badge
class StreakBadge extends ConsumerWidget {
  final bool showLabel;
  final double iconSize;

  const StreakBadge({super.key, this.showLabel = true, this.iconSize = 18});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final streakService = ref.watch(streakServiceProvider);
    final streak = streakService.currentStreak;
    final badge = streakService.getMilestoneBadge(streak);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _getStreakColor(streak).withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _getStreakColor(streak).withValues(alpha: 0.5),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getStreakIcon(streak),
            color: _getStreakColor(streak),
            size: iconSize,
          ),
          const SizedBox(width: 6),
          Text(
            '$streak',
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: _getStreakColor(streak),
            ),
          ),
          if (showLabel) ...[
            const SizedBox(width: 4),
            Text(
              streak == 1 ? 'day' : 'days',
              style: GoogleFonts.inter(
                fontSize: 12,
                color: _getStreakColor(streak).withValues(alpha: 0.8),
              ),
            ),
          ],
          if (badge != null) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppTheme.gold500,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                badge.split(' ').first, // Just the emoji
                style: const TextStyle(fontSize: 10),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color _getStreakColor(int streak) {
    if (streak >= 100) return Colors.purple;
    if (streak >= 30) return Colors.orange;
    if (streak >= 7) return AppTheme.gold500;
    if (streak >= 3) return Colors.green;
    return AppTheme.textSecondary;
  }

  IconData _getStreakIcon(int streak) {
    if (streak >= 30) return LucideIcons.flame;
    if (streak >= 7) return LucideIcons.zap;
    return LucideIcons.calendar;
  }
}

/// Full streak display card for profile/dashboard
class StreakCard extends ConsumerWidget {
  const StreakCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final streakService = ref.watch(streakServiceProvider);
    final currentStreak = streakService.currentStreak;
    final longestStreak = streakService.longestStreak;
    final badge = streakService.getMilestoneBadge(currentStreak);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.gold500.withValues(alpha: 0.15),
            AppTheme.sacredNavy900,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          // Streak count
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.flame, color: AppTheme.gold500, size: 32),
              const SizedBox(width: 12),
              Text(
                '$currentStreak',
                style: GoogleFonts.inter(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold500,
                ),
              ),
            ],
          ),
          Text(
            currentStreak == 1 ? 'Day Streak' : 'Day Streak',
            style: GoogleFonts.inter(
              fontSize: 16,
              color: AppTheme.textSecondary,
            ),
          ),
          if (badge != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.gold500.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                badge,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold500,
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          // Stats row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildStat('Current', currentStreak),
              Container(height: 30, width: 1, color: Colors.white24),
              _buildStat('Longest', longestStreak),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, int value) {
    return Column(
      children: [
        Text(
          '$value',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary),
        ),
      ],
    );
  }
}
