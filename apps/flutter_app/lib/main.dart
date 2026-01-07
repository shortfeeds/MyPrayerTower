import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import 'app/app.dart';
import 'core/constants/app_constants.dart';
import 'core/services/seeding_service.dart';
import 'core/services/notification_service.dart';

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

      // Initialize AdMob safely
      try {
        await MobileAds.instance.initialize();
      } catch (e) {
        debugPrint('AdMob initialization skipped: $e');
      }

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
      } catch (e) {
        debugPrint('Supabase initialization error: $e');
      }

      // Seed Data (Safe to run repeatedly) - skip on error
      try {
        final seedingService = SeedingService(Supabase.instance.client);
        await seedingService.seedPrayerLibrary();
        await seedingService.seedPrayerWall();
      } catch (e) {
        debugPrint('Seeding skipped: $e');
      }

      // Initialize Hive for local storage
      try {
        await Hive.initFlutter();
      } catch (e) {
        debugPrint('Hive initialization error: $e');
      }

      // Initialize push notifications with scheduled reminders
      try {
        final notificationService = NotificationService();
        await notificationService.initialize();
        await notificationService.scheduleAllDailyReminders();
      } catch (e) {
        debugPrint('Notification setup skipped: $e');
      }

      runApp(const ProviderScope(child: MyPrayerTowerApp()));
    },
    (error, stackTrace) {
      debugPrint('Uncaught error: $error');
      debugPrint('Stack trace: $stackTrace');
    },
  );
}
