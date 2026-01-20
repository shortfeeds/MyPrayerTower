import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class CandleWidget extends StatelessWidget {
  final String tier;
  final double size;

  const CandleWidget({super.key, required this.tier, this.size = 60});

  Color get flameColor {
    switch (tier) {
      case 'featured':
        return AppTheme.accentGold;
      case 'standard':
        return const Color(0xFFf59e0b);
      case 'basic':
        return const Color(0xFFfbbf24);
      default:
        return const Color(0xFFfcd34d);
    }
  }

  Color get candleColor {
    switch (tier) {
      case 'featured':
        return const Color(0xFFfef3c7);
      case 'standard':
        return const Color(0xFFfef9c3);
      case 'basic':
        return const Color(0xFFfefce8);
      default:
        return const Color(0xFFffffff);
    }
  }

  @override
  Widget build(BuildContext context) {
    final candleWidth = size * 0.35;
    final candleHeight = size * 0.6;
    final flameHeight = size * 0.4;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Glow effect
          if (tier == 'featured')
            Positioned(
              top: 0,
              child: Container(
                width: flameHeight * 1.5,
                height: flameHeight * 1.5,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      flameColor.withValues(alpha: 0.4),
                      flameColor.withValues(alpha: 0.1),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

          // Candle body
          Positioned(
            bottom: 0,
            child: Container(
              width: candleWidth,
              height: candleHeight,
              decoration: BoxDecoration(
                color: candleColor,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(candleWidth * 0.15),
                  bottom: Radius.circular(candleWidth * 0.1),
                ),
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [
                    candleColor,
                    candleColor.withValues(alpha: 0.9),
                    candleColor.withValues(alpha: 0.7),
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 4,
                    offset: const Offset(2, 2),
                  ),
                ],
              ),
            ),
          ),

          // Wick
          Positioned(
            bottom: candleHeight - 2,
            child: Container(
              width: 2,
              height: 6,
              decoration: BoxDecoration(
                color: const Color(0xFF4a4a4a),
                borderRadius: BorderRadius.circular(1),
              ),
            ),
          ),

          // Flame
          Positioned(
            bottom: candleHeight + 2,
            child: _AnimatedFlame(
              color: flameColor,
              height: flameHeight,
              tier: tier,
            ),
          ),
        ],
      ),
    );
  }
}

class _AnimatedFlame extends StatefulWidget {
  final Color color;
  final double height;
  final String tier;

  const _AnimatedFlame({
    required this.color,
    required this.height,
    required this.tier,
  });

  @override
  State<_AnimatedFlame> createState() => _AnimatedFlameState();
}

class _AnimatedFlameState extends State<_AnimatedFlame>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(
      begin: 0.9,
      end: 1.1,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: CustomPaint(
            size: Size(widget.height * 0.5, widget.height),
            painter: _FlamePainter(color: widget.color, tier: widget.tier),
          ),
        );
      },
    );
  }
}

class _FlamePainter extends CustomPainter {
  final Color color;
  final String tier;

  _FlamePainter({required this.color, required this.tier});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Colors.white,
          color.withValues(alpha: 0.9),
          color,
          Colors.orange.withValues(alpha: 0.8),
        ],
        stops: const [0.0, 0.3, 0.6, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final path = Path();
    final width = size.width;
    final height = size.height;

    // Create flame shape
    path.moveTo(width / 2, 0);
    path.quadraticBezierTo(
      width * 0.8,
      height * 0.3,
      width * 0.7,
      height * 0.5,
    );
    path.quadraticBezierTo(width * 0.9, height * 0.7, width / 2, height);
    path.quadraticBezierTo(
      width * 0.1,
      height * 0.7,
      width * 0.3,
      height * 0.5,
    );
    path.quadraticBezierTo(width * 0.2, height * 0.3, width / 2, 0);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
