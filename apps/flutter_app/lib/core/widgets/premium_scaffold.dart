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

  const PremiumScaffold({
    super.key,
    this.body,
    this.bottomNavigationBar,
    this.floatingActionButton,
    this.appBar,
    this.extendBody = false,
    this.extendBodyBehindAppBar = false,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: extendBody,
      extendBodyBehindAppBar: extendBodyBehindAppBar,
      appBar: appBar,
      backgroundColor: AppTheme.deepSpace,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Base Gradient
          Container(
            decoration: const BoxDecoration(gradient: AppTheme.primaryGradient),
          ),

          // 2. Animated Particles / Glows
          // Top Left Glow
          Positioned(
            top: -100,
            left: -100,
            child:
                Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.sacredPurple.withValues(alpha: 0.15),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.sacredPurple.withValues(
                              alpha: 0.15,
                            ),
                            blurRadius: 100,
                            spreadRadius: 50,
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
                      duration: 4.seconds,
                    )
                    .slide(
                      begin: const Offset(0, 0),
                      end: const Offset(10, 10),
                      duration: 5.seconds,
                    ),
          ),

          // Bottom Right Glow
          Positioned(
            bottom: -100,
            right: -100,
            child:
                Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.sacredGold.withValues(alpha: 0.1),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.sacredGold.withValues(alpha: 0.1),
                            blurRadius: 100,
                            spreadRadius: 50,
                          ),
                        ],
                      ),
                    )
                    .animate(
                      onPlay: (controller) => controller.repeat(reverse: true),
                    )
                    .scale(
                      begin: const Offset(1, 1),
                      end: const Offset(1.3, 1.3),
                      duration: 6.seconds,
                    )
                    .slide(
                      begin: const Offset(0, 0),
                      end: const Offset(-20, -20),
                      duration: 7.seconds,
                    ),
          ),

          // 3. Main Content
          if (body != null) body!,
        ],
      ),
      bottomNavigationBar: bottomNavigationBar,
      floatingActionButton: floatingActionButton,
    );
  }
}
