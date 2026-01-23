import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../payments/services/payment_service.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../repositories/candle_repository.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../core/services/abandoned_cart_service.dart';
import '../../../core/services/donation_service.dart';
import '../../../core/theme/app_theme.dart';
import '../models/candle_model.dart';
import '../widgets/premium_candle_widget.dart';
import '../../ads/widgets/rewarded_ad_widget.dart';

class LightCandleScreen extends ConsumerStatefulWidget {
  const LightCandleScreen({super.key});

  @override
  ConsumerState<LightCandleScreen> createState() => _LightCandleScreenState();
}

class _LightCandleScreenState extends ConsumerState<LightCandleScreen> {
  String _selectedDuration = 'SEVEN_DAYS';
  String _intention = '';
  String _userName = '';
  String _email = '';
  bool _isAnonymous = false;
  bool _isProcessing = false;
  bool _paymentSuccessful = false;

  final List<Map<String, dynamic>> _durations = [
    {
      'value': 'ONE_DAY',
      'label': 'Humble Prayer',
      'daysLabel': '1 Day',
      'price': 0.0,
      'priceDisplay': 'Free',
      'tier': 'free',
      'spiritual': 'A humble beginning',
      'image': 'assets/images/candles/humble.png',
      'colors': [Colors.grey.shade200, Colors.grey.shade400],
    },
    {
      'value': 'THREE_DAYS_AD',
      'label': 'Sponsor Votive',
      'daysLabel': '3 Days',
      'price': 0.0,
      'priceDisplay': 'Watch Ad',
      'tier': 'ad_sponsored',
      'spiritual': 'Supported by sponsors',
      'image': 'assets/images/candles/humble.png',
      'colors': [const Color(0xFF60A5FA), const Color(0xFF2563EB)],
      'badge': 'FREE',
    },
    {
      'value': 'THREE_DAYS',
      'label': 'Devotion Votive',
      'daysLabel': '3 Days',
      'price': 2.99,
      'priceDisplay': '\$2.99',
      'tier': 'standard',
      'spiritual': 'Faith grows stronger',
      'image': 'assets/images/candles/devotion_glow.png',
      'colors': [const Color(0xFFFDE047), const Color(0xFFF59E0B)],
    },
    {
      'value': 'SEVEN_DAYS',
      'label': 'Sacred Altar',
      'daysLabel': '7 Days',
      'price': 5.99,
      'priceDisplay': '\$5.99',
      'tier': 'premium',
      'spiritual': 'Presented before the Lord',
      'image': 'assets/images/candles/altar.png',
      'colors': [const Color(0xFFF59E0B), const Color(0xFFEA580C)],
      'badge': 'POPULAR',
    },
    {
      'value': 'FOURTEEN_DAYS',
      'label': 'Blessed Marian',
      'daysLabel': '14 Days',
      'price': 9.99,
      'priceDisplay': '\$9.99',
      'tier': 'premium',
      'spiritual': 'Mary intercedes for you',
      'image': 'assets/images/candles/marian_glow.png',
      'colors': [const Color(0xFF60A5FA), const Color(0xFF2563EB)],
      'badge': 'BEST VALUE',
    },
    {
      'value': 'THIRTY_DAYS',
      'label': 'Divine Cathedral',
      'daysLabel': '30 Days',
      'price': 14.99,
      'priceDisplay': '\$14.99',
      'tier': 'premium',
      'spiritual': 'Perpetual light of grace',
      'image': 'assets/images/candles/divine.png',
      'colors': [const Color(0xFFFBBF24), const Color(0xFFB45309)],
      'badge': 'MOST POWERFUL',
    },
  ];

  Map<String, dynamic> get selectedTier =>
      _durations.firstWhere((d) => d['value'] == _selectedDuration);

