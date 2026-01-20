import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../services/payment_service.dart';

/// Smart Checkout Bottom Sheet
/// Displays card-first guest checkout with PayPal as secondary option
class SmartCheckoutSheet extends ConsumerStatefulWidget {
  final double amount;
  final String currency;
  final String description;
  final String itemName;
  final String? itemIcon;
  final Function(String) onSuccess;
  final Function(String) onError;
  final VoidCallback? onCancel;

  const SmartCheckoutSheet({
    super.key,
    required this.amount,
    this.currency = 'USD',
    required this.description,
    required this.itemName,
    this.itemIcon,
    required this.onSuccess,
    required this.onError,
    this.onCancel,
  });

  /// Show the smart checkout bottom sheet
  static Future<void> show({
    required BuildContext context,
    required WidgetRef ref,
    required double amount,
    String currency = 'USD',
    required String description,
    required String itemName,
    String? itemIcon,
    required Function(String) onSuccess,
    required Function(String) onError,
    VoidCallback? onCancel,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SmartCheckoutSheet(
        amount: amount,
        currency: currency,
        description: description,
        itemName: itemName,
        itemIcon: itemIcon,
        onSuccess: onSuccess,
        onError: onError,
        onCancel: onCancel,
      ),
    );
  }

  @override
  ConsumerState<SmartCheckoutSheet> createState() => _SmartCheckoutSheetState();
}

class _SmartCheckoutSheetState extends ConsumerState<SmartCheckoutSheet> {
  final _emailController = TextEditingController();
  bool _isProcessing = false;
  PaymentMethod _selectedMethod = PaymentMethod.card;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _startPayment() {
    if (_emailController.text.isEmpty || !_emailController.text.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid email for your receipt'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    final paymentService = ref.read(paymentServiceProvider);

    paymentService.startPayPalPayment(
      context: context,
      amount: widget.amount,
      currency: widget.currency,
      description: widget.description,
      userEmail: _emailController.text,
      onSuccess: (transactionId) {
        setState(() => _isProcessing = false);
        Navigator.pop(context);
        widget.onSuccess(transactionId);
      },
      onError: (error) {
        setState(() => _isProcessing = false);
        widget.onError(error);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 16,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),

              // Header
              Row(
                children: [
                  if (widget.itemIcon != null)
                    Text(
                      widget.itemIcon!,
                      style: const TextStyle(fontSize: 32),
                    ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.itemName,
                          style: GoogleFonts.merriweather(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          '\$${widget.amount.toStringAsFixed(2)} ${widget.currency}',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppTheme.gold500,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(LucideIcons.x, color: Colors.white54),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // No account needed badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppTheme.gold500.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      LucideIcons.userCheck,
                      size: 14,
                      color: AppTheme.gold500,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'No account needed',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppTheme.gold500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Email field
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: GoogleFonts.inter(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Email (for receipt)',
                  labelStyle: GoogleFonts.inter(color: Colors.white60),
                  prefixIcon: const Icon(
                    LucideIcons.mail,
                    color: Colors.white54,
                    size: 20,
                  ),
                  filled: true,
                  fillColor: AppTheme.sacredNavy950,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.gold500),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Payment method selection
              Text(
                'Payment Method',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.white60,
                ),
              ),
              const SizedBox(height: 12),

              // Card option (PRIMARY)
              _buildPaymentOption(
                method: PaymentMethod.card,
                icon: LucideIcons.creditCard,
                title: 'Credit / Debit Card',
                subtitle: 'Visa, Mastercard, Amex',
                isRecommended: true,
              ),
              const SizedBox(height: 10),

              // PayPal option (SECONDARY)
              _buildPaymentOption(
                method: PaymentMethod.paypal,
                icon: LucideIcons.wallet,
                title: 'PayPal Account',
                subtitle: 'Pay with your PayPal balance',
              ),
              const SizedBox(height: 24),

              // Pay button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isProcessing ? null : _startPayment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold500,
                    foregroundColor: AppTheme.sacredNavy900,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 4,
                  ),
                  child: _isProcessing
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(
                              AppTheme.sacredNavy900,
                            ),
                          ),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(LucideIcons.lock, size: 18),
                            const SizedBox(width: 8),
                            Text(
                              'Pay \$${widget.amount.toStringAsFixed(2)} Securely',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 16),

              // Trust badges
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    LucideIcons.shieldCheck,
                    size: 14,
                    color: Colors.white38,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Secured by PayPal',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: Colors.white38,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Icon(
                    LucideIcons.truck,
                    size: 14,
                    color: Colors.white38,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'No shipping needed',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: Colors.white38,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required PaymentMethod method,
    required IconData icon,
    required String title,
    required String subtitle,
    bool isRecommended = false,
  }) {
    final isSelected = _selectedMethod == method;
    return GestureDetector(
      onTap: () => setState(() => _selectedMethod = method),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.gold500.withValues(alpha: 0.1)
              : AppTheme.sacredNavy950,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? AppTheme.gold500
                : Colors.white.withValues(alpha: 0.1),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.gold500.withValues(alpha: 0.2)
                    : Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppTheme.gold500 : Colors.white54,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      if (isRecommended) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.success.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'Fastest',
                            style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.success,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppTheme.gold500 : Colors.white30,
                  width: 2,
                ),
                color: isSelected ? AppTheme.gold500 : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(
                      LucideIcons.check,
                      size: 14,
                      color: AppTheme.sacredNavy900,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

enum PaymentMethod { card, paypal }
