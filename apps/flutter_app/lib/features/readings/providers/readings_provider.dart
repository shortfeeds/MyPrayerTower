import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/reading_model.dart';
import '../repositories/readings_repository.dart';

final dailyReadingProvider = FutureProvider<Reading>((ref) async {
  final repository = ref.watch(readingsRepositoryProvider);
  return repository.getDailyReading();
});

final readingsForWeekProvider = FutureProvider<List<Reading>>((ref) async {
  final repository = ref.watch(readingsRepositoryProvider);
  return repository.getReadingsForWeek();
});
