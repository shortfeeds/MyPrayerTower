import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
// import '../screens/achievements_screen.dart'; // Removed to fix unused import lint

// User Stats Model
class UserStats {
  final int level;
  final int xp;
  final int xpToNext;
  final int currentStreak;
  final int longestStreak;
  final int totalPrayers;
  final int prayedFor;
  final int rank;
  final List<String> earnedBadges;
  final DateTime? lastPrayerDate;

  UserStats({
    this.level = 1,
    this.xp = 0,
    this.xpToNext = 100,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.totalPrayers = 0,
    this.prayedFor = 0,
    this.rank = 0,
    this.earnedBadges = const [],
    this.lastPrayerDate,
  });

  Map<String, dynamic> toJson() => {
    'level': level,
    'xp': xp,
    'xpToNext': xpToNext,
    'currentStreak': currentStreak,
    'longestStreak': longestStreak,
    'totalPrayers': totalPrayers,
    'prayedFor': prayedFor,
    'rank': rank,
    'earnedBadges': earnedBadges,
    'lastPrayerDate': lastPrayerDate?.toIso8601String(),
  };

  factory UserStats.fromJson(Map<String, dynamic> json) => UserStats(
    level: json['level'] ?? 1,
    xp: json['xp'] ?? 0,
    xpToNext: json['xpToNext'] ?? 100,
    currentStreak: json['currentStreak'] ?? 0,
    longestStreak: json['longestStreak'] ?? 0,
    totalPrayers: json['totalPrayers'] ?? 0,
    prayedFor: json['prayedFor'] ?? 0,
    rank: json['rank'] ?? 0,
    earnedBadges: List<String>.from(json['earnedBadges'] ?? []),
    lastPrayerDate: json['lastPrayerDate'] != null
        ? DateTime.parse(json['lastPrayerDate'])
        : null,
  );

  UserStats copyWith({
    int? level,
    int? xp,
    int? xpToNext,
    int? currentStreak,
    int? longestStreak,
    int? totalPrayers,
    int? prayedFor,
    int? rank,
    List<String>? earnedBadges,
    DateTime? lastPrayerDate,
  }) {
    return UserStats(
      level: level ?? this.level,
      xp: xp ?? this.xp,
      xpToNext: xpToNext ?? this.xpToNext,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      totalPrayers: totalPrayers ?? this.totalPrayers,
      prayedFor: prayedFor ?? this.prayedFor,
      rank: rank ?? this.rank,
      earnedBadges: earnedBadges ?? this.earnedBadges,
      lastPrayerDate: lastPrayerDate ?? this.lastPrayerDate,
    );
  }
}

// Stats Provider
final userStatsProvider = StateNotifierProvider<UserStatsNotifier, UserStats>((
  ref,
) {
  return UserStatsNotifier();
});

class UserStatsNotifier extends StateNotifier<UserStats> {
  static const _boxName = 'user_gamification';
  static const _key = 'stats';

  UserStatsNotifier() : super(UserStats()) {
    _load();
  }

  Future<void> _load() async {
    final box = await Hive.openBox<Map>(_boxName);
    final data = box.get(_key);
    if (data != null) {
      state = UserStats.fromJson(Map<String, dynamic>.from(data));
    }
  }

  Future<void> _save() async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.put(_key, state.toJson());
  }

  Future<void> recordPrayer() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    // Update streak logic
    int newStreak = state.currentStreak;
    int newLongest = state.longestStreak;
    DateTime? last = state.lastPrayerDate;

    if (last != null) {
      final lastDate = DateTime(last.year, last.month, last.day);
      final diff = today.difference(lastDate).inDays;

      if (diff == 1) {
        // Consecutive day
        newStreak++;
      } else if (diff > 1) {
        // Broken streak
        newStreak = 1;
      }
      // If diff == 0 (same day), do nothing to streak
    } else {
      // First prayer ever
      newStreak = 1;
    }

    if (newStreak > newLongest) {
      newLongest = newStreak;
    }

    // Update XP and prayers
    int newXp = state.xp + 10; // 10 XP per prayer
    int newTotalPrayers = state.totalPrayers + 1;
    int newLevel = state.level;
    int newXpToNext = state.xpToNext;

    // Level up logic
    while (newXp >= newXpToNext) {
      newXp -= newXpToNext;
      newLevel++;
      newXpToNext = (newXpToNext * 1.2).round(); // 20% harder each level
    }

    // Badge logic
    List<String> newBadges = List.from(state.earnedBadges);
    if (newTotalPrayers >= 1 && !newBadges.contains('first_prayer')) {
      newBadges.add('first_prayer');
    }
    if (newTotalPrayers >= 10 && !newBadges.contains('devoted')) {
      newBadges.add('devoted');
    }
    if (newTotalPrayers >= 50 && !newBadges.contains('faithful')) {
      newBadges.add('faithful');
    }
    if (newTotalPrayers >= 100 && !newBadges.contains('prayer_warrior')) {
      newBadges.add('prayer_warrior');
    }

    if (newStreak >= 7 && !newBadges.contains('week_streak')) {
      newBadges.add('week_streak');
    }
    if (newStreak >= 30 && !newBadges.contains('month_streak')) {
      newBadges.add('month_streak');
    }

    state = state.copyWith(
      level: newLevel,
      xp: newXp,
      xpToNext: newXpToNext,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalPrayers: newTotalPrayers,
      earnedBadges: newBadges,
      lastPrayerDate: now,
    );

    await _save();
  }

  Future<void> recordPrayedForOthers() async {
    // Similar logic for "prayedFor" stat...
    int newPrayedFor = state.prayedFor + 1;
    List<String> newBadges = List.from(state.earnedBadges);

    if (newPrayedFor >= 10 && !newBadges.contains('helper')) {
      newBadges.add('helper');
    }
    if (newPrayedFor >= 100 && !newBadges.contains('intercessor')) {
      newBadges.add('intercessor');
    }

    state = state.copyWith(prayedFor: newPrayedFor, earnedBadges: newBadges);
    await _save();
  }
}
