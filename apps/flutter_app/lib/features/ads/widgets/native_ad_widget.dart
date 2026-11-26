import 'package:flutter/material.dart';

class NativeAdListItem extends StatelessWidget {
  final String adUnitId;

  const NativeAdListItem({
    super.key,
    this.adUnitId = '',
  });

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
