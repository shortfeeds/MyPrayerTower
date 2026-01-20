import 'package:home_widget/home_widget.dart';
import 'package:flutter/foundation.dart';

class HomeWidgetService {
  static const String appGroupId =
      'group.com.myprayertower.app'; // For iOS sharing
  static const String androidWidgetName = 'mpt_verse_widget';

  /// Updates the home screen widget with the latest data
  ///
  /// [title] - Usually "Verse of the Day" or "Daily Prayer"
  /// [content] - The actual text content
  /// [subtext] - Reference (e.g., "John 3:16")
  static Future<void> updateWidget({
    required String title,
    required String content,
    String? subtext,
  }) async {
    try {
      // Save data to shared storage
      await HomeWidget.saveWidgetData<String>('widget_title', title);
      await HomeWidget.saveWidgetData<String>('widget_content', content);
      await HomeWidget.saveWidgetData<String>('widget_subtext', subtext ?? '');

      // Update the widget
      await HomeWidget.updateWidget(
        name: androidWidgetName,
        iOSName: 'MPTWidget',
        qualifiedAndroidName: 'com.example.myprayertower.HomeWidgetProvider',
      );

      debugPrint('HomeWidget updated successfully: $title');
    } catch (e) {
      debugPrint('Error updating HomeWidget: $e');
    }
  }

  /// Initialize and potential background work setup
  static Future<void> initialize() async {
    // Determine app group id based on platform if needed
    // await HomeWidget.setAppGroupId(appGroupId);
  }
}
