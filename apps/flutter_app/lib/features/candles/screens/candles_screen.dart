import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/billing/product_ids.dart';
import '../../../core/providers/scaffold_key_provider.dart';
import 'dart:math';
import '../widgets/premium_candle_widget.dart';

// Candle model for display
class VirtualCandle {
  final String id;
  final String userName;
  final String intention;
  final String tier; // 'premium', 'standard', 'basic', 'free'
  final Color color;
  final int remainingHours;
  final int prayerCount;

  const VirtualCandle({
    required this.id,
    required this.userName,
    required this.intention,
    required this.tier,
    required this.color,
    required this.remainingHours,
    required this.prayerCount,
  });
}

// Duration options with pricing
class CandleDuration {
  final String value;
  final String label;
  final int hours;
  final int priceInCents;
  final String priceDisplay;
  final String tier;

  const CandleDuration({
    required this.value,
    required this.label,
    required this.hours,
    required this.priceInCents,
    required this.priceDisplay,
    required this.tier,
  });
}

const List<CandleDuration> _durations = [
  CandleDuration(
    value: 'ONE_DAY',
    label: '1 Day',
    hours: 24,
    priceInCents: 0,
    priceDisplay: 'Free',
    tier: 'free',
  ),
  CandleDuration(
    value: 'THREE_DAYS',
    label: '3 Days',
    hours: 72,
    priceInCents: 299,
    priceDisplay: '\$2.99',
    tier: 'basic',
  ),
  CandleDuration(
    value: 'SEVEN_DAYS',
    label: '7 Days',
    hours: 168,
    priceInCents: 599,
    priceDisplay: '\$5.99',
    tier: 'standard',
  ),
  CandleDuration(
    value: 'THIRTY_DAYS',
    label: '30 Days',
    hours: 720,
    priceInCents: 1499,
    priceDisplay: '\$14.99',
    tier: 'premium',
  ),
];

// Color scheme for candle tiers
const Map<String, Color> _tierColors = {
  'premium': Color(0xFFFFD700), // Gold
  'standard': Color(0xFF60A5FA), // Blue
  'basic': Color(0xFFFB7185), // Rose
  'free': Color(0xFFFFA500), // Orange/White
};

class CandlesScreen extends ConsumerStatefulWidget {
  const CandlesScreen({super.key});

  @override
  ConsumerState<CandlesScreen> createState() => _CandlesScreenState();
}

