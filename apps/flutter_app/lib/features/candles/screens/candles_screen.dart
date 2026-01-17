import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/billing/product_ids.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/sacred_copy.dart';
import '../../../core/providers/scaffold_key_provider.dart';
import 'dart:math';
import '../widgets/premium_candle_widget.dart';
import '../repositories/candle_repository.dart';

import '../models/candle_model.dart';

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
    label: 'Humble Prayer (1 Day)',
    hours: 24,
    priceInCents: 0,
    priceDisplay: 'Free',
    tier: 'free',
  ),
  CandleDuration(
    value: 'THREE_DAYS',
    label: 'Devotion Votive (3 Days)',
    hours: 72,
    priceInCents: 299,
    priceDisplay: '\$2.99',
    tier: 'basic',
  ),
  CandleDuration(
    value: 'SEVEN_DAYS',
    label: 'Sacred Altar (7 Days)',
    hours: 168,
    priceInCents: 599,
    priceDisplay: '\$5.99',
    tier: 'standard',
  ),
  CandleDuration(
    value: 'THIRTY_DAYS',
    label: 'Divine Cathedral (30 Days)',
    hours: 720,
    priceInCents: 1499,
    priceDisplay: '\$14.99',
    tier: 'premium',
  ),
];

class CandlesScreen extends ConsumerStatefulWidget {
  const CandlesScreen({super.key});

  @override
  ConsumerState<CandlesScreen> createState() => _CandlesScreenState();
}

class _CandlesScreenState extends ConsumerState<CandlesScreen> {
  List<Candle> _candles = [];
  int _peoplePraying = 24567;
  final String _selectedDuration = '3days';
  String _userName = '';
  String _intention = '';
  final bool _isAnonymous = false;

  @override
  void initState() {
    super.initState();
    _loadCandles();
    _startPrayerCountFluctuation();
  }

