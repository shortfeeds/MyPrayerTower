import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math';

/// A/B test configuration for ad placements
class AdPlacementConfig {
  final String testId;
  final String variant; // 'A' or 'B'
  final bool showNativeAds;
  final int nativeAdFrequency; // Show every N items in list
  final bool showRewardedPreview;
  final String bannerPosition; // 'top', 'bottom', 'inline'
  final double interstitialProbability; // 0.0 - 1.0

  const AdPlacementConfig({
    required this.testId,
    required this.variant,
    this.showNativeAds = true,
    this.nativeAdFrequency = 5,
    this.showRewardedPreview = true,
    this.bannerPosition = 'bottom',
    this.interstitialProbability = 0.1,
  });

  /// Variant A: Standard placement
  static const AdPlacementConfig variantA = AdPlacementConfig(
    testId: 'ad_placement_2024_01',
    variant: 'A',
    showNativeAds: true,
    nativeAdFrequency: 5, // Every 5th item
    showRewardedPreview: true,
    bannerPosition: 'bottom',
    interstitialProbability: 0.1,
  );

  /// Variant B: Aggressive placement
  static const AdPlacementConfig variantB = AdPlacementConfig(
    testId: 'ad_placement_2024_01',
    variant: 'B',
    showNativeAds: true,
    nativeAdFrequency: 3, // Every 3rd item
    showRewardedPreview: true,
    bannerPosition: 'inline',
    interstitialProbability: 0.2,
  );
}

/// Service for managing A/B tests
class ABTestService {
  static const _variantKey = 'ab_test_variant';

  final SharedPreferences _prefs;

  ABTestService(this._prefs);

  /// Get assigned variant (or assign one if new user)
  AdPlacementConfig getAdPlacementConfig() {
    final storedVariant = _prefs.getString(_variantKey);

    if (storedVariant == 'B') {
      return AdPlacementConfig.variantB;
    } else if (storedVariant == 'A') {
      return AdPlacementConfig.variantA;
    } else {
      // New user, randomly assign
      final variant = Random().nextBool() ? 'A' : 'B';
      _prefs.setString(_variantKey, variant);
      return variant == 'A'
          ? AdPlacementConfig.variantA
          : AdPlacementConfig.variantB;
    }
  }

  /// Check if should show native ad at this index
  bool shouldShowNativeAd(int index) {
    final config = getAdPlacementConfig();
    if (!config.showNativeAds) return false;
    return (index + 1) % config.nativeAdFrequency == 0;
  }

  /// Check if should show interstitial (probabilistic)
  bool shouldShowInterstitial() {
    final config = getAdPlacementConfig();
    return Random().nextDouble() < config.interstitialProbability;
  }

  /// Get current variant for analytics
  String getCurrentVariant() {
    return _prefs.getString(_variantKey) ?? 'A';
  }

  /// Force a specific variant (for testing)
  Future<void> setVariant(String variant) async {
    await _prefs.setString(_variantKey, variant);
  }
}

/// Provider for ABTestService
final abTestServiceProvider = Provider<ABTestService>((ref) {
  throw UnimplementedError('Initialize ABTestService with SharedPreferences');
});

/// Provider for current ad placement config
final adPlacementConfigProvider = Provider<AdPlacementConfig>((ref) {
  final abTest = ref.watch(abTestServiceProvider);
  return abTest.getAdPlacementConfig();
});

/// Helper extension for list builders
extension AdPlacementListExtension on List {
  /// Insert ad placeholders at appropriate positions based on A/B config
  List<dynamic> withNativeAds(AdPlacementConfig config) {
    if (!config.showNativeAds) return this;

    final result = <dynamic>[];
    for (var i = 0; i < length; i++) {
      result.add(this[i]);
      // Insert ad placeholder after every N items
      if ((i + 1) % config.nativeAdFrequency == 0 && i < length - 1) {
        result.add(const _AdPlaceholder());
      }
    }
    return result;
  }
}

/// Marker class for ad placeholders in lists
class _AdPlaceholder {
  const _AdPlaceholder();
}

/// Check if an item is an ad placeholder
bool isAdPlaceholder(dynamic item) => item is _AdPlaceholder;
