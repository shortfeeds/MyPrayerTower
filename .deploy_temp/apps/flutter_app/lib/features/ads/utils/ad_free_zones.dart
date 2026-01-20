import 'package:flutter/material.dart';

/// Defines sacred screens where ads should NEVER be shown
class AdFreeZones {
  /// List of route patterns that are considered sacred (no ads)
  static const List<String> sacredRoutes = [
    '/rosary', // Active prayer
    '/bible/', // Bible reading
    '/confession', // Confession guide
    '/mass-offering', // Payment flow
    '/bouquets', // Payment flow
  ];

  /// Check if the current route is ad-free
  static bool isAdFreeZone(String? currentRoute) {
    if (currentRoute == null) return false;
    return sacredRoutes.any((route) => currentRoute.startsWith(route));
  }

  /// Get a widget that only shows child if NOT in an ad-free zone
  static Widget conditionalAd({
    required String currentRoute,
    required Widget child,
  }) {
    if (isAdFreeZone(currentRoute)) {
      return const SizedBox.shrink();
    }
    return child;
  }
}

/// Mixin to add ad-free zone awareness to screens
mixin AdFreeZoneMixin<T extends StatefulWidget> on State<T> {
  bool get isInAdFreeZone {
    final route = ModalRoute.of(context)?.settings.name;
    return AdFreeZones.isAdFreeZone(route);
  }
}
