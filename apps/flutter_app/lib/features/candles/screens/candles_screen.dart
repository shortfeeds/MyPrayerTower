import 'dart:ui';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

import 'dart:math';
import '../widgets/premium_candle_widget.dart';
import '../repositories/candle_repository.dart';

import '../models/candle_model.dart';
import '../../ads/widgets/smart_ad_banner.dart';

class CandlesScreen extends ConsumerStatefulWidget {
  const CandlesScreen({super.key});

  @override
  ConsumerState<CandlesScreen> createState() => _CandlesScreenState();
}

class _CandlesScreenState extends ConsumerState<CandlesScreen> {
  List<Candle> _candles = [];
  int _peoplePraying = 24567;
  static const _baseCandleCount = 3127;

  @override
  void initState() {
    super.initState();
    _loadCandles();
    _loadCandles(); // Fetch real data
    _startPrayerCountFluctuation();
  }

  Future<void> _loadCandles() async {
    try {
      final realCandles = await ref
          .read(candleRepositoryProvider)
          .getActiveCandles();

      if (!mounted) return;

      setState(() {
        _candles = realCandles;
        _sortCandles();
      });
    } catch (e) {
      debugPrint('Error loading candles: $e');
    }
  }

  void _sortCandles() {
    const tierOrder = {
      'divine': 0,
      'marian': 1,
      'altar': 2,
      'devotion': 3,
      'free': 4,
    };
    _candles.sort((a, b) {
      final tierA = tierOrder[a.tier] ?? 4;
      final tierB = tierOrder[b.tier] ?? 4;
      return tierA.compareTo(tierB);
    });
  }

  void _startPrayerCountFluctuation() {
    Future.delayed(const Duration(seconds: 8), () {
      if (mounted) {
        setState(() {
          _peoplePraying = Random().nextInt(17000) + 18000;
        });
        _startPrayerCountFluctuation();
      }
    });
  }

  String _formatNumber(int num) {
    if (num >= 1000000) return '${(num / 1000000).toStringAsFixed(1)}M';
    if (num >= 1000) return '${(num / 1000).toStringAsFixed(1)}K';
    return num.toString();
  }

