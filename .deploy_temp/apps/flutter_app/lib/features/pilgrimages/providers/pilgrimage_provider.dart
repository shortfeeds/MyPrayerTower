import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pilgrimage_model.dart';
import '../repositories/pilgrimage_repository.dart';

final pilgrimagesProvider = FutureProvider<List<Pilgrimage>>((ref) async {
  final repository = ref.watch(pilgrimageRepositoryProvider);
  return repository.getPilgrimages();
});
