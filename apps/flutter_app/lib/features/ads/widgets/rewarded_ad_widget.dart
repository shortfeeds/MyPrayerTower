import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RewardedAdService {
  Future<void> loadAd() async {}
  bool get isAdReady => false;

  Future<bool> showAd({
    required VoidCallback onRewarded,
    VoidCallback? onDismissed,
  }) async {
    onDismissed?.call();
    return false;
  }

  void dispose() {}
}

final rewardedAdServiceProvider = Provider<RewardedAdService>((ref) {
  return RewardedAdService();
});

class RewardedAdButton extends StatelessWidget {
  final String title;
  final String description;
  final String rewardText;
  final VoidCallback onRewarded;

  const RewardedAdButton({
    super.key,
    this.title = '',
    this.description = '',
    this.rewardText = '',
    required this.onRewarded,
  });

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
