import 'dart:ui';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/billing/billing_service.dart';

import '../../../core/providers/scaffold_key_provider.dart';
import 'dart:math';
import '../widgets/premium_candle_widget.dart';
import '../repositories/candle_repository.dart';

import '../models/candle_model.dart';
import '../../ads/widgets/smart_ad_banner.dart';

// Duration options moved to LightCandleScreen

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
    // OPTIMIZATION: Load mock data immediately so screen isn't empty
    // Live data only - no initial mock data
    _loadCandles();

    // Then fetch real data in background
    _loadCandles();
    _startPrayerCountFluctuation();
  }

  Future<void> _loadCandles() async {
    // Generate fresh mock data to merge with
    // (Or reuse existing, but generating fresh ensures consisteny if called multiple times)
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
    // Sort logic matching web app: Divine > Marian > Altar > Devotion > Free
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

  // Mock data removed in favor of live data

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

  int get _totalPrayers => _candles.fold(0, (sum, c) => sum + c.prayerCount);

  List<Candle> get _premiumCandles => _candles
      .where((c) => ['divine', 'marian', 'altar'].contains(c.tier))
      .toList();
  List<Candle> get _standardCandles =>
      _candles.where((c) => c.tier == 'devotion').toList();
  List<Candle> get _freeCandles =>
      _candles.where((c) => c.tier == 'free').toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: Stack(
        children: [
          // 1. Ambient Background
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment(0, -0.2),
                  radius: 1.2,
                  colors: [Color(0xFF1E293B), AppTheme.deepSpace],
                ),
              ),
            ),
          ),

          // 2. Particle Effects
          ...List.generate(20, (index) => _buildParticle(index)),

          // 3. Main Content
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => ref
                                  .read(scaffoldKeyProvider)
                                  .currentState
                                  ?.openDrawer(),
                              icon: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  LucideIcons.menu,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              ),
                            ),
                            const Spacer(),
                            IconButton(
                              onPressed: () => ref
                                  .read(billingServiceProvider)
                                  .restorePurchases(),
                              icon: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  LucideIcons.refreshCcw,
                                  color: Colors.white70,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Virtual Prayer Candles',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            shadows: [
                              Shadow(
                                color: AppTheme.gold500.withValues(alpha: 0.5),
                                blurRadius: 15,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Light a candle for your intentions and join thousands praying together.',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppTheme.textSecondary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        // Premium CTA Button
                        SizedBox(
                          height: 56,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [AppTheme.gold400, AppTheme.gold600],
                              ),
                              borderRadius: BorderRadius.circular(28),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.gold500.withValues(
                                    alpha: 0.4,
                                  ),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: _showLightCandleSheet,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(28),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 40,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    LucideIcons.flame,
                                    color: Color(0xFF78350F),
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'Light My Candle',
                                    style: GoogleFonts.outfit(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF78350F),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ).animate().scale(
                          delay: 400.ms,
                          duration: 600.ms,
                          curve: Curves.elasticOut,
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Glassmorphic Stats Bar
              SliverToBoxAdapter(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildStat(
                            LucideIcons.flame,
                            'Active',
                            '${_baseCandleCount + _candles.length}',
                            AppTheme.gold500,
                          ),
                          _buildStat(
                            LucideIcons.heart,
                            'Prayers',
                            _formatNumber(_totalPrayers),
                            AppTheme.error,
                          ),
                          _buildStat(
                            LucideIcons.users,
                            'Praying',
                            _formatNumber(_peoplePraying),
                            AppTheme.info,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 32)),

              // Candle Sections
              if (_candles.isNotEmpty) ...[
                _buildCandleSection(
                  title: 'Featured Memorials',
                  icon: LucideIcons.crown,
                  iconColor: AppTheme.gold500,
                  badge: 'MOST PRAYERS',
                  candles: _premiumCandles,
                  crossAxisCount: 3,
                ),
                _buildCandleSection(
                  title: 'Standard Devotions',
                  icon: LucideIcons.sparkles,
                  iconColor: Colors.blue.shade300,
                  candles: _standardCandles,
                  crossAxisCount: 3,
                ),
                _buildCandleSection(
                  title: 'Community Intentions',
                  icon: LucideIcons.flame,
                  iconColor: AppTheme.textMuted,
                  candles: _freeCandles,
                  crossAxisCount: 4,
                  isCompact: true,
                ),
              ] else ...[
                // Empty State
                SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 60),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            LucideIcons.flame,
                            size: 48,
                            color: Colors.white12,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Be the first to light a candle',
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 18,
                              color: AppTheme.textMuted,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],

              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: SmartAdBanner(page: 'candles', position: 'bottom'),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildParticle(int index) {
    final random = Random(index);
    final size = random.nextDouble() * 3 + 1;
    final duration = 3000 + random.nextInt(3000);

    return Positioned(
      left: random.nextDouble() * 500, // Reasonable width
      top: random.nextDouble() * 800, // Reasonable height
      child:
          Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  color: AppTheme.gold400.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                  boxShadow: const [
                    BoxShadow(color: AppTheme.gold500, blurRadius: 4),
                  ],
                ),
              )
              .animate(onPlay: (c) => c.repeat())
              .moveY(
                begin: 0,
                end: -50 - random.nextDouble() * 50,
                duration: duration.ms,
              )
              .fadeIn(duration: (duration * 0.2).ms)
              .fadeOut(
                delay: (duration * 0.8).ms,
                duration: (duration * 0.2).ms,
              ),
    );
  }

  Widget _buildStat(IconData icon, String label, String value, Color color) {
    return Expanded(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 4),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              label,
              style: GoogleFonts.inter(fontSize: 11, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }

  String _formatNumber(int num) {
    if (num >= 1000000) return '${(num / 1000000).toStringAsFixed(1)}M';
    if (num >= 1000) return '${(num / 1000).toStringAsFixed(1)}K';
    return num.toString();
  }

  Widget _buildCandleSection({
    required String title,
    required IconData icon,
    required Color iconColor,
    String? badge,
    required List<Candle> candles,
    required int crossAxisCount,
    bool isCompact = false,
  }) {
    if (candles.isEmpty) {
      return const SliverToBoxAdapter(child: SizedBox.shrink());
    }

    return SliverPadding(
      padding: const EdgeInsets.all(16),
      sliver: SliverToBoxAdapter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Header
            Row(
              children: [
                Icon(icon, color: iconColor, size: isCompact ? 20 : 24),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: isCompact ? 16 : 18,
                    fontWeight: FontWeight.bold,
                    color: isCompact ? Colors.grey : Colors.white,
                  ),
                ),
                if (badge != null) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Colors.amber, Colors.orange],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      badge,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 12),
            // Candle Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: crossAxisCount,
                childAspectRatio: isCompact ? 0.8 : 0.65,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
              ),
              // Increase limit to 12 to show more rows
              itemCount: candles.length > (isCompact ? 12 : 12)
                  ? (isCompact ? 12 : 12)
                  : candles.length,
              itemBuilder: (context, index) {
                final candle = candles[index];
                return PremiumCandleWidget(
                  candle: candle,
                  isCompact: isCompact,
                  onPray: () {
                    // Optimistic update
                    setState(() {
                      // Create a new candle instance with incremented prayer count
                      final updatedCandle = candle.copyWith(
                        prayerCount: candle.prayerCount + 1,
                      );

                      // Find and replace in list
                      final index = _candles.indexWhere(
                        (c) => c.id == candle.id,
                      );
                      if (index != -1) {
                        _candles[index] = updatedCandle;
                      }
                    });

                    // Beautiful Success Dialog
                    showDialog(
                      context: context,
                      builder: (context) => Dialog(
                        backgroundColor: Colors.transparent,
                        child: Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Color(0xFF1E1B4B), // Indigo 950
                                Color(0xFF312E81), // Indigo 900
                              ],
                            ),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: const Color(
                                0xFFFFD700,
                              ).withValues(alpha: 0.3),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(
                                  0xFFFFD700,
                                ).withValues(alpha: 0.1),
                                blurRadius: 20,
                                spreadRadius: 0,
                              ),
                            ],
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                LucideIcons.heartHandshake,
                                color: Color(0xFFFFD700),
                                size: 48,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Prayer Offered',
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                '"Your prayer has been offered.\nYou are not alone."',
                                textAlign: TextAlign.center,
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  height: 1.5,
                                  color: Colors.white.withValues(alpha: 0.9),
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                onPressed: () => Navigator.of(context).pop(),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFFFD700),
                                  foregroundColor: const Color(0xFF1E1B4B),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 32,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                ),
                                child: const Text(
                                  'Amen',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showLightCandleSheet() {
    context.push('/light-candle');
  }
}

// End of file - _CandleCard removed in favor of AnimatedCandle widget
