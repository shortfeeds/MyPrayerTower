import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myprayertower_app/features/hymns/screens/hymns_screen.dart';
import 'package:myprayertower_app/features/news/screens/news_screen.dart';
import 'package:myprayertower_app/features/memorials/screens/memorials_screen.dart';
import 'package:myprayertower_app/features/achievements/screens/achievements_screen.dart';
import 'package:myprayertower_app/features/prayer_groups/screens/prayer_groups_screen.dart';
import 'package:myprayertower_app/features/encyclicals/screens/encyclicals_screen.dart';
import 'package:myprayertower_app/features/vatican_ii/screens/vatican_ii_screen.dart';
import 'package:myprayertower_app/features/summa/screens/summa_screen.dart';
import 'package:myprayertower_app/features/hierarchy/screens/hierarchy_screen.dart';
import 'package:myprayertower_app/features/history/screens/history_screen.dart';

void main() {
  testWidgets('Phase 2 Screens Smoke Test', (WidgetTester tester) async {
    // 1. Hymns Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: HymnsScreen())),
    );
    expect(find.text('Hymn Library'), findsOneWidget);
    expect(find.byType(ListView), findsOneWidget);

    // 2. News Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: NewsScreen())),
    );
    expect(find.text('Catholic News'), findsOneWidget);
    expect(find.text('Vatican News'), findsOneWidget);

    // 3. Memorials Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: MemorialsScreen())),
    );
    expect(find.text('Memorials'), findsOneWidget);
    expect(find.text('Visit a Memorial of Remembrance'), findsOneWidget);

    // 4. Achievements Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: AchievementsScreen())),
    );
    expect(find.text('Your Achievements'), findsOneWidget);
    expect(find.text('Prayer Champion'), findsOneWidget);

    // 5. Prayer Groups Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: PrayerGroupsScreen())),
    );
    expect(find.text('Prayer Groups'), findsOneWidget);

    // 6. Encyclicals Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: EncyclicalsScreen())),
    );
    expect(find.text('Papal Encyclicals'), findsOneWidget);

    // 7. Vatican II Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: VaticanIIScreen())),
    );
    expect(find.text('Vatican II'), findsOneWidget);

    // 8. Summa Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: SummaScreen())),
    );
    expect(find.text('Summa Theologica'), findsOneWidget);

    // 9. Hierarchy Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: HierarchyScreen())),
    );
    expect(find.text('Church Hierarchy'), findsOneWidget);

    // 10. History Screen
    await tester.pumpWidget(
      const ProviderScope(child: MaterialApp(home: HistoryScreen())),
    );
    expect(find.text('Church History'), findsOneWidget);
  });
}
