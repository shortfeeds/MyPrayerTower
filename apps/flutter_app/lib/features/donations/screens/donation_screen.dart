import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../payments/services/payment_service.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/donations_repository.dart';

class DonationScreen extends ConsumerStatefulWidget {
  const DonationScreen({super.key});

  @override
  ConsumerState<DonationScreen> createState() => _DonationScreenState();
}

class _DonationScreenState extends ConsumerState<DonationScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String? _selectedTierId;
  int _customAmount = 0;
  bool _coversFee = false;
  int? _selectedPlanIndex;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  double get _feeAmount => (_selectedAmount * 0.029 + 30) / 100;

  int get _selectedAmount {
    if (_selectedTierId == 'CUSTOM') return _customAmount;
    final tiers = ref.read(donationTiersProvider);
    final tier = tiers.firstWhere(
      (t) => t.id == _selectedTierId,
      orElse: () => tiers.first,
    );
    return tier.amount;
  }

  double get _totalAmount {
    final base = _selectedAmount / 100;
    return _coversFee ? base + _feeAmount : base;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Support Our Mission',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: AppTheme.sacredNavy900,
              borderRadius: BorderRadius.circular(12),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: AppTheme.gold500,
                borderRadius: BorderRadius.circular(10),
              ),
              labelColor: Colors.black,
              unselectedLabelColor: Colors.white60,
              labelStyle: GoogleFonts.inter(fontWeight: FontWeight.bold),
              tabs: const [
                Tab(text: 'One-Time'),
                Tab(text: 'Monthly'),
              ],
            ),
          ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [_buildOneTimeTab(), _buildMonthlyTab()],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOneTimeTab() {
    final tiers = ref.watch(donationTiersProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Text(
            'Make a Difference',
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(),
          const SizedBox(height: 8),
          Text(
            'Your generosity helps us spread the faith',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),

          // Tier Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.4,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: tiers.length,
            itemBuilder: (context, index) {
              final tier = tiers[index];
              final isSelected = _selectedTierId == tier.id;

              return GestureDetector(
                    onTap: () => setState(() => _selectedTierId = tier.id),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold500.withValues(alpha: 0.15)
                            : AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected
                              ? AppTheme.gold500
                              : Colors.transparent,
                          width: 2,
                        ),
                      ),
                      child: Stack(
                        children: [
                          if (tier.isPopular)
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'POPULAR',
                                  style: GoogleFonts.inter(
                                    fontSize: 8,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                            ),
                          Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  tier.icon,
                                  style: const TextStyle(fontSize: 28),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  '\$${(tier.amount / 100).toStringAsFixed(0)}',
                                  style: GoogleFonts.inter(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: isSelected
                                        ? AppTheme.gold500
                                        : Colors.white,
                                  ),
                                ),
                                Text(
                                  tier.label
                                      .replaceAll(RegExp(r'[^\w\s]'), '')
                                      .trim(),
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    color: AppTheme.textSecondary,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .animate(delay: Duration(milliseconds: 50 * index))
                  .fadeIn()
                  .scale(begin: const Offset(0.95, 0.95));
            },
          ),
          const SizedBox(height: 16),

          // Custom Amount
          GestureDetector(
            onTap: () => setState(() => _selectedTierId = 'CUSTOM'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _selectedTierId == 'CUSTOM'
                    ? AppTheme.gold500.withValues(alpha: 0.15)
                    : AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _selectedTierId == 'CUSTOM'
                      ? AppTheme.gold500
                      : Colors.transparent,
                ),
              ),
              child: Row(
                children: [
                  const Text('✨', style: TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Custom Amount',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Enter any amount',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (_selectedTierId == 'CUSTOM')
                    SizedBox(
                      width: 100,
                      child: TextField(
                        keyboardType: TextInputType.number,
                        style: GoogleFonts.inter(
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.bold,
                        ),
                        decoration: InputDecoration(
                          prefixText: '\$',
                          prefixStyle: GoogleFonts.inter(
                            color: AppTheme.gold500,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.zero,
                        ),
                        onChanged: (val) {
                          setState(() {
                            _customAmount = (int.tryParse(val) ?? 0) * 100;
                          });
                        },
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Cover Fee Option
          GestureDetector(
            onTap: () => setState(() => _coversFee = !_coversFee),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.sacredNavy900,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    _coversFee ? LucideIcons.checkSquare : LucideIcons.square,
                    color: _coversFee ? AppTheme.gold500 : Colors.grey,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Cover processing fees',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          'Add \$${_feeAmount.toStringAsFixed(2)} so 100% goes to our mission',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Donate Button
          ElevatedButton(
            onPressed: _selectedTierId != null && _selectedAmount > 0
                ? _handleDonate
                : null,
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
                const Icon(LucideIcons.heart, color: Colors.black),
                const SizedBox(width: 8),
                Text(
                  _selectedAmount > 0
                      ? 'Donate \$${_totalAmount.toStringAsFixed(2)}'
                      : 'Select Amount',
                  style: GoogleFonts.inter(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Security Note
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.shield, size: 14, color: Colors.grey[600]),
              const SizedBox(width: 4),
              Text(
                'Secure payment via PayPal',
                style: GoogleFonts.inter(fontSize: 12, color: Colors.grey[600]),
              ),
            ],
          ),
          const SizedBox(height: 120), // Clearance for bottom nav bar
        ],
      ),
    );
  }

  Widget _buildMonthlyTab() {
    final plans = ref.watch(subscriptionPlansProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Become a Partner',
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(),
          const SizedBox(height: 8),
          Text(
            'Join our community of faithful supporters',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),

          ...plans.asMap().entries.map((entry) {
            final index = entry.key;
            final plan = entry.value;
            final isSelected = _selectedPlanIndex == index;

            return GestureDetector(
                  onTap: () => setState(() => _selectedPlanIndex = index),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.gold500.withValues(alpha: 0.15)
                          : AppTheme.darkCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.gold500
                            : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Text(
                              plan.icon,
                              style: const TextStyle(fontSize: 32),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        plan.name,
                                        style: GoogleFonts.merriweather(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      if (plan.isPopular) ...[
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.gold500,
                                            borderRadius: BorderRadius.circular(
                                              4,
                                            ),
                                          ),
                                          child: Text(
                                            'BEST VALUE',
                                            style: GoogleFonts.inter(
                                              fontSize: 9,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  '\$${(plan.price / 100).toStringAsFixed(2)}',
                                  style: GoogleFonts.inter(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.gold500,
                                  ),
                                ),
                                Text(
                                  '/month',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: AppTheme.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ...plan.perks.map(
                          (perk) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              children: [
                                const Icon(
                                  LucideIcons.check,
                                  size: 16,
                                  color: AppTheme.gold500,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    perk,
                                    style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                .animate(delay: Duration(milliseconds: 100 * index))
                .fadeIn()
                .slideX(begin: 0.1);
          }),
          const SizedBox(height: 16),

          ElevatedButton(
            onPressed: _selectedPlanIndex != null ? _handleSubscribe : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold500,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              disabledBackgroundColor: Colors.grey[800],
            ),
            child: Text(
              _selectedPlanIndex != null
                  ? 'Subscribe to ${plans[_selectedPlanIndex!].name}'
                  : 'Select a Plan',
              style: GoogleFonts.inter(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 120), // Clearance for bottom nav bar
        ],
      ),
    );
  }

  void _handleDonate() {
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
              'Select Payment Method',
              style: GoogleFonts.merriweather(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
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
                  amount: _totalAmount,
                  currency: 'USD',
                  description: 'Donation to MyPrayerTower',
                  onSuccess: (id) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Donation successful! ID: $id'),
                        backgroundColor: Colors.green,
                      ),
                    );
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
              icon: const Icon(LucideIcons.creditCard, color: Colors.white),
              label: const Text('Pay with PayPal'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF003087), // PayPal Blue
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
            const SizedBox(height: 12),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  void _handleSubscribe() {
    final plans = ref.read(subscriptionPlansProvider);
    final plan = plans[_selectedPlanIndex!];

    // Subscriptions typically handled via Stripe Link or In-App Purchase
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Starting subscription for ${plan.name}...'),
        backgroundColor: AppTheme.gold500,
      ),
    );
  }
}
