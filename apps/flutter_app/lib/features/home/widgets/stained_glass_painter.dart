import 'dart:math';
import 'package:flutter/material.dart';

class StainedGlassPainter extends CustomPainter {
  final Color baseColor;
  final double progress;
  final Map<int, List<Offset>> shardPoints;

  StainedGlassPainter({
    required this.baseColor,
    required this.progress,
    required this.shardPoints,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill
      ..strokeWidth = 1.0;

    // Draw shards based on pre-calculated points to avoid jitter
    shardPoints.forEach((index, points) {
      if (points.length < 3) return;

      final path = Path()
        ..moveTo(points[0].dx * size.width, points[0].dy * size.height);
      for (var i = 1; i < points.length; i++) {
        path.lineTo(points[i].dx * size.width, points[i].dy * size.height);
      }
      path.close();

      // Dynamic coloring based on baseColor and index
      final opacity = 0.05 + 0.1 * sin((progress * 2 + index) * 0.5).abs();
      // Shift hue slightly for each shard
      final colorShift = index % 3 == 0 ? 0.1 : (index % 3 == 1 ? -0.05 : 0.0);

      paint.color = HSLColor.fromColor(baseColor)
          .withLightness((0.3 + colorShift).clamp(0.1, 0.9))
          .withSaturation((0.4 + opacity).clamp(0.0, 1.0))
          .toColor()
          .withValues(alpha: opacity);

      canvas.drawPath(path, paint);

      // Draw subtle borders for "lead" look
      final borderPaint = Paint()
        ..style = PaintingStyle.stroke
        ..color = Colors.black.withValues(alpha: 0.1)
        ..strokeWidth = 0.5;

      canvas.drawPath(path, borderPaint);
    });

    // Add a light vignette
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final gradient = RadialGradient(
      center: const Alignment(0.0, -0.5),
      radius: 1.2,
      colors: [Colors.transparent, Colors.black.withValues(alpha: 0.4)],
      stops: const [0.4, 1.0],
    );

    // ignore: unused_local_variable
    final vignettePaint = Paint()..shader = gradient.createShader(rect);
    // canvas.drawRect(rect, vignettePaint); // Optional, maybe heavy
  }

  @override
  bool shouldRepaint(covariant StainedGlassPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.baseColor != baseColor;
  }
}
