import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Tracks user engagement streaks (consecutive days of app usage)
class StreakService {
  static const _lastActiveKey = 'streak_last_active';
  static const _currentStreakKey = 'streak_current';
  static const _longestStreakKey = 'streak_longest';

  final SharedPreferences _prefs;

  StreakService(this._prefs);

  /// Get current streak count
  int get currentStreak => _prefs.getInt(_currentStreakKey) ?? 0;

  /// Get longest ever streak
  int get longestStreak => _prefs.getInt(_longestStreakKey) ?? 0;

  /// Get last active date
  DateTime? get lastActiveDate {
    final timestamp = _prefs.getInt(_lastActiveKey);
    if (timestamp == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(timestamp);
  }

  /// Check if user is at risk of losing streak (hasn't opened app today)
  bool get isStreakAtRisk {
    final lastActive = lastActiveDate;
    if (lastActive == null) return false;

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final lastActiveDay = DateTime(
      lastActive.year,
      lastActive.month,
      lastActive.day,
    );

    return today.difference(lastActiveDay).inDays >= 1;
  }

  /// Record today's activity (call on app open)
  Future<StreakUpdateResult> recordActivity() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final lastActive = lastActiveDate;

    int streak = currentStreak;
    bool isNewDay = false;
    bool streakIncreased = false;
    bool streakReset = false;

    if (lastActive == null) {
      // First ever activity
      streak = 1;
      streakIncreased = true;
      isNewDay = true;
    } else {
      final lastActiveDay = DateTime(
        lastActive.year,
        lastActive.month,
        lastActive.day,
      );
      final daysDifference = today.difference(lastActiveDay).inDays;

      if (daysDifference == 0) {
        // Same day, no change
        isNewDay = false;
      } else if (daysDifference == 1) {
        // Consecutive day!
        streak += 1;
        streakIncreased = true;
        isNewDay = true;
      } else {
        // Streak broken
        streak = 1;
        streakReset = true;
        isNewDay = true;
      }
    }

    // Save updates
    await _prefs.setInt(_lastActiveKey, now.millisecondsSinceEpoch);
    await _prefs.setInt(_currentStreakKey, streak);

    // Update longest streak if needed
    if (streak > longestStreak) {
      await _prefs.setInt(_longestStreakKey, streak);
    }

    return StreakUpdateResult(
      currentStreak: streak,
      longestStreak: longestStreak > streak ? longestStreak : streak,
      isNewDay: isNewDay,
      streakIncreased: streakIncreased,
      streakReset: streakReset,
    );
  }

  /// Get milestone badge if streak hits certain thresholds
  String? getMilestoneBadge(int streak) {
    if (streak >= 365) return '🏆 Year of Faith';
    if (streak >= 100) return '⭐ Century';
    if (streak >= 40) return '🔥 Lenten Master';
    if (streak >= 30) return '📿 Rosary Champion';
    if (streak >= 14) return '🌟 Fortnight Faithful';
    if (streak >= 7) return '✨ Weekly Warrior';
    if (streak >= 3) return '🙏 Getting Started';
    return null;
  }
}

class StreakUpdateResult {
  final int currentStreak;
  final int longestStreak;
  final bool isNewDay;
  final bool streakIncreased;
  final bool streakReset;

  StreakUpdateResult({
    required this.currentStreak,
    required this.longestStreak,
    required this.isNewDay,
    required this.streakIncreased,
    required this.streakReset,
  });
}

/// Provider for SharedPreferences
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('Initialize SharedPreferences in main()');
});

/// Provider for StreakService
final streakServiceProvider = Provider<StreakService>((ref) {
  return StreakService(ref.watch(sharedPreferencesProvider));
});

/// Current streak state
final currentStreakProvider = StateProvider<int>((ref) {
  return ref.watch(streakServiceProvider).currentStreak;
});

/// Longest streak state
final longestStreakProvider = Provider<int>((ref) {
  return ref.watch(streakServiceProvider).longestStreak;
});
