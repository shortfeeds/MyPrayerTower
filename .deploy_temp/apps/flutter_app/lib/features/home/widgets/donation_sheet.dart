import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class DonationSheet extends ConsumerStatefulWidget {
  const DonationSheet({super.key});

  @override
  ConsumerState<DonationSheet> createState() => _DonationSheetState();
}

class _DonationSheetState extends ConsumerState<DonationSheet> {
  bool _isMonthly = false;
  int _selectedAmount = 50;
  final TextEditingController _customController = TextEditingController();

  final List<int> _amounts = [10, 25, 50, 100, 250];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppTheme.sacredNavy950,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Header
            const Text(
              'Support Our Mission',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontFamily: 'Merriweather',
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Help us keep the virtual sanctuary open for everyone.',
              style: TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            // Toggle
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white12),
              ),
              child: Row(
                children: [
                  Expanded(child: _buildToggleOption('One-time', !_isMonthly)),
                  Expanded(child: _buildToggleOption('Monthly', _isMonthly)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Amounts
            Wrap(
              spacing: 12,
              runSpacing: 12,
              alignment: WrapAlignment.center,
              children: _amounts
                  .map((amount) => _buildAmountChip(amount))
                  .toList(),
            ),
            const SizedBox(height: 16),

            // Custom Amount
            TextField(
              controller: _customController,
              style: const TextStyle(color: Colors.white),
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                prefixText: '\$ ',
                prefixStyle: const TextStyle(color: AppTheme.gold500),
                labelText: 'Custom Amount',
                labelStyle: const TextStyle(color: Colors.grey),
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
              onChanged: (val) {
                setState(() {
                  _selectedAmount = 0; // Deselect chips
                });
              },
            ),
            const SizedBox(height: 24),

            // Donate Button
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Processing ${_isMonthly ? "Monthly" : "One-time"} donation...',
                    ),
                    backgroundColor: AppTheme.gold500,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.heart, color: Colors.black, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Donate Now',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(LucideIcons.lock, size: 12, color: Colors.white38),
                SizedBox(width: 6),
                Text(
                  'Secure Payment',
                  style: TextStyle(color: Colors.white38, fontSize: 12),
                ),
              ],
            ),
            SizedBox(
              height: MediaQuery.of(context).viewInsets.bottom,
            ), // Keyboard safe
          ],
        ),
      ),
    );
  }

  Widget _buildToggleOption(String label, bool isSelected) {
    return GestureDetector(
      onTap: () => setState(() => _isMonthly = label == 'Monthly'),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.gold500 : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : Colors.white70,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAmountChip(int amount) {
    final isSelected = _selectedAmount == amount;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedAmount = amount;
          _customController.clear();
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.gold500.withValues(alpha: 0.2)
              : AppTheme.darkCard,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? AppTheme.gold500 : Colors.white12,
            width: 1.5,
          ),
        ),
        child: Text(
          '\$$amount',
          style: TextStyle(
            color: isSelected ? AppTheme.gold500 : Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}
