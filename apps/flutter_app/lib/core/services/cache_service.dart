import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

class CacheService {
  static const String libraryBox = 'library_cache';
  static const String prayersBox = 'prayers_cache';
  static const String saintsBox = 'saints_cache';

  Future<void> cacheData(String boxName, String key, dynamic data) async {
    try {
      final box = await Hive.openBox(boxName);
      await box.put(key, data);
    } catch (e) {
      // Fail silently on cache write error
      debugPrint('Cache write error: $e');
    }
  }

  Future<dynamic> getCachedData(String boxName, String key) async {
    try {
      final box = await Hive.openBox(boxName);
      return box.get(key);
    } catch (e) {
      debugPrint('Cache read error: $e');
      return null;
    }
  }

  Future<void> clearCache(String boxName) async {
    try {
      if (await Hive.boxExists(boxName)) {
        final box = await Hive.openBox(boxName);
        await box.clear();
      }
    } catch (e) {
      debugPrint('Cache clear error: $e');
    }
  }
}

final cacheServiceProvider = Provider<CacheService>((ref) => CacheService());
