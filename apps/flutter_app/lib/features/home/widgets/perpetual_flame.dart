import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math;

class PerpetualFlame extends StatefulWidget {
  final int participantCount;

  const PerpetualFlame({super.key, required this.participantCount});

  @override
  State<PerpetualFlame> createState() => _PerpetualFlameState();
}

class _PerpetualFlameState extends State<PerpetualFlame>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void didUpdateWidget(covariant PerpetualFlame oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.participantCount > oldWidget.participantCount) {
      HapticFeedback.lightImpact();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final intensity = math.min(2.5, 0.5 + (widget.participantCount / 500));

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return CustomPaint(
              size: Size(80 * intensity, 100 * intensity),
              painter: FlamePainter(
                progress: _controller.value,
                intensity: intensity,
              ),
            );
          },
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: Colors.green,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${widget.participantCount} Praying Now',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class FlamePainter extends CustomPainter {
  final double progress;
  final double intensity;

  FlamePainter({required this.progress, required this.intensity});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.8);
    final paint = Paint()..style = PaintingStyle.fill;

    // Outer Glow
    final glowPaint = Paint()
      ..color = Colors.amber.withValues(
        alpha: 0.2 * (0.5 + 0.5 * math.sin(progress * 2 * math.pi)),
      )
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, 20 * intensity);
    canvas.drawCircle(
      center.translate(0, -size.height * 0.3),
      size.width * 0.6,
      glowPaint,
    );

    // Main Flame Body
    final path = Path();
    path.moveTo(center.dx, center.dy);
    path.quadraticBezierTo(
      center.dx - size.width * 0.6,
      center.dy - size.height * 0.5,
      center.dx,
      center.dy - size.height * 0.9 + (5 * math.sin(progress * 4 * math.pi)),
    );
    path.quadraticBezierTo(
      center.dx + size.width * 0.6,
      center.dy - size.height * 0.5,
      center.dx,
      center.dy,
    );

    paint.color = Colors.orange.shade800;
    canvas.drawPath(path, paint);

    // Inner Flame
    final innerPath = Path();
    innerPath.moveTo(center.dx, center.dy - 10);
    innerPath.quadraticBezierTo(
      center.dx - size.width * 0.3,
      center.dy - size.height * 0.4,
      center.dx,
      center.dy - size.height * 0.7 + (3 * math.cos(progress * 4 * math.pi)),
    );
    innerPath.quadraticBezierTo(
      center.dx + size.width * 0.3,
      center.dy - size.height * 0.4,
      center.dx,
      center.dy - 10,
    );

    paint.color = Colors.amber.shade400;
    canvas.drawPath(innerPath, paint);
  }

  @override
  bool shouldRepaint(covariant FlamePainter oldDelegate) => true;
}
