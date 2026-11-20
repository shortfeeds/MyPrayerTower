import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

/// Top-level background message handler for FCM
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('FCM Background message received: ${message.messageId}');
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
          final isAngelus = channelId == 'angelus_bells';

          _localNotifications.show(
            notification.hashCode,
            notification.title,
            notification.body,
            NotificationDetails(
              android: AndroidNotificationDetails(
                channelId,
                _getChannelName(channelId),
                channelDescription: _getChannelDescription(channelId),
                importance: Importance.high,
                priority: Priority.high,
                icon: '@mipmap/ic_launcher',
                sound: isAngelus
                    ? const RawResourceAndroidNotificationSound('angelus_chimes')
                    : null,
                playSound: true,
              ),
              iOS: DarwinNotificationDetails(
                presentAlert: true,
                presentBadge: true,
                presentSound: true,
                sound: isAngelus ? 'angelus_chimes.wav' : null,
              ),
            ),
            payload: message.data['url'] ?? message.data['route'],
          );
        }
      });

      // 5. Handle notification click when app opened from background
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        debugPrint('FCM notification clicked in background: ${message.data}');
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
      case 'streak_reminders':
        return 'Daily Streak Reminders';
      case 'broadcasts':
        return 'Feast & Pastoral Announcements';
      case 'community_prayers':
        return 'Prayer Wall Echoes';
      case 'daily_prayers':
      default:
        return 'Daily Prayers & Gospel';
    }
  }

  String _getChannelDescription(String channelId) {
    switch (channelId) {
      case 'angelus_bells':
        return 'Authentic bells for morning, noon, and evening Angelus';
      case 'streak_reminders':
        return 'Gentle nudges to keep your holy prayer habits alive';
      case 'broadcasts':
        return 'Solemnities, holy days of obligation, and papal prayers';
      case 'community_prayers':
        return 'Notifications when a devotee prays for your intention';
      case 'daily_prayers':
      default:
        return 'Daily Mass readings, Gospel verses, and saint meditations';
    }
  }

  Future<void> _subscribeToDefaultTopics() async {
    try {
      await _fcm.subscribeToTopic('all_users');
      await _fcm.subscribeToTopic('daily_gospel');
      await _fcm.subscribeToTopic('angelus_chimes');
      await _fcm.subscribeToTopic('liturgical_feasts');
      debugPrint('Subscribed to default FCM topics (all_users, daily_gospel, angelus_chimes, liturgical_feasts)');
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
        debugPrint('Notification clicked with payload: ${details.payload}');
      },
    );

    // Create high-reverence Android Notification Channels
    final androidPlugin = _localNotifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    if (androidPlugin != null) {
      final channels = [
        const AndroidNotificationChannel(
          'daily_prayers',
          'Daily Prayers & Gospel',
          description: 'Daily Mass readings, Gospel verses, and saint meditations',
          importance: Importance.high,
        ),
        const AndroidNotificationChannel(
          'angelus_bells',
          'The Angelus Bells',
          description: 'Authentic church bells for morning, noon, and sunset Angelus',
          importance: Importance.high,
          sound: RawResourceAndroidNotificationSound('angelus_chimes'),
          playSound: true,
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

  // Predefined notification methods
  Future<void> sendMorningPrayerReminder() async {
    await _showLocalNotification(
      title: '🌅 Good Morning!',
      body: 'Start your day with today\'s Gospel reading',
      channelId: 'daily_prayers',
      payload: '/readings',
    );
  }

  Future<void> sendAngelusReminder() async {
    await _showLocalNotification(
      title: '🔔 The Angelus',
      body: 'The Angel of the Lord declared unto Mary...',
      channelId: 'angelus_bells',
      payload: '/prayers',
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
      body: 'You\'re on a $currentStreak day streak. Open the app to continue!',
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
    final isAngelus = channelId == 'angelus_bells';
    final androidDetails = AndroidNotificationDetails(
      channelId,
      _getChannelName(channelId),
      channelDescription: _getChannelDescription(channelId),
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      sound: isAngelus
          ? const RawResourceAndroidNotificationSound('angelus_chimes')
          : null,
      playSound: true,
    );
    final details = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        sound: isAngelus ? 'angelus_chimes.wav' : null,
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
