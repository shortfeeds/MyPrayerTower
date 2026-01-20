import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

// Provider for the Favorites Service
final favoritesServiceProvider = Provider<FavoritesService>((ref) {
  return FavoritesService();
});

// StateNotifier to manage the Set of favorite IDs purely in memory (synced with Hive)
final favoritesProvider = StateNotifierProvider<FavoritesNotifier, Set<int>>((
  ref,
) {
  final service = ref.watch(favoritesServiceProvider);
  return FavoritesNotifier(service);
});

class FavoritesService {
  static const String _boxName = 'favorites_box';
  Box<int>? _box;

  Future<void> init() async {
    if (!Hive.isBoxOpen(_boxName)) {
      _box = await Hive.openBox<int>(_boxName);
    } else {
      _box = Hive.box<int>(_boxName);
    }
  }

  Box<int> get box {
    if (_box == null || !_box!.isOpen) {
      throw HiveError('Favorites Box not initialized');
    }
    return _box!;
  }

  List<int> getFavoriteIds() {
    return box.values.toList();
  }

  Future<void> addFavorite(int id) async {
    // We use the ID as key to ensure uniqueness and fast lookup if needed,
    // NO, Hive keys are dynamic. Better to use ID as Key and Value.
    await box.put(id, id);
  }

  Future<void> removeFavorite(int id) async {
    await box.delete(id);
  }

  bool isFavorite(int id) {
    return box.containsKey(id);
  }
}

class FavoritesNotifier extends StateNotifier<Set<int>> {
  final FavoritesService _service;

  FavoritesNotifier(this._service) : super({}) {
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    await _service.init();
    final ids = _service.getFavoriteIds();
    state = ids.toSet();
  }

  Future<void> toggleFavorite(int id) async {
    if (state.contains(id)) {
      await _service.removeFavorite(id);
      state = {...state}..remove(id);
    } else {
      await _service.addFavorite(id);
      state = {...state}..add(id);
    }
  }
}
