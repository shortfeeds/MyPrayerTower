import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../ads/widgets/rewarded_ad_widget.dart';

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
                _buildEmptySlot(),
                // Special Ad-Unlocked Certificate
                RewardedAdUnlock(
                  title: 'Prayer Guardian',
                  description: 'Unlock this special certificate',
                  previewContent: 'CERTIFICATE OF\nPRAYER GUARDIANSHIP',
                  fullContentBuilder: (context) => Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.gold500),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.shieldCheck,
                          color: AppTheme.gold500,
                          size: 48,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'GUARDIAN',
                          style: GoogleFonts.merriweather(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          'UNLOCKED',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            color: AppTheme.gold400,
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                _buildEmptySlot(),
                _buildEmptySlot(),
              ].animate(interval: 100.ms).fadeIn().scale(),
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
