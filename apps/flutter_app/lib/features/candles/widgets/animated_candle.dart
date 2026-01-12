import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/candle_model.dart';

class AnimatedCandle extends StatelessWidget {
  final Candle candle;
  final bool isCompact;
  final VoidCallback? onPray;

  const AnimatedCandle({
    super.key,
    required this.candle,
    this.isCompact = false,
    this.onPray,
  });

  bool get _isPremium => candle.tier == 'premium';

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // Slate-800
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _isPremium
              ? Colors.amber.withValues(alpha: 0.5)
              : Colors.white.withValues(alpha: 0.1),
          width: _isPremium ? 1.5 : 1,
        ),
        boxShadow: _isPremium
            ? [
                BoxShadow(
                  color: Colors.amber.withValues(alpha: 0.2),
                  blurRadius: 12,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
      child: Stack(
        children: [
          // Background Glow for Premium
          if (_isPremium)
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: RadialGradient(
                    center: Alignment.topCenter,
                    radius: 0.8,
                    colors: [
                      Colors.amber.withValues(alpha: 0.15),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated Flame
                _buildFlame(),

                SizedBox(height: isCompact ? 4 : 8),

                // Name
                Text(
                  candle.displayName,
                  style: GoogleFonts.inter(
                    fontSize: isCompact ? 10 : 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),

                if (!isCompact) ...[
                  const SizedBox(height: 2),
                  Text(
                    candle.intention,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: Colors.white70,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                ],

                // Prayer Counter & Button
                _buildPrayerAction(),
              ],
            ),
          ),

          // Premium Badge
          if (_isPremium)
            const Positioned(
              top: 8,
              left: 8,
              child: Icon(LucideIcons.crown, size: 12, color: Colors.amber),
            ),
        ],
      ),
    );
  }

  Widget _buildFlame() {
    double size = isCompact ? 24 : 32;
    Color flameColor;

    switch (candle.color) {
      case 'gold':
        flameColor = const Color(0xFFFFD700);
        break;
      case 'blue':
        flameColor = const Color(0xFF60A5FA);
        break;
      case 'red':
        flameColor = const Color(0xFFFB7185);
        break;
      default:
        flameColor = const Color(0xFFFFA500);
    }

    return Stack(
      alignment: Alignment.center,
      children: [
        // 1. Large Ambient Glow (Breathing)
        Container(
              width: size * 2.5,
              height: size * 2.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    flameColor.withValues(alpha: 0.2),
                    Colors.transparent,
                  ],
                  stops: const [0.2, 1.0],
                ),
              ),
            )
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .scale(
              begin: const Offset(0.9, 0.9),
              end: const Offset(1.1, 1.1),
              duration: 2000.ms,
              curve: Curves.easeInOut,
            ),

        // 2. Outer Halo (Flickering)
        Container(
              width: size * 1.5,
              height: size * 1.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    flameColor.withValues(alpha: 0.4),
                    Colors.transparent,
                  ],
                ),
              ),
            )
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .scale(
              begin: const Offset(0.95, 0.95),
              end: const Offset(1.05, 1.05),
              duration: 300.ms, // Fast flicker
              curve: Curves.easeInOut,
            )
            .fade(begin: 0.8, end: 1.0, duration: 150.ms),

        // 3. Flame Shape (Moving)
        Icon(LucideIcons.flame, color: flameColor, size: size)
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .tint(
              color: Colors.orange.shade300,
              duration: 1200.ms,
            ) // Subtle color shift
            .moveY(
              begin: 0,
              end: -2,
              duration: 800.ms,
              curve: Curves.easeInOutSine,
            )
            .scaleXY(
              begin: 1.0,
              end: 1.05,
              duration: 900.ms,
              alignment: Alignment.bottomCenter,
            ),

        // 4. Inner White Hot Core (Intense)
        Positioned(
          bottom: size * 0.15,
          child:
              Container(
                    width: size * 0.4,
                    height: size * 0.4,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.white.withValues(alpha: 0.5),
                          blurRadius: 8,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  )
                  .animate(onPlay: (c) => c.repeat(reverse: true))
                  .scale(
                    begin: const Offset(0.9, 0.9),
                    end: const Offset(1.1, 1.1),
                    duration: 100.ms, // Very fast micro-flicker
                  )
                  .fade(begin: 0.8, end: 1.0, duration: 100.ms),
        ),

        // 5. Premium Sparkles (Embers)
        if (_isPremium)
          Positioned(
            bottom: size * 0.5,
            child:
                Icon(
                      LucideIcons.sparkles,
                      color: Colors.amber.shade200,
                      size: size * 0.5,
                    )
                    .animate(onPlay: (c) => c.repeat())
                    .moveY(begin: 0, end: -15, duration: 1500.ms)
                    .fade(begin: 1.0, end: 0.0, duration: 1500.ms)
                    .scale(
                      begin: const Offset(0.5, 0.5),
                      end: const Offset(1, 1),
                    ),
          ),
      ],
    );
  }

  Widget _buildPrayerAction() {
    return InkWell(
      onTap: onPray,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
                  LucideIcons.heart,
                  size: isCompact ? 10 : 12,
                  color: Colors.pink.shade400,
                )
                .animate(target: onPray != null ? 1 : 0)
                .scale(
                  begin: const Offset(1, 1),
                  end: const Offset(1.2, 1.2),
                  duration: 200.ms,
                )
                .then()
                .scale(
                  begin: const Offset(1.2, 1.2),
                  end: const Offset(1, 1),
                  duration: 200.ms,
                ),
            const SizedBox(width: 4),
            Text(
              _formatCount(candle.prayerCount),
              style: GoogleFonts.inter(
                fontSize: isCompact ? 9 : 11,
                color: Colors.pink.shade300,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return count.toString();
  }
}
