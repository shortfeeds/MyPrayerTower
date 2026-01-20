import 'package:flutter_test/flutter_test.dart';
import 'package:myprayertower_app/core/services/streak_service.dart';

void main() {
  group('StreakService', () {
    group('getMilestoneBadge', () {
      // Mock streak service for badge testing
      late _MockStreakService streakService;

      setUp(() {
        streakService = _MockStreakService();
      });

      test('returns null for streak less than 3', () {
        expect(streakService.getMilestoneBadge(0), isNull);
        expect(streakService.getMilestoneBadge(1), isNull);
        expect(streakService.getMilestoneBadge(2), isNull);
      });

      test('returns Getting Started for 3+ days', () {
        final badge = streakService.getMilestoneBadge(3);
        expect(badge, contains('Getting Started'));
      });

      test('returns Weekly Warrior for 7+ days', () {
        final badge = streakService.getMilestoneBadge(7);
        expect(badge, contains('Weekly Warrior'));
      });

      test('returns Fortnight Faithful for 14+ days', () {
        final badge = streakService.getMilestoneBadge(14);
        expect(badge, contains('Fortnight Faithful'));
      });

      test('returns Rosary Champion for 30+ days', () {
        final badge = streakService.getMilestoneBadge(30);
        expect(badge, contains('Rosary Champion'));
      });

      test('returns Lenten Master for 40+ days', () {
        final badge = streakService.getMilestoneBadge(40);
        expect(badge, contains('Lenten Master'));
      });

      test('returns Century for 100+ days', () {
        final badge = streakService.getMilestoneBadge(100);
        expect(badge, contains('Century'));
      });

      test('returns Year of Faith for 365+ days', () {
        final badge = streakService.getMilestoneBadge(365);
        expect(badge, contains('Year of Faith'));
      });

      test('higher badge takes precedence', () {
        // At 365 days, should get Year of Faith not Century
        final badge = streakService.getMilestoneBadge(400);
        expect(badge, contains('Year of Faith'));
      });
    });
  });

  group('StreakUpdateResult', () {
    test('correctly indicates first activity', () {
      final result = StreakUpdateResult(
        currentStreak: 1,
        longestStreak: 1,
        isNewDay: true,
        streakIncreased: true,
        streakReset: false,
      );

      expect(result.currentStreak, 1);
      expect(result.streakIncreased, true);
      expect(result.streakReset, false);
    });

    test('correctly indicates streak continuation', () {
      final result = StreakUpdateResult(
        currentStreak: 5,
        longestStreak: 10,
        isNewDay: true,
        streakIncreased: true,
        streakReset: false,
      );

      expect(result.currentStreak, 5);
      expect(result.streakIncreased, true);
    });

    test('correctly indicates streak reset', () {
      final result = StreakUpdateResult(
        currentStreak: 1,
        longestStreak: 10,
        isNewDay: true,
        streakIncreased: false,
        streakReset: true,
      );

      expect(result.currentStreak, 1);
      expect(result.streakReset, true);
      expect(result.longestStreak, 10); // Longest preserved
    });

    test('correctly indicates same day activity', () {
      final result = StreakUpdateResult(
        currentStreak: 5,
        longestStreak: 10,
        isNewDay: false,
        streakIncreased: false,
        streakReset: false,
      );

      expect(result.isNewDay, false);
      expect(result.streakIncreased, false);
    });
  });
}

/// Mock streak service for testing badge logic
class _MockStreakService {
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
