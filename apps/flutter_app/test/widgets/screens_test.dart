import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myprayertower_app/features/donations/screens/donation_screen.dart';
import 'package:myprayertower_app/features/challenges/screens/challenges_screen.dart';
import 'package:myprayertower_app/features/quiz/screens/quiz_screen.dart';
import 'package:myprayertower_app/core/theme/app_theme.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  // Disable Google Fonts network requests in tests
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  Widget wrapWithApp(Widget child) {
    return ProviderScope(
      child: MaterialApp(theme: AppTheme.darkTheme, home: child),
    );
  }

  group('DonationScreen Widget Tests', () {
    testWidgets('renders with correct title', (tester) async {
      await tester.pumpWidget(wrapWithApp(const DonationScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Support Our Mission'), findsOneWidget);
    });

    testWidgets('shows both One-Time and Monthly tabs', (tester) async {
      await tester.pumpWidget(wrapWithApp(const DonationScreen()));
      await tester.pumpAndSettle();

      expect(find.text('One-Time'), findsOneWidget);
      expect(find.text('Monthly'), findsOneWidget);
    });

    testWidgets('displays donation tiers', (tester) async {
      await tester.pumpWidget(wrapWithApp(const DonationScreen()));
      await tester.pumpAndSettle();

      // Check for some tier amounts
      expect(find.textContaining('\$10'), findsWidgets);
      expect(find.textContaining('\$20'), findsWidgets);
    });

    testWidgets('can switch between tabs', (tester) async {
      await tester.pumpWidget(wrapWithApp(const DonationScreen()));
      await tester.pumpAndSettle();

      // Tap Monthly tab
      await tester.tap(find.text('Monthly'));
      await tester.pumpAndSettle();

      // Should show subscription plans
      expect(find.text('Prayer Partner'), findsOneWidget);
    });

    testWidgets('shows custom amount option', (tester) async {
      await tester.pumpWidget(wrapWithApp(const DonationScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Custom'), findsOneWidget);
    });
  });

  group('ChallengesScreen Widget Tests', () {
    testWidgets('renders with correct title', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Challenges'), findsOneWidget);
    });

    testWidgets('shows all three tabs', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Active'), findsOneWidget);
      expect(find.text('Leaderboard'), findsOneWidget);
      expect(find.text('Badges'), findsOneWidget);
    });

    testWidgets('displays points summary', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Your Points'), findsOneWidget);
    });

    testWidgets('displays active challenges', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Active Challenges'), findsOneWidget);
      expect(find.text('Daily Rosary'), findsOneWidget);
    });

    testWidgets('can switch to Leaderboard tab', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Leaderboard'));
      await tester.pumpAndSettle();

      // Should show rank emojis
      expect(find.text('🥇'), findsOneWidget);
      expect(find.text('🥈'), findsOneWidget);
      expect(find.text('🥉'), findsOneWidget);
    });

    testWidgets('can switch to Badges tab', (tester) async {
      await tester.pumpWidget(wrapWithApp(const ChallengesScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Badges'));
      await tester.pumpAndSettle();

      // Should show badge names
      expect(find.text('First Prayer'), findsOneWidget);
    });
  });

  group('QuizScreen Widget Tests', () {
    testWidgets('renders with correct title', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Faith Quiz'), findsOneWidget);
    });

    testWidgets('shows first question', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Question 1/5'), findsOneWidget);
      expect(find.textContaining('sacraments'), findsOneWidget);
    });

    testWidgets('shows answer options', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      // Question 1 options
      expect(find.text('5'), findsOneWidget);
      expect(find.text('6'), findsOneWidget);
      expect(find.text('7'), findsOneWidget);
      expect(find.text('9'), findsOneWidget);
    });

    testWidgets('Check Answer button disabled without selection', (
      tester,
    ) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      final button = find.text('Check Answer');
      expect(button, findsOneWidget);

      // Button should be disabled (ElevatedButton with null onPressed)
      final buttonWidget = tester.widget<ElevatedButton>(
        find.ancestor(of: button, matching: find.byType(ElevatedButton)),
      );
      expect(buttonWidget.onPressed, isNull);
    });

    testWidgets('selecting answer enables Check Answer button', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      // Tap on an answer (option C: 7)
      await tester.tap(find.text('7'));
      await tester.pumpAndSettle();

      // Button should now be enabled
      final button = find.text('Check Answer');
      final buttonWidget = tester.widget<ElevatedButton>(
        find.ancestor(of: button, matching: find.byType(ElevatedButton)),
      );
      expect(buttonWidget.onPressed, isNotNull);
    });

    testWidgets('shows explanation after checking answer', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      // Select correct answer
      await tester.tap(find.text('7'));
      await tester.pumpAndSettle();

      // Check answer
      await tester.tap(find.text('Check Answer'));
      await tester.pumpAndSettle();

      // Should show explanation
      expect(find.textContaining('seven sacraments'), findsOneWidget);
    });

    testWidgets('progresses to next question', (tester) async {
      await tester.pumpWidget(wrapWithApp(const QuizScreen()));
      await tester.pumpAndSettle();

      // Answer first question
      await tester.tap(find.text('7'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Check Answer'));
      await tester.pumpAndSettle();

      // Go to next question
      await tester.tap(find.text('Next Question'));
      await tester.pumpAndSettle();

      expect(find.text('Question 2/5'), findsOneWidget);
    });
  });
}
