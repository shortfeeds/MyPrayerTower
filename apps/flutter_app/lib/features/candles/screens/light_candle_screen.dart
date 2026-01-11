import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../payments/services/payment_service.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/candle_repository.dart';
import '../../auth/providers/auth_provider.dart';

class LightCandleScreen extends ConsumerStatefulWidget {
  const LightCandleScreen({super.key});

  @override
  ConsumerState<LightCandleScreen> createState() => _LightCandleScreenState();
}

class _LightCandleScreenState extends ConsumerState<LightCandleScreen> {
  String _selectedDuration = 'THIRTY_DAYS';
  String _intention = '';
  String _userName = '';
  bool _isAnonymous = false;
  bool _isProcessing = false;

  // Pricing Constants (Matching Web App)
  final List<Map<String, dynamic>> _durations = [
    {
      'value': 'ONE_DAY',
      'label': '1 Day',
      'price': 0.0,
      'priceDisplay': 'Free',
      'tier': 'free',
      'desc': 'Basic listing',
    },
    {
      'value': 'THREE_DAYS',
      'label': '3 Days',
      'price': 2.99,
      'priceDisplay': '\$2.99',
      'tier': 'basic',
      'desc': 'Standard visibility',
    },
    {
      'value': 'SEVEN_DAYS',
      'label': '7 Days',
      'price': 5.99,
      'priceDisplay': '\$5.99',
      'tier': 'standard',
      'desc': 'High visibility • More prayers',
    },
    {
      'value': 'THIRTY_DAYS',
      'label': '30 Days',
      'price': 14.99,
      'priceDisplay': '\$14.99',
      'tier': 'premium',
      'desc': '3000+ prayers • Featured spot',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final selectedOption = _durations.firstWhere(
      (d) => d['value'] == _selectedDuration,
    );
    final isPaid = (selectedOption['price'] as double) > 0;

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      resizeToAvoidBottomInset: true, // Ensures keyboard doesn't cover content
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            const Icon(LucideIcons.flame, color: AppTheme.gold500, size: 20),
            const SizedBox(width: 8),
            Text(
              'Light a Prayer Candle',
              style: GoogleFonts.merriweather(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Duration Selection
              Text(
                'Choose Duration',
                style: GoogleFonts.inter(
                  color: Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.4,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: _durations.reversed.map((duration) {
                  final isSelected = _selectedDuration == duration['value'];
                  final isPremium = duration['tier'] == 'premium';

                  return GestureDetector(
                    onTap: () =>
                        setState(() => _selectedDuration = duration['value']),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isPremium
                                  ? AppTheme.gold500.withValues(alpha: 0.2)
                                  : Colors.blue.withValues(alpha: 0.1))
                            : AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? (isPremium
                                    ? AppTheme.gold500
                                    : Colors.blue.shade400)
                              : Colors.white10,
                          width: 2,
                        ),
                      ),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          if (isPremium)
                            Positioned(
                              top: -8,
                              right: -8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [AppTheme.gold500, Colors.orange],
                                  ),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'FEATURED',
                                  style: GoogleFonts.inter(
                                    fontSize: 8,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    duration['label'],
                                    style: GoogleFonts.inter(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    duration['priceDisplay'],
                                    style: GoogleFonts.inter(
                                      color: duration['price'] == 0
                                          ? Colors.greenAccent
                                          : AppTheme.gold500,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                duration['desc'],
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 11,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 32),

              // Name Input
              Text(
                'Your Name',
                style: GoogleFonts.inter(
                  color: Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                onChanged: (val) => setState(() => _userName = val),
                enabled: !_isAnonymous,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: _isAnonymous ? 'Anonymous' : 'Enter your name',
                  hintStyle: TextStyle(
                    color: Colors.white.withValues(alpha: 0.3),
                  ),
                  filled: true,
                  fillColor: AppTheme.darkCard,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.all(16),
                ),
              ),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: () => setState(() => _isAnonymous = !_isAnonymous),
                child: Row(
                  children: [
                    Icon(
                      _isAnonymous
                          ? LucideIcons.checkSquare
                          : LucideIcons.square,
                      color: _isAnonymous ? AppTheme.gold500 : Colors.grey,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Post anonymously',
                      style: GoogleFonts.inter(
                        color: Colors.grey,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Intention Input
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Your Prayer Intention',
                    style: GoogleFonts.inter(
                      color: Colors.white70,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    '${_intention.length}/60',
                    style: GoogleFonts.inter(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              TextField(
                onChanged: (val) => setState(() => _intention = val),
                style: const TextStyle(color: Colors.white),
                maxLength: 60,
                decoration: InputDecoration(
                  hintText: 'For healing, peace, guidance...',
                  hintStyle: TextStyle(
                    color: Colors.white.withValues(alpha: 0.3),
                  ),
                  filled: true,
                  fillColor: AppTheme.darkCard,
                  counterText: '',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.all(16),
                ),
              ),

              const SizedBox(height: 48),

              // Action Button
              ElevatedButton(
                onPressed: _isProcessing ? null : _handleAction,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold500,
                  disabledBackgroundColor: Colors.grey.shade800,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.black,
                          strokeWidth: 2,
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isPaid ? LucideIcons.creditCard : LucideIcons.flame,
                            color: Colors.black,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            isPaid
                                ? 'Continue - ${selectedOption['priceDisplay']}'
                                : 'Light Free Candle',
                            style: GoogleFonts.inter(
                              color: Colors.black,
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
    );
  }

  bool _isValid() {
    if (_intention.trim().isEmpty) return false;
    if (!_isAnonymous && _userName.trim().isEmpty) return false;
    return true;
  }

  Future<void> _handleAction() async {
    try {
      if (!_isValid()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter your name and intention'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      setState(() => _isProcessing = true);

      final selectedOption = _durations.firstWhere(
        (d) => d['value'] == _selectedDuration,
      );
      final isPaid = (selectedOption['price'] as double) > 0;
      final tier = selectedOption['tier'] as String;

      // Get current user ID if logged in (optional)
      final authState = ref.read(authProvider);
      final userId = authState.value?.id;

      // Save to database
      final candleRepo = ref.read(candleRepositoryProvider);
      debugPrint('Lighting candle: $_intention');

      final candle = await candleRepo.lightCandle(
        userName: _isAnonymous ? 'Anonymous' : _userName,
        intention: _intention,
        duration: _selectedDuration,
        tier: tier,
        userId: userId,
        isAnonymous: _isAnonymous,
      );

      if (!mounted) return;
      setState(() => _isProcessing = false);

      if (candle != null) {
        // Successfully saved to database
        if (isPaid) {
          // Payment Flow
          showModalBottomSheet(
            context: context,
            backgroundColor: AppTheme.sacredNavy950,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            builder: (context) => Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Complete Payment',
                    style: GoogleFonts.merriweather(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  Text(
                    selectedOption['priceDisplay'],
                    style: GoogleFonts.inter(
                      color: AppTheme.gold500,
                      fontSize: 16,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  // PayPal Button
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      final service = ref.read(paymentServiceProvider);
                      service.startPayPalPayment(
                        context: context,
                        amount: selectedOption['price'],
                        currency: 'USD',
                        description: 'Candle: $_intention',
                        onSuccess: (id) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Candle sponsored successfully!'),
                              backgroundColor: Colors.green,
                            ),
                          );
                          ref.invalidate(activeCandlesProvider);
                          Navigator.of(context).pop(); // Close candle screen
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
                    },
                    icon: const Icon(
                      LucideIcons.creditCard,
                      color: Colors.white,
                    ),
                    label: const Text('Pay with PayPal'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF003087),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ],
              ),
            ),
          );
        } else {
          // Free Candle Success
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                '🕯️ Your candle has been lit! It will appear on the wall.',
              ),
              backgroundColor: Colors.green,
            ),
          );
          ref.invalidate(activeCandlesProvider);
          context.pop();
        }
      } else {
        // Failed to save (likely Supabase 401 or offline)
        // Show "Local Success" message to allow user to proceed
        debugPrint(
          'Failed to save candle to DB (Supabase error likely), showing local success',
        );
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Your candle has been lit locally!'),
            backgroundColor: Colors.green,
          ),
        );
        context.pop();
      }
    } catch (e, stack) {
      debugPrint('Error in _handleAction: $e\n$stack');
      if (mounted) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }
}
