import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/billing/billing_service.dart';
import '../../../core/billing/product_ids.dart';

class SpiritualBouquetScreen extends ConsumerStatefulWidget {
  const SpiritualBouquetScreen({super.key});

  @override
  ConsumerState<SpiritualBouquetScreen> createState() =>
      _SpiritualBouquetScreenState();
}

class _SpiritualBouquetScreenState
    extends ConsumerState<SpiritualBouquetScreen> {
  // Bouquet contents
  int _massesCount = 0;
  int _rosariesCount = 0;
  int _prayersCount = 0;
  int _candlesCount = 0;

  // Recipient info
  final _recipientNameController = TextEditingController();
  final _recipientEmailController = TextEditingController();
  final _messageController = TextEditingController();
  String _occasion = 'Birthday';

  final List<String> _occasions = [
    'Birthday',
    'Anniversary',
    'Get Well',
    'Sympathy',
    'Thank You',
    'Congratulations',
    'Thinking of You',
    'Memorial',
    'Other',
  ];

  // Pricing
  static const int _massPrice = 1000; // $10 (Updated to match plan)
  static const int _rosaryPrice = 500; // $5
  static const int _prayerPrice = 0; // Free for now
  static const int _candlePrice = 299; // $2.99 (Matches 3-day candle)

  int get _totalCents =>
      (_massesCount * _massPrice) +
      (_rosariesCount * _rosaryPrice) +
      (_prayersCount * _prayerPrice) +
      (_candlesCount * _candlePrice);

  double get _total => _totalCents / 100;

  @override
  void dispose() {
    _recipientNameController.dispose();
    _recipientEmailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // ... code remains same ...
    return Scaffold(
      // ... existing scaffold ...
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Spiritual Bouquet',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.gold500.withValues(alpha: 0.2),
                    AppTheme.sacredNavy900,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  const Text('💐', style: TextStyle(fontSize: 48)),
                  const SizedBox(height: 12),
                  Text(
                    'Create a Spiritual Bouquet',
                    style: GoogleFonts.merriweather(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'A beautiful gift of prayers for someone special',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95)),
            const SizedBox(height: 24),

            // Bouquet Items
            Text(
              'Choose Your Offerings',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),

            _buildItemSelector(
              icon: '⛪',
              title: 'Holy Masses',
              subtitle: '\$10.00 each',
              count: _massesCount,
              onChanged: (v) => setState(() => _massesCount = v),
            ),
            _buildItemSelector(
              icon: '📿',
              title: 'Rosaries',
              subtitle: '\$5.00 each',
              count: _rosariesCount,
              onChanged: (v) => setState(() => _rosariesCount = v),
            ),
            _buildItemSelector(
              icon: '🙏',
              title: 'Prayers',
              subtitle: 'Free',
              count: _prayersCount,
              onChanged: (v) => setState(() => _prayersCount = v),
            ),
            _buildItemSelector(
              icon: '🕯️',
              title: 'Candles',
              subtitle: '\$2.99 each',
              count: _candlesCount,
              onChanged: (v) => setState(() => _candlesCount = v),
            ),
            const SizedBox(height: 24),

            // Recipient Details
            // ... (rest of UI code) ...
            Text(
              'Recipient Details',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),

            _buildTextField(
              controller: _recipientNameController,
              label: 'Recipient Name',
              icon: LucideIcons.user,
            ),
            const SizedBox(height: 12),
            _buildTextField(
              controller: _recipientEmailController,
              label: 'Recipient Email',
              icon: LucideIcons.mail,
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),

            // Occasion Dropdown
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _occasion,
                  isExpanded: true,
                  dropdownColor: AppTheme.sacredNavy900,
                  style: GoogleFonts.inter(color: Colors.white),
                  items: _occasions
                      .map((o) => DropdownMenuItem(value: o, child: Text(o)))
                      .toList(),
                  onChanged: (v) => setState(() => _occasion = v!),
                ),
              ),
            ),
            const SizedBox(height: 12),

            _buildTextField(
              controller: _messageController,
              label: 'Personal Message (Optional)',
              icon: LucideIcons.messageSquare,
              maxLines: 3,
            ),
            const SizedBox(height: 24),

            // Order Summary
            if (_totalCents > 0 || _prayersCount > 0) ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    if (_massesCount > 0)
                      _buildSummaryRow(
                        'Holy Masses × $_massesCount',
                        _massesCount * _massPrice / 100,
                      ),
                    if (_rosariesCount > 0)
                      _buildSummaryRow(
                        'Rosaries × $_rosariesCount',
                        _rosariesCount * _rosaryPrice / 100,
                      ),
                    if (_prayersCount > 0)
                      _buildSummaryRow(
                        'Prayers × $_prayersCount',
                        _prayersCount * _prayerPrice / 100,
                      ),
                    if (_candlesCount > 0)
                      _buildSummaryRow(
                        'Candles × $_candlesCount',
                        _candlesCount * _candlePrice / 100,
                      ),
                    const Divider(color: Colors.white24, height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'TOTAL',
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '\$${_total.toStringAsFixed(2)}',
                          style: GoogleFonts.inter(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.gold500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ).animate().fadeIn(),
              const SizedBox(height: 24),
            ],

            // Send Button
            ElevatedButton(
              onPressed: _canSubmit ? () => _handleSubmit(ref) : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                disabledBackgroundColor: Colors.grey[800],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(LucideIcons.gift, color: Colors.black),
                  const SizedBox(width: 8),
                  Text(
                    _totalCents > 0
                        ? 'Send Bouquet - \$${_total.toStringAsFixed(2)}'
                        : 'Send Prayers (Free)',
                    style: GoogleFonts.inter(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 120), // Clearance for bottom nav bar
          ],
        ),
      ),
    );
  }

  bool get _canSubmit =>
      (_totalCents > 0 || _prayersCount > 0) &&
      _recipientNameController.text.isNotEmpty &&
      _recipientEmailController.text.isNotEmpty;

  // ... _buildItemSelector, _buildTextField, _buildSummaryRow match original ...
  Widget _buildItemSelector({
    required String icon,
    required String title,
    required String subtitle,
    required int count,
    required ValueChanged<int> onChanged,
  }) {
    // ... (same as original, just ensuring context) ...
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: count > 0
            ? AppTheme.gold500.withValues(alpha: 0.1)
            : AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: count > 0
              ? AppTheme.gold500.withValues(alpha: 0.5)
              : Colors.transparent,
        ),
      ),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              IconButton(
                onPressed: count > 0 ? () => onChanged(count - 1) : null,
                icon: Icon(
                  LucideIcons.minus,
                  color: count > 0 ? Colors.white : Colors.grey,
                  size: 18,
                ),
                style: IconButton.styleFrom(
                  backgroundColor: AppTheme.sacredNavy900,
                ),
              ),
              SizedBox(
                width: 40,
                child: Text(
                  '$count',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: count > 0 ? AppTheme.gold500 : Colors.grey,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => onChanged(count + 1),
                icon: const Icon(
                  LucideIcons.plus,
                  color: Colors.white,
                  size: 18,
                ),
                style: IconButton.styleFrom(backgroundColor: AppTheme.gold500),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      style: GoogleFonts.inter(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.inter(color: Colors.grey),
        prefixIcon: Icon(icon, color: Colors.grey),
        filled: true,
        fillColor: AppTheme.darkCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppTheme.gold500),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, double price) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(color: AppTheme.textSecondary)),
          Text(
            '\$${price.toStringAsFixed(2)}',
            style: GoogleFonts.inter(color: Colors.white),
          ),
        ],
      ),
    );
  }

  Future<void> _handleSubmit(WidgetRef ref) async {
    if (_totalCents > 0) {
      // Trigger Billing similar to Mass Offering
      // NOTE: For MVP, we default to mass_single if mass is selected, or candle_3d if just candle.
      // This is a simplification.
      String? productId;

      if (_massesCount > 0) {
        productId = ProductIds.massSingle;
      } else if (_candlesCount > 0) {
        productId = ProductIds.candle3Day;
      } else if (_rosariesCount > 0) {
        // Fallback to candle price point for now
        productId = ProductIds.candle7Day;
      }

      if (productId != null) {
        try {
          await ref
              .read(billingServiceProvider)
              .buyConsumable(
                productId,
                context: context,
                itemName: 'Spiritual Bouquet',
                price: _total,
              );
          // Assume success for UI flow
        } catch (e) {
          if (!mounted) return;
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Billing Failed: $e')));
          return;
        }
      }
    }

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sent bouquet to ${_recipientNameController.text}!'),
        backgroundColor: AppTheme.gold500,
      ),
    );
    context.pop();
  }
}
