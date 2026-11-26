import 'package:flutter/material.dart';

/// All advertisements have been removed from the mobile sanctuary.
class SmartAdBanner extends StatelessWidget {
  final String page;
  final String position;
  final double? height;

  const SmartAdBanner({
    super.key,
    required this.page,
    required this.position,
    this.height,
  });

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
