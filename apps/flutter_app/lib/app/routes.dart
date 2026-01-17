import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Feature screens
import '../features/home/screens/home_screen.dart';
import '../features/offerings/screens/offerings_screen.dart';
import '../features/prayers/screens/prayers_screen.dart';
import '../features/prayers/screens/prayer_detail_screen.dart';
import '../features/prayers/screens/prayer_list_screen.dart';
import '../features/prayer_wall/screens/prayer_wall_screen.dart';
import '../features/rosary/screens/rosary_screen.dart';
import '../features/readings/screens/readings_screen.dart';

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
import '../features/library/screens/canon_law_screen.dart';
import '../features/calendar/screens/calendar_screen.dart';
import '../features/donations/screens/donation_screen.dart';
import '../features/bouquets/screens/spiritual_bouquet_screen.dart';

import '../features/catechism/screens/catechism_screen.dart';
import '../features/challenges/screens/challenges_screen.dart';
import '../features/leaderboard/screens/leaderboard_screen.dart';

// Quiz feature removed
// import '../features/quiz/screens/quiz_screen.dart';

import '../features/settings/screens/settings_screen.dart';
import '../features/mass_offering/screens/mass_offering_screen.dart';

// Phase 1 New Features
import '../features/pilgrimages/screens/pilgrimages_screen.dart';
import '../features/chaplets/screens/chaplets_screen.dart';
import '../features/fasting/screens/fasting_screen.dart';
import '../features/glossary/screens/glossary_screen.dart';

// Phase 2 New Features
import '../features/memorials/screens/memorials_screen.dart';
import '../features/hymns/screens/hymns_screen.dart';
import '../features/news/screens/news_screen.dart';
import '../features/achievements/screens/achievements_screen.dart';

// Phase 3 New Features
import '../features/prayer_groups/screens/prayer_groups_screen.dart';
import '../features/encyclicals/screens/encyclicals_screen.dart';
import '../features/vatican_ii/screens/vatican_ii_screen.dart';
import '../features/summa/screens/summa_screen.dart';
import '../features/hierarchy/screens/hierarchy_screen.dart';
import '../features/hierarchy/screens/hierarchy_screen.dart';
import '../features/history/screens/history_screen.dart';
import '../features/saints/screens/saints_screen.dart';
import '../features/churches/screens/churches_screen.dart';

// Phase 8 New Features
import '../features/sacraments/screens/sacrament_records_screen.dart';
import '../features/certificates/screens/certificates_screen.dart';
import '../features/chant/screens/chant_screen.dart';
import '../features/testimonies/screens/testimonies_screen.dart';

// Phase 9 New Features
import '../features/tracking/screens/year_in_review_screen.dart';
import '../features/tracking/screens/journey_screen.dart';

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
            path: '/offerings',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: OfferingsScreen()),
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
            path: '/leaderboard',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: LeaderboardScreen()),
          ),
          GoRoute(
            path: '/canon_law',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CanonLawScreen()),
          ),

          GoRoute(
            path: '/settings',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SettingsScreen()),
          ),
          GoRoute(
            path: '/mass-offering',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: MassOfferingScreen()),
          ),

          // Phase 1 Routes
          GoRoute(
            path: '/pilgrimages',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: PilgrimagesScreen()),
          ),
          GoRoute(
            path: '/chaplets',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ChapletsScreen()),
          ),
          GoRoute(
            path: '/fasting',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: FastingScreen()),
          ),
          GoRoute(
            path: '/glossary',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: GlossaryScreen()),
          ),

          // Phase 2 Routes
          GoRoute(
            path: '/memorials',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: MemorialsScreen()),
          ),
          GoRoute(
            path: '/saints',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SaintsScreen()),
          ),
          GoRoute(
            path: '/churches',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ChurchesScreen()),
          ),
          GoRoute(
            path: '/hymns',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: HymnsScreen()),
          ),
          GoRoute(
            path: '/news',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: NewsScreen()),
          ),
          GoRoute(
            path: '/achievements',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: AchievementsScreen()),
          ),

          // Phase 3 Routes
          GoRoute(
            path: '/groups',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: PrayerGroupsScreen()),
          ),
          GoRoute(
            path: '/encyclicals',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: EncyclicalsScreen()),
          ),
          GoRoute(
            path: '/vatican-ii',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: VaticanIIScreen()),
          ),
          GoRoute(
            path: '/summa',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SummaScreen()),
          ),
          GoRoute(
            path: '/hierarchy',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: HierarchyScreen()),
          ),
          GoRoute(
            path: '/history',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: HistoryScreen()),
          ),

          // Phase 8 Routes
          GoRoute(
            path: '/sacraments',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: SacramentRecordsScreen()),
          ),
          GoRoute(
            path: '/certificates',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: CertificatesScreen()),
          ),
          GoRoute(
            path: '/chant',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ChantScreen()),
          ),
          GoRoute(
            path: '/testimonies',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: TestimoniesScreen()),
          ),

          // Phase 9 Routes
          GoRoute(
            path: '/year-in-review',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: YearInReviewScreen()),
          ),
          GoRoute(
            path: '/journey',
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: JourneyScreen()),
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
        builder: (context, state) {
          final idString = state.pathParameters['id']!;
          final id = int.tryParse(idString) ?? 0;
          return PrayerDetailScreen(prayerId: id);
        },
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
