import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz_data;
import 'package:shared_preferences/shared_preferences.dart';

/// Scheduled notification service for daily reminders
class ScheduledNotificationService {
  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// Initialize the notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    tz_data.initializeTimeZones();

    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(initSettings);

    // Create notification channels
    await _createNotificationChannels();

    _isInitialized = true;
  }

  Future<void> _createNotificationChannels() async {
    const channels = [
      AndroidNotificationChannel(
        'daily_prayers',
        'Daily Prayer Reminders',
        description: 'Morning, Gospel, and Night prayer reminders',
        importance: Importance.high,
      ),
      AndroidNotificationChannel(
        'angelus_bells',
        'The Angelus Bells',
        description: 'Authentic church bells for morning, noon, and sunset Angelus',
        importance: Importance.high,
        sound: RawResourceAndroidNotificationSound('angelus_chimes'),
        playSound: true,
      ),
      AndroidNotificationChannel(
        'streak_reminders',
        'Streak Reminders',
        description: 'Reminders to keep your prayer streak going',
        importance: Importance.high,
      ),
      AndroidNotificationChannel(
        'broadcasts',
        'Announcements',
        description: 'Important announcements from MyPrayerTower',
        importance: Importance.high,
      ),
    ];

    final androidPlugin = _notifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    for (final channel in channels) {
      await androidPlugin?.createNotificationChannel(channel);
    }
  }

  /// Schedule all daily notifications
  Future<void> scheduleAllDailyNotifications() async {
    await cancelAllNotifications();

    // 1. Morning Prayer (7:00 AM)
    await _scheduleDaily(
      id: 1,
      hour: 7,
      minute: 0,
      title: '🌅 Good Morning!',
      body: 'Start your day with today\'s Gospel reading',
      channelId: 'daily_prayers',
      payload: '/readings',
    );

    // 2. Angelus (12:00 PM) - Dedicated Angelus Bells channel
    await _scheduleDaily(
      id: 2,
      hour: 12,
      minute: 0,
      title: '🔔 The Angelus',
      body: 'The Angel of the Lord declared unto Mary...',
      channelId: 'angelus_bells',
      payload: '/prayers',
    );

    // 3. Afternoon Prayer (3:00 PM - Divine Mercy)
    await _scheduleDaily(
      id: 3,
      hour: 15,
      minute: 0,
      title: '✝️ Divine Mercy Hour',
      body: 'For the sake of His sorrowful Passion...',
      channelId: 'daily_prayers',
      payload: '/prayers',
    );

    // 4. Evening Reminder (6:00 PM)
    await _scheduleDaily(
      id: 4,
      hour: 18,
      minute: 0,
      title: '🔥 Keep Your Streak!',
      body: 'Don\'t forget to open the app today',
      channelId: 'streak_reminders',
      payload: '/',
    );

    // 5. Night Prayer (9:00 PM)
    await _scheduleDaily(
      id: 5,
      hour: 21,
      minute: 0,
      title: '🌙 Night Prayer',
      body: 'End your day in peace with Compline',
      channelId: 'daily_prayers',
      payload: '/prayers',
    );

    // 6. Saint of the Day (8:00 AM)
    await _scheduleDaily(
      id: 6,
      hour: 8,
      minute: 0,
      title: '⭐ Saint of the Day',
      body: 'Discover today\'s saint and their inspiring story',
      channelId: 'daily_prayers',
      payload: '/saints',
    );
  }

  Future<void> _scheduleDaily({
    required int id,
    required int hour,
    required int minute,
    required String title,
    required String body,
    required String channelId,
    String? payload,
  }) async {
    final now = tz.TZDateTime.now(tz.local);
    var scheduledDate = tz.TZDateTime(
      tz.local,
      now.year,
      now.month,
      now.day,
      hour,
      minute,
    );

    // If time has passed for today, schedule for tomorrow
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }

    String channelName;
    switch (channelId) {
      case 'angelus_bells':
        channelName = 'The Angelus Bells';
        break;
      case 'streak_reminders':
        channelName = 'Streak Reminders';
        break;
      case 'broadcasts':
        channelName = 'Announcements';
        break;
      case 'daily_prayers':
      default:
        channelName = 'Daily Prayer Reminders';
        break;
    }

    final isAngelus = channelId == 'angelus_bells';

    await _notifications.zonedSchedule(
      id,
      title,
      body,
      scheduledDate,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          channelName,
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
          sound: isAngelus
              ? const RawResourceAndroidNotificationSound('angelus_chimes')
              : null,
          playSound: true,
        ),
        iOS: DarwinNotificationDetails(
          sound: isAngelus ? 'angelus_chimes.wav' : null,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time, // Repeat daily
      payload: payload,
    );
  }

  /// Cancel all scheduled notifications
  Future<void> cancelAllNotifications() async {
    await _notifications.cancelAll();
  }

  /// Cancel a specific notification
  Future<void> cancelNotification(int id) async {
    await _notifications.cancel(id);
  }

  /// Enable/disable specific notification types
  Future<void> toggleNotification(int id, bool enabled) async {
    if (enabled) {
      switch (id) {
        case 1:
          await _scheduleDaily(
            id: 1,
            hour: 7,
            minute: 0,
            title: '🌅 Good Morning!',
            body: 'Start your day with today\'s Gospel reading',
            channelId: 'daily_prayers',
            payload: '/readings',
          );
          break;
        case 2:
          await _scheduleDaily(
            id: 2,
            hour: 12,
            minute: 0,
            title: '🔔 The Angelus',
            body: 'The Angel of the Lord declared unto Mary...',
            channelId: 'angelus_bells',
            payload: '/prayers',
          );
          break;
        case 3:
          await _scheduleDaily(
            id: 3,
            hour: 15,
            minute: 0,
            title: '✝️ Divine Mercy Hour',
            body: 'For the sake of His sorrowful Passion...',
            channelId: 'daily_prayers',
            payload: '/prayers',
          );
          break;
        case 4:
          await _scheduleDaily(
            id: 4,
            hour: 18,
            minute: 0,
            title: '🔥 Keep Your Streak!',
            body: 'Don\'t forget to open the app today',
            channelId: 'streak_reminders',
            payload: '/',
          );
          break;
        case 5:
          await _scheduleDaily(
            id: 5,
            hour: 21,
            minute: 0,
            title: '🌙 Night Prayer',
            body: 'End your day in peace with Compline',
            channelId: 'daily_prayers',
            payload: '/prayers',
          );
          break;
        case 6:
          await _scheduleDaily(
            id: 6,
            hour: 8,
            minute: 0,
            title: '⭐ Saint of the Day',
            body: 'Discover today\'s saint and their inspiring story',
            channelId: 'daily_prayers',
            payload: '/saints',
          );
          break;
      }
    } else {
      await cancelNotification(id);
    }
  }
}

