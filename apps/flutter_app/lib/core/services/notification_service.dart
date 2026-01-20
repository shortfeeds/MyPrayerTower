import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

/// Service for handling push notifications (Local + Firebase)
class NotificationService {
  final ApiService _apiService;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  NotificationService(this._apiService);

  /// Initialize notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // 1. Firebase Messaging Initialization
      final messaging = FirebaseMessaging.instance;

      // Request permission
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      debugPrint('User granted permission: ${settings.authorizationStatus}');

      // Get Token
      final token = await messaging.getToken();
      if (token != null) {
        _registerDevice(token);
      }

      // Refresh Token Listener
      messaging.onTokenRefresh.listen(_registerDevice);

      // Foreground Message Handler
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('Got a message whilst in the foreground!');
        debugPrint('Message data: ${message.data}');

        if (message.notification != null) {
          debugPrint(
            'Message also contained a notification: ${message.notification}',
          );
          _showLocalNotification(
            title: message.notification!.title ?? 'Notification',
            body: message.notification!.body ?? '',
            payload: message.data['route'] ?? message.data['screen'],
          );
        }
      });

      // 2. Initialize local notifications
      await _initializeLocalNotifications();

      _isInitialized = true;
    } catch (e) {
      debugPrint('NotificationService initialization failed: $e');
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
        data: {'token': token, 'platform': platform},
      );
      debugPrint('Firebase Device Registered: $token');
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
      requestAlertPermission: false, // Handled by Firebase
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
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

  /// Handle local notification tap
  void _onNotificationTap(NotificationResponse response) {
    final route = response.payload;
    if (route != null) {
      debugPrint('Local notification tapped: $route');
      // Navigation logic would go here
    }
  }

  /// Show a local notification
  Future<void> _showLocalNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'mpt_default',
      'MyPrayerTower Notifications',
      channelDescription: 'Daily prayers, readings, and reminders',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );

    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      details,
      payload: payload,
    );
  }

  /// Schedule a local notification
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'mpt_scheduled',
      'Scheduled Reminders',
      channelDescription: 'Prayer reminders and daily schedules',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(id, title, body, details, payload: payload);
  }

  // Predefined notification types
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

  Future<void> sendStreakReminder(int currentStreak) async {
    await _showLocalNotification(
      title: '🔥 Don\'t break your streak!',
      body: 'You\'re on a $currentStreak day streak. Open the app to continue!',
      payload: '/',
    );
  }

  Future<void> sendNightPrayerReminder() async {
    await _showLocalNotification(
      title: '🌙 Night Prayer',
      body: 'End your day with Compline',
      payload: '/prayers',
    );
  }

  Future<void> sendReengagementNotification(String saintName) async {
    await _showLocalNotification(
      title: '🙏 We miss you!',
      body: 'Today\'s saint is $saintName. Come back and pray with us!',
      payload: '/saints',
    );
  }

  Future<void> scheduleAllDailyReminders() async {
    await _localNotifications.cancelAll();
    debugPrint('Scheduled all daily prayer reminders (Local Only)');
  }
}

/// Provider for NotificationService
final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService(ref.read(apiServiceProvider));
});
