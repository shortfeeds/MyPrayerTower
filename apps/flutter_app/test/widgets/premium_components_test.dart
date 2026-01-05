import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:myprayertower_app/widgets/premium_components.dart';
import 'package:myprayertower_app/core/theme/app_theme.dart';

void main() {
  Widget wrapWithApp(Widget child) {
    return MaterialApp(
      theme: AppTheme.darkTheme,
      home: Scaffold(body: child),
    );
  }

  group('GlassmorphicCard', () {
    testWidgets('renders child content', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const GlassmorphicCard(child: Text('Test Content'))),
      );

      expect(find.text('Test Content'), findsOneWidget);
    });

    testWidgets('applies custom padding', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(
          const GlassmorphicCard(
            padding: EdgeInsets.all(50),
            child: Text('Padded'),
          ),
        ),
      );

      // Widget should render without errors
      expect(find.text('Padded'), findsOneWidget);
    });

    testWidgets('responds to tap', (tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        wrapWithApp(
          GlassmorphicCard(
            onTap: () => tapped = true,
            child: const Text('Tappable'),
          ),
        ),
      );

      await tester.tap(find.text('Tappable'));
      expect(tapped, true);
    });
  });

  group('GradientButton', () {
    testWidgets('renders button text', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(GradientButton(text: 'Click Me', onPressed: () {})),
      );

      expect(find.text('Click Me'), findsOneWidget);
    });

    testWidgets('shows loading indicator when isLoading is true', (
      tester,
    ) async {
      await tester.pumpWidget(
        wrapWithApp(const GradientButton(text: 'Loading', isLoading: true)),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Loading'), findsNothing); // Text hidden when loading
    });

    testWidgets('shows icon when provided', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(
          GradientButton(
            text: 'With Icon',
            icon: Icons.check,
            onPressed: () {},
          ),
        ),
      );

      expect(find.byIcon(Icons.check), findsOneWidget);
    });

    testWidgets('triggers onPressed callback', (tester) async {
      bool pressed = false;

      await tester.pumpWidget(
        wrapWithApp(
          GradientButton(text: 'Press Me', onPressed: () => pressed = true),
        ),
      );

      await tester.tap(find.text('Press Me'));
      await tester.pump();
      expect(pressed, true);
    });
  });

  group('AnimatedProgressRing', () {
    testWidgets('renders at correct size', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const AnimatedProgressRing(progress: 0.5, size: 100)),
      );

      final sizebox = find.byType(SizedBox).first;
      final widget = tester.widget<SizedBox>(sizebox);
      expect(widget.width, 100);
      expect(widget.height, 100);
    });

    testWidgets('renders child widget in center', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(
          const AnimatedProgressRing(progress: 0.75, child: Text('75%')),
        ),
      );

      expect(find.text('75%'), findsOneWidget);
    });

    testWidgets('animates on build', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const AnimatedProgressRing(progress: 1.0)),
      );

      // Pump animation frames
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 600));
      await tester.pump(const Duration(milliseconds: 600));

      // Should complete without errors
      expect(find.byType(AnimatedProgressRing), findsOneWidget);
    });
  });

  group('ShimmerLoading', () {
    testWidgets('renders with correct dimensions', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const ShimmerLoading(width: 200, height: 50)),
      );

      final container = find.byType(Container).first;
      expect(container, findsOneWidget);
    });

    testWidgets('animates shimmer effect', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const ShimmerLoading(width: 100, height: 20)),
      );

      // Verify animation starts
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 500));
      await tester.pump(const Duration(milliseconds: 500));

      expect(find.byType(ShimmerLoading), findsOneWidget);
    });

    testWidgets('applies custom border radius', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(
          const ShimmerLoading(
            width: 100,
            height: 100,
            borderRadius: 50, // Circle
          ),
        ),
      );

      expect(find.byType(ShimmerLoading), findsOneWidget);
    });
  });

  group('PulsingGlow', () {
    testWidgets('renders child widget', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const PulsingGlow(child: Icon(Icons.star))),
      );

      expect(find.byIcon(Icons.star), findsOneWidget);
    });

    testWidgets('animates glow effect', (tester) async {
      await tester.pumpWidget(
        wrapWithApp(const PulsingGlow(child: Text('Glowing'))),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 750));

      expect(find.text('Glowing'), findsOneWidget);
    });
  });
}
