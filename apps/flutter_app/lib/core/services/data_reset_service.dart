import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter/foundation.dart';

class DataResetService {
  static final List<String> _allBoxes = [
    'novena_progress',
    'spiritual_progress',
    'prayer_journal',
    'favorites',
    'app_cache',
    'achievements',
    'reading_plans',
    'confession_history',
  ];

  static Future<void> resetAllData() async {
    try {
      // Clear specific boxes
      for (final boxName in _allBoxes) {
        if (await Hive.boxExists(boxName)) {
          final box = await Hive.openBox(boxName);
          await box.clear();
          await box.close();
        }
      }

      // Delete from disk for extra safety
      for (final boxName in _allBoxes) {
        try {
          await Hive.deleteBoxFromDisk(boxName);
        } catch (e) {
          debugPrint('Error deleting box $boxName: $e');
        }
      }

      debugPrint('All local data has been reset to nil.');
    } catch (e) {
      debugPrint('Critical error during data reset: $e');
    }
  }
}
