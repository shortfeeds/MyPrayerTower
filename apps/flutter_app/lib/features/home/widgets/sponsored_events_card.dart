import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Displays Tonight's Sponsored Rosary / Novena Event & quick sponsorship CTA
class SponsoredEventsCard extends StatelessWidget {
  const SponsoredEventsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.marianNavySurface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: AppTheme.sacredGold.withValues(alpha: 0.35),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.sacredGold.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.35)),
            ),
            child: Text(
              "TONIGHT'S SPONSORED ROSARY MARATHON",
              style: GoogleFonts.inter(
                fontSize: 9.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.0,
                color: AppTheme.goldLight,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '✨ The Rodriguez Family ✨',
            style: GoogleFonts.cinzel(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            '"In loving memory of Grandma Rosa"',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 15,
              fontStyle: FontStyle.italic,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            '2,847 faithful praying together tonight',
            style: GoogleFonts.inter(fontSize: 11.5, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                HapticFeedback.lightImpact();
                _showSponsorOptionsSheet(context);
              },
              icon: const Icon(LucideIcons.crown, size: 16),
              label: Text(
                "Sponsor Tomorrow's Rosary — \$25",
                style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 12.5),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.sacredGold,
                foregroundColor: const Color(0xFF090E18),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showSponsorOptionsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.marianNavySurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Sponsor a Sacred Prayer Event',
                style: GoogleFonts.cinzel(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.goldLight,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Your family name and dedication will be displayed with reverence during the event.',
                style: GoogleFonts.inter(fontSize: 12.5, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 16),
              _tierTile(ctx, 'Nightly Rosary Stream', 'Daily · 8:00 PM', '\$25', '/donate'),
              _tierTile(ctx, 'Saint Feast Celebration', 'Per Feast Day', '\$50', '/donate'),
              _tierTile(ctx, 'First Friday Adoration', 'Monthly Vigil', '\$100', '/donate'),
              _tierTile(ctx, '9-Day Novena Series', '9 Consecutive Nights', '\$199', '/donate'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _tierTile(
    BuildContext context,
    String title,
    String subtitle,
    String price,
    String route,
  ) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(
        title,
        style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: AppTheme.textPrimary, fontSize: 14),
      ),
      subtitle: Text(
        subtitle,
        style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 12),
      ),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppTheme.sacredGold,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          price,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w800,
            color: const Color(0xFF090E18),
            fontSize: 12.5,
          ),
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        context.push(route);
      },
    );
  }
}
