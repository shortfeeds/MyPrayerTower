import 'dart:math';
import 'package:flutter/material.dart';

/// Candle tier configuration matching web app design
enum CandleTier { premium, standard, basic, free }

class CandleTierConfig {
  final List<Color> waxGradient;
  final List<Color> flameGradient;
  final Color glowColor;
  final double glowIntensity;
  final bool hasSparkles;
  final bool hasRays;
  final bool hasDrips;

  const CandleTierConfig({
    required this.waxGradient,
    required this.flameGradient,
    required this.glowColor,
    required this.glowIntensity,
    this.hasSparkles = false,
    this.hasRays = false,
    this.hasDrips = false,
  });

  static CandleTierConfig getConfig(CandleTier tier) {
    switch (tier) {
      case CandleTier.premium:
        return const CandleTierConfig(
          waxGradient: [
            Color(0xFF991B1B),
            Color(0xFFB91C1C),
            Color(0xFF7F1D1D),
          ],
          flameGradient: [Colors.white, Color(0xFFFEF08A), Color(0xFFFB923C)],
          glowColor: Color(0xFFFFD700),
          glowIntensity: 0.8,
          hasSparkles: true,
          hasRays: true,
          hasDrips: true,
        );
      case CandleTier.standard:
        return const CandleTierConfig(
          waxGradient: [
            Color(0xFFFEF3C7),
            Color(0xFFFEF9C3),
            Color(0xFFFDE68A),
          ],
          flameGradient: [
            Color(0xFFFEF9C3),
            Color(0xFFFDBA74),
            Color(0xFFF97316),
          ],
          glowColor: Color(0xFFFFA500),
          glowIntensity: 0.6,
          hasSparkles: true,
        );
      case CandleTier.basic:
        return const CandleTierConfig(
          waxGradient: [Color(0xFFF3F4F6), Colors.white, Color(0xFFE5E7EB)],
          flameGradient: [
            Color(0xFFFEF08A),
            Color(0xFFFB923C),
            Color(0xFFEA580C),
          ],
          glowColor: Color(0xFFFF8C00),
          glowIntensity: 0.5,
        );
      case CandleTier.free:
        return const CandleTierConfig(
          waxGradient: [
            Color(0xFFF5F5F4),
            Color(0xFFFAFAF9),
            Color(0xFFE7E5E4),
          ],
          flameGradient: [
            Color(0xFFFDE047),
            Color(0xFFFB923C),
            Color(0xFFEF4444),
          ],
          glowColor: Color(0xFFFF7800),
          glowIntensity: 0.4,
        );
    }
  }
}

/// Realistic animated flame widget
class RealisticFlame extends StatefulWidget {
  final CandleTier tier;
  final bool isSmall;

  const RealisticFlame({super.key, required this.tier, this.isSmall = false});

  @override
  State<RealisticFlame> createState() => _RealisticFlameState();
}

