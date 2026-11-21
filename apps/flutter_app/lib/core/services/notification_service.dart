import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/routes.dart';
import 'api_service.dart';

/// Top-level background message handler for FCM
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('FCM Background message received: ${message.messageId}');
}

/// Top-level background notification action response handler
@pragma('vm:entry-point')
void notificationTapBackground(NotificationResponse notificationResponse) {
  debugPrint('Notification background action tapped: actionId=${notificationResponse.actionId}, payload=${notificationResponse.payload}');
}

/// Service for handling push notifications (Firebase Cloud Messaging + Local)
class NotificationService {
  final ApiService _apiService;
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  NotificationService(this._apiService);

  /// Initialize notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // 1. Request Permission
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized ||
          settings.authorizationStatus == AuthorizationStatus.provisional) {
        debugPrint('Push Notification permission granted: ${settings.authorizationStatus}');
      } else {
        debugPrint('Push Notification permission denied');
        return;
      }

      // 2. Set background handler
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      // 3. Initialize Local Notifications & Channels
      await _initializeLocalNotifications();

      // 4. Foreground Message Handler
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('FCM Foreground message received: ${message.notification?.title}');

        RemoteNotification? notification = message.notification;
        AndroidNotification? android = message.notification?.android;

        if (notification != null) {
          final channelId = message.data['channelId'] ??
              android?.channelId ??
              'daily_prayers';

          _showLocalNotification(
            title: notification.title ?? 'MyPrayerTower',
            body: notification.body ?? '',
            channelId: channelId,
            payload: message.data['url'] ?? message.data['route'],
          );
        }
      });

      // 5. Handle notification click when app opened from background
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        debugPrint('FCM notification clicked in background: ${message.data}');
        final targetRoute = message.data['route'] ??
            message.data['url'] ??
            message.data['slug'] ??
            '/';
        navigateToNotificationTarget(targetRoute);
      });

      // Check for cold-start initial notification tap
      _fcm.getInitialMessage().then((RemoteMessage? initialMessage) {
        if (initialMessage != null) {
          debugPrint('FCM notification opened app from terminated state: ${initialMessage.data}');
          final targetRoute = initialMessage.data['route'] ??
              initialMessage.data['url'] ??
              initialMessage.data['slug'];
          if (targetRoute != null) {
            navigateToNotificationTarget(targetRoute);
          }
        }
      });

      // 6. Token Check & Device Registration
      await _registerToken();
      _fcm.onTokenRefresh.listen(_registerDevice);

      // 7. Subscribe to default devotional broadcast topics
      await _subscribeToDefaultTopics();

      _isInitialized = true;
    } catch (e) {
      debugPrint('NotificationService initialization failed: $e');
    }
  }

  String _getChannelName(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return 'The Angelus Bells';
      case 'divine_mercy':
        return 'Hour of Great Mercy';
      case 'daily_gospel':
        return 'Daily Gospel & Readings';
      case 'streak_reminders':
        return 'Daily Streak Reminders';
      case 'broadcasts':
        return 'Feast & Pastoral Announcements';
      case 'community_prayers':
        return 'Prayer Wall Echoes';
      case 'daily_prayers':
      default:
        return 'Daily Prayers';
    }
  }

  String _getChannelDescription(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return 'Authentic cathedral bells for morning, noon, and evening Angelus';
      case 'divine_mercy':
        return 'Reverent sacred chime for 3:00 PM Hour of Mercy and Chaplet';
      case 'daily_gospel':
        return 'Monastic chord chime for morning Gospel verses and Scripture';
      case 'streak_reminders':
        return 'Gentle nudges to keep your holy prayer habits alive';
      case 'broadcasts':
        return 'Solemnities, holy days of obligation, and papal prayers';
      case 'community_prayers':
        return 'Notifications when a devotee offers a prayer for your intention';
      case 'daily_prayers':
      default:
        return 'Daily Mass readings, saint meditations, and devotions';
    }
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
      case 'community_prayers':
        return const [
          AndroidNotificationAction(
            'action_pray_back',
            '❤️ Say Amen',
            showsUserInterface: true,
          ),
        ];
      default:
        return null;
    }
  }

  Future<void> _subscribeToDefaultTopics() async {
    try {
      await _fcm.subscribeToTopic('all_users');
      await _fcm.subscribeToTopic('daily_gospel');
      await _fcm.subscribeToTopic('angelus_chimes');
      await _fcm.subscribeToTopic('divine_mercy');
      await _fcm.subscribeToTopic('liturgical_feasts');
      debugPrint('Subscribed to default FCM topics (all_users, daily_gospel, angelus_chimes, divine_mercy, liturgical_feasts)');
    } catch (e) {
      debugPrint('FCM topic subscription warning: $e');
    }
  }

  /// Subscribe to a custom topic (e.g. 'novena_st_jude')
  Future<void> subscribeToTopic(String topic) async {
    try {
      await _fcm.subscribeToTopic(topic);
      debugPrint('Subscribed to topic: $topic');
    } catch (e) {
      debugPrint('Failed to subscribe to topic $topic: $e');
    }
  }

  /// Unsubscribe from a topic
  Future<void> unsubscribeFromTopic(String topic) async {
    try {
      await _fcm.unsubscribeFromTopic(topic);
      debugPrint('Unsubscribed from topic: $topic');
    } catch (e) {
      debugPrint('Failed to unsubscribe from topic $topic: $e');
    }
  }

  Future<void> _registerToken() async {
    try {
      String? token = await _fcm.getToken();
      if (token != null) {
        await _registerDevice(token);
      }
    } catch (e) {
      debugPrint('Failed to get FCM token: $e');
    }
  }

  /// Register device token with backend
  Future<void> _registerDevice(String token) async {
    try {
      if (token.isEmpty) return;
      final platform = kIsWeb
          ? 'web'
          : defaultTargetPlatform.name.toLowerCase();

      await _apiService.post(
        '/notifications/register-device',
        data: {
          'token': token,
          'platform': platform,
          'provider': 'firebase',
          'timezone': DateTime.now().timeZoneName,
          'timezoneOffsetMinutes': DateTime.now().timeZoneOffset.inMinutes,
        },
      );
      debugPrint('FCM Device Registered with Backend: $token');
    } catch (e) {
      debugPrint('Failed to register device: $e');
    }
  }

  /// Initialize local notifications and create all custom audio channels
  Future<void> _initializeLocalNotifications() async {
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

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (details) {
        _handleNotificationResponse(details);
      },
      onDidReceiveBackgroundNotificationResponse: notificationTapBackground,
    );

    // Create high-reverence Android Notification Channels
    final androidPlugin = _localNotifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    if (androidPlugin != null) {
      final channels = [
        const AndroidNotificationChannel(
          'angelus_bells',
          'The Angelus Bells',
          description: 'Authentic cathedral bells for morning, noon, and sunset Angelus',
          importance: Importance.max,
          sound: RawResourceAndroidNotificationSound('angelus_chimes'),
          playSound: true,
        ),
        const AndroidNotificationChannel(
          'divine_mercy',
          'Hour of Great Mercy',
          description: 'Reverent sacred chime for 3:00 PM Hour of Mercy and Chaplet',
          importance: Importance.high,
          sound: RawResourceAndroidNotificationSound('divine_mercy_chime'),
          playSound: true,
        ),
        const AndroidNotificationChannel(
          'daily_gospel',
          'Daily Gospel & Readings',
          description: 'Monastic chord chime for morning Gospel verses and Scripture',
          importance: Importance.high,
          sound: RawResourceAndroidNotificationSound('gospel_chime'),
          playSound: true,
        ),
        const AndroidNotificationChannel(
          'daily_prayers',
          'Daily Prayers',
          description: 'Daily Mass readings, saint meditations, and devotions',
          importance: Importance.high,
        ),
        const AndroidNotificationChannel(
          'streak_reminders',
          'Daily Streak Reminders',
          description: 'Gentle nudges to keep your holy prayer habits alive',
          importance: Importance.high,
        ),
        const AndroidNotificationChannel(
          'broadcasts',
          'Feast & Pastoral Announcements',
          description: 'Solemnities, holy days of obligation, and papal prayers',
          importance: Importance.high,
        ),
        const AndroidNotificationChannel(
          'community_prayers',
          'Prayer Wall Echoes',
          description: 'Notifications when a devotee prays for your intention',
          importance: Importance.high,
        ),
      ];

      for (final channel in channels) {
        await androidPlugin.createNotificationChannel(channel);
      }
    }
  }

  void _handleNotificationResponse(NotificationResponse details) {
    final actionId = details.actionId;
    final payload = details.payload;
    debugPrint('Notification tapped: actionId=$actionId, payload=$payload');

    if (actionId == 'action_snooze_15') {
      // Reschedule Angelus for 15 minutes from now
      Future.delayed(const Duration(minutes: 15), () {
        _showLocalNotification(
          title: '🔔 The Angelus',
          body: 'The Angel of the Lord declared unto Mary...',
          channelId: 'angelus_bells',
          payload: '/prayers',
        );
      });
      return;
    }

    if (actionId == 'action_amen' || actionId == 'action_mercy_amen') {
      debugPrint('Devotee affirmed Amen to devotional notification');
      return;
    }

    // Action button targeted deep linking
    if (actionId == 'action_read_gospel' || actionId == 'action_listen_gospel') {
      navigateToNotificationTarget('/readings');
      return;
    }
    if (actionId == 'action_pray_angelus') {
      navigateToNotificationTarget('/prayers');
      return;
    }
    if (actionId == 'action_pray_chaplet') {
      navigateToNotificationTarget('/chaplets');
      return;
    }
    if (actionId == 'action_pray_back') {
      navigateToNotificationTarget('/prayer-wall');
      return;
    }

    // Direct notification tap routing
    if (payload != null && payload.isNotEmpty) {
      navigateToNotificationTarget(payload);
    }
  }

  // Predefined notification methods
  Future<void> sendMorningPrayerReminder() async {
    await _showLocalNotification(
      title: '🌅 Good Morning!',
      body: 'Start your day with today\'s Gospel reading & meditation',
      channelId: 'daily_gospel',
      payload: '/readings',
    );
  }

  Future<void> sendAngelusReminder() async {
    await _showLocalNotification(
      title: '🔔 The Angelus',
      body: 'The Angel of the Lord declared unto Mary. And she conceived of the Holy Spirit.',
      channelId: 'angelus_bells',
      payload: '/prayers',
    );
  }

  Future<void> sendDivineMercyReminder() async {
    await _showLocalNotification(
      title: '✝️ Hour of Great Mercy (3:00 PM)',
      body: 'For the sake of His sorrowful Passion, have mercy on us and on the whole world.',
      channelId: 'divine_mercy',
      payload: '/chaplets',
    );
  }

  Future<void> sendNightPrayerReminder() async {
    await _showLocalNotification(
      title: '🌙 Night Prayer',
      body: 'End your day in peace with Compline',
      channelId: 'daily_prayers',
      payload: '/prayers',
    );
  }

  Future<void> sendStreakReminder(int currentStreak) async {
    await _showLocalNotification(
      title: '🔥 Don\'t break your streak!',
      body: 'You\'re on a $currentStreak day streak. Offer a quick prayer to keep it alive!',
      channelId: 'streak_reminders',
      payload: '/',
    );
  }

  Future<void> scheduleAllDailyReminders() async {
    await _localNotifications.cancelAll();
    debugPrint('Cleared all daily local reminders');
  }

  Future<void> _showLocalNotification({
    required String title,
    required String body,
    String channelId = 'daily_prayers',
    String? payload,
  }) async {
    final sound = _getSoundForChannel(channelId);
    final iosSound = _getIosSoundForChannel(channelId);
    final actions = _getActionsForChannel(channelId);

    final androidDetails = AndroidNotificationDetails(
      channelId,
      _getChannelName(channelId),
      channelDescription: _getChannelDescription(channelId),
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
    );
    final details = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        sound: iosSound,
        presentSound: true,
        presentAlert: true,
        presentBadge: true,
      ),
    );
    await _localNotifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      details,
      payload: payload,
    );
  }
}

/// Provider for NotificationService
final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService(ref.read(apiServiceProvider));
});
