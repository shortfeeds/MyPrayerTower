import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

/// Model for a single liturgical day
class LiturgicalDay {
  final DateTime date;
  final String name;
  final String grade; // SOLEMNITY, FEAST, MEMORIAL, etc.
  final String color; // WHITE, RED, GREEN, PURPLE, etc.
  final String season; // ADVENT, CHRISTMAS, LENT, EASTER, ORDINARY TIME

  LiturgicalDay({
    required this.date,
    required this.name,
    required this.grade,
    required this.color,
    required this.season,
  });

  factory LiturgicalDay.fromJson(Map<String, dynamic> json) {
    // Parse date from timestamp (milliseconds since epoch)
    final dateMs = json['date'] as int? ?? 0;

    return LiturgicalDay(
      date: DateTime.fromMillisecondsSinceEpoch(dateMs * 1000),
      name: json['name'] as String? ?? 'Unknown',
      grade:
          json['grade_display'] as String? ?? json['grade']?.toString() ?? '',
      color:
          (json['color'] as List<dynamic>?)?.firstOrNull?.toString() ?? 'GREEN',
      season:
          json['season_display'] as String? ??
          json['season']?.toString() ??
          'Ordinary Time',
    );
  }

  /// Get the Flutter Color from liturgical color string
  static int getColorValue(String colorName) {
    switch (colorName.toUpperCase()) {
      case 'WHITE':
        return 0xFFFFFFFF;
      case 'RED':
        return 0xFFDC2626;
      case 'GREEN':
        return 0xFF16A34A;
      case 'PURPLE':
      case 'VIOLET':
        return 0xFF7C3AED;
      case 'ROSE':
        return 0xFFFB7185;
      case 'BLACK':
        return 0xFF1F2937;
      case 'GOLD':
        return 0xFFF59E0B;
      default:
        return 0xFF16A34A; // Default to GREEN
    }
  }
}

/// Repository for fetching Liturgical Calendar data from litcal API
class LiturgicalCalendarRepository {
  final http.Client _client;

  LiturgicalCalendarRepository({http.Client? client})
    : _client = client ?? http.Client();

  /// Fetch liturgical events for a given year
  Future<List<LiturgicalDay>> getCalendarForYear(int year) async {
    try {
      // Using the free litcal API
      // Using the free litcal API
      var urlString =
          'https://litcal.johnromanodorazio.com/api/v3/calendar/$year?nationalcalendar=USA&locale=en';

      // Use CORS proxy for Web
      if (kIsWeb) {
        urlString = 'https://corsproxy.io/?${Uri.encodeComponent(urlString)}';
      }

      final url = Uri.parse(urlString);

      final response = await _client.get(
        url,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // The API returns a 'LitCal' key with events
        final litCal = data['LitCal'] as Map<String, dynamic>?;
        if (litCal == null) return [];

        final events = <LiturgicalDay>[];
        litCal.forEach((key, value) {
          if (value is Map<String, dynamic>) {
            events.add(LiturgicalDay.fromJson(value));
          }
        });

        // Sort by date
        events.sort((a, b) => a.date.compareTo(b.date));
        return events;
      }
    } catch (e) {
      // Log error for debugging
      debugPrint('LitCal API Error: $e');
    }
    return [];
  }

  /// Get today's liturgical day info
  Future<LiturgicalDay?> getToday() async {
    try {
      final now = DateTime.now();
      var urlString =
          'https://litcal.johnromanodorazio.com/api/v3/calendar/${now.year}?nationalcalendar=USA&locale=en';

      if (kIsWeb) {
        urlString = 'https://corsproxy.io/?${Uri.encodeComponent(urlString)}';
      }

      final url = Uri.parse(urlString);

      final response = await _client.get(
        url,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final litCal = data['LitCal'] as Map<String, dynamic>?;
        if (litCal == null) return null;

        // Find today's date

        for (final entry in litCal.entries) {
          final value = entry.value as Map<String, dynamic>;
          final dateMs = value['date'] as int? ?? 0;
          final eventDate = DateTime.fromMillisecondsSinceEpoch(dateMs * 1000);

          if (eventDate.year == now.year &&
              eventDate.month == now.month &&
              eventDate.day == now.day) {
            return LiturgicalDay.fromJson(value);
          }
        }
      }
    } catch (e) {
      debugPrint('LitCal Today Error: $e');
    }
    return null;
  }

  /// Get upcoming feasts (next 30 days)
  Future<List<LiturgicalDay>> getUpcomingFeasts({int daysAhead = 30}) async {
    try {
      final now = DateTime.now();
      final events = await getCalendarForYear(now.year);

      final cutoffDate = now.add(Duration(days: daysAhead));

      return events
          .where((e) {
            return e.date.isAfter(now) &&
                e.date.isBefore(cutoffDate) &&
                (e.grade.contains('SOLEMNITY') ||
                    e.grade.contains('FEAST') ||
                    e.grade.contains('MEMORIAL'));
          })
          .take(10)
          .toList();
    } catch (e) {
      debugPrint('LitCal Upcoming Error: $e');
    }
    return [];
  }
}

// Provider
final liturgicalCalendarRepositoryProvider =
    Provider<LiturgicalCalendarRepository>((ref) {
      return LiturgicalCalendarRepository();
    });

// Today's day provider
final todayLiturgicalDayProvider = FutureProvider<LiturgicalDay?>((ref) async {
  final repo = ref.watch(liturgicalCalendarRepositoryProvider);
  return repo.getToday();
});

// Upcoming feasts provider
final upcomingFeastsProvider = FutureProvider<List<LiturgicalDay>>((ref) async {
  final repo = ref.watch(liturgicalCalendarRepositoryProvider);
  return repo.getUpcomingFeasts();
});
