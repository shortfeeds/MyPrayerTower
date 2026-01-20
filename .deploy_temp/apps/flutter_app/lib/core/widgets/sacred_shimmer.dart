import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/app_theme.dart';

class SacredShimmer extends StatelessWidget {
  final double width;
  final double height;
  final ShapeBorder shapeBorder;

  const SacredShimmer.rectangular({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.shapeBorder = const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(12)),
    ),
  });

  const SacredShimmer.circular({
    super.key,
    required this.width,
    required this.height,
    this.shapeBorder = const CircleBorder(),
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppTheme.sacredNavy700,
      highlightColor: AppTheme.gold500.withValues(alpha: 0.1),
      period: const Duration(milliseconds: 2000),
      child: Container(
        width: width,
        height: height,
        decoration: ShapeDecoration(
          color: AppTheme.sacredNavy600,
          shape: shapeBorder,
        ),
      ),
    );
  }
}