class _RealisticFlameState extends State<RealisticFlame>
    with TickerProviderStateMixin {
  late AnimationController _flickerController;
  late AnimationController _tipController;
  late Animation<double> _flickerAnimation;
  late Animation<double> _tipAnimation;

  @override
  void initState() {
    super.initState();
    _flickerController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    )..repeat(reverse: true);

    _tipController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    )..repeat(reverse: true);

    _flickerAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _flickerController, curve: Curves.easeInOut),
    );

    _tipAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(parent: _tipController, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _flickerController.dispose();
    _tipController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final config = CandleTierConfig.getConfig(widget.tier);
    final baseWidth = widget.isSmall ? 12.0 : 20.0;
    final baseHeight = widget.isSmall ? 24.0 : 40.0;

    return SizedBox(
      width: baseWidth * 3,
      height: baseHeight * 1.5,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Divine rays for premium
          if (config.hasRays && !widget.isSmall)
            ...List.generate(8, (i) {
              return Positioned(
                top: 0,
                child: Transform.rotate(
                  angle: i * pi / 4,
                  child: AnimatedBuilder(
                    animation: _flickerController,
                    builder: (context, child) {
                      return Container(
                        width: 2,
                        height: 20 + Random().nextDouble() * 15,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              config.glowColor.withValues(alpha: 0.8),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              );
            }),

          // Outer glow
          Positioned(
            top: widget.isSmall ? 5 : 0,
            child: Container(
              width: widget.isSmall ? 30 : 60,
              height: widget.isSmall ? 30 : 60,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: config.glowColor.withValues(
                      alpha: config.glowIntensity,
                    ),
                    blurRadius: widget.isSmall ? 15 : 30,
                    spreadRadius: widget.isSmall ? 5 : 10,
                  ),
                ],
              ),
            ),
          ),

          // Sparkles for premium/standard
          if (config.hasSparkles && !widget.isSmall)
            ...List.generate(6, (i) {
              return Positioned(
                left: 10 + Random().nextDouble() * 30,
                top: Random().nextDouble() * 30,
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 1),
                  duration: Duration(
                    milliseconds: 1500 + Random().nextInt(1000),
                  ),
                  curve: Curves.easeInOut,
                  builder: (context, value, child) {
                    return Opacity(
                      opacity: (sin(value * 2 * pi) * 0.5 + 0.5),
                      child: Container(
                        width: 4,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF08A),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: config.glowColor.withValues(alpha: 0.5),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              );
            }),

          // Main flame
          Positioned(
            bottom: widget.isSmall ? 2 : 4,
            child: AnimatedBuilder(
              animation: _flickerAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _flickerAnimation.value,
                  child: Container(
                    width: baseWidth,
                    height: baseHeight,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: config.flameGradient,
                      ),
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(baseWidth * 0.6),
                        topRight: Radius.circular(baseWidth * 0.6),
                        bottomLeft: Radius.circular(baseWidth * 0.4),
                        bottomRight: Radius.circular(baseWidth * 0.4),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: config.glowColor.withValues(alpha: 0.8),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Container(
                        width: baseWidth * 0.5,
                        height: baseHeight * 0.5,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.white, Color(0xFFFEF9C3)],
                          ),
                          borderRadius: BorderRadius.circular(baseWidth * 0.25),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Flame tip wisp
          Positioned(
            bottom: baseHeight + (widget.isSmall ? 0 : 2),
            child: AnimatedBuilder(
              animation: _tipAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scaleY: _tipAnimation.value,
                  child: Container(
                    width: widget.isSmall ? 4 : 6,
                    height: widget.isSmall ? 8 : 12,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          config.flameGradient[1].withValues(alpha: 0.8),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// Candle wax body widget
class CandleBody extends StatelessWidget {
  final CandleTier tier;
  final bool isSmall;

  const CandleBody({super.key, required this.tier, this.isSmall = false});

  double get _height {
    switch (tier) {
      case CandleTier.premium:
        return isSmall ? 64 : 96;
      case CandleTier.standard:
        return isSmall ? 56 : 80;
      case CandleTier.basic:
        return isSmall ? 48 : 64;
      case CandleTier.free:
        return isSmall ? 40 : 56;
    }
  }

  @override
  Widget build(BuildContext context) {
    final config = CandleTierConfig.getConfig(tier);
    final width = isSmall ? 24.0 : 40.0;

    return SizedBox(
      width: width + 8,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Wick
          Container(
            width: isSmall ? 2 : 4,
            height: isSmall ? 6 : 8,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF374151), Color(0xFF1F2937)],
              ),
              borderRadius: BorderRadius.circular(1),
            ),
          ),

          // Main candle body
          Container(
            width: width,
            height: _height,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: config.waxGradient,
                stops: const [0.0, 0.5, 1.0],
              ),
              borderRadius: BorderRadius.vertical(
                bottom: Radius.circular(isSmall ? 4 : 6),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.3),
                  blurRadius: 4,
                  offset: const Offset(2, 2),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Left highlight
                Positioned(
                  left: 0,
                  top: 0,
                  bottom: 0,
                  child: Container(
                    width: width * 0.3,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          Colors.white.withValues(alpha: 0.4),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),

                // Wax drips for premium
                if (config.hasDrips && !isSmall) ...[
                  Positioned(
                    right: -2,
                    top: 32,
                    child: Container(
                      width: 6,
                      height: 16,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            config.waxGradient[0],
                            config.waxGradient[2],
                          ],
                        ),
                        borderRadius: const BorderRadius.vertical(
                          bottom: Radius.circular(4),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    left: -2,
                    top: 48,
                    child: Container(
                      width: 4,
                      height: 12,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            config.waxGradient[0],
                            config.waxGradient[2],
                          ],
                        ),
                        borderRadius: const BorderRadius.vertical(
                          bottom: Radius.circular(3),
                        ),
                      ),
                    ),
                  ),
                ],

                // Decorative patterns for premium
                if (tier == CandleTier.premium && !isSmall)
                  Positioned.fill(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 16,
                            height: 16,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: const Color(
                                  0xFFFBBF24,
                                ).withValues(alpha: 0.5),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Cross
                          SizedBox(
                            width: 12,
                            height: 20,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  width: 2,
                                  height: 20,
                                  color: const Color(
                                    0xFFFBBF24,
                                  ).withValues(alpha: 0.4),
                                ),
                                Positioned(
                                  top: 4,
                                  child: Container(
                                    width: 12,
                                    height: 2,
                                    color: const Color(
                                      0xFFFBBF24,
                                    ).withValues(alpha: 0.4),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Texture lines
                ...List.generate(isSmall ? 3 : 5, (i) {
                  return Positioned(
                    left: 0,
                    right: 0,
                    top: _height * (0.2 + i * 0.15),
                    child: Container(
                      height: 1,
                      color: Colors.black.withValues(alpha: 0.05),
                    ),
                  );
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Candle holder widget
class CandleHolder extends StatelessWidget {
  final CandleTier tier;
  final bool isSmall;

  const CandleHolder({super.key, required this.tier, this.isSmall = false});

  @override
  Widget build(BuildContext context) {
    if (tier == CandleTier.premium) {
      return _buildOrnateGoldHolder();
    } else if (tier == CandleTier.standard) {
      return _buildSilverHolder();
    }
    return _buildSimpleDishHolder();
  }

  Widget _buildOrnateGoldHolder() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Base plate
        Container(
          width: isSmall ? 40 : 64,
          height: isSmall ? 6 : 8,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFFCD34D), Color(0xFFEAB308), Color(0xFFCA8A04)],
            ),
            borderRadius: BorderRadius.circular(isSmall ? 3 : 4),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Align(
            alignment: Alignment.topCenter,
            child: Container(
              width: double.infinity,
              height: isSmall ? 2 : 3,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(0xFFFEF08A).withValues(alpha: 0.5),
                    Colors.transparent,
                  ],
                ),
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(isSmall ? 3 : 4),
                ),
              ),
            ),
          ),
        ),
        // Decorative stem
        Container(
          width: isSmall ? 16 : 24,
          height: isSmall ? 8 : 12,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFFBBF24), Color(0xFFCA8A04)],
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(4)),
          ),
        ),
        // Bottom base
        Container(
          width: isSmall ? 48 : 80,
          height: isSmall ? 4 : 8,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFF59E0B), Color(0xFFD97706), Color(0xFFB45309)],
            ),
            borderRadius: BorderRadius.circular(isSmall ? 2 : 4),
          ),
        ),
      ],
    );
  }

  Widget _buildSilverHolder() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: isSmall ? 32 : 48,
          height: isSmall ? 4 : 6,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFE5E7EB), Color(0xFF9CA3AF), Color(0xFF6B7280)],
            ),
            borderRadius: BorderRadius.circular(isSmall ? 2 : 3),
          ),
        ),
        Container(
          width: isSmall ? 40 : 56,
          height: isSmall ? 4 : 6,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFD1D5DB), Color(0xFF6B7280)],
            ),
            borderRadius: BorderRadius.circular(isSmall ? 2 : 3),
          ),
        ),
      ],
    );
  }

  Widget _buildSimpleDishHolder() {
    return Container(
      width: isSmall ? 32 : 48,
      height: isSmall ? 4 : 6,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFFFDE68A), Color(0xFFFBBF24), Color(0xFFF59E0B)],
        ),
        borderRadius: BorderRadius.circular(isSmall ? 2 : 3),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(0, 1)),
        ],
      ),
    );
  }
}

/// Complete candle assembly
class RealisticCandle extends StatelessWidget {
  final CandleTier tier;
  final bool isSmall;

  const RealisticCandle({super.key, required this.tier, this.isSmall = false});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        RealisticFlame(tier: tier, isSmall: isSmall),
        CandleBody(tier: tier, isSmall: isSmall),
        CandleHolder(tier: tier, isSmall: isSmall),
      ],
    );
  }
}
