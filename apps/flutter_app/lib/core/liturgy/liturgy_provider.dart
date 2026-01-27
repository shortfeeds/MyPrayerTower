import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'liturgy_utils.dart';

final liturgicalSeasonProvider = Provider<LiturgicalSeason>((ref) {
  return LiturgyUtils.getCurrentSeason();
});

final liturgicalColorProvider = Provider<Color>((ref) {
  final season = ref.watch(liturgicalSeasonProvider);
  return LiturgyUtils.getSeasonColor(season);
});

final liturgicalSeasonNameProvider = Provider<String>((ref) {
  final season = ref.watch(liturgicalSeasonProvider);
  return LiturgyUtils.getSeasonName(season);
});