  void _showLightCandleSheet() {
    context.push('/light-candle');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: Container(
            margin: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, size: 20),
              onPressed: () => context.pop(),
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(
                  LucideIcons.history,
                  size: 20,
                  color: Colors.white70,
                ),
                onPressed: () {},
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. Master Plan: Infinite Void Background
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(0, -0.6), // Light comes from top
                  radius: 1.6,
                  colors: [
                    Color(0xFF2E1065), // Deep Royal Purple top
                    Colors.black, // Fade to void
                  ],
                  stops: [0.0, 0.8],
                ),
              ),
            ),
          ),

          // 2. Ambient Dust/Fireflies (Atmosphere)
          ...List.generate(20, (index) => _buildAmbientParticle(index)),

          // 3. Content
          SafeArea(
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                // Master Plan: Cinematic Reveal Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 32,
                    ),
                    child: Column(
                      children: [
                        // Cinematic Title with Glow
                        ShaderMask(
                              shaderCallback: (bounds) => const LinearGradient(
                                colors: [AppTheme.gold300, AppTheme.gold500],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ).createShader(bounds),
                              child: Text(
                                "Sanctuary of Light",
                                textAlign: TextAlign.center,
                                style: GoogleFonts.cinzel(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white, // Masked
                                  letterSpacing: 2.0,
                                ),
                              ),
                            )
                            .animate()
                            .fadeIn(duration: 1200.ms)
                            .moveY(
                              begin: 30,
                              end: 0,
                              curve: Curves.easeOutQuint,
                            ),

                        const SizedBox(height: 16),

                        // Poetic Subtitle
                        Text(
                          "United in prayer. Shining in darkness.",
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: Colors.white54,
                            height: 1.6,
                            letterSpacing: 0.5,
                          ),
                        ).animate().fadeIn(delay: 600.ms),
                      ],
                    ),
                  ),
                ),

                // Master Plan: Minimalist Stats (Glass Bar)
                SliverToBoxAdapter(
                  child: Center(
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 32),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(50),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildSanctuaryStat(
                            '${_baseCandleCount + _candles.length}',
                            'Burning',
                          ),
                          Container(
                            height: 16,
                            width: 1,
                            color: Colors.white24,
                            margin: const EdgeInsets.symmetric(horizontal: 24),
                          ),
                          _buildSanctuaryStat(
                            _formatNumber(_peoplePraying),
                            'Praying',
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Master Plan: "Direct Interaction" - The Light Button is a Flame
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Center(
                      child: Column(
                        children: [
                          GestureDetector(
                                onTap: _showLightCandleSheet,
                                child: Container(
                                  padding: const EdgeInsets.all(4), // Rim
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.transparent,
                                        AppTheme.gold500.withValues(alpha: 0.2),
                                      ],
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                    ),
                                    border: Border.all(
                                      color: AppTheme.gold500.withValues(
                                        alpha: 0.3,
                                      ),
                                    ),
                                  ),
                                  child: Container(
                                    width: 72,
                                    height: 72,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      gradient: AppTheme.goldGradient,
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppTheme.gold500,
                                          blurRadius: 30,
                                          spreadRadius: -5,
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      LucideIcons.flame,
                                      color: AppTheme.sacredNavy900,
                                      size: 32,
                                    ),
                                  ),
                                ),
                              )
                              .animate(onPlay: (c) => c.repeat(reverse: true))
                              .scale(
                                begin: const Offset(1.0, 1.0),
                                end: const Offset(1.05, 1.05),
                                duration: 1500.ms,
                              ),
                          const SizedBox(height: 16),
                          Text(
                            "Light a Candle",
                            style: GoogleFonts.cinzel(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.gold400,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Grotto Grid (Masonry Simulation)
                if (_candles.isNotEmpty)
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.7,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                          ),
                      delegate: SliverChildBuilderDelegate((context, index) {
                        return _buildGrottoItem(_candles[index]);
                      }, childCount: _candles.length),
                    ),
                  )
                else
                  SliverToBoxAdapter(
                    child: SizedBox(
                      height: 200,
                      child: Center(
                        child: Text(
                          "The grotto is silent... be the first light.",
                          style: GoogleFonts.inter(
                            color: Colors.white30,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ),
                  ),

                // Ad Banner - Integrated
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 32),
                    child: SmartAdBanner(page: 'candles', position: 'bottom'),
                  ),
                ),

                const SliverPadding(padding: EdgeInsets.only(bottom: 150)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSanctuaryStat(String value, String label) {
    return Row(
      children: [
        Text(
          value,
          style: GoogleFonts.cinzel(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.gold400,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label.toUpperCase(),
          style: GoogleFonts.inter(
            fontSize: 10,
            color: Colors.white54,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.0,
          ),
        ),
      ],
    );
  }

  Widget _buildGrottoItem(Candle candle) {
    return PremiumCandleWidget(
      candle: candle,
      isCompact: false, // Use full detail
      onPray: () {
        // Optimistic update
        setState(() {
          final idx = _candles.indexWhere((c) => c.id == candle.id);
          if (idx != -1) {
            _candles[idx] = candle.copyWith(
              prayerCount: candle.prayerCount + 1,
            );
          }
        });
        _showPrayerSuccess();
      },
    );
  }

  void _showPrayerSuccess() {
    // Master Plan: Haptic Feedback Visualized
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.sparkles, color: AppTheme.gold500, size: 16),
            const SizedBox(width: 12),
            Text(
              "PRAYER SENT",
              style: GoogleFonts.cinzel(
                color: AppTheme.gold300,
                fontWeight: FontWeight.bold,
                letterSpacing: 2.0,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.black.withValues(alpha: 0.9),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
        width: 200, // Compact pill
        duration: const Duration(milliseconds: 1500),
      ),
    );
  }

  Widget _buildAmbientParticle(int index) {
    final random = Random(index * 99);
    final size = random.nextDouble() * 3 + 1;
    return Positioned(
      top: random.nextDouble() * MediaQuery.of(context).size.height,
      left: random.nextDouble() * MediaQuery.of(context).size.width,
      child:
          Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.gold500.withValues(alpha: 0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
              )
              .animate(onPlay: (c) => c.repeat(reverse: true))
              .fade(duration: (2000 + random.nextInt(3000)).ms)
              .scale(
                begin: const Offset(0.5, 0.5),
                end: const Offset(1.5, 1.5),
                duration: 3000.ms,
              ),
    );
  }
}
