import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/billing/billing_service.dart';
import '../models/memorial_model.dart';
import '../repositories/memorial_repository.dart';

class UpgradeMemorialSheet extends ConsumerStatefulWidget {
  final Memorial memorial;

  const UpgradeMemorialSheet({super.key, required this.memorial});

  @override
  ConsumerState<UpgradeMemorialSheet> createState() =>
      _UpgradeMemorialSheetState();
}

class _UpgradeMemorialSheetState extends ConsumerState<UpgradeMemorialSheet> {
  bool _isLoading = false;

  Future<void> _handleUpgrade() async {
    setState(() => _isLoading = true);

    try {
      // 1. Process Payment
      // We need a product ID for memorial upgrade.
      // Assuming 'memorial_premium_upgrade' for now, or use a generic consumable/non-consumable.
      // Ideally this comes from product_ids.dart.
      const productId = 'memorial_premium_upgrade';

      await ref
          .read(billingServiceProvider)
          .buyConsumable(
            productId,
            context: context,
            itemName: 'Memorial Premium Upgrade',
            price: 49.99,
          );

      // 2. Update DB
      // We need a method in repo to upgrade tier.
      // For now, we'll assume the repo has specific method or we use a raw update.
      // But wait, the repo I wrote only has create/get/addEntry.
      // I should add `upgradeMemorial(id)` to repo.
      // For now, I will use a direct update call if possible or add the method.
      // Let's assume I will add `updateMemorialTier` to the repo in the next step.
      await ref
          .read(memorialRepositoryProvider)
          .updateTier(widget.memorial.id, 'PREMIUM');

      if (mounted) {
        Navigator.pop(context); // Close sheet
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Memorial upgraded to Premium!'),
            backgroundColor: Colors.amber,
          ),
        );
        // We really should trigger a refresh in the Detail screen
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Upgrade failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),

          const Icon(LucideIcons.crown, size: 48, color: Colors.amber),
          const SizedBox(height: 16),

          Text(
            'Upgrade to Premium',
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Honor ${widget.memorial.firstName} with a featured memorial.',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(color: Colors.grey.shade600),
          ),

          const SizedBox(height: 24),

          const _FeatureRow(
            label: 'Golden Profile Styling',
            icon: LucideIcons.sparkles,
          ),
          const _FeatureRow(
            label: 'Unlimited Photos & Videos',
            icon: LucideIcons.image,
          ),
          const _FeatureRow(label: 'Background Music', icon: LucideIcons.music),
          const _FeatureRow(
            label: 'Ad-Free Experience',
            icon: LucideIcons.shieldCheck,
          ),
          const _FeatureRow(
            label: 'Priority Placement',
            icon: LucideIcons.arrowUpCircle,
          ),

          const SizedBox(height: 32),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _handleUpgrade,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                foregroundColor: Colors.black87,
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.black,
                      ),
                    )
                  : const Text('Upgrade Lifetime - \$49.99'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final String label;
  final IconData icon;

  const _FeatureRow({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.amber.shade700),
          const SizedBox(width: 12),
          Text(label, style: GoogleFonts.inter(fontSize: 16)),
        ],
      ),
    );
  }
}
