import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../services/ad_service.dart';

/// Manager for rewarded video ads (bonus points in challenges)
class RewardedAdManager extends ConsumerStatefulWidget {
  final VoidCallback onRewardEarned;
  final Widget child;
  final String buttonText;

  const RewardedAdManager({
    super.key,
    required this.onRewardEarned,
    required this.child,
    this.buttonText = 'Watch Ad for Bonus',
  });

  @override
  ConsumerState<RewardedAdManager> createState() => _RewardedAdManagerState();
}

class _RewardedAdManagerState extends ConsumerState<RewardedAdManager> {
  RewardedAd? _rewardedAd;
  bool _isLoading = false;
  bool _isAdReady = false;

  @override
  void initState() {
    super.initState();
    _loadRewardedAd();
  }

  @override
  void dispose() {
    _rewardedAd?.dispose();
    super.dispose();
  }

  void _loadRewardedAd() {
    setState(() => _isLoading = true);

    final adService = ref.read(adServiceProvider);
    adService.loadRewardedAd(
      onAdLoaded: (ad) {
        setState(() {
          _rewardedAd = ad;
          _isLoading = false;
          _isAdReady = true;
        });

        ad.fullScreenContentCallback = FullScreenContentCallback(
          onAdDismissedFullScreenContent: (ad) {
            ad.dispose();
            _loadRewardedAd(); // Preload next ad
          },
          onAdFailedToShowFullScreenContent: (ad, error) {
            ad.dispose();
            _loadRewardedAd();
          },
        );
      },
      onAdFailed: (error) {
        debugPrint('Rewarded ad failed: $error');
        setState(() {
          _isLoading = false;
          _isAdReady = false;
        });
      },
    );
  }

  void _showRewardedAd() {
    if (_rewardedAd == null) return;

    _rewardedAd!.show(
      onUserEarnedReward: (ad, reward) {
        widget.onRewardEarned();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        widget.child,
        if (_isAdReady)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _showRewardedAd,
                icon: const Icon(LucideIcons.play, size: 16),
                label: Text(widget.buttonText),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.gold500),
                  foregroundColor: AppTheme.gold500,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ),
        if (_isLoading)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Text(
              'Loading bonus option...',
              style: GoogleFonts.inter(color: Colors.white38, fontSize: 12),
            ),
          ),
      ],
    );
  }
}
