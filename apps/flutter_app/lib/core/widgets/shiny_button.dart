import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';

class ShinyButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback onPressed;
  final Color? color;
  final bool isLarge;

  const ShinyButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.color,
    this.isLarge = false,
  });

  @override
  Widget build(BuildContext context) {
    final themeColor = color ?? AppTheme.gold500;

    return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: themeColor.withValues(alpha: 0.3),
                blurRadius: 20,
                spreadRadius: -5,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onPressed,
              borderRadius: BorderRadius.circular(16),
              child: Ink(
                padding: EdgeInsets.symmetric(
                  horizontal: isLarge ? 32 : 24,
                  vertical: isLarge ? 18 : 14,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      themeColor,
                      context.isDark
                          ? themeColor.withValues(alpha: 0.8)
                          : themeColor,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(
                        icon,
                        size: isLarge ? 24 : 20,
                        color: AppTheme.sacredNavy900,
                      ),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: isLarge ? 18 : 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.sacredNavy900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
        .animate(onPlay: (controller) => controller.repeat(reverse: true))
        .shimmer(
          delay: 2000.ms,
          duration: 1500.ms,
          color: Colors.white.withValues(alpha: 0.4),
          size: 0.5,
        );
  }
}

extension _ContextTheme on BuildContext {
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
}
