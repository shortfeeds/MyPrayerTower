import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';

class PremiumScaffold extends StatelessWidget {
  final Widget? body;
  final Widget? bottomNavigationBar;
  final Widget? floatingActionButton;
  final PreferredSizeWidget? appBar;
  final bool extendBody;
  final bool extendBodyBehindAppBar;
  final Color? auraColor;
  final bool showCathedralAura;

  const PremiumScaffold({
    super.key,
    this.body,
    this.bottomNavigationBar,
    this.floatingActionButton,
    this.appBar,
    this.extendBody = false,
    this.extendBodyBehindAppBar = false,
    this.auraColor,
    this.showCathedralAura = true,
  });

  @override
  Widget build(BuildContext context) {
    final aura = auraColor ?? AppTheme.sacredGold;

    return Scaffold(
      extendBody: extendBody,
      extendBodyBehindAppBar: extendBodyBehindAppBar,
      appBar: appBar,
      backgroundColor: AppTheme.midnightNocturne,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Cathedral Base Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF101726),
                  Color(0xFF090E18),
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),

          // 2. Cathedral Overhead Stained Glass / Divine Radiance Aura
          if (showCathedralAura)
            Positioned(
              top: -100,
              left: 0,
              right: 0,
              height: 380,
              child: IgnorePointer(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: const Alignment(0, -0.6),
                      radius: 0.9,
                      colors: [
                        aura.withValues(alpha: 0.18),
                        aura.withValues(alpha: 0.04),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ),

          // 3. Gentle Living Aura Ambient Glows
          Positioned(
            top: -60,
            left: -60,
            child: IgnorePointer(
              child: Container(
                width: 260,
                height: 260,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: aura.withValues(alpha: 0.12),
                  boxShadow: [
                    BoxShadow(
                      color: aura.withValues(alpha: 0.12),
                      blurRadius: 90,
                      spreadRadius: 40,
                    ),
                  ],
                ),
              )
              .animate(
                onPlay: (controller) => controller.repeat(reverse: true),
              )
              .scale(
                begin: const Offset(1, 1),
                end: const Offset(1.15, 1.15),
                duration: 5.seconds,
              ),
            ),
          ),

          Positioned(
            bottom: -60,
            right: -60,
            child: IgnorePointer(
              child: Container(
                width: 260,
                height: 260,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.sacredGold.withValues(alpha: 0.08),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.sacredGold.withValues(alpha: 0.08),
                      blurRadius: 90,
                      spreadRadius: 40,
                    ),
                  ],
                ),
              )
              .animate(
                onPlay: (controller) => controller.repeat(reverse: true),
              )
              .scale(
                begin: const Offset(1, 1),
                end: const Offset(1.2, 1.2),
                duration: 6.seconds,
              ),
            ),
          ),

          // 4. Main Body Content
          if (body != null) body!,
        ],
      ),
      bottomNavigationBar: bottomNavigationBar,
      floatingActionButton: floatingActionButton,
    );
  }
}