class _CandlesScreenState extends ConsumerState<CandlesScreen> {
  List<VirtualCandle> _candles = [];
  int _peoplePraying = 24567;
  String _selectedDuration = 'ONE_DAY';
  String _userName = '';
  String _intention = '';
  bool _isAnonymous = false;
  final bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _generateSampleCandles();
    _startPrayerCountFluctuation();
  }

  void _generateSampleCandles() {
    final random = Random();
    final intentions = [
      "For my mother's healing",
      "Thanksgiving for answered prayers",
      "For peace in our family",
      "Protection for my children",
      "Guidance in career decision",
      "For the souls in purgatory",
      "For my husband's recovery",
      "Safe delivery for our baby",
      "For vocations to priesthood",
      "Healing from depression",
      "Reconciliation with my sister",
      "For our marriage",
      "Job opportunity for my son",
      "For conversion of sinners",
      "Peace in our troubled world",
    ];
    final names = [
      "Maria G.",
      "Fr. Thomas K.",
      "Anonymous",
      "Catherine M.",
      "The Rodriguez Family",
      "Michael P.",
      "Sr. Agnes",
      "Joseph W.",
      "Grace L.",
      "Anthony R.",
      "Margaret S.",
      "David K.",
      "Teresa B.",
      "Paul M.",
      "Linda F.",
    ];

    final List<VirtualCandle> candles = [];

    // Premium (Gold) - 12 candles
    for (int i = 0; i < 12; i++) {
      candles.add(
        VirtualCandle(
          id: 'premium-$i',
          userName: names[i % names.length],
          intention: intentions[i % intentions.length],
          tier: 'premium',
          color: _tierColors['premium']!,
          remainingHours: random.nextInt(600) + 100,
          prayerCount: random.nextInt(27000) + 3000,
        ),
      );
    }

    // Standard (Blue) - 10 candles
    for (int i = 0; i < 10; i++) {
      candles.add(
        VirtualCandle(
          id: 'standard-$i',
          userName: names[(i + 5) % names.length],
          intention: intentions[(i + 5) % intentions.length],
          tier: 'standard',
          color: _tierColors['standard']!,
          remainingHours: random.nextInt(140) + 24,
          prayerCount: random.nextInt(600) + 600,
        ),
      );
    }

    // Basic (Red) - 8 candles
    for (int i = 0; i < 8; i++) {
      candles.add(
        VirtualCandle(
          id: 'basic-$i',
          userName: names[(i + 10) % names.length],
          intention: intentions[(i + 10) % intentions.length],
          tier: 'basic',
          color: _tierColors['basic']!,
          remainingHours: random.nextInt(60) + 12,
          prayerCount: random.nextInt(500) + 100,
        ),
      );
    }

    // Free (White) - 6 candles
    for (int i = 0; i < 6; i++) {
      candles.add(
        VirtualCandle(
          id: 'free-$i',
          userName: names[(i + 3) % names.length],
          intention: intentions[(i + 3) % intentions.length],
          tier: 'free',
          color: _tierColors['free']!,
          remainingHours: random.nextInt(20) + 4,
          prayerCount: random.nextInt(210) + 90,
        ),
      );
    }

    setState(() => _candles = candles);
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

  int get _totalPrayers => _candles.fold(0, (sum, c) => sum + c.prayerCount);

  List<VirtualCandle> get _premiumCandles =>
      _candles.where((c) => c.tier == 'premium').toList();
  List<VirtualCandle> get _standardCandles =>
      _candles.where((c) => c.tier == 'standard').toList();
  List<VirtualCandle> get _basicCandles =>
      _candles.where((c) => c.tier == 'basic').toList();
  List<VirtualCandle> get _freeCandles =>
      _candles.where((c) => c.tier == 'free').toList();

  void _showLightCandleSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildLightCandleSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate-900
      body: CustomScrollView(
        slivers: [
          // Gradient Header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFD97706),
                    Color(0xFFEA580C),
                    Color(0xFFE11D48),
                  ],
                ),
              ),
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
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Light a candle for your intentions and join thousands praying together.',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.white70,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Premium candles receive 4x more prayers from our global community',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.amber.shade200,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      // Light Candle Button
                      ElevatedButton(
                        onPressed: _showLightCandleSheet,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.orange.shade700,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 32,
                            vertical: 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          elevation: 8,
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
          ),

          // Stats Bar
          SliverToBoxAdapter(
            child: Container(
              color: Colors.black38,
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
          _buildCandleSection(
            title: 'Premium Candles',
            icon: LucideIcons.crown,
            iconColor: Colors.amber,
            badge: 'MOST PRAYERS',
            candles: _premiumCandles,
            crossAxisCount: 3,
          ),

          // Standard Candles Section
          _buildCandleSection(
            title: 'Standard Candles',
            icon: LucideIcons.star,
            iconColor: Colors.blue.shade400,
            candles: _standardCandles,
            crossAxisCount: 3,
          ),

          // Community Candles Section (Basic + Free)
          _buildCandleSection(
            title: 'Community Candles',
            icon: LucideIcons.flame,
            iconColor: Colors.grey,
            candles: [..._basicCandles, ..._freeCandles],
            crossAxisCount: 4,
            isCompact: true,
          ),

          // CTA Banner
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.amber.shade700.withValues(alpha: 0.2),
                    Colors.orange.shade600.withValues(alpha: 0.2),
                    Colors.pink.shade600.withValues(alpha: 0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
              ),
              child: Column(
                children: [
                  Text(
                    'Want More Prayers for Your Intention?',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Premium candles stay lit for 30 days and receive the most prayers from our global community.',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.amber.shade200,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _showLightCandleSheet,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.amber.shade600,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    child: Text(
                      'Light a Candle - Start for Free',
                      style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildStat(IconData icon, String label, String value, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(label, style: GoogleFonts.inter(fontSize: 11, color: Colors.grey)),
      ],
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
    required List<VirtualCandle> candles,
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
              itemCount: candles.length > (isCompact ? 8 : 9)
                  ? (isCompact ? 8 : 9)
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
                      final updatedCandle = VirtualCandle(
                        id: candle.id,
                        userName: candle.userName,
                        intention: candle.intention,
                        tier: candle.tier,
                        color: candle.color,
                        remainingHours: candle.remainingHours,
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

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('You prayed for ${candle.userName}'),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: Colors.pink.shade600,
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

  Widget _buildLightCandleSheet() {
    return StatefulBuilder(
      builder: (context, setSheetState) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
            ),
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle
              Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade600,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    const Icon(
                      LucideIcons.flame,
                      color: Colors.amber,
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Light a Prayer Candle',
                      style: GoogleFonts.merriweather(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(LucideIcons.x, color: Colors.grey),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Duration Selection
                      Text(
                        'Choose Duration',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey.shade300,
                        ),
                      ),
                      const SizedBox(height: 12),
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        childAspectRatio: 2.2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        children: _durations.reversed.map((d) {
                          final isSelected = _selectedDuration == d.value;
                          final isPremium = d.tier == 'premium';
                          return GestureDetector(
                            onTap: () => setSheetState(
                              () => _selectedDuration = d.value,
                            ),
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? (isPremium
                                          ? Colors.amber.withValues(alpha: 0.2)
                                          : Colors.blue.withValues(alpha: 0.1))
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected
                                      ? (isPremium
                                            ? Colors.amber
                                            : Colors.blue.shade400)
                                      : Colors.grey.shade700,
                                  width: isSelected ? 2 : 1,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        d.label,
                                        style: GoogleFonts.inter(
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                      Text(
                                        d.priceDisplay,
                                        style: GoogleFonts.inter(
                                          fontWeight: FontWeight.bold,
                                          color: d.priceInCents == 0
                                              ? Colors.green.shade400
                                              : Colors.amber,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    isPremium
                                        ? '3000+ prayers • Featured'
                                        : d.tier == 'standard'
                                        ? 'High visibility'
                                        : 'Basic listing',
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  if (isPremium)
                                    Container(
                                      margin: const EdgeInsets.only(top: 4),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        gradient: const LinearGradient(
                                          colors: [Colors.amber, Colors.orange],
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        'FEATURED',
                                        style: GoogleFonts.inter(
                                          fontSize: 8,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),

                      const SizedBox(height: 24),

                      // Name Field
                      Text(
                        'Your Name',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey.shade300,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        onChanged: (v) => setSheetState(() => _userName = v),
                        enabled: !_isAnonymous,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Enter your name',
                          hintStyle: TextStyle(color: Colors.grey.shade600),
                          filled: true,
                          fillColor: const Color(0xFF334155),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          Checkbox(
                            value: _isAnonymous,
                            onChanged: (v) =>
                                setSheetState(() => _isAnonymous = v ?? false),
                            activeColor: Colors.amber,
                          ),
                          Text(
                            'Post anonymously',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Intention Field
                      Text(
                        'Your Prayer Intention',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey.shade300,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        onChanged: (v) => setSheetState(() => _intention = v),
                        maxLength: 60,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'For healing, peace, guidance...',
                          hintStyle: TextStyle(color: Colors.grey.shade600),
                          filled: true,
                          fillColor: const Color(0xFF334155),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          counterStyle: TextStyle(color: Colors.grey.shade600),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed:
                              (_intention.isNotEmpty &&
                                  (_isAnonymous || _userName.isNotEmpty))
                              ? () => _handleLightCandle(context)
                              : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber.shade600,
                            disabledBackgroundColor: Colors.grey.shade700,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: _isSubmitting
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : Text(
                                  _durations
                                              .firstWhere(
                                                (d) =>
                                                    d.value ==
                                                    _selectedDuration,
                                              )
                                              .priceInCents ==
                                          0
                                      ? '🕯️ Light Free Candle'
                                      : '💳 Continue - ${_durations.firstWhere((d) => d.value == _selectedDuration).priceDisplay}',
                                  style: GoogleFonts.inter(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                        ),
                      ),

                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _handleLightCandle(BuildContext context) async {
    final duration = _durations.firstWhere((d) => d.value == _selectedDuration);

    if (duration.priceInCents > 0) {
      // Trigger billing for paid candles
      final productId = _mapDurationToProductId(duration.value);
      if (productId.isNotEmpty) {
        await ref.read(billingServiceProvider).buyConsumable(productId);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid product configuration')),
        );
      }
    } else {
      // Free candle - add directly
      final newCandle = VirtualCandle(
        id: 'user-${DateTime.now().millisecondsSinceEpoch}',
        userName: _isAnonymous ? 'Anonymous' : _userName,
        intention: _intention,
        tier: 'free',
        color: _tierColors['free']!,
        remainingHours: 24,
        prayerCount: 1,
      );

      setState(() {
        _candles.insert(
          _candles.indexWhere(
            (c) =>
                c.tier != 'premium' &&
                c.tier != 'standard' &&
                c.tier != 'basic',
          ),
          newCandle,
        );
        _userName = '';
        _intention = '';
        _isAnonymous = false;
      });

      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            '🕯️ Your candle is lit! The community is now praying for you.',
          ),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  String _mapDurationToProductId(String duration) {
    switch (duration) {
      case 'THREE_DAYS':
        return ProductIds.candle3Day;
      case 'SEVEN_DAYS':
        return ProductIds.candle7Day;
      case 'THIRTY_DAYS':
        return ProductIds.candle30Day;
      default:
        return '';
    }
  }
}

// End of file - _CandleCard removed in favor of AnimatedCandle widget
