import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';

/// Service to format and share sacred Catholic scripture, saint quotes, and prayers.
/// Generates elegant formatted share cards for WhatsApp, Instagram, Telegram, and Messages.
class SacredShareService {
  static const String appPlayStoreUrl =
      'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';

  /// Share daily Gospel or scripture reading
  static Future<void> shareScripture({
    required String reference,
    required String text,
    String? title,
  }) async {
    HapticFeedback.lightImpact();
    final buffer = StringBuffer();
    buffer.writeln('✝️ MY PRAYERTOWER • DAILY SCRIPTURE');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (title != null && title.isNotEmpty) {
      buffer.writeln('$title\n');
    }
    buffer.writeln('"$text"');
    buffer.writeln('\n— $reference');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('🕊️ Meditate, pray, and grow closer to God today.');
    buffer.writeln('Download MyPrayerTower App: $appPlayStoreUrl');

    await Share.share(
      buffer.toString(),
      subject: 'Daily Catholic Scripture • $reference',
    );
  }

  /// Share Saint of the Day reflection
  static Future<void> shareSaint({
    required String saintName,
    required String title,
    required String bioOrQuote,
  }) async {
    HapticFeedback.lightImpact();
    final buffer = StringBuffer();
    buffer.writeln('⭐ SAINT OF THE DAY • MY PRAYERTOWER');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln(saintName);
    buffer.writeln('$title\n');
    buffer.writeln('"$bioOrQuote"');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('🙏 Holy Saints of God, pray for us!');
    buffer.writeln('Download MyPrayerTower App: $appPlayStoreUrl');

    await Share.share(
      buffer.toString(),
      subject: 'Saint of the Day • $saintName',
    );
  }

  /// Share a prayer or intention
  static Future<void> sharePrayer({
    required String title,
    required String prayerText,
  }) async {
    HapticFeedback.lightImpact();
    final buffer = StringBuffer();
    buffer.writeln('🙏 CATHOLIC PRAYER • MY PRAYERTOWER');
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('$title\n');
    buffer.writeln(prayerText);
    buffer.writeln('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    buffer.writeln('Amen. ✨');
    buffer.writeln('Pray thousands of Catholic prayers on MyPrayerTower: $appPlayStoreUrl');

    await Share.share(
      buffer.toString(),
      subject: 'Catholic Prayer • $title',
    );
  }
}
