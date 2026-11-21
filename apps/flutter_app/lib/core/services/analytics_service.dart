import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

/// Service to track screen views and user actions across Android app
class AnalyticsService {
  static const String _gaMeasurementId = 'G-XHPBKVZBZH';
  static const String _clientIdKey = 'mpt_analytics_client_id';
  String? _clientId;

  AnalyticsService() {
    _initClientId();
  }

  Future<void> _initClientId() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _clientId = prefs.getString(_clientIdKey);
      if (_clientId == null) {
        _clientId = 'mpt_mob_${DateTime.now().millisecondsSinceEpoch}_${(1000 + (DateTime.now().microsecond % 9000))}';
        await prefs.setString(_clientIdKey, _clientId!);
      }
    } catch (_) {
      _clientId = 'mpt_guest_${DateTime.now().millisecondsSinceEpoch}';
    }
  }

  /// Track a screen view (e.g. "Holy Rosary", "Prayer Wall", "Daily Gospel")
  Future<void> trackScreenView(String screenName, {String? screenClass}) async {
    debugPrint('[Analytics] Screen View: $screenName ($screenClass)');

    if (_clientId == null) {
      await _initClientId();
    }

    // 1. Send to Backend Telemetry / Database
    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}/analytics/track');
      http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'eventType': 'screen_view',
          'screenName': screenName,
          'screenClass': screenClass ?? screenName,
          'clientId': _clientId,
          'platform': defaultTargetPlatform.name.toLowerCase(),
          'timestamp': DateTime.now().toIso8601String(),
        }),
      ).timeout(const Duration(seconds: 4)).ignore();
    } catch (e) {
      debugPrint('[Analytics] Backend logging note: $e');
    }

    // 2. Send to Google Analytics 4 (GA4 Measurement Hit)
    try {
      final gaUrl = Uri.parse(
        'https://www.google-analytics.com/g/collect?v=2&tid=$_gaMeasurementId&cid=$_clientId&en=screen_view&ep.screen_name=${Uri.encodeComponent(screenName)}&ep.platform=android',
      );
      http.get(gaUrl).timeout(const Duration(seconds: 4)).ignore();
    } catch (e) {
      debugPrint('[Analytics] GA4 hit note: $e');
    }
  }

  /// Track a high-intent devotional event
  Future<void> trackEvent(String eventName, {Map<String, dynamic>? parameters}) async {
    debugPrint('[Analytics] Event: $eventName $parameters');

    if (_clientId == null) {
      await _initClientId();
    }

    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}/analytics/track');
      http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'eventType': eventName,
          'parameters': parameters ?? {},
          'clientId': _clientId,
          'platform': defaultTargetPlatform.name.toLowerCase(),
          'timestamp': DateTime.now().toIso8601String(),
        }),
      ).timeout(const Duration(seconds: 4)).ignore();
    } catch (_) {}
  }
}

/// Provider for AnalyticsService
final analyticsServiceProvider = Provider<AnalyticsService>((ref) {
  return AnalyticsService();
});

/// Navigation observer for GoRouter to automatically log all screen views
class AnalyticsRouteObserver extends NavigatorObserver {
  final AnalyticsService _analytics;

  AnalyticsRouteObserver(this._analytics);

  String _formatRouteName(Route<dynamic>? route) {
    if (route == null) return 'Unknown Screen';
    final name = route.settings.name ?? route.settings.toString();
    if (name.isEmpty || name == '/') return 'Home Sanctuary';

    // Format clean readable screen names
    final clean = name.replaceAll('/', ' ').trim();
    if (clean.isEmpty) return 'Home Sanctuary';

    return clean
        .split(' ')
        .map((w) => w.isNotEmpty ? '${w[0].toUpperCase()}${w.substring(1)}' : '')
        .join(' ');
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    final screenName = _formatRouteName(route);
    _analytics.trackScreenView(screenName, screenClass: route.runtimeType.toString());
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    if (newRoute != null) {
      final screenName = _formatRouteName(newRoute);
      _analytics.trackScreenView(screenName, screenClass: newRoute.runtimeType.toString());
    }
  }
}

/// Provider for the route observer
final analyticsObserverProvider = Provider<AnalyticsRouteObserver>((ref) {
  final analytics = ref.watch(analyticsServiceProvider);
  return AnalyticsRouteObserver(analytics);
});
