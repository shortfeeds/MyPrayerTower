import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../payments/services/payment_service.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../repositories/candle_repository.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../core/services/abandoned_cart_service.dart';
import '../../../core/services/donation_service.dart';

class LightCandleScreen extends ConsumerStatefulWidget {
  const LightCandleScreen({super.key});

  @override
  ConsumerState<LightCandleScreen> createState() => _LightCandleScreenState();
}

class _LightCandleScreenState extends ConsumerState<LightCandleScreen> {
  // Single Screen State - No Steps
  String _selectedDuration = 'SEVEN_DAYS'; // Default
  String _intention = '';
  String _userName = '';
  String _email = '';
  bool _isAnonymous = false;
  bool _isProcessing = false;
  bool _paymentSuccessful = false; // Track payment status

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
      'badge': '',
    },
    {
      'value': 'THREE_DAYS',
      'label': 'Devotion Votive',
      'daysLabel': '3 Days',
      'price': 2.99,
      'priceDisplay': '\$2.99',
      'tier': 'standard',
      'spiritual': '✞ Your faith grows stronger',
      'image': 'assets/images/candles/devotion_glow.png',
      'badge': '',
    },
    {
      'value': 'SEVEN_DAYS',
      'label': 'Sacred Altar',
      'daysLabel': '7 Days',
      'price': 5.99,
      'priceDisplay': '\$5.99',
      'tier': 'premium',
      'spiritual': '⛪ Presented before the Lord',
      'image': 'assets/images/candles/altar.png',
      'badge': 'POPULAR',
    },
    {
      'value': 'FOURTEEN_DAYS',
      'label': 'Blessed Marian',
      'daysLabel': '14 Days',
      'price': 9.99,
      'priceDisplay': '\$9.99',
      'tier': 'premium',
      'spiritual': '✨ Mary intercedes for you',
      'image': 'assets/images/candles/marian_glow.png',
      'badge': 'BEST VALUE',
    },
    {
      'value': 'THIRTY_DAYS',
      'label': 'Divine Cathedral',
      'daysLabel': '30 Days',
      'price': 14.99,
      'priceDisplay': '\$14.99',
      'tier': 'premium',
      'spiritual': '🕊️ Your prayer ascends to Heaven',
      'image': 'assets/images/candles/divine.png',
      'badge': 'MOST POWERFUL',
    },
  ];

  Map<String, dynamic> get selectedTier =>
      _durations.firstWhere((d) => d['value'] == _selectedDuration);

  @override
  void dispose() {
    // Track abandoned cart if leaving without successful payment (and not free tier)
    if (!_paymentSuccessful && selectedTier['price'] > 0.0) {
      // Fire and forget - using a microtask to ensure it runs
      Future.microtask(() {
        try {
          ref
              .read(abandonedCartServiceProvider)
              .saveCart(
                type: 'CANDLE',
                email: _email.isNotEmpty
                    ? _email
                    : 'anonymous@tracking.com', // Fallback for tracking
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
          // Ignore errors during dispose
        }
      });
    }
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_intention.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your prayer intention'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (selectedTier['price'] == 0.0) {
      // Free candle - light immediately
      await _lightCandle();
    } else {
      // Proceed to payment (One-Click Logic)
      final paymentService = ref.read(paymentServiceProvider);
      paymentService.startPayPalPayment(
        context: context,
        amount: selectedTier['price'],
        currency: 'USD',
        description: 'Light Candle: ${selectedTier['label']}',
        userEmail: _email.isNotEmpty ? _email : null,
        onSuccess: (transactionId) async {
          _paymentSuccessful = true; // Mark as successful
          // Record donation via backend API
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
              backgroundColor: Colors.red,
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              '🕯️ Your candle has been lit! May your prayer rise like incense.',
            ),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 3),
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to light candleError: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Opaque page (hides background candle)
      body: Stack(
        children: [
          Column(
            children: [
              // Header with SafeArea padding
              Container(
                padding: EdgeInsets.only(
                  top: MediaQuery.of(context).padding.top + 16,
                  bottom: 16,
                  left: 20,
                  right: 20,
                ),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      LucideIcons.flame,
                      color: Colors.white,
                      size: 24,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'Light a Candle',
                      style: GoogleFonts.merriweather(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(LucideIcons.x, color: Colors.white),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),
              // Scrollable Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildIntentionSection(),
                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 24),
                      _buildTierSection(),
                      const SizedBox(height: 24),
                      _buildActionSection(),
                      const SizedBox(height: 120), // Added bottom padding
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Loading Overlay
          if (_isProcessing)
            Container(
              color: Colors.white.withValues(alpha: 0.95),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 48,
                      height: 48,
                      child: CircularProgressIndicator(
                        strokeWidth: 4,
                        valueColor: const AlwaysStoppedAnimation(
                          Color(0xFFF59E0B),
                        ),
                        backgroundColor: Colors.amber.shade100,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Lighting your candle...',
                      style: GoogleFonts.merriweather(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'May your prayer rise like incense.',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.black54,
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

  Widget _buildIntentionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your Intention',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          onChanged: (value) => setState(() => _intention = value),
          maxLines: 3,
          style: GoogleFonts.inter(color: Colors.black87),
          decoration: InputDecoration(
            hintText: 'I pray for...',
            hintStyle: GoogleFonts.inter(color: Colors.black38),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 2),
            ),
            contentPadding: const EdgeInsets.all(16),
          ),
        ),
        const SizedBox(height: 16),
        // Name & Email
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: TextField(
                onChanged: (value) => setState(() => _userName = value),
                style: GoogleFonts.inter(color: Colors.black87),
                decoration: InputDecoration(
                  labelText: 'Name (Optional)',
                  labelStyle: GoogleFonts.inter(color: Colors.black54),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                      color: Color(0xFFF59E0B),
                      width: 2,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                onChanged: (value) => setState(() => _email = value),
                style: GoogleFonts.inter(color: Colors.black87),
                decoration: InputDecoration(
                  labelText: 'Email (Optional)',
                  labelStyle: GoogleFonts.inter(color: Colors.black54),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                      color: Color(0xFFF59E0B),
                      width: 2,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            SizedBox(
              height: 24,
              width: 24,
              child: Checkbox(
                value: _isAnonymous,
                onChanged: (value) =>
                    setState(() => _isAnonymous = value ?? false),
                activeColor: const Color(0xFFF59E0B),
                side: const BorderSide(
                  color: Colors.black45,
                  width: 1.5,
                ), // Visible border
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'Pray anonymously',
              style: GoogleFonts.inter(fontSize: 14, color: Colors.black87),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTierSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Your Candle',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        ..._durations.map((tier) {
          final isSelected = _selectedDuration == tier['value'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Stack(
              children: [
                GestureDetector(
                  onTap: () =>
                      setState(() => _selectedDuration = tier['value']),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? const Color(0xFFFEF3C7)
                          : Colors.white,
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFFF59E0B)
                            : const Color(0xFFE5E7EB),
                        width: isSelected ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        // Candle Image
                        Container(
                          width: 48,
                          height: 48,
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFFFCD34D)
                                  : const Color(0xFFE5E7EB),
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Image.asset(
                            tier['image'],
                            fit: BoxFit.contain,
                          ),
                        ),
                        const SizedBox(width: 12),
                        // Tier Info
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                tier['label'],
                                style: GoogleFonts.merriweather(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: isSelected
                                      ? const Color(0xFF78350F)
                                      : Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                tier['spiritual'],
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  color: const Color(
                                    0xFFB45309,
                                  ).withValues(alpha: 0.8),
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Price
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              tier['price'] == 0.0
                                  ? 'Free'
                                  : tier['priceDisplay'],
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: tier['price'] == 0.0
                                    ? const Color(0xFF059669)
                                    : Colors.black87,
                              ),
                            ),
                            Text(
                              tier['daysLabel'],
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                color: Colors.black45,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                // Badge
                if (tier['badge'].isNotEmpty)
                  Positioned(
                    top: -4,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFD97706), Color(0xFFEA580C)],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        tier['badge'],
                        style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildActionSection() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 54,
          child: ElevatedButton(
            onPressed: (_intention.isEmpty) ? null : _handleSubmit,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
              disabledBackgroundColor: Colors.black12,
              elevation: 4,
              shadowColor: const Color(0xFFF59E0B).withValues(alpha: 0.4),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  selectedTier['price'] == 0.0
                      ? LucideIcons.flame
                      : LucideIcons.creditCard, // or Lock
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  selectedTier['price'] == 0.0
                      ? 'Light Humble Candle'
                      : 'Light Candle (${selectedTier['priceDisplay']})',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (selectedTier['price'] > 0) ...[
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(LucideIcons.lock, size: 14, color: Colors.black38),
              const SizedBox(width: 6),
              Text(
                'Secure checkout powered by PayPal',
                style: GoogleFonts.inter(fontSize: 11, color: Colors.black45),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
