import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/providers/scaffold_key_provider.dart';

import 'package:go_router/go_router.dart';
import '../../payments/services/payment_service.dart';

// Mass offering types
class OfferingType {
  final String id;
  final String name;
  final String icon;
  final int priceInCents;
  final String description;
  final bool isPopular;
  final String? badge;

  const OfferingType({
    required this.id,
    required this.name,
    required this.icon,
    required this.priceInCents,
    required this.description,
    this.isPopular = false,
    this.badge,
  });
}

const List<OfferingType> _offeringTypes = [
  OfferingType(
    id: 'REGULAR',
    name: 'Single Mass',
    icon: '⛪',
    priceInCents: 1500,
    description: 'A single Holy Mass offered for your intention',
  ),
  OfferingType(
    id: 'PERPETUAL',
    name: 'Perpetual Enrollment',
    icon: '🌟',
    priceInCents: 10000,
    description: 'Enrolled forever in daily Masses at our partner monasteries',
    isPopular: true,
    badge: 'BEST VALUE',
  ),
  OfferingType(
    id: 'NOVENA',
    name: 'Novena of Masses',
    icon: '📿',
    priceInCents: 7500,
    description: '9 consecutive Masses offered for your intention',
  ),
  OfferingType(
    id: 'GREGORIAN',
    name: 'Gregorian Masses',
    icon: '🙏',
    priceInCents: 25000,
    description:
        '30 consecutive Masses for the deceased (traditional devotion)',
  ),
];

// Intention categories
const List<Map<String, String>> _livingIntentions = [
  {'value': 'THANKSGIVING', 'label': 'Thanksgiving / Gratitude'},
  {'value': 'GOOD_HEALTH', 'label': 'Good Health'},
  {'value': 'HEALING', 'label': 'Healing'},
  {'value': 'BIRTHDAY_BLESSING', 'label': 'Birthday Blessing'},
  {'value': 'WEDDING_ANNIVERSARY', 'label': 'Wedding Anniversary'},
  {'value': 'SAFE_TRAVEL', 'label': 'Safe Travel'},
  {'value': 'EXAM_SUCCESS', 'label': 'Exam Success'},
  {'value': 'CAREER_SUCCESS', 'label': 'Career Success'},
  {'value': 'FAMILY_PEACE', 'label': 'Family Peace'},
];

const List<Map<String, String>> _deceasedIntentions = [
  {'value': 'REPOSE_OF_SOUL', 'label': 'Repose of the Soul'},
  {'value': 'ALL_SOULS', 'label': 'All Souls / Poor Souls'},
  {'value': 'DEATH_ANNIVERSARY', 'label': 'Death Anniversary'},
  {'value': 'RECENTLY_DECEASED', 'label': 'Recently Deceased'},
  {'value': 'FORGOTTEN_SOULS', 'label': 'Forgotten Souls'},
  {'value': 'PURGATORY', 'label': 'Souls in Purgatory'},
];

// Add-ons
const List<Map<String, dynamic>> _addons = [
  {
    'id': 'candle',
    'name': '🕯️ Virtual Candle',
    'price': 500,
    'description': '7-day candle on Prayer Wall',
  },
  {
    'id': 'printedCard',
    'name': '📮 Printed Mass Card',
    'price': 1000,
    'description': 'Beautiful card mailed to you',
  },
  {
    'id': 'framedCertificate',
    'name': '🖼️ Framed Certificate',
    'price': 3500,
    'description': 'Premium framed memorial',
  },
];

class MassOfferingScreen extends ConsumerStatefulWidget {
  const MassOfferingScreen({super.key});

  @override
  ConsumerState<MassOfferingScreen> createState() => _MassOfferingScreenState();
}

class _MassOfferingScreenState extends ConsumerState<MassOfferingScreen> {
  int _step = 1;
  String _selectedType = 'REGULAR';
  bool _isForLiving = false;
  String _intentionFor = '';
  // Contact & Shipping Info
  // ignore: unused_field
  String _name = '';
  // ignore: unused_field
  String _email = '';
  // ignore: unused_field
  String _phone = '';
  // ignore: unused_field
  String _recipientName = '';
  // ignore: unused_field
  String _recipientEmail = '';
  // ignore: unused_field, prefer_final_fields
  String _shippingAddress = '';
  // ignore: unused_field, prefer_final_fields
  String _giftMessage = '';
  // ignore: unused_field, prefer_final_fields
  String _offeredBy = '';
  // ignore: unused_field, prefer_final_fields
  String _specialIntention = '';

