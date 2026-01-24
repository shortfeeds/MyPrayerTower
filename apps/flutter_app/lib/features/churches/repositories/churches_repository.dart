import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/church_model.dart';
import '../data/churches_dataset.dart';

final churchesRepositoryProvider = Provider<ChurchesRepository>((ref) {
  return ChurchesRepository();
});

class ChurchesRepository {
  // Cache the full list in memory for this demo
  // In a real app, this would be in a database
  late final List<Church> _allChurches;

  ChurchesRepository() {
    _allChurches = ChurchesDataset.getAllChurches();
  }

  Future<List<Church>> getChurches({
    String? query,
    String? type, // Added 'type' parameter
    int page = 1,
    int limit = 20,
    Map<String, dynamic>? filters,
  }) async {
    // Simulate network delay for realism
    await Future.delayed(const Duration(milliseconds: 300)); // Changed delay

    var results = _allChurches;

    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      results = results.where((c) {
        return c.name.toLowerCase().contains(q) ||
            c.city.toLowerCase().contains(q) ||
            (c.address?.toLowerCase().contains(q) ?? false) ||
            (c.postalCode != null &&
                c.postalCode!.contains(q)); // Added postalCode search
      }).toList();
    }

    // Apply type filter
    if (type != null && type.isNotEmpty && type != 'All') {
      results = results.where((c) => c.type == type).toList();
    }

    // Apply filters if simulated (e.g. Mass Times, Confession)
    if (filters != null) {
      if (filters['isVerified'] == true) {
        results = results.where((c) => c.isVerified).toList();
      }
      // Add more filter logic here if needed
    }

    final startIndex = (page - 1) * limit;
    if (startIndex >= results.length) return [];

    final endIndex = startIndex + limit;
    return results.sublist(
      startIndex,
      endIndex > results.length ? results.length : endIndex,
    );
  }

  Future<Church> getChurchById(String id) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _allChurches.firstWhere(
      (c) => c.id == id,
      orElse: () => _allChurches.first, // Fallback for stability
    );
  }

  Future<List<Church>> getNearbyChurches({
    required double lat,
    required double lng,
    double radiusKm = 10,
  }) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _allChurches.take(5).toList();
  }
}
