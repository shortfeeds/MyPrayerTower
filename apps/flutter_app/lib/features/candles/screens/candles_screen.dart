import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/billing/billing_service.dart';

import '../../../core/providers/scaffold_key_provider.dart';
import 'dart:math';
import '../widgets/premium_candle_widget.dart';
import '../repositories/candle_repository.dart';

import '../models/candle_model.dart';

// Duration options moved to LightCandleScreen

class CandlesScreen extends ConsumerStatefulWidget {
  const CandlesScreen({super.key});

  @override
  ConsumerState<CandlesScreen> createState() => _CandlesScreenState();
}

class _CandlesScreenState extends ConsumerState<CandlesScreen> {
  List<Candle> _candles = [];
  int _peoplePraying = 24567;

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
    // Sort logic matching web app: Premium > Standard > Basic > Free
    const tierOrder = {'premium': 0, 'standard': 1, 'basic': 2, 'free': 3};
    _candles.sort((a, b) {
      final tierA = tierOrder[a.tier] ?? 3;
      final tierB = tierOrder[b.tier] ?? 3;
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

  List<Candle> get _premiumCandles =>
      _candles.where((c) => c.tier == 'premium').toList();
  List<Candle> get _standardCandles =>
      _candles.where((c) => c.tier == 'standard').toList();
  List<Candle> get _basicCandles =>
      _candles.where((c) => c.tier == 'basic').toList();
  List<Candle> get _freeCandles =>
      _candles.where((c) => c.tier == 'free').toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0f172a), // Solid dark navy (no image)
      body: Stack(
        children: [
          // Main Content
          CustomScrollView(
            slivers: [
              // Gradient Header (Transparent to show altar, just branding)
              SliverToBoxAdapter(
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        // Back button row
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(
                                LucideIcons.menu,
                                color: Colors.white,
                              ),
                              onPressed: () => ref
                                  .read(scaffoldKeyProvider)
                                  .currentState
                                  ?.openDrawer(),
                            ),
                            const Spacer(),
                            IconButton(
                              icon: const Icon(
                                LucideIcons.refreshCcw,
                                color: Colors.white70,
                              ),
                              onPressed: () => ref
                                  .read(billingServiceProvider)
                                  .restorePurchases(),
                              tooltip: 'Restore Purchases',
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Title
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              LucideIcons.flame,
                              color: Colors.amber,
                              size: 32,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Virtual Prayer Candles',
                              style: GoogleFonts.merriweather(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                shadows: [
                                  Shadow(
                                    offset: const Offset(0, 2),
                                    blurRadius: 4,
                                    color: Colors.black.withValues(alpha: 0.5),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Light a candle for your intentions and join thousands praying together.',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: Colors.white.withValues(alpha: 0.9),
                            shadows: [
                              Shadow(
                                offset: const Offset(0, 1),
                                blurRadius: 2,
                                color: Colors.black.withValues(alpha: 0.5),
                              ),
                            ],
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        // Light Candle Button
                        ElevatedButton(
                          onPressed: _showLightCandleSheet,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 32,
                              vertical: 16,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            elevation: 8,
                            shadowColor: Colors.amber.shade900,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text('🕯️', style: TextStyle(fontSize: 20)),
                              const SizedBox(width: 8),
                              Text(
                                'Light Your Candle',
                                style: GoogleFonts.inter(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Stats Bar
              SliverToBoxAdapter(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStat(
                        LucideIcons.flame,
                        'Active Candles',
                        '${_candles.length}',
                        Colors.amber,
                      ),
                      _buildStat(
                        LucideIcons.heart,
                        'Total Prayers',
                        _formatNumber(_totalPrayers),
                        Colors.pink,
                      ),
                      _buildStat(
                        LucideIcons.users,
                        'People Praying',
                        _formatNumber(_peoplePraying),
                        Colors.blue,
                      ),
                    ],
                  ),
                ),
              ),

              // Premium Candles Section
              if (_candles.isNotEmpty) ...[
                _buildCandleSection(
                  title: 'Premium Candles',
                  icon: LucideIcons.crown,
                  iconColor: Colors.amber,
                  badge: 'MOST PRAYERS',
                  candles: _premiumCandles,
                  crossAxisCount: 3,
                ),

                _buildCandleSection(
                  title: 'Standard Candles',
                  icon: LucideIcons.star,
                  iconColor: Colors.blue.shade400,
                  candles: _standardCandles,
                  crossAxisCount: 3,
                ),

                _buildCandleSection(
                  title: 'Community Candles',
                  icon: LucideIcons.flame,
                  iconColor: Colors.grey,
                  candles: [..._basicCandles, ..._freeCandles],
                  crossAxisCount: 4,
                  isCompact: true,
                ),
              ] else ...[
                // Empty State
                SliverToBoxAdapter(
                  child: Container(
                    height: 300,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          LucideIcons.flame,
                          size: 48,
                          color: Colors.white.withValues(alpha: 0.3),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Be the first to light a candle',
                          style: GoogleFonts.merriweather(
                            fontSize: 18,
                            color: Colors.white.withValues(alpha: 0.7),
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ],
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
