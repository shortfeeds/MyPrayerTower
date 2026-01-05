import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/prayer_model.dart';
import '../repositories/prayers_repository.dart';

final prayersProvider = FutureProvider.autoDispose
    .family<List<Prayer>, String?>((ref, category) {
      return ref
          .watch(prayersRepositoryProvider)
          .getPrayers(category: category);
    });
