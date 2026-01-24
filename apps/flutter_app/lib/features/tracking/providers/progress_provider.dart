import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

class Milestone {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final String type; // achievement, prayer, etc.

  Milestone({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.type,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'date': date.toIso8601String(),
    'type': type,
  };

  factory Milestone.fromJson(Map<String, dynamic> json) => Milestone(
    id: json['id'],
    title: json['title'],
    description: json['description'],
    date: DateTime.parse(json['date']),
    type: json['type'],
  );
}

class SpiritualProgress {
  final int totalPrayers;
  final int focusMinutes;
  final int dailyStreak;
  final List<Milestone> milestones;
  final DateTime? lastActivityDate;

  SpiritualProgress({
    this.totalPrayers = 0,
    this.focusMinutes = 0,
    this.dailyStreak = 0,
    this.milestones = const [],
    this.lastActivityDate,
  });

  SpiritualProgress copyWith({
    int? totalPrayers,
    int? focusMinutes,
    int? dailyStreak,
    List<Milestone>? milestones,
    DateTime? lastActivityDate,
  }) {
    return SpiritualProgress(
      totalPrayers: totalPrayers ?? this.totalPrayers,
      focusMinutes: focusMinutes ?? this.focusMinutes,
      dailyStreak: dailyStreak ?? this.dailyStreak,
      milestones: milestones ?? this.milestones,
      lastActivityDate: lastActivityDate ?? this.lastActivityDate,
    );
  }

  Map<String, dynamic> toJson() => {
    'totalPrayers': totalPrayers,
    'focusMinutes': focusMinutes,
    'dailyStreak': dailyStreak,
    'milestones': milestones.map((m) => m.toJson()).toList(),
    'lastActivityDate': lastActivityDate?.toIso8601String(),
  };

  factory SpiritualProgress.fromJson(Map<String, dynamic> json) =>
      SpiritualProgress(
        totalPrayers: json['totalPrayers'] ?? 0,
        focusMinutes: json['focusMinutes'] ?? 0,
        dailyStreak: json['dailyStreak'] ?? 0,
        milestones: (json['milestones'] as List? ?? [])
            .map((m) => Milestone.fromJson(Map<String, dynamic>.from(m)))
            .toList(),
        lastActivityDate: json['lastActivityDate'] != null
            ? DateTime.parse(json['lastActivityDate'])
            : null,
      );
}

final progressProvider =
    StateNotifierProvider<ProgressNotifier, SpiritualProgress>((ref) {
      return ProgressNotifier();
    });

class ProgressNotifier extends StateNotifier<SpiritualProgress> {
  static const _boxName = 'spiritual_progress';

  ProgressNotifier() : super(SpiritualProgress()) {
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final box = await Hive.openBox<Map>(_boxName);
    final data = box.get('data');
    if (data != null) {
      state = SpiritualProgress.fromJson(Map<String, dynamic>.from(data));
    } else {
      // First time user milestone
      state = SpiritualProgress(
        milestones: [
          Milestone(
            id: 'begin',
            title: 'Sacred Beginning',
            description:
                'You started your spiritual mission with MyPrayerTower.',
            date: DateTime.now(),
            type: 'milestone',
          ),
        ],
      );
      await _saveProgress();
    }
  }

  Future<void> _saveProgress() async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.put('data', state.toJson());
  }

  Future<void> addPrayer() async {
    final now = DateTime.now();
    int newStreak = state.dailyStreak;

    if (state.lastActivityDate != null) {
      final diff = now.difference(state.lastActivityDate!).inDays;
      if (diff == 1) {
        newStreak++;
      } else if (diff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    state = state.copyWith(
      totalPrayers: state.totalPrayers + 1,
      dailyStreak: newStreak,
      lastActivityDate: now,
    );
    await _saveProgress();
  }

  Future<void> addFocusTime(int minutes) async {
    state = state.copyWith(focusMinutes: state.focusMinutes + minutes);
    await _saveProgress();
  }

  Future<void> addMilestone(String title, String description) async {
    final newMilestone = Milestone(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      description: description,
      date: DateTime.now(),
      type: 'achievement',
    );
    state = state.copyWith(milestones: [newMilestone, ...state.milestones]);
    await _saveProgress();
  }

  Future<void> resetAll() async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.clear();
    state = SpiritualProgress();
    // Restart logic would be handled by the caller (likely a full app restart/wipe)
  }
}
