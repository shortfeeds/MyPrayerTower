/// Novena Definition (static data)
class NovenaDefinition {
  final String id;
  final String name;
  final String description;
  final String patronOf;
  final String? imageUrl;
  final List<String> dailyPrayers; // 9 prayers, one for each day
  final String openingPrayer;
  final String closingPrayer;

  const NovenaDefinition({
    required this.id,
    required this.name,
    required this.description,
    required this.patronOf,
    this.imageUrl,
    required this.dailyPrayers,
    required this.openingPrayer,
    required this.closingPrayer,
  });
}

/// User's Progress on a Novena (persisted as simple map)
class NovenaProgress {
  String novenaId;
  int currentDay; // 1-9
  DateTime startDate;
  List<DateTime> completedDays;
  bool reminderEnabled;
  int reminderHour;
  int reminderMinute;
  bool isCompleted;

  NovenaProgress({
    required this.novenaId,
    this.currentDay = 1,
    required this.startDate,
    List<DateTime>? completedDays,
    this.reminderEnabled = true,
    this.reminderHour = 8,
    this.reminderMinute = 0,
    this.isCompleted = false,
  }) : completedDays = completedDays ?? [];

  int get daysCompleted => completedDays.length;

  double get progressPercent => daysCompleted / 9;

  bool get canMarkToday {
    if (completedDays.isEmpty) return true;
    final lastDay = completedDays.last;
    final now = DateTime.now();
    return now.difference(lastDay).inHours >= 20; // At least 20 hours gap
  }
}
