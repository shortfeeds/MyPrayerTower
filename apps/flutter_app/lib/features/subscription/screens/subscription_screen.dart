import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Subscription Screen - Now shows that all features are FREE
///
/// The app has moved to a free model with ad-based revenue.
/// This screen informs users that all premium features are now unlocked.
class SubscriptionScreen extends ConsumerWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: const Text('Premium Access'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: CustomScrollView(
        slivers: [
          SliverFillRemaining(
            hasScrollBody: false,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Success icon
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppTheme.accentGold.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      LucideIcons.checkCircle2,
                      size: 64,
                      color: AppTheme.accentGold,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Main message
                  Text(
                    '🎉 All Features Unlocked!',
                    style: GoogleFonts.merriweather(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),

                  Text(
                    'Great news! MyPrayerTower is now completely FREE for everyone.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      color: Colors.white.withValues(alpha: 0.9),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Feature list
                  _buildFeatureCard(
                    icon: LucideIcons.bookOpen,
                    title: 'Full Prayer Library',
                    description: '3900+ prayers at your fingertips',
                  ),
                  _buildFeatureCard(
                    icon: LucideIcons.flame,
                    title: 'Virtual Candles',
                    description: 'Light candles for your intentions',
                  ),
                  _buildFeatureCard(
                    icon: LucideIcons.church,
                    title: 'Mass Finder',
                    description: 'Find churches near you',
                  ),
                  _buildFeatureCard(
                    icon: LucideIcons.heart,
                    title: 'Prayer Wall',
                    description: 'Share and receive prayers',
                  ),
                  _buildFeatureCard(
                    icon: LucideIcons.cross,
                    title: 'Daily Readings',
                    description: 'Mass readings and reflections',
                  ),

                  const SizedBox(height: 32),

                  // Support message
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGold.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppTheme.accentGold.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          LucideIcons.heart,
                          color: AppTheme.accentGold,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Support our mission through donations, Mass offerings, or by sharing the app with others!',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.white.withValues(alpha: 0.8),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Back button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.accentGold,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Start Exploring',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
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

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy800.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.accentGold.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppTheme.accentGold, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    description,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(LucideIcons.checkCircle2, color: Colors.green, size: 24),
          ],
        ),
      ),
    );
  }
}
