import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Service for handling push notifications
class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// Initialize notification service
  Future<void> initialize() async {
    if (_isInitialized) return;

    // Request permission
    await _requestPermission();

    // Initialize local notifications
    await _initializeLocalNotifications();

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle notification taps
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // Check for initial notification (app opened from terminated state)
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }

    _isInitialized = true;
  }

  /// Request notification permissions
  Future<bool> _requestPermission() async {
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    return settings.authorizationStatus == AuthorizationStatus.authorized;
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

  /// Handle foreground messages
  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    _showLocalNotification(
      title: notification.title ?? 'MyPrayerTower',
      body: notification.body ?? '',
      payload: message.data['route'] as String?,
    );
  }

  /// Handle notification tap (when app is in background)
  void _handleNotificationTap(RemoteMessage message) {
    // TODO: Navigate to appropriate screen based on message.data
    final route = message.data['route'] as String?;
    if (route != null) {
      // Use a navigation callback or state management to navigate
    }
  }

  /// Handle local notification tap
  void _onNotificationTap(NotificationResponse response) {
    final route = response.payload;
    if (route != null) {
      // TODO: Navigate to route
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

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

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

  /// Get FCM token for server-side notifications
  Future<String?> getDeviceToken() async {
    return await _messaging.getToken();
  }

  /// Subscribe to a topic (for targeted notifications)
  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }

  /// Unsubscribe from a topic
  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }

  /// Schedule a local notification
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
    String? payload,
  }) async {
    // For scheduled notifications, consider using flutter_local_notifications
    // with timezone support. This is a simplified version.
    const androidDetails = AndroidNotificationDetails(
      'mpt_scheduled',
      'Scheduled Reminders',
      channelDescription: 'Prayer reminders and daily schedules',
      importance: Importance.high,
      priority: Priority.high,
    );

    const iosDetails = DarwinNotificationDetails();

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    // Note: For proper scheduling, use zonedSchedule with timezone
    // This is a placeholder showing the structure
    await _localNotifications.show(id, title, body, details, payload: payload);
  }

  // Predefined notification types for the app
  // ==================================

  /// Morning prayer reminder (7 AM)
  Future<void> sendMorningPrayerReminder() async {
    await _showLocalNotification(
      title: '🌅 Good Morning!',
      body: 'Start your day with today\'s Gospel reading',
      payload: '/readings',
    );
  }

  /// Angelus reminder (12 PM)
  Future<void> sendAngelusReminder() async {
    await _showLocalNotification(
      title: '🔔 The Angelus',
      body: 'Pause for the Angelus prayer',
      payload: '/prayers',
    );
  }

  /// Evening streak reminder (6 PM)
  Future<void> sendStreakReminder(int currentStreak) async {
    await _showLocalNotification(
      title: '🔥 Don\'t break your streak!',
      body: 'You\'re on a $currentStreak day streak. Open the app to continue!',
      payload: '/',
    );
  }

  /// Night prayer reminder (9 PM)
  Future<void> sendNightPrayerReminder() async {
    await _showLocalNotification(
      title: '🌙 Night Prayer',
      body: 'End your day with Compline',
      payload: '/prayers',
    );
  }

  /// Inactive user re-engagement (after 3 days)
  Future<void> sendReengagementNotification(String saintName) async {
    await _showLocalNotification(
      title: '🙏 We miss you!',
      body: 'Today\'s saint is $saintName. Come back and pray with us!',
      payload: '/saints',
    );
  }
}

/// Provider for NotificationService
final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});
