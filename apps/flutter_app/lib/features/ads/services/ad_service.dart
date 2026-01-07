import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdService {
  final bool useAdMob = true;

  Future<void> initialize() async {
    if (useAdMob && !kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
      await MobileAds.instance.initialize();
    }
  }

  String get bannerAdUnitId {
    if (kDebugMode) {
      // Test ID
      return Platform.isAndroid
          ? 'ca-app-pub-3940256099942544/6300978111'
          : 'ca-app-pub-3940256099942544/2934735716';
    }
    // NOTE: Replace with real production IDs before release
    return Platform.isAndroid
        ? 'ca-app-pub-3940256099942544/6300978111'
        : 'ca-app-pub-3940256099942544/2934735716';
  }

  BannerAd? createBannerAd({
    required Function() onAdLoaded,
    Function(LoadAdError)? onAdFailed,
  }) {
    if (!useAdMob || kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
      return null;
    }

    return BannerAd(
      adUnitId: bannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (_) => onAdLoaded(),
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          debugPrint('Ad failed to load: $error');
          if (onAdFailed != null) onAdFailed(error);
        },
      ),
    );
  }
}

final adServiceProvider = Provider<AdService>((ref) {
  return AdService();
});
