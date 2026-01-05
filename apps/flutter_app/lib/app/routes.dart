import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Feature screens
import '../features/home/screens/home_screen.dart';
import '../features/prayers/screens/prayers_screen.dart';
import '../features/prayers/screens/prayer_detail_screen.dart';
import '../features/prayers/screens/prayer_list_screen.dart';
import '../features/prayer_wall/screens/prayer_wall_screen.dart';
import '../features/rosary/screens/rosary_screen.dart';
import '../features/readings/screens/readings_screen.dart';
import '../features/saints/screens/saints_screen.dart';
import '../features/saints/screens/saint_detail_screen.dart';
import '../features/candles/screens/candles_screen.dart';
import '../features/candles/screens/light_candle_screen.dart';
import '../features/bible/screens/bible_screen.dart';
import '../features/bible/screens/bible_chapter_screen.dart';
import '../features/subscription/screens/subscription_screen.dart';
import '../features/profile/screens/profile_screen.dart';
import '../features/auth/screens/login_screen.dart';
import '../features/auth/screens/register_screen.dart';
import '../features/auth/screens/onboarding_screen.dart';

import '../features/confession/screens/confession_screen.dart';
import '../features/examen/screens/examen_screen.dart';
import '../features/stations/screens/stations_screen.dart';
import '../features/novenas/screens/novenas_screen.dart';
import '../features/library/screens/library_screen.dart';
import '../features/calendar/screens/calendar_screen.dart';
import '../features/donations/screens/donation_screen.dart';
import '../features/bouquets/screens/spiritual_bouquet_screen.dart';

import '../features/catechism/screens/catechism_screen.dart';
import '../features/challenges/screens/challenges_screen.dart';
import '../features/wallpapers/screens/wallpapers_screen.dart';
import '../features/wallpapers/screens/wallpapers_screen.dart';
import '../features/leaderboard/screens/leaderboard_screen.dart';
import '../features/churches/screens/churches_screen.dart';
import '../features/churches/screens/church_detail_screen.dart';
import '../features/quiz/screens/quiz_screen.dart';
import '../features/settings/screens/notification_settings_screen.dart';
import '../features/mass_offering/screens/mass_offering_screen.dart';
import '../widgets/main_scaffold.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    routes: [
      // Onboarding/Auth routes
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      // Main app with bottom navigation
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(
            path: '/',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: HomeScreen()),
          ),
          GoRoute(
            path: '/prayers',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: PrayersScreen()),
          ),
          GoRoute(
            path: '/prayer-wall',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: PrayerWallScreen()),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ProfileScreen()),
          ),
          GoRoute(
            path: '/confession',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ConfessionScreen()),
          ),
          GoRoute(
            path: '/examen',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ExamenScreen()),
          ),
          GoRoute(
            path: '/stations',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: StationsScreen()),
          ),
          GoRoute(
            path: '/novenas',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: NovenasScreen()),
          ),
          GoRoute(
            path: '/library',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: LibraryScreen()),
          ),
          GoRoute(
            path: '/calendar',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CalendarScreen()),
          ),
          GoRoute(
            path: '/rosary',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: RosaryScreen()),
          ),
          GoRoute(
            path: '/readings',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ReadingsScreen()),
            routes: [
              GoRoute(
                path: 'daily',
                pageBuilder: (context, state) =>
                    const NoTransitionPage(child: ReadingsScreen()),
              ),
            ],
          ),
          GoRoute(
            path: '/saints',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SaintsScreen()),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) =>
                    SaintDetailScreen(saintId: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: '/candles',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CandlesScreen()),
          ),
          GoRoute(
            path: '/bible',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: BibleScreen()),
          ),
          GoRoute(
            path: '/subscription',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SubscriptionScreen()),
          ),
          GoRoute(
            path: '/donate',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: DonationScreen()),
          ),
          GoRoute(
            path: '/bouquets',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SpiritualBouquetScreen()),
          ),
          GoRoute(
            path: '/catechism',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CatechismScreen()),
          ),
          GoRoute(
            path: '/challenges',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ChallengesScreen()),
          ),
          GoRoute(
            path: '/wallpapers',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: WallpapersScreen()),
          ),
          GoRoute(
            path: '/leaderboard',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: LeaderboardScreen()),
          ),
          GoRoute(
            path: '/churches',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ChurchesScreen()),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) =>
                    ChurchDetailScreen(churchId: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: '/quiz',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: QuizScreen()),
          ),
          GoRoute(
            path: '/settings',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: NotificationSettingsScreen()),
          ),
          GoRoute(
            path: '/mass-offering',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: MassOfferingScreen()),
          ),
        ],
      ),

      GoRoute(
        path: '/light-candle',
        pageBuilder: (context, state) => const MaterialPage(
          fullscreenDialog: true,
          child: LightCandleScreen(),
        ),
      ),

      GoRoute(
        path: '/prayer/:id',
        builder: (context, state) =>
            PrayerDetailScreen(prayerId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/prayers/:category',
        builder: (context, state) => PrayerListScreen(
          categoryId: state.pathParameters['category']!,
          categoryName: state.extra as String? ?? 'Prayers',
        ),
      ),
      GoRoute(
        path: '/bible/:book/:chapter',
        builder: (context, state) {
          final book = Uri.decodeComponent(state.pathParameters['book']!);
          final chapter = int.tryParse(state.pathParameters['chapter']!) ?? 1;
          return BibleChapterScreen(bookName: book, chapter: chapter);
        },
      ),
    ],
  );
});
