import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../liturgy/liturgy_provider.dart';

enum SacredThemeStyle {
  vaticanAlabaster, // Style 1: Vatican Alabaster & Monastic Scriptorium
  midnightCathedral, // Style 2: Midnight Cathedral & Marian Nocturne
}

final sacredThemeStyleProvider = StateProvider<SacredThemeStyle>((ref) {
  // Default to Style 1 as chosen by the user
  return SacredThemeStyle.vaticanAlabaster;
});

final themeProvider = Provider<ThemeData>((ref) {
  final seasonalColor = ref.watch(liturgicalColorProvider);
  final style = ref.watch(sacredThemeStyleProvider);

  switch (style) {
    case SacredThemeStyle.vaticanAlabaster:
      return AppTheme.getLightDynamicTheme(seasonalColor);
    case SacredThemeStyle.midnightCathedral:
      return AppTheme.getDynamicTheme(seasonalColor);
  }
});
