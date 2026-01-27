import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../liturgy/liturgy_provider.dart';

final themeProvider = Provider<ThemeData>((ref) {
  final seasonalColor = ref.watch(liturgicalColorProvider);
  return AppTheme.getDynamicTheme(seasonalColor);
});
