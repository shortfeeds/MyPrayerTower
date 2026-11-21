import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz_data;
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/routes.dart';

/// Scheduled notification service for daily reminders
class ScheduledNotificationService {
  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// Initialize the notification service with user device timezone
  Future<void> initialize() async {
    if (_isInitialized) return;

    tz_data.initializeTimeZones();
    _configureLocalTimezone();

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

    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (details) {
        if (details.payload != null && details.payload!.isNotEmpty) {
          debugPrint('[Scheduled Notification] Clicked with route: ${details.payload}');
          navigateToNotificationTarget(details.payload);
        }
      },
    );

    // Create notification channels
    await _createNotificationChannels();

    _isInitialized = true;
  }

  /// Automatically configure user device local timezone
  void _configureLocalTimezone() {
    try {
      final String timeZoneName = DateTime.now().timeZoneName;
      try {
        tz.setLocalLocation(tz.getLocation(timeZoneName));
        debugPrint('[Timezone] Initialized with location name: $timeZoneName');
        return;
      } catch (_) {
        // Fallback: match by current device UTC offset
        final offset = DateTime.now().timeZoneOffset;
        for (final loc in tz.timeZoneDatabase.locations.values) {
          if (loc.currentTimeZone.offset == offset.inMilliseconds) {
            tz.setLocalLocation(loc);
            debugPrint('[Timezone] Initialized with matched offset: ${loc.name}');
            return;
          }
        }
      }
    } catch (e) {
      debugPrint('[Timezone] Note initializing local timezone: $e');
    }
  }

  Future<void> _createNotificationChannels() async {
    const channels = [
      AndroidNotificationChannel(
        'angelus_bells',
        'The Angelus Bells',
        description: 'Authentic cathedral bells for morning, noon, and sunset Angelus',
        importance: Importance.max,
        sound: RawResourceAndroidNotificationSound('angelus_chimes'),
        playSound: true,
      ),
      AndroidNotificationChannel(
        'divine_mercy',
        'Hour of Great Mercy',
        description: 'Reverent sacred chime for 3:00 PM Hour of Mercy and Chaplet',
        importance: Importance.high,
        sound: RawResourceAndroidNotificationSound('divine_mercy_chime'),
        playSound: true,
      ),
      AndroidNotificationChannel(
        'daily_gospel',
        'Daily Gospel & Readings',
        description: 'Monastic chord chime for morning Gospel verses and Scripture',
        importance: Importance.high,
        sound: RawResourceAndroidNotificationSound('gospel_chime'),
        playSound: true,
      ),
      AndroidNotificationChannel(
        'daily_prayers',
        'Daily Prayer Reminders',
        description: 'Morning, Saint, and Night prayer reminders',
        importance: Importance.high,
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

    if (androidPlugin != null) {
      for (final channel in channels) {
        await androidPlugin.createNotificationChannel(channel);
      }
    }
  }

  /// Schedule all daily notifications
  Future<void> scheduleAllDailyNotifications() async {
    await cancelAllNotifications();

    final prefs = await SharedPreferences.getInstance();
    final morningEnabled = prefs.getBool('pref_notif_morning') ?? true;
    final angelusEnabled = prefs.getBool('pref_notif_angelus') ?? true;
    final mercyEnabled = prefs.getBool('pref_notif_mercy') ?? true;
    final streakEnabled = prefs.getBool('pref_notif_streak') ?? true;
    final nightEnabled = prefs.getBool('pref_notif_night') ?? true;
    final saintEnabled = prefs.getBool('pref_notif_saint') ?? true;

    // 1. Morning Gospel & Meditation (7:00 AM)
    if (morningEnabled) {
      await _scheduleDaily(
        id: 1,
        hour: 7,
        minute: 0,
        title: '🌅 Today\'s Holy Gospel',
        body: 'Start your morning in communion with Christ. Tap to read or listen.',
        channelId: 'daily_gospel',
        payload: '/readings',
      );
    }

    // 2. Saint of the Day (8:00 AM)
    if (saintEnabled) {
      await _scheduleDaily(
        id: 2,
        hour: 8,
        minute: 0,
        title: '⭐ Saint of the Day',
        body: 'Discover today\'s saint, their holy life, and prayer of intercession.',
        channelId: 'daily_prayers',
        payload: '/saints',
      );
    }

    // 3. The Angelus (12:00 PM) - Dedicated Angelus Cathedral Bells
    if (angelusEnabled) {
      await _scheduleDaily(
        id: 3,
        hour: 12,
        minute: 0,
        title: '🔔 The Angelus',
        body: 'The Angel of the Lord declared unto Mary. And she conceived of the Holy Spirit.',
        channelId: 'angelus_bells',
        payload: '/prayers',
      );
    }

    // 4. Hour of Great Mercy (3:00 PM - Divine Mercy Chime)
    if (mercyEnabled) {
      await _scheduleDaily(
        id: 4,
        hour: 15,
        minute: 0,
        title: '✝️ Hour of Great Mercy',
        body: 'For the sake of His sorrowful Passion, have mercy on us and on the whole world.',
        channelId: 'divine_mercy',
        payload: '/chaplets',
      );
    }

    // 5. Evening Streak Reminder (6:00 PM)
    if (streakEnabled) {
      await _scheduleDaily(
        id: 5,
        hour: 18,
        minute: 0,
        title: '🔥 Keep Your Daily Devotion Alive',
        body: 'Take 2 minutes to offer an evening prayer and sustain your holy streak.',
        channelId: 'streak_reminders',
        payload: '/',
      );
    }

    // 6. Night Prayer & Examen (9:00 PM)
    if (nightEnabled) {
      await _scheduleDaily(
        id: 6,
        hour: 21,
        minute: 0,
        title: '🌙 Night Compline & Examen',
        body: 'End your day in peace. Reflect in gratitude before the Lord.',
        channelId: 'daily_prayers',
        payload: '/prayers',
      );
    }

    debugPrint('All 6 daily Catholic devotional reminders scheduled with exact alarms.');
  }

  RawResourceAndroidNotificationSound? _getSoundForChannel(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return const RawResourceAndroidNotificationSound('angelus_chimes');
      case 'divine_mercy':
        return const RawResourceAndroidNotificationSound('divine_mercy_chime');
      case 'daily_gospel':
        return const RawResourceAndroidNotificationSound('gospel_chime');
      default:
        return null;
    }
  }

  String? _getIosSoundForChannel(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return 'angelus_chimes.wav';
      case 'divine_mercy':
        return 'divine_mercy_chime.wav';
      case 'daily_gospel':
        return 'gospel_chime.wav';
      default:
        return null;
    }
  }

  List<AndroidNotificationAction>? _getActionsForChannel(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return const [
          AndroidNotificationAction(
            'action_pray_angelus',
            '🕊️ Pray Angelus',
            showsUserInterface: true,
          ),
          AndroidNotificationAction(
            'action_snooze_15',
            '⏰ Snooze 15m',
            showsUserInterface: false,
            cancelNotification: true,
          ),
        ];
      case 'divine_mercy':
        return const [
          AndroidNotificationAction(
            'action_pray_chaplet',
            '✝️ Pray Chaplet',
            showsUserInterface: true,
          ),
          AndroidNotificationAction(
            'action_mercy_amen',
            '🙏 Jesus I Trust In You',
            showsUserInterface: false,
            cancelNotification: true,
          ),
        ];
      case 'daily_gospel':
        return const [
          AndroidNotificationAction(
            'action_read_gospel',
            '📖 Read Gospel',
            showsUserInterface: true,
          ),
          AndroidNotificationAction(
            'action_listen_gospel',
            '🎧 Listen',
            showsUserInterface: true,
          ),
          AndroidNotificationAction(
            'action_amen',
            '🙏 Amen',
            showsUserInterface: false,
            cancelNotification: true,
          ),
        ];
      default:
        return null;
    }
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
    // Determine the user's exact local wall-clock target time
    final deviceNow = DateTime.now();
    var targetLocalTime = DateTime(
      deviceNow.year,
      deviceNow.month,
      deviceNow.day,
      hour,
      minute,
    );

    // If the local hour has already passed today, schedule for tomorrow
    if (targetLocalTime.isBefore(deviceNow)) {
      targetLocalTime = targetLocalTime.add(const Duration(days: 1));
    }

    final scheduledDate = tz.TZDateTime.from(targetLocalTime, tz.local);

    String channelName;
    switch (channelId) {
      case 'angelus_bells':
        channelName = 'The Angelus Bells';
        break;
      case 'divine_mercy':
        channelName = 'Hour of Great Mercy';
        break;
      case 'daily_gospel':
        channelName = 'Daily Gospel & Readings';
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

    final sound = _getSoundForChannel(channelId);
    final iosSound = _getIosSoundForChannel(channelId);
    final actions = _getActionsForChannel(channelId);

    await _notifications.zonedSchedule(
      id,
      title,
      body,
      scheduledDate,
      NotificationDetails(
        android: AndroidNotificationDetails(
          channelId,
          channelName,
          importance: Importance.max,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
          sound: sound,
          playSound: true,
          actions: actions,
          styleInformation: BigTextStyleInformation(
            body,
            contentTitle: title,
            summaryText: 'MyPrayerTower Devotion',
          ),
        ),
        iOS: DarwinNotificationDetails(
          sound: iosSound,
          presentSound: true,
          presentAlert: true,
          presentBadge: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time, // Repeat daily at specified time
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

  /// Toggle and save preference for specific notification
  Future<void> setDevotionEnabled(String key, bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, enabled);
    await scheduleAllDailyNotifications();
  }
}

/// Provider for ScheduledNotificationService
final scheduledNotificationServiceProvider =
    Provider<ScheduledNotificationService>((ref) {
  return ScheduledNotificationService();
});