  // Add-ons
  final Map<String, bool> _addonsSelected = {
    'candle': false,
    'printedCard': false,
    'framedCertificate': false,
  };

  final _selectedIntentions = <String>{};

  bool _isGift = false;
  bool _isSubmitting = false;

  OfferingType get _selectedOffering =>
      _offeringTypes.firstWhere((o) => o.id == _selectedType);
  List<Map<String, String>> get _intentionOptions =>
      _isForLiving ? _livingIntentions : _deceasedIntentions;

  int _calculateTotal() {
    int total = _selectedOffering.priceInCents;
    if (_addonsSelected['candle'] == true) total += 500;
    if (_addonsSelected['printedCard'] == true) total += 1000;
    if (_addonsSelected['framedCertificate'] == true) total += 3500;
    return total;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFBEB), // Amber-50
      body: CustomScrollView(
        slivers: [
          // Gradient Header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFFD97706),
                    Color(0xFFEA580C),
                    Color(0xFFDC2626),
                  ],
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
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
                        ],
                      ),
                      Row(
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              color: Colors.white24,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Icon(
                              LucideIcons.church,
                              color: Colors.white,
                              size: 28,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Request a Holy Mass',
                                  style: GoogleFonts.merriweather(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'Have a Mass offered for your intentions',
                                  style: GoogleFonts.inter(
                                    fontSize: 14,
                                    color: Colors.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Progress Steps
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (i) {
                  final step = i + 1;
                  return Expanded(
                    child: Container(
                      height: 6,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: step <= _step
                            ? Colors.amber.shade600
                            : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),

          // Step Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _buildStepContent(),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_step) {
      case 1:
        return _buildStep1();
      case 2:
        return _buildStep2();
      case 3:
        return _buildStep3();
      case 4:
        return _buildStep4();
      default:
        return _buildStep1();
    }
  }

  // Step 1: Choose Offering Type
  Widget _buildStep1() {
    return Column(
      key: const ValueKey('step1'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            'Choose Your Offering',
            style: GoogleFonts.merriweather(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade900,
            ),
          ),
        ),
        const SizedBox(height: 24),
        ..._offeringTypes.map((type) => _buildOfferingCard(type)),
        const SizedBox(height: 24),
        _buildNavButton(
          'Continue',
          () => setState(() => _step = 2),
          enabled: true,
        ),
      ],
    );
  }

  Widget _buildOfferingCard(OfferingType type) {
    final isSelected = _selectedType == type.id;
    return GestureDetector(
      onTap: () => setState(() => _selectedType = type.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? Colors.amber.shade500 : Colors.grey.shade200,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.amber.withValues(alpha: 0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            Text(type.icon, style: const TextStyle(fontSize: 36)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        type.name,
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.grey.shade900,
                        ),
                      ),
                      if (isSelected) ...[
                        const SizedBox(width: 8),
                        Icon(
                          LucideIcons.check,
                          color: Colors.amber.shade600,
                          size: 18,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    type.description,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '\$${(type.priceInCents / 100).toStringAsFixed(2)}',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.bold,
                      color: Colors.amber.shade700,
                    ),
                  ),
                ],
              ),
            ),
            if (type.badge != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.amber.shade500,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  type.badge!,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Step 2: Intention Details
  Widget _buildStep2() {
    return Column(
      key: const ValueKey('step2'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            'Intention Details',
            style: GoogleFonts.merriweather(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade900,
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Living/Deceased Toggle
        Text(
          'This intention is for:',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildToggleButton(
                '✨ Living Person',
                _isForLiving,
                () => setState(() {
                  _isForLiving = true;
                  _selectedIntentions.clear();
                }),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildToggleButton(
                '🕯️ Deceased Person',
                !_isForLiving,
                () => setState(() {
                  _isForLiving = false;
                  _selectedIntentions.clear();
                }),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Name for intention
        Text(
          'Name of Person(s) for the Intention *',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          onChanged: (v) => setState(() => _intentionFor = v),
          decoration: _inputDecoration('e.g., John Smith'),
        ),
        const SizedBox(height: 20),

        // Intention categories (chips)
        Text(
          'Select Intention Type(s)',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _intentionOptions.map((opt) {
            final isSelected = _selectedIntentions.contains(opt['value']);
            return GestureDetector(
              onTap: () => setState(() {
                if (isSelected) {
                  _selectedIntentions.remove(opt['value']);
                } else {
                  _selectedIntentions.add(opt['value']!);
                }
              }),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Colors.amber.shade500
                      : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${isSelected ? '✓ ' : ''}${opt['label']}',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: isSelected ? Colors.white : Colors.grey.shade700,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),

        // Special intention
        Text(
          'Special Intention (Optional)',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          onChanged: (v) => setState(() => _specialIntention = v),
          maxLines: 3,
          decoration: _inputDecoration('Any specific intention or notes...'),
        ),
        const SizedBox(height: 20),

        // Offered By
        Text(
          'Offered By (for the Mass card)',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          onChanged: (v) => setState(() => _offeredBy = v),
          decoration: _inputDecoration('Your name (appears on Mass card)'),
        ),
        const SizedBox(height: 24),

        Row(
          children: [
            Expanded(
              child: _buildNavButton(
                'Back',
                () => setState(() => _step = 1),
                isSecondary: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildNavButton(
                'Continue',
                () => setState(() => _step = 3),
                enabled: _intentionFor.isNotEmpty,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // Step 3: Add-ons
  Widget _buildStep3() {
    return Column(
      key: const ValueKey('step3'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            'Enhance Your Offering',
            style: GoogleFonts.merriweather(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade900,
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Add-ons
        ..._addons.map((addon) {
          final isSelected = _addonsSelected[addon['id']] == true;
          return GestureDetector(
            onTap: () =>
                setState(() => _addonsSelected[addon['id']] = !isSelected),
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? Colors.amber.shade500
                      : Colors.grey.shade200,
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Checkbox(
                    value: isSelected,
                    onChanged: (v) => setState(
                      () => _addonsSelected[addon['id']] = v ?? false,
                    ),
                    activeColor: Colors.amber,
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          addon['name'],
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.w600,
                            color: Colors.grey.shade900,
                          ),
                        ),
                        Text(
                          addon['description'],
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '+\$${(addon['price'] / 100).toStringAsFixed(2)}',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.bold,
                      color: Colors.amber.shade700,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: 20),

        // Gift Option
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.pink.shade50, Colors.pink.shade50],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.pink.shade100),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Checkbox(
                    value: _isGift,
                    onChanged: (v) => setState(() => _isGift = v ?? false),
                    activeColor: Colors.pink,
                  ),
                  const Icon(LucideIcons.gift, color: Colors.pink, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'This is a Gift',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade900,
                    ),
                  ),
                ],
              ),
              Text(
                'Send the digital Mass card to someone else',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
              if (_isGift) ...[
                const SizedBox(height: 12),
                TextField(
                  onChanged: (v) => setState(() => _recipientName = v),
                  decoration: _inputDecoration("Recipient's name"),
                ),
                const SizedBox(height: 8),
                TextField(
                  onChanged: (v) => setState(() => _recipientEmail = v),
                  decoration: _inputDecoration("Recipient's email"),
                ),
                const SizedBox(height: 8),
                TextField(
                  onChanged: (v) => setState(() => _giftMessage = v),
                  maxLines: 2,
                  decoration: _inputDecoration('Personal message...'),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 24),

        Row(
          children: [
            Expanded(
              child: _buildNavButton(
                'Back',
                () => setState(() => _step = 2),
                isSecondary: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildNavButton(
                'Continue',
                () => setState(() => _step = 4),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // Step 4: Checkout
  Widget _buildStep4() {
    return Column(
      key: const ValueKey('step4'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            'Complete Your Request',
            style: GoogleFonts.merriweather(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade900,
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Contact Info
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 8,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Your Information',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: Colors.grey.shade900,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                onChanged: (v) => setState(() => _name = v),
                decoration: _inputDecoration('Your full name *'),
              ),
              const SizedBox(height: 12),
              TextField(
                onChanged: (v) => setState(() => _email = v),
                decoration: _inputDecoration('your@email.com *'),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 12),
              TextField(
                onChanged: (v) => setState(() => _phone = v),
                decoration: _inputDecoration('Phone (optional)'),
                keyboardType: TextInputType.phone,
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Order Summary
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.amber.shade50,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Order Summary',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: Colors.amber.shade900,
                ),
              ),
              const SizedBox(height: 12),
              _buildSummaryRow(
                '${_selectedOffering.icon} ${_selectedOffering.name}',
                '\$${(_selectedOffering.priceInCents / 100).toStringAsFixed(2)}',
              ),
              if (_addonsSelected['candle'] == true)
                _buildSummaryRow('🕯️ Virtual Candle', '\$5.00'),
              if (_addonsSelected['printedCard'] == true)
                _buildSummaryRow('📮 Printed Card', '\$10.00'),
              if (_addonsSelected['framedCertificate'] == true)
                _buildSummaryRow('🖼️ Framed Certificate', '\$35.00'),
              const Divider(color: Colors.amber),
              _buildSummaryRow(
                'Total',
                '\$${(_calculateTotal() / 100).toStringAsFixed(2)}',
                isBold: true,
              ),
              const SizedBox(height: 12),
              Text(
                'For: $_intentionFor ${_isForLiving ? '(Living)' : '(Deceased)'}',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: Colors.amber.shade800,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        Row(
          children: [
            Expanded(
              child: _buildNavButton(
                'Back',
                () => setState(() => _step = 3),
                isSecondary: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed:
                    (_name.isNotEmpty && _email.isNotEmpty && !_isSubmitting)
                    ? () async {
                        setState(() => _isSubmitting = true);
                        try {
                          final double amount = _calculateTotal() / 100.0;

                          // Trigger PayPal Payment
                          final paymentService = ref.read(
                            paymentServiceProvider,
                          );
                          paymentService.startPayPalPayment(
                            context: context,
                            amount: amount,
                            currency: 'USD',
                            description: 'Mass Offering: $_selectedType',
                            onSuccess: (paymentId) async {
                              // Log details (placeholder for future backend sync)
                              debugPrint(
                                'Offering Successful ($paymentId): '
                                'For: $_intentionFor, '
                                'By: $_offeredBy',
                              );

                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Mass offering submitted successfully!',
                                  ),
                                  backgroundColor: Colors.green,
                                ),
                              );

                              if (mounted) {
                                setState(() => _isSubmitting = false);
                                // Optional: Navigate back or reset
                                context.pop();
                              }
                            },
                            onError: (error) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Payment failed: $error'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                              if (mounted) {
                                setState(() => _isSubmitting = false);
                              }
                            },
                          );
                        } catch (e) {
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Error: $e'),
                                backgroundColor: Colors.red,
                              ),
                            );
                            setState(() => _isSubmitting = false);
                          }
                        }
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber.shade600,
                  disabledBackgroundColor: Colors.grey.shade300,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_isSubmitting)
                      const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    else ...[
                      const Icon(LucideIcons.heart, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Request Mass - \$${(_calculateTotal() / 100).toStringAsFixed(2)}',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Center(
          child: Text(
            '🔒 Secure payment via PayPal',
            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
          ),
        ),
      ],
    );
  }

  Widget _buildToggleButton(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected
              ? (label.contains('Living')
                    ? Colors.green.shade50
                    : Colors.purple.shade50)
              : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? (label.contains('Living')
                      ? Colors.green.shade500
                      : Colors.purple.shade500)
                : Colors.grey.shade200,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.inter(
              fontWeight: FontWeight.w600,
              color: isSelected
                  ? (label.contains('Living')
                        ? Colors.green.shade700
                        : Colors.purple.shade700)
                  : Colors.grey.shade600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton(
    String label,
    VoidCallback onPressed, {
    bool isSecondary = false,
    bool enabled = true,
  }) {
    return ElevatedButton(
      onPressed: enabled ? onPressed : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: isSecondary ? Colors.white : Colors.amber.shade600,
        foregroundColor: isSecondary ? Colors.grey.shade700 : Colors.white,
        disabledBackgroundColor: Colors.grey.shade300,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: isSecondary
              ? BorderSide(color: Colors.grey.shade300, width: 2)
              : BorderSide.none,
        ),
        elevation: isSecondary ? 0 : 2,
      ),
      child: Text(
        label,
        style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 16),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: GoogleFonts.inter(
                fontSize: isBold ? 16 : 14,
                fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
                color: Colors.amber.shade800,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: isBold ? 16 : 14,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: Colors.amber.shade900,
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.inter(color: Colors.grey.shade400),
      filled: true,
      fillColor: Colors.grey.shade50,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.amber.shade500, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }
}
