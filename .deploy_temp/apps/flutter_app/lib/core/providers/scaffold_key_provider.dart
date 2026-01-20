import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Global scaffold key provider for accessing drawer from anywhere
final scaffoldKeyProvider = Provider<GlobalKey<ScaffoldState>>((ref) {
  return GlobalKey<ScaffoldState>();
});

/// Extension method to open drawer from any context with Riverpod
extension ScaffoldKeyExtension on WidgetRef {
  void openDrawer() {
    read(scaffoldKeyProvider).currentState?.openDrawer();
  }

  void closeDrawer() {
    read(scaffoldKeyProvider).currentState?.closeDrawer();
  }
}
