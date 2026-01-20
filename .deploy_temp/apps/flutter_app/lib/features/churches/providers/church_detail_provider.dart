import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/church_model.dart';
import '../repositories/churches_repository.dart';

final churchDetailProvider = FutureProvider.family<Church, String>((
  ref,
  id,
) async {
  final repository = ref.watch(churchesRepositoryProvider);
  return repository.getChurchById(id);
});
