import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../screens/candles_screen.dart';

/// Rich, realistic candle widget matching web app premium design
class PremiumCandleWidget extends StatelessWidget {
  final VirtualCandle candle;
  final bool isCompact;
  final VoidCallback? onPray;

  const PremiumCandleWidget({
    super.key,
    required this.candle,
    this.isCompact = false,
    this.onPray,
  });

  // Tier configurations for rich visuals
  static const _tierConfigs = {
    'premium': _TierConfig(
      waxGradient: [Color(0xFFB91C1C), Color(0xFFDC2626), Color(0xFF7F1D1D)],
      flameColors: [Colors.white, Color(0xFFFEF08A), Color(0xFFFB923C)],
      glowColor: Color(0xFFFFD700),
      holderColor: [Color(0xFFFCD34D), Color(0xFFF59E0B), Color(0xFFB45309)],
      hasSparkles: true,
      hasRays: true,
      hasDrips: true,
      hasPattern: true,
    ),
    'standard': _TierConfig(
      waxGradient: [Color(0xFFFDE68A), Color(0xFFFEF9C3), Color(0xFFFDE68A)],
      flameColors: [Color(0xFFFEF3C7), Color(0xFFFDBA74), Color(0xFFF97316)],
      glowColor: Color(0xFFFB923C),
      holderColor: [Color(0xFFE5E7EB), Color(0xFF9CA3AF), Color(0xFF6B7280)],
      hasSparkles: true,
      hasRays: false,
      hasDrips: false,
      hasPattern: false,
    ),
    'basic': _TierConfig(
      waxGradient: [Color(0xFFF3F4F6), Colors.white, Color(0xFFE5E7EB)],
      flameColors: [Color(0xFFFEF08A), Color(0xFFFB923C), Color(0xFFEA580C)],
      glowColor: Color(0xFFFBBF24),
      holderColor: [Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFFD97706)],
      hasSparkles: false,
      hasRays: false,
      hasDrips: false,
      hasPattern: false,
    ),
    'free': _TierConfig(
      waxGradient: [Color(0xFFF5F5F4), Color(0xFFFAFAF9), Color(0xFFE7E5E4)],
      flameColors: [Color(0xFFFDE047), Color(0xFFFB923C), Color(0xFFEF4444)],
      glowColor: Color(0xFFFDBA74),
      holderColor: [Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFFD97706)],
      hasSparkles: false,
      hasRays: false,
      hasDrips: false,
      hasPattern: false,
    ),
  };

  _TierConfig get _config => _tierConfigs[candle.tier] ?? _tierConfigs['free']!;
  bool get _isPremium => candle.tier == 'premium';

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
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Candle Assembly
                _buildCandleAssembly(),
                SizedBox(height: isCompact ? 4 : 8),

                // User Name
                Text(
                  candle.userName,
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
        // Flame
        _buildRealisticFlame(),
        // Wick
        _buildWick(),
        // Candle Body
        _buildCandleBody(),
        // Holder
        _buildHolder(),
      ],
    );
  }

  Widget _buildRealisticFlame() {
    final config = _config;
    final flameWidth = isCompact ? 12.0 : 18.0;
    final flameHeight = isCompact ? 24.0 : 36.0;

    return SizedBox(
      height: flameHeight + 16,
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          // Divine rays for premium
          if (config.hasRays)
            ...List.generate(8, (i) {
              return Positioned(
                bottom: flameHeight * 0.3,
                child:
                    Transform.rotate(
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
                        )
                        .animate(onPlay: (c) => c.repeat(reverse: true))
                        .fadeIn(
                          duration: Duration(milliseconds: 500 + i * 100),
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
                child:
                    Container(
                          width: 3,
                          height: 3,
                          decoration: BoxDecoration(
                            color: Colors.yellow[200],
                            shape: BoxShape.circle,
                          ),
                        )
                        .animate(onPlay: (c) => c.repeat())
                        .fadeIn(duration: Duration(milliseconds: 800 + i * 200))
                        .then()
                        .fadeOut(duration: 600.ms),
              );
            }),

          // Main flame
          Positioned(
            bottom: 0,
            child:
                Container(
                      width: flameWidth,
                      height: flameHeight,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: config.flameColors,
                        ),
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.elliptical(
                            flameWidth / 2,
                            flameHeight * 0.6,
                          ),
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
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scaleXY(begin: 1.0, end: 1.05, duration: 300.ms)
                    .moveY(begin: 0, end: -2, duration: 400.ms),
          ),
        ],
      ),
    );
  }

  Widget _buildWick() {
    return Container(
      width: isCompact ? 2 : 3,
      height: isCompact ? 4 : 6,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF1F2937), Color(0xFF374151)],
        ),
        borderRadius: BorderRadius.circular(1),
      ),
    );
  }

  Widget _buildCandleBody() {
    final config = _config;
    final bodyWidth = isCompact ? 24.0 : 36.0;
    final bodyHeight =
        {
          'premium': isCompact ? 56.0 : 84.0,
          'standard': isCompact ? 48.0 : 72.0,
          'basic': isCompact ? 40.0 : 60.0,
          'free': isCompact ? 36.0 : 52.0,
        }[candle.tier] ??
        (isCompact ? 36.0 : 52.0);

    return Container(
      width: bodyWidth,
      height: bodyHeight,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: config.waxGradient,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(bodyWidth / 6),
          bottomRight: Radius.circular(bodyWidth / 6),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(2, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Left highlight (reflection)
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(
              width: bodyWidth * 0.3,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [
                    Colors.white.withValues(alpha: 0.4),
                    Colors.transparent,
                  ],
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(bodyWidth / 6),
                ),
              ),
            ),
          ),

          // Wax drips for premium
          if (config.hasDrips && !isCompact) ...[
            Positioned(
              right: -2,
              top: bodyHeight * 0.3,
              child: Container(
                width: 5,
                height: 14,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [config.waxGradient[0], config.waxGradient[2]],
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(4),
                    bottomRight: Radius.circular(4),
                  ),
                ),
              ),
            ),
            Positioned(
              left: -2,
              top: bodyHeight * 0.5,
              child: Container(
                width: 4,
                height: 10,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [config.waxGradient[0], config.waxGradient[2]],
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(3),
                    bottomRight: Radius.circular(3),
                  ),
                ),
              ),
            ),
          ],

          // Decorative pattern for premium
          if (config.hasPattern && !isCompact)
            Positioned(
              left: 0,
              right: 0,
              top: bodyHeight * 0.25,
              child: Column(
                children: [
                  // Sacred heart outline
                  Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.amber.withValues(alpha: 0.4),
                        width: 1,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Cross
                  SizedBox(
                    width: 10,
                    height: 16,
                    child: Stack(
                      children: [
                        Positioned(
                          left: 4,
                          top: 0,
                          child: Container(
                            width: 2,
                            height: 16,
                            color: Colors.amber.withValues(alpha: 0.3),
                          ),
                        ),
                        Positioned(
                          left: 0,
                          top: 4,
                          child: Container(
                            width: 10,
                            height: 2,
                            color: Colors.amber.withValues(alpha: 0.3),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Texture lines
          ...List.generate(isCompact ? 3 : 5, (i) {
            return Positioned(
              left: 0,
              right: 0,
              top: bodyHeight * (0.2 + i * 0.15),
              child: Container(
                height: 1,
                color: Colors.black.withValues(alpha: 0.05),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildHolder() {
    final config = _config;
    final holderWidth = isCompact ? 32.0 : 48.0;

    if (_isPremium) {
      // Ornate gold cathedral holder
      return Column(
        children: [
          // Base plate
          Container(
            width: holderWidth,
            height: isCompact ? 5 : 7,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: config.holderColor),
              borderRadius: BorderRadius.circular(holderWidth / 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.amber.withValues(alpha: 0.3),
                  blurRadius: 4,
                ),
              ],
            ),
            child: Stack(
              children: [
                Positioned(
                  left: 0,
                  right: 0,
                  top: 0,
                  child: Container(
                    height: 3,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.yellow[200]!.withValues(alpha: 0.5),
                          Colors.transparent,
                        ],
                      ),
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(holderWidth / 2),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Decorative stem
          Container(
            width: holderWidth * 0.4,
            height: isCompact ? 6 : 10,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [config.holderColor[0], config.holderColor[2]],
              ),
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(4),
              ),
            ),
          ),
          // Bottom base
          Container(
            width: holderWidth * 1.2,
            height: isCompact ? 4 : 6,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: config.holderColor),
              borderRadius: BorderRadius.circular(holderWidth / 2),
            ),
          ),
        ],
      );
    }

    if (candle.tier == 'standard') {
      // Silver holder
      return Column(
        children: [
          Container(
            width: holderWidth * 0.8,
            height: isCompact ? 4 : 5,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: config.holderColor),
              borderRadius: BorderRadius.circular(holderWidth / 2),
            ),
          ),
          Container(
            width: holderWidth,
            height: isCompact ? 4 : 5,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: config.holderColor),
              borderRadius: BorderRadius.circular(holderWidth / 2),
            ),
          ),
        ],
      );
    }

    // Simple brass dish for basic/free
    return Container(
      width: holderWidth * 0.8,
      height: isCompact ? 4 : 5,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: config.holderColor),
        borderRadius: BorderRadius.circular(holderWidth / 2),
      ),
    );
  }

  Widget _buildPrayerButton() {
    return InkWell(
      onTap: onPray,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
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
  final List<Color> waxGradient;
  final List<Color> flameColors;
  final Color glowColor;
  final List<Color> holderColor;
  final bool hasSparkles;
  final bool hasRays;
  final bool hasDrips;
  final bool hasPattern;

  const _TierConfig({
    required this.waxGradient,
    required this.flameColors,
    required this.glowColor,
    required this.holderColor,
    required this.hasSparkles,
    required this.hasRays,
    required this.hasDrips,
    required this.hasPattern,
  });
}
