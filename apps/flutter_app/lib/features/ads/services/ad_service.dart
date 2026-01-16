import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdService {
  final bool useAdMob = true;

  // Frequency control
  DateTime? _lastInterstitialTime;
  static const _interstitialCooldown = Duration(minutes: 10);

  Future<void> initialize() async {
    if (useAdMob && !kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
      await MobileAds.instance.initialize();
    }
  }

  String get bannerAdUnitId {
    // Using production ID for both debug/release as requested
    return Platform.isAndroid
        ? 'ca-app-pub-1009360672921924/8257353171'
        : 'ca-app-pub-3940256099942544/2934735716';
  }

  String get nativeAdUnitId {
    // Using production ID for both debug/release as requested
    return Platform.isAndroid
        ? 'ca-app-pub-1009360672921924/9865948318'
        : 'ca-app-pub-3940256099942544/3986624511';
  }

  String get rewardedAdUnitId {
    // Using production ID for both debug/release as requested
    return Platform.isAndroid
        ? 'ca-app-pub-1009360672921924/1561928795'
        : 'ca-app-pub-3940256099942544/1712485313';
  }

  String get interstitialAdUnitId {
    // Using production ID for both debug/release as requested
    return Platform.isAndroid
        ? 'ca-app-pub-1009360672921924/8169723267'
        : 'ca-app-pub-3940256099942544/4411468910';
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

  /// Load a rewarded ad for optional bonus points
  Future<void> loadRewardedAd({
    required Function(RewardedAd) onAdLoaded,
    required Function(String) onAdFailed,
  }) async {
    if (!useAdMob || kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
      onAdFailed('Platform not supported');
      return;
    }

    await RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: onAdLoaded,
        onAdFailedToLoad: (error) => onAdFailed(error.message),
      ),
    );
  }

  /// Check if interstitial is allowed (respects cooldown)
  bool canShowInterstitial() {
    if (_lastInterstitialTime == null) return true;
    return DateTime.now().difference(_lastInterstitialTime!) >
        _interstitialCooldown;
  }

  /// Load an interstitial ad (only at natural breaks)
  Future<void> loadInterstitialAd({
    required Function(InterstitialAd) onAdLoaded,
    required Function(String) onAdFailed,
  }) async {
    if (!canShowInterstitial()) {
      onAdFailed('Cooldown active');
      return;
    }

    if (!useAdMob || kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
      onAdFailed('Platform not supported');
      return;
    }

    await InterstitialAd.load(
      adUnitId: interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _lastInterstitialTime = DateTime.now();
          onAdLoaded(ad);
        },
        onAdFailedToLoad: (error) => onAdFailed(error.message),
      ),
    );
  }
}

final adServiceProvider = Provider<AdService>((ref) {
  return AdService();
});
