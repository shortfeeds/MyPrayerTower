import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app_theme.dart';
import '../../features/calendar/repositories/liturgical_calendar_repository.dart';

/// Season descriptor for UI accents
class LiturgicalSeasonInfo {
  final String seasonName;
  final String seasonDisplay;
  final Color primaryColor;
  final Color secondaryColor;
  final Color surfaceTint;
  final String icon;
  final String latinName;

  const LiturgicalSeasonInfo({
    required this.seasonName,
    required this.seasonDisplay,
    required this.primaryColor,
    required this.secondaryColor,
    required this.surfaceTint,
    required this.icon,
    required this.latinName,
  });

  static const LiturgicalSeasonInfo ordinaryTime = LiturgicalSeasonInfo(
    seasonName: 'ORDINARY_TIME',
    seasonDisplay: 'Ordinary Time',
    primaryColor: Color(0xFF059669), // Sacred Emerald
    secondaryColor: Color(0xFF10B981),
    surfaceTint: Color(0x1A059669),
    icon: '🌿',
    latinName: 'Tempus per annum',
  );

  static const LiturgicalSeasonInfo advent = LiturgicalSeasonInfo(
    seasonName: 'ADVENT',
    seasonDisplay: 'Season of Advent',
    primaryColor: Color(0xFF7C3AED), // Royal Liturgical Violet
    secondaryColor: Color(0xFF8B5CF6),
    surfaceTint: Color(0x1A7C3AED),
    icon: '🕯️',
    latinName: 'Tempus Adventus',
  );

  static const LiturgicalSeasonInfo christmas = LiturgicalSeasonInfo(
    seasonName: 'CHRISTMAS',
    seasonDisplay: 'Christmas Season',
    primaryColor: AppTheme.sacredGold,
    secondaryColor: Color(0xFFFFDF7A),
    surfaceTint: Color(0x20D4AF37),
    icon: '⭐',
    latinName: 'Tempus Nativitatis',
  );

  static const LiturgicalSeasonInfo lent = LiturgicalSeasonInfo(
    seasonName: 'LENT',
    seasonDisplay: 'Season of Lent',
    primaryColor: Color(0xFF6B21A8), // Deep Penitential Purple
    secondaryColor: Color(0xFF9333EA),
    surfaceTint: Color(0x1A6B21A8),
    icon: '✝️',
    latinName: 'Quadragesima',
  );

  static const LiturgicalSeasonInfo easter = LiturgicalSeasonInfo(
    seasonName: 'EASTER',
    seasonDisplay: 'Easter Season',
    primaryColor: Color(0xFFD97706), // Radiant Paschal Gold
    secondaryColor: Color(0xFFFCD34D),
    surfaceTint: Color(0x22F59E0B),
    icon: '🕊️',
    latinName: 'Tempus Paschale',
  );

  static const LiturgicalSeasonInfo martyrFeast = LiturgicalSeasonInfo(
    seasonName: 'MARTYR_RED',
    seasonDisplay: 'Feast of the Apostles & Martyrs',
    primaryColor: Color(0xFFDC2626), // Martyr Red
    secondaryColor: Color(0xFFEF4444),
    surfaceTint: Color(0x1ADC2626),
    icon: '🔥',
    latinName: 'Sancti Martyres',
  );

  static const LiturgicalSeasonInfo gaudeteRose = LiturgicalSeasonInfo(
    seasonName: 'ROSE',
    seasonDisplay: 'Gaudete / Laetare Sunday',
    primaryColor: Color(0xFFDB2777), // Rose
    secondaryColor: Color(0xFFF472B6),
    surfaceTint: Color(0x1ADB2777),
    icon: '🌸',
    latinName: 'Gaudete in Domino',
  );
}

/// Provider supplying current Liturgical Season theme information dynamically
final liturgicalThemeProvider = Provider<LiturgicalSeasonInfo>((ref) {
  final todayAsync = ref.watch(todayLiturgicalDayProvider);

  return todayAsync.maybeWhen(
    data: (litDay) {
      if (litDay != null) {
        final color = litDay.color.toUpperCase();
        final season = litDay.season.toUpperCase();

        if (color == 'ROSE') return LiturgicalSeasonInfo.gaudeteRose;
        if (color == 'RED') return LiturgicalSeasonInfo.martyrFeast;
        if (color == 'WHITE' || color == 'GOLD') {
          if (season.contains('CHRISTMAS')) {
            return LiturgicalSeasonInfo.christmas;
          }
          if (season.contains('EASTER')) return LiturgicalSeasonInfo.easter;
          return LiturgicalSeasonInfo.christmas; // Solemnities use Gold/White
        }
        if (color == 'PURPLE' || color == 'VIOLET') {
          if (season.contains('LENT')) return LiturgicalSeasonInfo.lent;
          return LiturgicalSeasonInfo.advent;
        }
        return LiturgicalSeasonInfo.ordinaryTime;
      }
      return _calculateDefaultSeasonByDate(DateTime.now());
    },
    orElse: () => _calculateDefaultSeasonByDate(DateTime.now()),
  );
});

/// Smart local fallback based on Gregorian calendar rules
LiturgicalSeasonInfo _calculateDefaultSeasonByDate(DateTime now) {
  final month = now.month;
  final day = now.day;

  // Christmas (Dec 25 - Jan 10)
  if ((month == 12 && day >= 25) || (month == 1 && day <= 10)) {
    return LiturgicalSeasonInfo.christmas;
  }

  // Advent (late Nov / Dec until Dec 24)
  if (month == 12 && day < 25) {
    return LiturgicalSeasonInfo.advent;
  }
  if (month == 11 && day >= 27 && now.weekday == DateTime.sunday) {
    return LiturgicalSeasonInfo.advent;
  }

  // Lent (typically late Feb / March / early April)
  if (month == 3 || (month == 2 && day >= 15) || (month == 4 && day <= 10)) {
    return LiturgicalSeasonInfo.lent;
  }

  // Easter Season (typically mid April through May)
  if ((month == 4 && day > 10) || month == 5) {
    return LiturgicalSeasonInfo.easter;
  }

  // Default: Ordinary Time
  return LiturgicalSeasonInfo.ordinaryTime;
}
