import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/church_model.dart';
import '../repositories/churches_repository.dart';

final churchesProvider = FutureProvider.autoDispose
    .family<List<Church>, String?>((ref, query) {
      return ref.watch(churchesRepositoryProvider).getChurches(query: query);
    });
