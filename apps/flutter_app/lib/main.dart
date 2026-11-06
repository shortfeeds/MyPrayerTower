import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:firebase_core/firebase_core.dart';

import 'app/app.dart';
import 'core/constants/app_constants.dart';
import 'core/services/cache_service.dart';
import 'core/services/notification_service.dart';
import 'core/services/scheduled_notification_service.dart';
import 'features/home_widget/services/home_widget_service.dart';
import 'features/ads/services/ad_service.dart';

void main() async {
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('Flutter Error: ${details.exception}');
  };

  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      // Set preferred orientations & system overlay with full Android 15 Edge-to-Edge compliance
      try {
        await SystemChrome.setPreferredOrientations([
          DeviceOrientation.portraitUp,
          DeviceOrientation.portraitDown,
        ]);

        SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
        SystemChrome.setSystemUIOverlayStyle(
          const SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: Brightness.dark,
            systemNavigationBarColor: Colors.transparent,
            systemNavigationBarContrastEnforced: false,
            systemNavigationBarIconBrightness: Brightness.dark,
          ),
        );
      } catch (e) {
        debugPrint('System UI setup error: $e');
      }

      // Initialize fast local storage (Hive)
      try {
        await Hive.initFlutter();
      } catch (e) {
        debugPrint('Hive initialization error: $e');
      }

      // Initialize Supabase client
      try {
        await Supabase.initialize(
          url: ApiConstants.supabaseUrl,
          anonKey: ApiConstants.supabaseAnonKey,
        );
      } catch (e) {
        debugPrint('Supabase initialization error: $e');
      }

      final container = ProviderContainer();

      // Launch UI instantly so the user has immediate 0ms app start
      runApp(
        UncontrolledProviderScope(
          container: container,
          child: const MyPrayerTowerApp(),
        ),
      );

      // Execute background warming & service setup non-blocking after first frame
      Future.microtask(() async {
        // 1. Prewarm offline Hive boxes (prayers, saints, catechism, api cache)
        try {
          await container.read(cacheServiceProvider).prewarmCaches();
        } catch (e) {
          debugPrint('Cache prewarm error: $e');
        }

        // 2. Initialize Firebase Cloud Messaging & Smart Automated Habit Notifications
        try {
          if (!kIsWeb) {
            await Firebase.initializeApp();
            final notificationService = container.read(
              notificationServiceProvider,
            );
            await notificationService.initialize();

            // Schedule the 6 daily smart engagement reminders
            final scheduledService = container.read(
              scheduledNotificationServiceProvider,
            );
            await scheduledService.initialize();
            await scheduledService.scheduleAllDailyNotifications();
          }
        } catch (e) {
          debugPrint('Firebase/Notification setup skipped: $e');
        }

        // 3. Initialize Google Mobile Ads SDK
        if (!kIsWeb) {
          try {
            await MobileAds.instance.initialize();
            container.read(adServiceProvider).initialize();
          } catch (e) {
            debugPrint('AdMob init error: $e');
          }
        }

        // 4. Initialize Home Widget
        try {
          await HomeWidgetService.initialize();
        } catch (e) {
          debugPrint('HomeWidget setup skipped: $e');
        }
      });
    },
    (error, stackTrace) {
      debugPrint('Uncaught error: $error');
      debugPrint('Stack trace: $stackTrace');
    },
  );
}
