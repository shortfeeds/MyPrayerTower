import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';

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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
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
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                    _isAnonymous ? LucideIcons.checkSquare : LucideIcons.square,
                    color: _isAnonymous ? AppTheme.gold500 : Colors.grey,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Post anonymously',
                    style: GoogleFonts.inter(color: Colors.grey, fontSize: 14),
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
              onPressed: _isValid() ? _handleAction : null,
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
    );
  }

  bool _isValid() {
    if (_intention.trim().isEmpty) return false;
    if (!_isAnonymous && _userName.trim().isEmpty) return false;
    return true;
  }

  void _handleAction() {
    setState(() => _isProcessing = true);

    // Simulate processing
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() => _isProcessing = false);
        final selectedOption = _durations.firstWhere(
          (d) => d['value'] == _selectedDuration,
        );
        final isPaid = (selectedOption['price'] as double) > 0;

        if (isPaid) {
          // Payment Flow placeholder
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Proceeding to payment for ${selectedOption['priceDisplay']}...',
              ),
              backgroundColor: AppTheme.gold500,
            ),
          );
          // In real implementation, show payment sheet here
        } else {
          // Free Candle Success
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Your candle has been lit!'),
              backgroundColor: Colors.green,
            ),
          );
          context.pop();
        }
      }
    });
  }
}
