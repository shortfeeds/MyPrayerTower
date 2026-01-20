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

import 'core/services/notification_service.dart';
import 'features/home_widget/services/home_widget_service.dart';
import 'features/ads/services/ad_service.dart';
// import 'firebase_options.dart'; // Removed: File missing and unused (Native config used)

void main() async {
  // Catch all Flutter framework errors
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('Flutter Error: ${details.exception}');
  };

  // Catch all platform/async errors
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      // Set preferred orientations
      try {
        await SystemChrome.setPreferredOrientations([
          DeviceOrientation.portraitUp,
          DeviceOrientation.portraitDown,
        ]);

        SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
        SystemChrome.setSystemUIOverlayStyle(
          const SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: Brightness.light,
            systemNavigationBarColor: Color(0xFF0f172a),
            systemNavigationBarIconBrightness: Brightness.light,
          ),
        );
      } catch (e) {
        debugPrint('System UI setup error: $e');
      }

      // Initialize Supabase
      try {
        await Supabase.initialize(
          url: ApiConstants.supabaseUrl,
          anonKey: ApiConstants.supabaseAnonKey,
        );
        debugPrint('Supabase initialized successfully');
      } catch (e) {
        debugPrint('Supabase initialization error: $e');
      }

      // Initialize Hive for local storage
      try {
        await Hive.initFlutter();
      } catch (e) {
        debugPrint('Hive initialization error: $e');
      }

      // Create Provider Container
      final container = ProviderContainer();

      // Initialize push notifications (Firebase)
      if (!kIsWeb) {
        MobileAds.instance.initialize();
      }
      try {
        if (!kIsWeb) {
          // Initialize Firebase
          // If firebase_options.dart exists, we use it. If not, we rely on native config (google-services.json)
          // Since user provided google-services.json manually, we might not have options.
          try {
            await Firebase.initializeApp(); // Uses Native Config (google-services.json) on Android
          } catch (e) {
            debugPrint('Firebase init failed (Native): $e');
          }

          final notificationService = container.read(
            notificationServiceProvider,
          );
          await notificationService.initialize();
          // Schedule in background
          notificationService.scheduleAllDailyReminders();
        }
      } catch (e) {
        debugPrint('Notification setup skipped: $e');
      }

      // Initialize HomeWidget
      try {
        await HomeWidgetService.initialize();
      } catch (e) {
        debugPrint('HomeWidget setup skipped: $e');
      }

      // Initialize AdService
      if (!kIsWeb) {
        try {
          container.read(adServiceProvider).initialize();
        } catch (e) {
          debugPrint('AdService init error: $e');
        }
      }

      runApp(
        UncontrolledProviderScope(
          container: container,
          child: const MyPrayerTowerApp(),
        ),
      );
    },
    (error, stackTrace) {
      debugPrint('Uncaught error: $error');
      debugPrint('Stack trace: $stackTrace');
    },
  );
}
