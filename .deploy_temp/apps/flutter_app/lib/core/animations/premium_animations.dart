import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_theme.dart';

class FadeInSlideUp extends StatelessWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  final double offset;

  const FadeInSlideUp({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 600),
    this.offset = 20.0,
  });

  @override
  Widget build(BuildContext context) {
    return child
        .animate(delay: delay)
        .fade(duration: duration)
        .slideY(
          begin: offset / 100, // Approximate slide
          end: 0,
          duration: duration,
          curve: Curves.easeOut,
        );
  }
}

class PremiumShimmer extends StatelessWidget {
  final Widget child;
  final bool isDark;

  const PremiumShimmer({super.key, required this.child, this.isDark = true});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: isDark ? AppTheme.sacredNavy800 : Colors.grey[300]!,
      highlightColor: isDark ? AppTheme.sacredNavy700 : Colors.grey[100]!,
      period: const Duration(milliseconds: 2000),
      child: child,
    );
  }

  static Widget rect({
    required double height,
    double width = double.infinity,
    double borderRadius = 12,
  }) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.black, // Color doesn't matter for shimmer content
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }
}

class FloatingCard extends StatelessWidget {
  final Widget child;
  final Duration duration;

  const FloatingCard({
    super.key,
    required this.child,
    this.duration = const Duration(seconds: 4),
  });

  @override
  Widget build(BuildContext context) {
    return child
        .animate(onPlay: (controller) => controller.repeat(reverse: true))
        .moveY(begin: 0, end: -10, duration: duration, curve: Curves.easeInOut);
  }
}
