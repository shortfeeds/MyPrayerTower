import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../theme/app_theme.dart';

class ReviewPromptService {
  static const String _appOpensKey = 'review_prompt_app_opens';
  static const String _prayersCountKey = 'review_prompt_prayers_count';
  static const String _lastPromptTimestampKey = 'review_prompt_last_timestamp';
  static const String _hasReviewedKey = 'review_prompt_has_reviewed';

  static const String playStoreMarketUrl =
      'market://details?id=com.myprayertower.myprayertower_app';
  static const String playStoreWebUrl =
      'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app';
  static const String supportEmail = 'mailto:support@myprayertower.com?subject=MyPrayerTower%20Feedback';

  /// Call on app start to increment open count and check if prompt should trigger
  static Future<void> recordAppOpen(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getBool(_hasReviewedKey) ?? false) return;

    final opens = (prefs.getInt(_appOpensKey) ?? 0) + 1;
    await prefs.setInt(_appOpensKey, opens);

    // Prompt on 5th open if eligible
    if (opens == 5) {
      if (context.mounted) {
        showReviewDialog(context);
      }
    }
  }

  /// Call whenever user finishes a prayer, rosary, or reading
  static Future<void> recordPrayerCompleted(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getBool(_hasReviewedKey) ?? false) return;

    final count = (prefs.getInt(_prayersCountKey) ?? 0) + 1;
    await prefs.setInt(_prayersCountKey, count);

    // Prompt on 3rd completed prayer
    if (count == 3 || count == 10) {
      final lastPrompt = prefs.getInt(_lastPromptTimestampKey) ?? 0;
      final daysSince = DateTime.now().difference(DateTime.fromMillisecondsSinceEpoch(lastPrompt)).inDays;
      if (daysSince >= 14 && context.mounted) {
        showReviewDialog(context);
      }
    }
  }

  /// Display the sacred review dialog
  static Future<void> showReviewDialog(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_lastPromptTimestampKey, DateTime.now().millisecondsSinceEpoch);

    if (!context.mounted) return;

    await showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(
            color: AppTheme.gold500.withValues(alpha: 0.4),
            width: 1,
          ),
        ),
        contentPadding: const EdgeInsets.fromLTRB(24, 28, 24, 20),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.gold500.withValues(alpha: 0.15),
                border: Border.all(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                ),
              ),
              child: const Icon(
                LucideIcons.sparkles,
                color: AppTheme.gold400,
                size: 32,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'A Moment of Grace',
              style: GoogleFonts.cinzel(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            Text(
              'Has MyPrayerTower helped bless your daily prayer life and devotion?',
              style: GoogleFonts.inter(
                fontSize: 14,
                color: Colors.white70,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () async {
                  HapticFeedback.lightImpact();
                  await prefs.setBool(_hasReviewedKey, true);
                  if (ctx.mounted) Navigator.pop(ctx);
                  final uri = Uri.parse(playStoreMarketUrl);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri);
                  } else {
                    await launchUrl(Uri.parse(playStoreWebUrl));
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold500,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                icon: const Icon(LucideIcons.star, size: 16),
                label: Text(
                  'Yes, Bless on Play Store',
                  style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () async {
                      if (ctx.mounted) Navigator.pop(ctx);
                      final uri = Uri.parse(supportEmail);
                      if (await canLaunchUrl(uri)) {
                        await launchUrl(uri);
                      }
                    },
                    child: Text(
                      'Send Feedback',
                      style: GoogleFonts.inter(color: Colors.white60, fontSize: 13),
                    ),
                  ),
                ),
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: Text(
                      'Maybe Later',
                      style: GoogleFonts.inter(color: Colors.white38, fontSize: 13),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
