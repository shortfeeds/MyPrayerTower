import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class PremiumGlassCard extends StatelessWidget {
  final Widget child;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final bool hasShine;
  final bool hasGoldBorder;
  final double blurIntensity;
  final Color? color;

  const PremiumGlassCard({
    super.key,
    required this.child,
    this.borderRadius,
    this.padding,
    this.onTap,
    this.hasShine = false,
    this.hasGoldBorder = false,
    this.blurIntensity = 10.0,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final radius = borderRadius ?? BorderRadius.circular(24);

    Widget content = ClipRRect(
      borderRadius: radius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blurIntensity, sigmaY: blurIntensity),
        child: Container(
          decoration: BoxDecoration(
            color: (color ?? const Color(0xFF131D31)).withValues(
              alpha: 0.72,
            ), // Cathedral midnight Marian navy glass
            borderRadius: radius,
            border: Border.all(
              color: hasGoldBorder
                  ? const Color(0xFFD4AF37).withValues(alpha: 0.35)
                  : Colors.white.withValues(alpha: 0.08),
              width: hasGoldBorder ? 1.2 : 1,
            ),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white.withValues(alpha: 0.09),
                Colors.white.withValues(alpha: 0.03),
              ],
            ),
          ),
          padding: padding ?? const EdgeInsets.all(20),
          child: child,
        ),
      ),
    );

    if (onTap != null) {
      content = Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: radius,
          onTap: () {
            HapticFeedback.lightImpact();
            onTap!();
          },
          splashColor: const Color(0xFFD4AF37).withValues(alpha: 0.12),
          highlightColor: Colors.white.withValues(alpha: 0.04),
          child: content,
        ),
      );
    }

    return content;
  }
}
