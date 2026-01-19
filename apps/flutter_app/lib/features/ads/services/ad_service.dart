import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../../../core/api/api_client.dart';

class AdService {
  final Ref ref;
  final bool useAdMob = true;
  Map<String, dynamic> _settings = {};

  AdService(this.ref);

  // Frequency control
  DateTime? _lastInterstitialTime;
  static const _interstitialCooldown = Duration(minutes: 10);

  Future<void> initialize() async {
    // Fetch settings from API
    try {
      final dio = ref.read(dioProvider);
      final response = await dio.get('/public/settings');
      if (response.statusCode == 200 && response.data != null) {
        _settings = response.data;
        debugPrint('Ad settings loaded: $_settings');
      }
    } catch (e) {
      debugPrint('Failed to load ad settings: $e');
    }

    if (useAdMob && !kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
      await MobileAds.instance.initialize();
    }
  }

  String get bannerAdUnitId {
    if (Platform.isAndroid) {
      return _settings['bannerAdUnitIdAndroid'] ??
          'ca-app-pub-1009360672921924/8257353171';
    } else if (Platform.isIOS) {
      return _settings['bannerAdUnitIdiOS'] ??
          'ca-app-pub-3940256099942544/2934735716';
    }
    return '';
  }

  String get nativeAdUnitId {
    if (Platform.isAndroid) {
      return _settings['nativeAdUnitIdAndroid'] ??
          'ca-app-pub-1009360672921924/9865948318';
    } else if (Platform.isIOS) {
      return _settings['nativeAdUnitIdiOS'] ??
          'ca-app-pub-3940256099942544/3986624511';
    }
    return '';
  }

  String get rewardedAdUnitId {
    if (Platform.isAndroid) {
      return _settings['rewardedAdUnitIdAndroid'] ??
          'ca-app-pub-1009360672921924/1561928795';
    } else if (Platform.isIOS) {
      return _settings['rewardedAdUnitIdiOS'] ??
          'ca-app-pub-3940256099942544/1712485313';
    }
    return '';
  }

  String get interstitialAdUnitId {
    if (Platform.isAndroid) {
      return _settings['interstitialAdUnitIdAndroid'] ??
          'ca-app-pub-1009360672921924/8169723267';
    } else if (Platform.isIOS) {
      return _settings['interstitialAdUnitIdiOS'] ??
          'ca-app-pub-3940256099942544/4411468910';
    }
    return '';
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
  return AdService(ref);
});
