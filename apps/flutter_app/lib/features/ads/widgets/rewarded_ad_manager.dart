import 'package:flutter/material.dart';

class RewardedAdManager extends StatelessWidget {
  final VoidCallback onRewardEarned;
  final Widget child;
  final String buttonText;

  const RewardedAdManager({
    super.key,
    required this.onRewardEarned,
    required this.child,
    this.buttonText = '',
  });

  @override
  Widget build(BuildContext context) => child;
}
