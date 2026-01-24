import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../theme/app_theme.dart';
import '../constants/sacred_copy.dart';

class SacredPauseOverlay extends StatefulWidget {
  final VoidCallback onComplete;
  final String? message;
  final String? subtitle;
  final IconData? icon;

  const SacredPauseOverlay({
    super.key,
    required this.onComplete,
    this.message,
    this.subtitle,
    this.icon,
  });

  @override
  State<SacredPauseOverlay> createState() => _SacredPauseOverlayState();

  static Future<void> show(
    BuildContext context, {
    String? message,
    String? subtitle,
    IconData? icon,
    Duration duration = const Duration(milliseconds: 3500),
  }) async {
    return showGeneralDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withValues(alpha: 0.85),
      transitionDuration: const Duration(milliseconds: 500),
      pageBuilder: (context, animation, secondaryAnimation) {
        return FadeTransition(
          opacity: animation,
          child: SacredPauseOverlay(
            onComplete: () => Navigator.of(context).pop(),
            message: message,
            subtitle: subtitle,
            icon: icon,
          ),
        );
      },
    ).then((_) {});
  }
}

class _SacredPauseOverlayState extends State<SacredPauseOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  late Animation<double> _pulseAnimation;

  String _currentStage = 'lifting'; // 'lifting' -> 'offered'

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3500),
    );

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.8, end: 1.05), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 1.05, end: 1.0), weight: 70),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    _opacityAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 20),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 60),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 20),
    ]).animate(_controller);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.2, 0.8, curve: Curves.easeInOut),
      ),
    );

    _controller.forward();

    // Change text stage halfway
    Future.delayed(const Duration(milliseconds: 2000), () {
      if (mounted) {
        setState(() {
          _currentStage = 'offered';
        });
      }
    });

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onComplete();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _opacityAnimation.value,
              child: Transform.scale(
                scale: _scaleAnimation.value,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Icon with pulse
                    Transform.scale(
                      scale: _pulseAnimation.value,
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppTheme.gold500.withValues(alpha: 0.1),
                          border: Border.all(
                            color: AppTheme.gold500.withValues(alpha: 0.3),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.gold500.withValues(alpha: 0.2),
                              blurRadius: 30,
                              spreadRadius: 10,
                            ),
                          ],
                        ),
                        child: Icon(
                          widget.icon ?? LucideIcons.heart,
                          size: 40,
                          color: AppTheme.gold500,
                        ),
                      ),
                    ),
                    const SizedBox(height: 48),
                    // Message
                    Text(
                      _currentStage == 'lifting'
                          ? (widget.message ?? 'Lifting your intention...')
                          : (widget.subtitle ??
                                SacredCopy.prayerComplete.primary),
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _currentStage == 'lifting'
                          ? 'United with the global community'
                          : SacredCopy.prayerComplete.reassurance,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        color: Colors.white70,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