  Future<void> _loadCandles() async {
    // 1. Generate Mock Data (matches Web App)
    final mockCandles = _generateMockData();

    // 2. Fetch Real Data from Supabase
    try {
      final realCandles = await ref
          .read(candleRepositoryProvider)
          .getActiveCandles();

      // 3. Merge Strategies
      // We want real candles to appear first within their tiers?
      // Or just mix them. Web App sorts by Tier then litAt.
      // Our fetch already returns sorted items.

      setState(() {
        _candles = [...realCandles, ...mockCandles];
        _sortCandles();
      });
    } catch (e) {
      debugPrint('Error loading candles: \$e');
      setState(() {
        _candles = mockCandles;
      });
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

  List<Candle> _generateMockData() {
    final intentions = [
      "For my mother's healing from cancer",
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
      "For victims of war",
      "Healing from addiction",
      "For my father's surgery",
      "Gratitude for new job",
      "For our pastor's health",
      "Safe travels for family",
      "For students facing exams",
      "Healing from chronic illness",
      "For homeless families",
      "Guidance for our parish",
      "For persecuted Christians",
      "Strength in trials",
      "For expecting mothers",
      "For our grandparents",
      "Peace in marriage",
      "For those grieving",
      "Healing after miscarriage",
      "For single parents",
      "Wisdom for leaders",
      "For missionaries worldwide",
      "Recovery from surgery",
      "For military families",
      "Healing of anxiety",
      "For youth ministry",
      "Thanksgiving for baby",
      "For unborn children",
      "Healing of broken heart",
      "For elderly in care homes",
      "Protection during storms",
      "For teachers and students",
      "For unemployed",
      "Healing of relationship",
      "For prison ministry",
      "Guidance in discernment",
      "For healthcare workers",
      "For world peace",
      "For my son's addiction",
      "Safe pregnancy",
      "Healing after loss",
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
      "James H.",
      "Patricia O.",
      "Robert N.",
      "Anna K.",
      "John D.",
      "Sarah M.",
      "Peter L.",
      "Elizabeth T.",
      "Andrew C.",
      "Rebecca S.",
      "Christopher M.",
      "Jennifer P.",
      "Matthew R.",
      "Angela N.",
      "Thomas W.",
      "Martha V.",
      "Francis X.",
      "Veronica L.",
      "Stephen K.",
      "The Smith Family",
      "Rosa M.",
      "Emmanuel O.",
      "Claire B.",
      "Patrick D.",
      "Monica A.",
      "Daniel G.",
      "Therese F.",
      "The Martinez Family",
      "Gabriel H.",
      "Lucia P.",
      "Benedict J.",
      "Josephine C.",
      "Augustine N.",
      "Bernadette S.",
      "Anonymous",
    ];

    final candles = <Candle>[];
    final random = Random();

    // FEATURED SECTION (Gold - 30 days)
    for (int i = 0; i < 18; i++) {
      candles.add(
        Candle(
          id: 'featured-\${i + 1}',
          name: names[i % names.length],
          intention: intentions[i % intentions.length],
          duration: 'THIRTY_DAYS',
          litAt: DateTime.now().subtract(Duration(hours: random.nextInt(24))),
          expiresAt: DateTime.now().add(const Duration(days: 30)),
          isActive: true,
          prayerCount: 3000 + random.nextInt(27000),
        ),
      );
    }

    // STANDARD SECTION (Blue - 7 days)
    for (int i = 0; i < 14; i++) {
      candles.add(
        Candle(
          id: 'standard-\${i + 1}',
          name: names[(i + 18) % names.length],
          intention: intentions[(i + 18) % intentions.length],
          duration: 'SEVEN_DAYS',
          litAt: DateTime.now().subtract(Duration(hours: random.nextInt(24))),
          expiresAt: DateTime.now().add(const Duration(days: 7)),
          isActive: true,
          prayerCount: 600 + random.nextInt(600),
        ),
      );
    }

    // BASIC SECTION (Red - 3 days)
    for (int i = 0; i < 12; i++) {
      candles.add(
        Candle(
          id: 'basic-\${i + 1}',
          name: names[(i + 32) % names.length],
          intention: intentions[(i + 32) % intentions.length],
          duration: 'THREE_DAYS',
          litAt: DateTime.now().subtract(Duration(hours: random.nextInt(24))),
          expiresAt: DateTime.now().add(const Duration(days: 3)),
          isActive: true,
          prayerCount: 100 + random.nextInt(500),
        ),
      );
    }

    // FREE SECTION (White - 1 day)
    for (int i = 0; i < 10; i++) {
      candles.add(
        Candle(
          id: 'free-\${i + 1}',
          name: names[(i + 44) % names.length],
          intention: intentions[(i + 44) % intentions.length],
          duration: 'ONE_DAY',
          litAt: DateTime.now().subtract(Duration(hours: random.nextInt(24))),
          expiresAt: DateTime.now().add(const Duration(days: 1)),
          isActive: true,
          prayerCount: 90 + random.nextInt(210),
        ),
      );
    }

    return candles;
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
      backgroundColor: AppTheme.deepSpace, // Use Theme Background
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
                    AppTheme.gold600,
                    AppTheme.royalPurple700,
                    AppTheme.royalPurple900,
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
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        // Local state for the sheet
        String localUserName = _userName;
        String localIntention = _intention;
        bool localIsAnonymous = _isAnonymous;
        String localSelectedDuration = _selectedDuration;
        bool localIsLoading = false;

        return StatefulBuilder(
          builder: (builderContext, setSheetState) {
            // Handler inside the closure to access local state
            Future<void> handleSubmit() async {
              setSheetState(() => localIsLoading = true);

              try {
                final duration = _durations.firstWhere(
                  (d) => d.value == localSelectedDuration,
                  orElse: () => _durations.first,
                );

                if (duration.priceInCents > 0) {
                  // PAID CANDLE
                  final productId = _mapDurationToProductId(duration.value);
                  if (productId.isEmpty) throw Exception('Invalid product ID');

                  await ref
                      .read(billingServiceProvider)
                      .buyConsumable(
                        productId,
                        context: context, // Use State context
                        itemName: 'Candle (${duration.label})',
                        price: duration.priceInCents / 100.0,
                      );
                  // Close the sheet after initiating payment
                  if (mounted) Navigator.pop(context);
                } else {
                  // FREE CANDLE
                  final newCandle = Candle(
                    id: 'user-${DateTime.now().millisecondsSinceEpoch}',
                    name: localIsAnonymous ? 'Anonymous' : localUserName,
                    intention: localIntention,
                    duration: 'ONE_DAY',
                    litAt: DateTime.now(),
                    expiresAt: DateTime.now().add(const Duration(days: 1)),
                    prayerCount: 1,
                  );

                  // Update Parent State
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
                    _userName = ''; // Clear defaults
                    _intention = '';
                  });

                  if (mounted) Navigator.pop(context);
                  if (mounted) {
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
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Error: $e'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              } finally {
                if (mounted) {
                  // Only stop loading if we haven't popped
                  try {
                    setSheetState(() => localIsLoading = false);
                  } catch (_) {}
                }
              }
            }

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
                              final isSelected =
                                  localSelectedDuration == d.value;
                              final isPremium = d.tier == 'premium';
                              return GestureDetector(
                                onTap: () => setSheetState(
                                  () => localSelectedDuration = d.value,
                                ),
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? (isPremium
                                              ? Colors.amber.withValues(
                                                  alpha: 0.2,
                                                )
                                              : Colors.blue.withValues(
                                                  alpha: 0.1,
                                                ))
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
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
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
                                              colors: [
                                                Colors.amber,
                                                Colors.orange,
                                              ],
                                            ),
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
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
                            onChanged: (v) =>
                                setSheetState(() => localUserName = v),
                            enabled: !localIsAnonymous,
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
                                value: localIsAnonymous,
                                onChanged: (v) => setSheetState(
                                  () => localIsAnonymous = v ?? false,
                                ),
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
                            onChanged: (v) =>
                                setSheetState(() => localIntention = v),
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
                              counterStyle: TextStyle(
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Submit Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed:
                                  (localIntention.isNotEmpty &&
                                      (localIsAnonymous ||
                                          localUserName.isNotEmpty) &&
                                      !localIsLoading)
                                  ? handleSubmit
                                  : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.amber.shade600,
                                disabledBackgroundColor: Colors.grey.shade700,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: localIsLoading
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
                                                        localSelectedDuration,
                                                    orElse: () =>
                                                        _durations.first,
                                                  )
                                                  .priceInCents ==
                                              0
                                          ? '🕯️ Light Free Candle'
                                          : '💳 Continue - ${_durations.firstWhere((d) => d.value == localSelectedDuration, orElse: () => _durations.first).priceDisplay}',
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
      },
    );
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