  @override
  void dispose() {
    if (!_paymentSuccessful && selectedTier['price'] > 0.0) {
      Future.microtask(() {
        try {
          ref
              .read(abandonedCartServiceProvider)
              .saveCart(
                type: 'CANDLE',
                email: _email.isNotEmpty ? _email : 'anonymous@tracking.com',
                name: _userName.isNotEmpty ? _userName : null,
                data: {
                  'duration': _selectedDuration,
                  'intention': _intention,
                  'price': selectedTier['price'],
                  'tier': selectedTier['label'],
                },
                step: 'checkout_abandoned',
              );
        } catch (e) {
          // Ignore
        }
      });
    }
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_intention.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please enter your prayer intention',
            style: GoogleFonts.inter(color: Colors.white),
          ),
          backgroundColor: AppTheme.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    // Handle Ad-Sponsored Tier
    if (selectedTier['value'] == 'THREE_DAYS_AD') {
      final service = ref.read(rewardedAdServiceProvider);
      final success = await service.showAd(
        onRewarded: () async {
          // Proceed to light candle (treated as free backend-wise but tracked)
          await _lightCandle();
        },
        onDismissed: () {
          // Optional: Show message if ad closed without reward
        },
      );

      if (!success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Watch full ad to light this candle'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
      return;
    }

    if (selectedTier['price'] == 0.0) {
      await _lightCandle();
    } else {
      final paymentService = ref.read(paymentServiceProvider);
      paymentService.startPayPalPayment(
        context: context,
        amount: selectedTier['price'],
        currency: 'USD',
        description: 'Light Candle: ${selectedTier['label']}',
        userEmail: _email.isNotEmpty ? _email : null,
        onSuccess: (transactionId) async {
          _paymentSuccessful = true;
          await ref
              .read(donationServiceProvider)
              .createDonationViaApi(
                amount: selectedTier['price'],
                type: 'candle',
                paymentId: transactionId,
                intention: _intention,
                name: _userName.isNotEmpty ? _userName : null,
                email: _email.isNotEmpty ? _email : null,
              );
          await _lightCandle();
        },
        onError: (error) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Payment failed: $error'),
              backgroundColor: AppTheme.error,
            ),
          );
        },
      );
    }
  }

  Future<void> _lightCandle() async {
    setState(() => _isProcessing = true);
    try {
      final user = ref.read(authProvider).value;
      final repository = ref.read(candleRepositoryProvider);

      await repository.lightCandle(
        intention: _intention,
        name: _isAnonymous
            ? 'Anonymous'
            : (_userName.isEmpty ? user?.email ?? 'Anonymous' : _userName),
        duration: _selectedDuration,
        isAnonymous: _isAnonymous,
        userId: user?.id,
        amountInCents: (selectedTier['price'] * 100).toInt(),
      );

      if (mounted) {
        await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => _buildSuccessDialog(),
        );
        if (mounted) context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to light candle: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  Widget _buildSuccessDialog() {
    return Dialog(
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: AppTheme.glassDecoration.copyWith(
          color: AppTheme.sacredNavy900.withValues(alpha: 0.9),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              LucideIcons.flame,
              color: AppTheme.gold500,
              size: 48,
            ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
            const SizedBox(height: 16),
            Text(
              'Candle Lit',
              style: GoogleFonts.playfairDisplay(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Your prayer rises like incense before the Lord.',
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                foregroundColor: AppTheme.sacredNavy900,
              ),
              child: const Text('Amen'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Calculate preview expiration based on selected duration
    int days = 7;
    if (_selectedDuration == 'ONE_DAY') days = 1;
    if (_selectedDuration == 'THREE_DAYS') days = 3;
    if (_selectedDuration == 'FOURTEEN_DAYS') days = 14;
    if (_selectedDuration == 'THIRTY_DAYS') days = 30;

    final previewCandle = Candle(
      id: 'preview',
      intention: _intention.isEmpty ? 'Your Prayer Intention' : _intention,
      duration: _selectedDuration,
      litAt: DateTime.now(),
      expiresAt: DateTime.now().add(Duration(days: days)),
      prayerCount: 0,
      name: _userName.isEmpty ? 'You' : _userName,
      isAnonymous: _isAnonymous,
      isActive: true,
    );

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      resizeToAvoidBottomInset: false,
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
          ...List.generate(15, (index) => _buildParticle(index)),

          // 3. Main Content
          SafeArea(
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  flex: 3,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child:
                          Hero(
                                tag: 'main_candle',
                                child: Transform.scale(
                                  scale: 2.2,
                                  child: PremiumCandleWidget(
                                    candle: previewCandle,
                                    isCompact: false,
                                  ),
                                ),
                              )
                              .animate()
                              .fadeIn(duration: 800.ms)
                              .scale(
                                begin: const Offset(0.9, 0.9),
                                end: const Offset(1.0, 1.0),
                                duration: 1000.ms,
                                curve: Curves.easeOutBack,
                              ),
                    ),
                  ),
                ),
                Expanded(flex: 4, child: _buildControlsSheet()),
              ],
            ),
          ),

          // Loading Overlay
          if (_isProcessing)
            Container(
              color: Colors.black.withValues(alpha: 0.7),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(color: AppTheme.gold500),
                    const SizedBox(height: 16),
                    Text(
                      'Lighting your candle...',
                      style: GoogleFonts.inter(color: Colors.white),
                    ),
                  ],
                ),
              ),
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
      left: random.nextDouble() * MediaQuery.of(context).size.width,
      top: random.nextDouble() * MediaQuery.of(context).size.height * 0.6,
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

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(LucideIcons.x, color: Colors.white, size: 20),
            ),
          ),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Light a Candle',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        color: AppTheme.gold500.withValues(alpha: 0.5),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                ),
                // Live Counter Badge
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.gold500.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: AppTheme.gold400,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.gold500,
                                  blurRadius: 4,
                                ),
                              ],
                            ),
                          )
                          .animate(onPlay: (c) => c.repeat(reverse: true))
                          .fade(duration: 1000.ms, begin: 0.5, end: 1.0),
                      const SizedBox(width: 6),
                      Text(
                        '2,341 candles burning now',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.gold400,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {}, // Placeholder for symmetry or help
            icon: const SizedBox(width: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildControlsSheet() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900.withValues(alpha: 0.7),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.1),
          width: 1,
        ),
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildIntentionInput(),
                const SizedBox(height: 24),
                _buildTierSelector(),
                const SizedBox(height: 24),
                _buildActionButtons(),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    ).animate().slideY(
      begin: 1.0,
      end: 0.0,
      duration: 600.ms,
      curve: Curves.easeOutQuart,
    );
  }

  Widget _buildIntentionInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'YOUR INTENTION',
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
            color: AppTheme.gold500,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: _intention.isNotEmpty
                  ? AppTheme.gold500.withValues(alpha: 0.5)
                  : Colors.white.withValues(alpha: 0.1),
            ),
          ),
          child: TextField(
            onChanged: (value) => setState(() => _intention = value),
            maxLines: 3,
            minLines: 1,
            style: GoogleFonts.inter(color: Colors.white, fontSize: 16),
            decoration: InputDecoration(
              hintText: 'I pray for healing, guidance...',
              hintStyle: GoogleFonts.inter(color: Colors.white30),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              contentPadding: const EdgeInsets.all(16),
              filled: false,
            ),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            GestureDetector(
              onTap: () => setState(() => _isAnonymous = !_isAnonymous),
              child: Row(
                children: [
                  Icon(
                    _isAnonymous ? LucideIcons.checkSquare : LucideIcons.square,
                    color: _isAnonymous ? AppTheme.gold500 : Colors.white54,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Pray Anonymously',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        if (!_isAnonymous) ...[
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildCompactInput(
                  label: 'Name',
                  onChanged: (v) => setState(() => _userName = v),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildCompactInput(
                  label: 'Email (Optional)',
                  onChanged: (v) => setState(() => _email = v),
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildCompactInput({
    required String label,
    required Function(String) onChanged,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: TextField(
        onChanged: onChanged,
        style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
        decoration: InputDecoration(
          hintText: label,
          hintStyle: GoogleFonts.inter(color: Colors.white30),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
          isDense: true,
          filled: false,
        ),
      ),
    );
  }

  Widget _buildTierSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'SELECT DURATION',
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
            color: AppTheme.gold500,
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 110,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: _durations.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final tier = _durations[index];
              final isSelected = _selectedDuration == tier['value'];
              final colors = tier['colors'] as List<Color>;

              return GestureDetector(
                onTap: () => setState(() => _selectedDuration = tier['value']),
                child: AnimatedContainer(
                  duration: 300.ms,
                  width: 90,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? colors[0].withValues(alpha: 0.2)
                        : Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected
                          ? colors[0]
                          : Colors.white.withValues(alpha: 0.1),
                      width: isSelected ? 2 : 1,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: colors[0].withValues(alpha: 0.3),
                              blurRadius: 12,
                            ),
                          ]
                        : [],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        tier['daysLabel'],
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? colors[0] : Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tier['priceDisplay'],
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white70,
                        ),
                      ),
                      if (isSelected)
                        const Icon(
                          LucideIcons.check,
                          size: 14,
                          color: Colors.white,
                        ).animate().scale(),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 56,
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.gold400, AppTheme.gold600],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: _handleSubmit,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(LucideIcons.flame, color: Color(0xFF78350F)),
                  const SizedBox(width: 8),
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
        ),
        if (selectedTier['price'] > 0) ...[
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.lock, size: 12, color: Colors.white30),
              const SizedBox(width: 6),
              Text(
                'Secure offering via PayPal',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.white30),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
