import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myprayertower_app/app/app.dart';

void main() {
  testWidgets('App should render', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: MyPrayerTowerApp()));

    // Verify the app renders without errors
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
