import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../models/church_model.dart';
import '../repositories/church_repository.dart';

// Current location provider
final currentLocationProvider = StateProvider<Position?>((ref) => null);

// Nearby churches provider
final nearbyChurchesProvider = FutureProvider.autoDispose<List<Church>>((
  ref,
) async {
  final position = ref.watch(currentLocationProvider);
  if (position == null) {
    // If no location, maybe return empty or try to get location if permission granted?
    // For now, let's assume UI handles location request and sets the state.
    return [];
  }

  final repository = ref.watch(churchRepositoryProvider);
  return repository.findNearby(position.latitude, position.longitude);
});

// Search functionality
final churchSearchQueryProvider = StateProvider<String?>((ref) => null);

final searchedChurchesProvider = FutureProvider.autoDispose<List<Church>>((
  ref,
) async {
  final query = ref.watch(churchSearchQueryProvider);
  if (query == null || query.isEmpty) return [];

  final repository = ref.watch(churchRepositoryProvider);
  return repository.search(query: query);
});