/// Service for admin-triggered broadcast notifications
class BroadcastNotificationService {
  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  /// Show an immediate broadcast notification
  Future<void> showBroadcast({
    required String title,
    required String body,
    String? payload,
  }) async {
    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'broadcasts',
          'Announcements',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(),
      ),
      payload: payload,
    );
  }

  /// Check for pending broadcasts from server
  Future<void> checkPendingBroadcasts() async {
    // In production, fetch from Supabase/API if needed
  }
}

/// Service for inactive user re-engagement
class ReengagementService {
  final SharedPreferences _prefs;
  // ignore: unused_field - Reserved for future scheduled notification integration
  final ScheduledNotificationService _scheduledNotifications;

  static const _lastActiveKey = 'last_active_timestamp';
  static const _reengagementSentKey = 'reengagement_sent';

  ReengagementService(this._prefs, this._scheduledNotifications);

  /// Record user activity
  Future<void> recordActivity() async {
    await _prefs.setInt(_lastActiveKey, DateTime.now().millisecondsSinceEpoch);
    await _prefs.setBool(_reengagementSentKey, false);
  }

  /// Check if user is inactive and should receive re-engagement
  Future<bool> shouldSendReengagement() async {
    final lastActive = _prefs.getInt(_lastActiveKey);
    final alreadySent = _prefs.getBool(_reengagementSentKey) ?? false;

    if (lastActive == null || alreadySent) return false;

    final lastActiveDate = DateTime.fromMillisecondsSinceEpoch(lastActive);
    final daysSinceActive = DateTime.now().difference(lastActiveDate).inDays;

    return daysSinceActive >= 3; // Send after 3 days of inactivity
  }

  /// Schedule re-engagement notification
  Future<void> scheduleReengagement() async {
    if (!await shouldSendReengagement()) return;

    final notifications = FlutterLocalNotificationsPlugin();
    await notifications.show(
      999,
      '🙏 We miss you!',
      'Come back and continue your prayer journey. Your streak is waiting!',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'streak_reminders',
          'Streak Reminders',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
      payload: '/',
    );

    await _prefs.setBool(_reengagementSentKey, true);
  }
}

/// Providers
final scheduledNotificationServiceProvider =
    Provider<ScheduledNotificationService>((ref) {
      return ScheduledNotificationService();
    });

final broadcastNotificationServiceProvider =
    Provider<BroadcastNotificationService>((ref) {
      return BroadcastNotificationService();
    });
