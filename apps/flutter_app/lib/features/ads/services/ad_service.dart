import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../models/ad_config.dart';
import '../repositories/ad_repository.dart';

class AdService {
  final Ref ref;
  final bool useAdMob = true;

  AdService(this.ref);

  // Frequency control
  DateTime? _lastInterstitialTime;
  static const _interstitialCooldown = Duration(minutes: 10);

  Future<void> initialize() async {
    if (useAdMob && !kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
      await MobileAds.instance.initialize();
    }
  }

  /// Fetch ad configuration for a specific placement
  /// Returns AdConfig which determines if we show an Offline Ad or Google Ad
  Future<AdConfig?> getAdConfig({
    required String page,
    required String position,
  }) async {
    return ref
        .read(adRepositoryProvider)
        .fetchAd(page: page, position: position);
  }

  /// Track impression for offline ads
  Future<void> trackImpression(String adId) async {
    await ref.read(adRepositoryProvider).trackImpression(adId);
  }

  /// Track click for offline ads
  Future<void> trackClick(String adId) async {
    await ref.read(adRepositoryProvider).trackClick(adId);
  }

  // --- AdMob Helpers ---

  String _getAdMobUnitId(AdConfig? config, String adType) {
    // 1. Try config-specific ID from API (Targeted AdMob)
    if (config != null && config.adSource == AdSource.google) {
      if (Platform.isAndroid && config.androidAdUnitId != null) {
        return config.androidAdUnitId!;
      }
      if (Platform.isIOS && config.iosAdUnitId != null) {
        return config.iosAdUnitId!;
      }
    }

    // 2. Fallback to default IDs (House inventory)
    return _getDefaultAdUnitId(adType);
  }

  String _getDefaultAdUnitId(String adType) {
    // Replace these with your actual global fallback IDs
    // Currently using Test IDs
    if (Platform.isAndroid) {
      switch (adType) {
        case 'banner':
          return 'ca-app-pub-3940256099942544/6300978111';
        case 'native':
          return 'ca-app-pub-3940256099942544/2247696110';
        case 'interstitial':
          return 'ca-app-pub-3940256099942544/1033173712';
        case 'rewarded':
          return 'ca-app-pub-3940256099942544/5224354917';
      }
    } else if (Platform.isIOS) {
      switch (adType) {
        case 'banner':
          return 'ca-app-pub-3940256099942544/2934735716';
        case 'native':
          return 'ca-app-pub-3940256099942544/3986624511';
        case 'interstitial':
          return 'ca-app-pub-3940256099942544/4411468910';
        case 'rewarded':
          return 'ca-app-pub-3940256099942544/1712485313';
      }
    }
    return '';
  }

  BannerAd? createBannerAd({
    AdConfig? config,
    required Function() onAdLoaded,
    Function(LoadAdError)? onAdFailed,
  }) {
    if (!useAdMob || kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
      return null;
    }

    return BannerAd(
      adUnitId: _getAdMobUnitId(config, 'banner'),
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

  /// Load a native ad with config
  NativeAd? createNativeAd({
    AdConfig? config,
    Map<String, Object>? customOptions,
    required Function(Ad) onAdLoaded,
    Function(LoadAdError)? onAdFailed,
  }) {
    if (!useAdMob || kIsWeb || (!Platform.isAndroid && !Platform.isIOS)) {
      return null;
    }

    return NativeAd(
      adUnitId: _getAdMobUnitId(config, 'native'),
      factoryId:
          'listTile', // Ensure you have this factory in Android/iOS native code
      request: const AdRequest(),
      listener: NativeAdListener(
        onAdLoaded: onAdLoaded,
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
      adUnitId: _getDefaultAdUnitId('rewarded'),
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
      adUnitId: _getDefaultAdUnitId('interstitial'),
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
  return AdService(ref);
});
