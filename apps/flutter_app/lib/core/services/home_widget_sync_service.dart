import 'package:home_widget/home_widget.dart';

/// Syncs Daily Verse, Prayer Streak & Next Prayer Alarm to Android Home Screen Widget
class HomeWidgetSyncService {
  static const String _androidWidgetName = 'MyPrayerTowerWidgetProvider';

  static Future<void> syncHomeWidget({
    required int streak,
    String verse = '"Do not be afraid; only have faith." — Mark 5:36',
    String nextReminder = '12:00 PM Angelus • 3:00 PM Divine Mercy',
  }) async {
    try {
      await HomeWidget.saveWidgetData<int>('prayer_streak', streak);
      await HomeWidget.saveWidgetData<String>('daily_verse', verse);
      await HomeWidget.saveWidgetData<String>('next_reminder', nextReminder);
      await HomeWidget.updateWidget(androidName: _androidWidgetName);
    } catch (_) {
      // Safe no-op if native widget provider isn't pinned yet
    }
  }
}
