import 'package:flutter/material.dart';

/// Premium animated candle flame with glow effects
class PremiumCandleFlame extends StatefulWidget {
  final double size;
  final Color flameColor;
  final Color glowColor;
  final bool isActive;
  final bool isPremium;

  const PremiumCandleFlame({
    super.key,
    this.size = 60,
    this.flameColor = const Color(0xFFFFD54F),
    this.glowColor = const Color(0xFFFF9800),
    this.isActive = true,
    this.isPremium = false,
  });

  @override
  State<PremiumCandleFlame> createState() => _PremiumCandleFlameState();
}

class _PremiumCandleFlameState extends State<PremiumCandleFlame>
    with TickerProviderStateMixin {
  late AnimationController _flickerController;
  late AnimationController _glowController;
  late Animation<double> _flickerAnimation;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _flickerController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _flickerAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _flickerController, curve: Curves.easeInOut),
    );

    _glowAnimation = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );

    if (widget.isActive) {
      _startAnimations();
    }
  }

  void _startAnimations() {
    _flickerController.repeat(reverse: true);
    _glowController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _flickerController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isActive) {
      return _buildStaticCandle();
    }

    return AnimatedBuilder(
      animation: Listenable.merge([_flickerController, _glowController]),
      builder: (context, child) {
        return SizedBox(
          width: widget.size * 2.5,
          height: widget.size * 3.0,
          child: Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              // Outer glow
              if (widget.isPremium)
                Container(
                  width: widget.size * 2.5,
                  height: widget.size * 2.5,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        widget.glowColor.withValues(
                          alpha: 0.3 * _glowAnimation.value,
                        ),
                        widget.glowColor.withValues(
                          alpha: 0.1 * _glowAnimation.value,
                        ),
                        Colors.transparent,
                      ],
                      stops: const [0.0, 0.4, 1.0],
                    ),
                  ),
                ),

              // Inner glow
              Container(
                width: widget.size * 1.8,
                height: widget.size * 1.8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      widget.flameColor.withValues(
                        alpha: 0.4 * _glowAnimation.value,
                      ),
                      widget.flameColor.withValues(alpha: 0.1),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.5, 1.0],
                  ),
                ),
              ),

              // Flame
              Transform.scale(
                scale: _flickerAnimation.value,
                child: CustomPaint(
                  size: Size(widget.size, widget.size * 1.5),
                  painter: _FlamePainter(
                    flameColor: widget.flameColor,
                    innerColor: Colors.white,
                  ),
                ),
              ),

              // Note: Sparkles removed to prevent layout issues
            ],
          ),
        );
      },
    );
  }

  Widget _buildStaticCandle() {
    return CustomPaint(
      size: Size(widget.size, widget.size * 1.5),
      painter: _FlamePainter(
        flameColor: widget.flameColor.withValues(alpha: 0.5),
        innerColor: Colors.white54,
      ),
    );
  }
}

class _FlamePainter extends CustomPainter {
  final Color flameColor;
  final Color innerColor;

  _FlamePainter({required this.flameColor, required this.innerColor});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [flameColor, flameColor.withValues(alpha: 0.8), innerColor],
        stops: const [0.0, 0.6, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final path = Path();
    final centerX = size.width / 2;
    final bottomY = size.height;
    const topY = 0.0;

    // Flame shape
    path.moveTo(centerX, bottomY);
    path.quadraticBezierTo(
      centerX - size.width * 0.4,
      size.height * 0.6,
      centerX - size.width * 0.15,
      size.height * 0.3,
    );
    path.quadraticBezierTo(
      centerX,
      topY,
      centerX + size.width * 0.15,
      size.height * 0.3,
    );
    path.quadraticBezierTo(
      centerX + size.width * 0.4,
      size.height * 0.6,
      centerX,
      bottomY,
    );
    path.close();

    canvas.drawPath(path, paint);

    // Inner bright core
    final innerPaint = Paint()..color = innerColor.withValues(alpha: 0.8);

    final innerPath = Path();
    innerPath.moveTo(centerX, bottomY * 0.9);
    innerPath.quadraticBezierTo(
      centerX - size.width * 0.1,
      size.height * 0.5,
      centerX,
      size.height * 0.25,
    );
    innerPath.quadraticBezierTo(
      centerX + size.width * 0.1,
      size.height * 0.5,
      centerX,
      bottomY * 0.9,
    );
    innerPath.close();

    canvas.drawPath(innerPath, innerPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
