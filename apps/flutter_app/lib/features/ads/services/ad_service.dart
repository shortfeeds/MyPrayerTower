import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ad_config.dart';

/// Ads are completely removed from MyPrayerTower mobile app.
class AdService {
  final Ref ref;
  final bool useAdMob = false;

  AdService(this.ref);

  Future<void> initialize() async {}

  Future<AdConfig?> getAdConfig({
    required String page,
    required String position,
  }) async =>
      null;

  Future<void> trackImpression(String adId) async {}
  Future<void> trackClick(String adId) async {}
  bool canShowInterstitial() => false;

  Future<void> loadInterstitialAd({
    required Function(dynamic) onAdLoaded,
    required Function(String) onAdFailed,
  }) async {
    onAdFailed('Ads disabled');
  }
}

final adServiceProvider = Provider<AdService>((ref) => AdService(ref));
