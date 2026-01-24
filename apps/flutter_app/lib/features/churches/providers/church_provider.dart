import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../models/church_model.dart';
import '../repositories/churches_repository.dart';

// Current location provider
final currentLocationProvider = StateProvider<Position?>((ref) => null);

// Nearby churches provider
final nearbyChurchesProvider = FutureProvider.autoDispose<List<Church>>((
  ref,
) async {
  final position = ref.watch(currentLocationProvider);
  if (position == null) {
    return [];
  }

  final repository = ref.watch(churchesRepositoryProvider);
  return repository.getNearbyChurches(
    lat: position.latitude,
    lng: position.longitude,
  );
});

// Search functionality
final churchSearchQueryProvider = StateProvider<String?>((ref) => null);

final searchedChurchesProvider = FutureProvider.autoDispose<List<Church>>((
  ref,
) async {
  final query = ref.watch(churchSearchQueryProvider);
  if (query == null || query.isEmpty) return [];

  final repository = ref.watch(churchesRepositoryProvider);
  return repository.getChurches(query: query);
});
