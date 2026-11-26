import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../core/theme/app_theme.dart';

/// Reusable Sleep Timer Bottom Sheet for Rosary, Chants & Night Prayer audio
class PrayerSleepTimerSheet {
  static void show(
    BuildContext context, {
    required VoidCallback onTimerExpired,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.marianNavySurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(LucideIcons.moon, color: AppTheme.goldLight, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Prayer Audio Sleep Timer',
                    style: GoogleFonts.cinzel(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.goldLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [15, 30, 45, 60].map((mins) {
                  return ActionChip(
                    backgroundColor: Colors.white.withValues(alpha: 0.08),
                    side: BorderSide(color: AppTheme.sacredGold.withValues(alpha: 0.3)),
                    label: Text(
                      '$mins minutes',
                      style: GoogleFonts.inter(
                        color: AppTheme.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    onPressed: () {
                      Timer(Duration(minutes: mins), onTimerExpired);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Sleep timer set for $mins minutes.'),
                          backgroundColor: AppTheme.marianNavySurface,
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
