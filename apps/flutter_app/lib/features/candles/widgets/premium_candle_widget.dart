import 'dart:ui';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/candle_model.dart';
import '../../../core/theme/app_theme.dart';

/// Rich, realistic candle widget matching web app premium design
/// Updated with "Master Plan" Glassmorphism & Cinematic Effects
class PremiumCandleWidget extends StatelessWidget {
  final Candle candle;
  final bool isCompact;
  final VoidCallback? onPray;

  const PremiumCandleWidget({
    super.key,
    required this.candle,
    this.isCompact = false,
    this.onPray,
  });

  // Tier configurations for rich visuals matching Web App
  static const _tierConfigs = {
    'divine': _TierConfig(
      image: 'assets/images/candles/divine.png',
      flameColors: [Colors.white, Color(0xFFFEF08A), Color(0xFFFB923C)],
      glowColor: Color(0xFFFFD700),
      hasSparkles: true,
      hasRays: true,
    ),
    'marian': _TierConfig(
      image: 'assets/images/candles/marian_glow.png',
      flameColors: [Color(0xFFE0F2FE), Color(0xFF7DD3FC), Color(0xFF0EA5E9)],
      glowColor: Color(0xFF0EA5E9),
      hasSparkles: true,
      hasRays: true,
    ),
    'altar': _TierConfig(
      image: 'assets/images/candles/altar.png',
      flameColors: [Color(0xFFFEF3C7), Color(0xFFFDBA74), Color(0xFFF97316)],
      glowColor: Color(0xFFFB923C),
      hasSparkles: true,
      hasRays: false,
    ),
    'devotion': _TierConfig(
      image: 'assets/images/candles/devotion_glow.png',
      flameColors: [Color(0xFFFEF08A), Color(0xFFFB923C), Color(0xFFEA580C)],
      glowColor: Color(0xFFFBBF24),
      hasSparkles: false,
      hasRays: false,
    ),
    'free': _TierConfig(
      image: 'assets/images/candles/humble.png',
      flameColors: [Color(0xFFFDE047), Color(0xFFFB923C), Color(0xFFEF4444)],
      glowColor: Color(0xFFFDBA74),
      hasSparkles: false,
      hasRays: false,
    ),
  };

  _TierConfig get _config => _tierConfigs[candle.tier] ?? _tierConfigs['free']!;

  @override
  Widget build(BuildContext context) {
    // Master Plan: "Glassmorphic" Container
    return InkWell(
      onTap: onPray,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          // Glassmorphism 2.0: Subtle top-down gradient + blur simulation
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.white.withValues(alpha: 0.08), // Light reflection at top
              Colors.white.withValues(alpha: 0.02), // Fades to clear
            ],
          ),
          // "Light Rim" border only at top
          border: Border(
            top: BorderSide(
              color: Colors.white.withValues(alpha: 0.3),
              width: 1,
            ),
            bottom: BorderSide.none,
            left: BorderSide.none,
            right: BorderSide.none,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5), // Frosted glass
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // 1. The Living Flame (Centerpiece)
                  _buildLivingCandle(),

                  const SizedBox(height: 12),

                  // 2. Metallic Typography
                  Text(
                    candle.displayName.toUpperCase(),
                    style: GoogleFonts.cinzel(
                      fontSize: isCompact ? 10 : 12,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFE2E8F0), // Silver
                      letterSpacing: 1.0,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),

                  if (!isCompact) ...[
                    const SizedBox(height: 4),
                    Text(
                      '"${candle.intention}"',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: Colors.white.withValues(
                          alpha: 0.6,
                        ), // Muted Spirit
                        fontStyle: FontStyle.italic,
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 12),

                    // 3. Minimalist Stats (No buttons, just data)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            LucideIcons.flame,
                            size: 10,
                            color: AppTheme.gold500,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _formatCount(candle.prayerCount),
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.gold400,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    ).animate().scale(
      duration: 400.ms,
      curve: Curves.easeOutBack,
      begin: const Offset(0.95, 0.95), // Subtle entrance pop
    );
  }

  Widget _buildLivingCandle() {
    // "Breathing" Animation via Animate
    return SizedBox(
      height: isCompact ? 100 : 140,
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          // Dynamic Glow (Back)
          Positioned(
            bottom: 40,
            child:
                Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _config.glowColor.withValues(alpha: 0.4),
                        boxShadow: [
                          BoxShadow(
                            color: _config.glowColor.withValues(alpha: 0.2),
                            blurRadius: 40,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scale(
                      begin: const Offset(0.9, 0.9),
                      end: const Offset(1.2, 1.2),
                      duration: (2000 + Random().nextInt(1000))
                          .ms, // Randomized breathing
                    ),
          ),

          // The Candle Asset
          Image.asset(_config.image, fit: BoxFit.contain),
        ],
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return count.toString();
  }
}

/// Tier configuration for candle visuals
class _TierConfig {
  final String image;
  final List<Color> flameColors;
  final Color glowColor;
  final bool hasSparkles;
  final bool hasRays;

  const _TierConfig({
    required this.image,
    required this.flameColors,
    required this.glowColor,
    required this.hasSparkles,
    required this.hasRays,
  });
}
