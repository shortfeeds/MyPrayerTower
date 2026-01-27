import 'package:flutter/material.dart';

enum LiturgicalSeason { advent, christmas, lent, easter, ordinaryTime, triduum }

class LiturgyUtils {
  static LiturgicalSeason getCurrentSeason() {
    final now = DateTime.now();
    final year = now.year;

    // Simplified calculation for demonstration
    // In a real app, this would use a complex liturgical calculation or an API

    // Lent: Approx 46 days before Easter
    // Easter: Changes every year
    // For now, let's use some hardcoded ranges for 2026

    // Advent 2025: Nov 30 - Dec 24
    // Christmas 2025: Dec 25 - Jan 11 (2026)
    // Ordinary Time: Jan 12 - Feb 17
    // Lent 2026: Feb 18 - April 2
    // Easter 2026: April 5 - May 24

    if (now.isAfter(DateTime(year, 2, 18)) &&
        now.isBefore(DateTime(year, 4, 3))) {
      return LiturgicalSeason.lent;
    }

    if (now.isAfter(DateTime(year, 4, 3)) &&
        now.isBefore(DateTime(year, 5, 25))) {
      return LiturgicalSeason.easter;
    }

    if (now.month == 12 && now.day < 25) {
      return LiturgicalSeason.advent;
    }

    if ((now.month == 12 && now.day >= 25) ||
        (now.month == 1 && now.day <= 11)) {
      return LiturgicalSeason.christmas;
    }

    return LiturgicalSeason.ordinaryTime;
  }

  static Color getSeasonColor(LiturgicalSeason season) {
    switch (season) {
      case LiturgicalSeason.advent:
        return const Color(0xFF4A148C); // Purple
      case LiturgicalSeason.christmas:
        return Colors.white;
      case LiturgicalSeason.lent:
        return const Color(0xFF4A148C); // Purple
      case LiturgicalSeason.easter:
        return Colors.white;
      case LiturgicalSeason.ordinaryTime:
        return const Color(0xFF2E7D32); // Green
      case LiturgicalSeason.triduum:
        return const Color(0xFFB71C1C); // Red
    }
  }

  static String getSeasonName(LiturgicalSeason season) {
    switch (season) {
      case LiturgicalSeason.advent:
        return 'Advent';
      case LiturgicalSeason.christmas:
        return 'Christmas';
      case LiturgicalSeason.lent:
        return 'Lent';
      case LiturgicalSeason.easter:
        return 'Easter';
      case LiturgicalSeason.ordinaryTime:
        return 'Ordinary Time';
      case LiturgicalSeason.triduum:
        return 'The Sacred Triduum';
    }
  }
}
