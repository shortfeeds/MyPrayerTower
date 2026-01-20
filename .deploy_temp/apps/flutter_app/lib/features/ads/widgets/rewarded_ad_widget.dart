import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

/// Service for managing rewarded video ads
class RewardedAdService {
  RewardedAd? _rewardedAd;
  bool _isLoading = false;

  // Test ad unit ID - replace with production ID
  static const String _adUnitId = 'ca-app-pub-3940256099942544/5224354917';

  /// Load a rewarded ad
  Future<void> loadAd() async {
    if (_isLoading || _rewardedAd != null) return;

    _isLoading = true;

    await RewardedAd.load(
      adUnitId: _adUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isLoading = false;
        },
        onAdFailedToLoad: (error) {
          _isLoading = false;
        },
      ),
    );
  }

  /// Check if rewarded ad is ready
  bool get isAdReady => _rewardedAd != null;

  /// Show rewarded ad and return reward if watched
  Future<bool> showAd({
    required VoidCallback onRewarded,
    VoidCallback? onDismissed,
  }) async {
    if (_rewardedAd == null) {
      await loadAd();
      if (_rewardedAd == null) return false;
    }

    bool wasRewarded = false;

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _rewardedAd = null;
        loadAd(); // Preload next ad
        onDismissed?.call();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _rewardedAd = null;
        loadAd();
      },
    );

    await _rewardedAd!.show(
      onUserEarnedReward: (ad, reward) {
        wasRewarded = true;
        onRewarded();
      },
    );

    return wasRewarded;
  }

  void dispose() {
    _rewardedAd?.dispose();
  }
}

/// Provider for RewardedAdService
final rewardedAdServiceProvider = Provider<RewardedAdService>((ref) {
  final service = RewardedAdService();
  service.loadAd(); // Preload on creation
  ref.onDispose(() => service.dispose());
  return service;
});

/// Widget that shows content preview with "Watch Ad to Unlock" button
class RewardedAdUnlock extends ConsumerStatefulWidget {
  final String title;
  final String description;
  final String previewContent;
  final Widget Function(BuildContext) fullContentBuilder;
  final VoidCallback? onUnlocked;

  const RewardedAdUnlock({
    super.key,
    required this.title,
    required this.description,
    required this.previewContent,
    required this.fullContentBuilder,
    this.onUnlocked,
  });

  @override
  ConsumerState<RewardedAdUnlock> createState() => _RewardedAdUnlockState();
}

class _RewardedAdUnlockState extends ConsumerState<RewardedAdUnlock> {
  bool _isUnlocked = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    if (_isUnlocked) {
      return widget.fullContentBuilder(context);
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Preview content
          Text(
            widget.title,
            style: GoogleFonts.merriweather(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            widget.description,
            style: GoogleFonts.inter(
              fontSize: 13,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 16),

          // Blurred/truncated preview
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.sacredNavy900,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Stack(
              children: [
                Text(
                  widget.previewContent,
                  maxLines: 3,
                  overflow: TextOverflow.fade,
                  style: GoogleFonts.merriweather(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.5),
                    height: 1.6,
                  ),
                ),
                // Gradient overlay
                Positioned.fill(
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, AppTheme.sacredNavy900],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Unlock button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _watchAdToUnlock,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: _isLoading
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.black,
                      ),
                    )
                  : const Icon(Icons.play_circle_outline, color: Colors.black),
              label: Text(
                _isLoading ? 'Loading...' : 'Watch Ad to Unlock',
                style: GoogleFonts.inter(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Or subscribe option
          Center(
            child: TextButton(
              onPressed: () {
                // Navigate to subscription
              },
              child: Text(
                'Or subscribe for ad-free access',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _watchAdToUnlock() async {
    setState(() => _isLoading = true);

    final adService = ref.read(rewardedAdServiceProvider);

    await adService.showAd(
      onRewarded: () {
        setState(() {
          _isUnlocked = true;
          _isLoading = false;
        });
        widget.onUnlocked?.call();
      },
      onDismissed: () {
        setState(() => _isLoading = false);
      },
    );
  }
}
