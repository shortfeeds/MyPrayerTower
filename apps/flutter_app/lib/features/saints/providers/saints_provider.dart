import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/saint_model.dart';
import '../repositories/saints_repository.dart';

final saintOfTheDayProvider = FutureProvider<Saint>((ref) async {
  final repository = ref.watch(saintsRepositoryProvider);
  return repository.getSaintOfTheDay();
});

final saintBySlugProvider = FutureProvider.family<Saint, String>((
  ref,
  slug,
) async {
  final repository = ref.watch(saintsRepositoryProvider);
  return repository.getSaintBySlug(slug);
});
