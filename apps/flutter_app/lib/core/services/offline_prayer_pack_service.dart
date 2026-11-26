import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

/// Caches Today's Readings and Saint of the Day for offline Church Pew / Travel mode
class OfflinePrayerPackService {
  static const String _readingsCacheKey = 'mpt_offline_readings';
  static const String _saintCacheKey = 'mpt_offline_saint';
  static const String _lastSyncedKey = 'mpt_offline_pack_synced_at';

  static Future<bool> downloadOfflinePack() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final results = await Future.wait([
        http
            .get(Uri.parse('${ApiConstants.baseUrl}/readings/today'))
            .timeout(const Duration(seconds: 8)),
        http
            .get(Uri.parse('${ApiConstants.baseUrl}/saints/today'))
            .timeout(const Duration(seconds: 8)),
      ]);

      if (results[0].statusCode == 200) {
        await prefs.setString(_readingsCacheKey, results[0].body);
      }
      if (results[1].statusCode == 200) {
        await prefs.setString(_saintCacheKey, results[1].body);
      }
      await prefs.setString(_lastSyncedKey, DateTime.now().toIso8601String());
      return true;
    } catch (_) {
      return false;
    }
  }

  static Future<String?> getLastSyncedLabel() async {
    final prefs = await SharedPreferences.getInstance();
    final iso = prefs.getString(_lastSyncedKey);
    if (iso == null) return null;
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.month}/${dt.day} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getCachedReadings() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_readingsCacheKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }
}
