import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class CertificatesScreen extends StatelessWidget {
  const CertificatesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'My Certificates',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverGrid.count(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 0.8,
              children: [
                _buildCertificateCard(
                  title: 'Novena to St. Jude',
                  date: 'Oct 2025',
                  icon: LucideIcons.flame,
                  color: Colors.red,
                ),
                _buildCertificateCard(
                  title: 'Bible In A Year',
                  date: 'Dec 2025',
                  icon: LucideIcons.bookOpen,
                  color: AppTheme.gold500,
                ),
                _buildCertificateCard(
                  title: 'Divine Mercy',
                  date: 'Apr 2026',
                  icon: LucideIcons.droplets,
                  color: Colors.blue,
                ),
                _buildEmptySlot(),
              ].animate(interval: 100.ms).fadeIn().scale(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCertificateCard({
    required String title,
    required String date,
    required IconData icon,
    required Color color,
  }) {
    return PremiumGlassCard(
      padding: EdgeInsets.zero,
      onTap: () {},
      child: Stack(
        children: [
          // Decorative BG
          Positioned(
            right: -20,
            bottom: -20,
            child: Icon(icon, size: 100, color: color.withValues(alpha: 0.1)),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: color.withValues(alpha: 0.5)),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'CERTIFICATE OF COMPLETION',
                      style: GoogleFonts.inter(
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                        color: Colors.white54,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      title,
                      style: GoogleFonts.merriweather(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      date,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppTheme.gold400,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptySlot() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.1),
          style: BorderStyle.solid,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.lock, color: Colors.white24, size: 32),
            const SizedBox(height: 8),
            Text(
              'Complete more\nprayers to unlock',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white38),
            ),
          ],
        ),
      ),
    );
  }
}
