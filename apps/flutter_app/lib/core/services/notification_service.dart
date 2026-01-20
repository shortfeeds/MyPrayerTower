import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

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
      // 1. Request Permission (iOS/Web)
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        debugPrint('User granted permission');
      } else if (settings.authorizationStatus ==
          AuthorizationStatus.provisional) {
        debugPrint('User granted provisional permission');
      } else {
        debugPrint('User declined or has not accepted permission');
        return;
      }

      // 2. Foreground Message Handler
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('Got a message whilst in the foreground!');

        RemoteNotification? notification = message.notification;
        AndroidNotification? android = message.notification?.android;

        // If `onMessage` is triggered with a notification, construct our own
        // local notification to show to users using the created channel.
        if (notification != null && android != null) {
          _localNotifications.show(
            notification.hashCode,
            notification.title,
            notification.body,
            NotificationDetails(
              android: AndroidNotificationDetails(
                'mpt_default',
                'MyPrayerTower Notifications',
                channelDescription: 'Daily prayers, readings, and reminders',
                importance: Importance.high,
                priority: Priority.high,
                icon: '@mipmap/ic_launcher',
              ),
              iOS: const DarwinNotificationDetails(
                presentAlert: true,
                presentBadge: true,
                presentSound: true,
              ),
            ),
          );
        }
      });

      // 3. Token Check
      await _registerToken();
      _fcm.onTokenRefresh.listen(_registerDevice);

      // 4. Initialize Local Notifications (for scheduling & foreground display)
      await _initializeLocalNotifications();

      _isInitialized = true;
    } catch (e) {
      debugPrint('NotificationService initialization failed: $e');
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
          'provider': 'firebase', // Implicitly handled by backend logic usually
        },
      );
      debugPrint('FCM Device Registered: $token');
    } catch (e) {
      debugPrint('Failed to register device: $e');
    }
  }

  /// Initialize local notifications for foreground display
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
        // Handle local tap
      },
    );

    // Create notification channel for Android
    const androidChannel = AndroidNotificationChannel(
      'mpt_default',
      'MyPrayerTower Notifications',
      description: 'Daily prayers, readings, and reminders',
      importance: Importance.high,
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >()
        ?.createNotificationChannel(androidChannel);
  }

  // Predefined notification types (Local Logic remains same)
  Future<void> sendMorningPrayerReminder() async {
    await _showLocalNotification(
      title: '🌅 Good Morning!',
      body: 'Start your day with today\'s Gospel reading',
      payload: '/readings',
    );
  }

  Future<void> sendAngelusReminder() async {
    await _showLocalNotification(
      title: '🔔 The Angelus',
      body: 'Pause for the Angelus prayer',
      payload: '/prayers',
    );
  }

  Future<void> sendNightPrayerReminder() async {
    await _showLocalNotification(
      title: '🌙 Night Prayer',
      body: 'End your day with Compline',
      payload: '/prayers',
    );
  }

  Future<void> sendStreakReminder(int currentStreak) async {
    await _showLocalNotification(
      title: '🔥 Don\'t break your streak!',
      body: 'You\'re on a $currentStreak day streak. Open the app to continue!',
      payload: '/',
    );
  }

  Future<void> scheduleAllDailyReminders() async {
    await _localNotifications.cancelAll();
    debugPrint('Scheduled all daily prayer reminders (Local Only)');
  }

  Future<void> _showLocalNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'mpt_default',
      'MyPrayerTower Notifications',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );
    const details = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(),
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
