import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ad_model.dart';

final adRepositoryProvider = Provider<AdRepository>((ref) {
  return AdRepository();
});

class AdRepository {
  AdRepository();

  Future<List<AdModel>> getAds({
    required String page,
    required String position,
  }) async {
    // For now returning empty or mock until backend is ready.
    // Supabase can be used if ads table exists.
    return [];
  }

  Future<void> trackClick(String adId) async {
    // Implement tracking logic
  }

  Future<void> trackImpression(String adId) async {
    // Implement tracking logic
  }
}
