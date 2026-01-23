import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/candle_model.dart';
// Still needed for screen navigation if any

/// Rich, realistic candle widget matching web app premium design
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
  bool get _isPremium => candle.tierLabel == 'Premium';

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: _isPremium
              ? [
                  const Color(0xFF451A03).withValues(alpha: 0.4),
                  const Color(0xFF0F172A).withValues(alpha: 0.6),
                  const Color(0xFF0F172A).withValues(alpha: 0.8),
                ]
              : [
                  const Color(0xFF1E293B).withValues(alpha: 0.6),
                  const Color(0xFF0F172A).withValues(alpha: 0.8),
                ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _isPremium
              ? Colors.amber.withValues(alpha: 0.5)
              : Colors.white.withValues(alpha: 0.1),
          width: _isPremium ? 1.5 : 1,
        ),
        boxShadow: _isPremium
            ? [
                BoxShadow(
                  color: Colors.amber.withValues(alpha: 0.3),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ]
            : null,
      ),
      child: Stack(
        children: [
          Padding(
            padding: EdgeInsets.all(isCompact ? 8 : 12),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Candle Assembly
                  _buildCandleAssembly(),
                  SizedBox(height: isCompact ? 4 : 8),

                  // User Name
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
                      '"${candle.intention}"',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        color: Colors.white70,
                        fontStyle: FontStyle.italic,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 4),
                    // Time remaining
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize
                          .min, // Fix: Prevent infinite width inside FittedBox
                      children: [
                        Icon(
                          LucideIcons.clock,
                          size: 10,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${candle.remainingHours}h remaining',
                          style: GoogleFonts.inter(
                            fontSize: 9,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 8),

                  // Prayer Button
                  _buildPrayerButton(),
                ],
              ),
            ),
          ),

          // Premium Badge
          if (_isPremium)
            Positioned(
              top: -2,
              right: -2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFFFBBF24),
                      Color(0xFFF59E0B),
                      Color(0xFFF97316),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.amber.withValues(alpha: 0.4),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      LucideIcons.crown,
                      size: 10,
                      color: Color(0xFF78350F),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      'FEATURED',
                      style: GoogleFonts.inter(
                        fontSize: 7,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF78350F),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCandleAssembly() {
    return Column(
      children: [
        // Realistic Flame Overlay (Positioned relatively)
        RepaintBoundary(
          child: SizedBox(
            height: isCompact ? 40 : 60,
            child: _buildRealisticFlame(),
          ),
        ),
        // Web Image Asset
        Transform.translate(
          offset: Offset(
            0,
            isCompact ? -15 : -25,
          ), // Overlap flame with wick area
          child: Image.asset(
            _config.image,
            height: isCompact ? 80 : 140,
            fit: BoxFit.contain,
          ),
        ),
      ],
    );
  }

  Widget _buildRealisticFlame() {
    final config = _config;
    final flameWidth = isCompact ? 12.0 : 18.0;
    final flameHeight = isCompact ? 24.0 : 36.0;

    return SizedBox(
      height: flameHeight + 16,
      width: flameWidth * 4,
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          // Divine rays for premium
          if (config.hasRays)
            ...List.generate(8, (i) {
              return Positioned(
                bottom: flameHeight * 0.3,
                child: Transform.rotate(
                  angle: i * pi / 4,
                  child: Container(
                    width: 2,
                    height: 20 + Random().nextDouble() * 10,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [
                          Colors.amber.withValues(alpha: 0.6),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),

          // Outer glow
          Positioned(
            bottom: 0,
            child: Container(
              width: flameWidth * 2.5,
              height: flameWidth * 2.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: config.glowColor.withValues(
                      alpha: _isPremium ? 0.6 : 0.4,
                    ),
                    blurRadius: isCompact ? 15 : 25,
                    spreadRadius: isCompact ? 3 : 5,
                  ),
                ],
              ),
            ),
          ),

          // Sparkles for premium
          if (config.hasSparkles && !isCompact)
            ...List.generate(6, (i) {
              return Positioned(
                left: Random().nextDouble() * 30 - 15,
                bottom: Random().nextDouble() * 30,
                child: Container(
                  width: 3,
                  height: 3,
                  decoration: BoxDecoration(
                    color: Colors.yellow[200],
                    shape: BoxShape.circle,
                  ),
                ),
              );
            }),

          // Main flame
          Positioned(
            bottom: 0,
            child: Container(
              width: flameWidth,
              height: flameHeight,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: config.flameColors,
                ),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.elliptical(flameWidth / 2, flameHeight * 0.6),
                  topRight: Radius.elliptical(
                    flameWidth / 2,
                    flameHeight * 0.6,
                  ),
                  bottomLeft: Radius.circular(flameWidth / 3),
                  bottomRight: Radius.circular(flameWidth / 3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: config.flameColors[1].withValues(alpha: 0.8),
                    blurRadius: 15,
                    spreadRadius: 3,
                  ),
                ],
              ),
              child: Center(
                // White hot core
                child: Container(
                  width: flameWidth * 0.4,
                  height: flameHeight * 0.5,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [Colors.yellow[100]!, Colors.white],
                    ),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.elliptical(
                        flameWidth * 0.2,
                        flameHeight * 0.3,
                      ),
                      topRight: Radius.elliptical(
                        flameWidth * 0.2,
                        flameHeight * 0.3,
                      ),
                      bottomLeft: Radius.circular(flameWidth * 0.15),
                      bottomRight: Radius.circular(flameWidth * 0.15),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrayerButton() {
    return InkWell(
      onTap: onPray,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: EdgeInsets.symmetric(
          vertical: isCompact ? 6 : 10,
          horizontal: 8,
        ),
        decoration: BoxDecoration(
          gradient: _isPremium
              ? LinearGradient(
                  colors: [
                    Colors.pink.withValues(alpha: 0.4),
                    Colors.pink.shade400.withValues(alpha: 0.4),
                  ],
                )
              : null,
          color: _isPremium ? null : Colors.pink.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _isPremium
              ? [
                  BoxShadow(
                    color: Colors.pink.withValues(alpha: 0.2),
                    blurRadius: 8,
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              LucideIcons.heart,
              size: isCompact ? 10 : 14,
              color: _isPremium ? Colors.pink[200] : Colors.pink[300],
            ),
            const SizedBox(width: 4),
            Text(
              _formatCount(candle.prayerCount),
              style: GoogleFonts.inter(
                fontSize: isCompact ? 9 : 11,
                fontWeight: FontWeight.w600,
                color: _isPremium ? Colors.pink[200] : Colors.pink[300],
              ),
            ),
            if (!isCompact) ...[
              const SizedBox(width: 2),
              Text(
                'prayers',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  color: _isPremium ? Colors.pink[200] : Colors.pink[300],
                ),
              ),
            ],
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
