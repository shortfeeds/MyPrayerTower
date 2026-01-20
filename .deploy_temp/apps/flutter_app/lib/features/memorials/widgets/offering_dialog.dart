import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/billing/billing_service.dart';
import '../repositories/memorial_repository.dart';

class OfferingDialog extends ConsumerStatefulWidget {
  final String memorialId;

  const OfferingDialog({super.key, required this.memorialId});

  @override
  ConsumerState<OfferingDialog> createState() => _OfferingDialogState();
}

class _OfferingDialogState extends ConsumerState<OfferingDialog> {
  String? _selectedType;
  final TextEditingController _messageController = TextEditingController();
  final TextEditingController _guestNameController = TextEditingController();
  bool _isLoading = false;

  final _offerings = [
    {
      'type': 'CANDLE_SMALL',
      'label': 'Small Candle',
      'icon': '🕯️',
      'price': 2.0,
    },
    {'type': 'FLOWERS', 'label': 'Flowers', 'icon': '🌹', 'price': 5.0},
    {'type': 'MASS', 'label': 'Holy Mass', 'icon': '✝️', 'price': 15.0},
  ];

  Future<void> _handlePurchase() async {
    if (_selectedType == null) return;
    setState(() => _isLoading = true);

    try {
      final offering = _offerings.firstWhere((o) => o['type'] == _selectedType);
      final price = offering['price'] as double;
      // Use generic consumable ID or specific one
      const productId = 'memorial_offering_consumable';

      await ref
          .read(billingServiceProvider)
          .buyConsumable(
            productId,
            context: context,
            itemName: offering['label'] as String,
            price: price,
          );

      await ref
          .read(memorialRepositoryProvider)
          .addOffering(
            memorialId: widget.memorialId,
            type: _selectedType!,
            amount: price,
            message: _guestNameController.text.isNotEmpty
                ? 'From ${_guestNameController.text}: ${_messageController.text}'
                : _messageController.text,
            isAnonymous: false,
          );

      if (mounted) {
        Navigator.pop(context, true); // Return true to trigger refresh
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Tribute sent successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Send a Tribute',
              style: GoogleFonts.merriweather(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),

            // Selection
            SizedBox(
              height: 100,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _offerings.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final off = _offerings[index];
                  final isSelected = _selectedType == off['type'];
                  return GestureDetector(
                    onTap: () =>
                        setState(() => _selectedType = off['type'] as String),
                    child: Container(
                      width: 100,
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.amber.shade50 : Colors.white,
                        border: Border.all(
                          color: isSelected
                              ? Colors.amber
                              : Colors.grey.shade300,
                          width: isSelected ? 2 : 1,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            off['icon'] as String,
                            style: const TextStyle(fontSize: 24),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            off['label'] as String,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '\$${off['price']}',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 20),

            TextField(
              controller: _guestNameController,
              decoration: const InputDecoration(
                labelText: 'Your Name (Optional)',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _messageController,
              decoration: const InputDecoration(
                labelText: 'Message (Optional)',
                border: OutlineInputBorder(),
                isDense: true,
              ),
              maxLines: 2,
            ),

            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: (_isLoading || _selectedType == null)
                    ? null
                    : _handlePurchase,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  foregroundColor: Colors.black87,
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Send Tribute'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
