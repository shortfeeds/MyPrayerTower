import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../core/theme/app_theme.dart';

/// Gentle post-prayer offering sheet with a kind escape hatch ("Continue in peace").
void showPostPrayerOfferingSheet(BuildContext context, {String intention = ''}) {
  showModalBottomSheet(
    context: context,
    backgroundColor: AppTheme.marianNavySurface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(22, 20, 22, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.sparkles, color: AppTheme.goldLight, size: 32),
            const SizedBox(height: 10),
            Text(
              'Your prayer has been offered.',
              style: GoogleFonts.cinzel(
                fontSize: 19,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              intention.isNotEmpty
                  ? 'Would you like to deepen your intention for $intention?'
                  : 'Would you like to deepen this intention before the altar?',
              style: GoogleFonts.cormorantGaramond(
                fontSize: 15.5,
                fontStyle: FontStyle.italic,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(ctx);
                  ctx.push('/candles');
                },
                icon: const Icon(LucideIcons.flame, size: 18),
                label: Text(
                  'Light a Vigil Candle — Free',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w800),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.sacredGold,
                  foregroundColor: const Color(0xFF090E18),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(ctx);
                  ctx.push('/mass-offering');
                },
                icon: const Icon(LucideIcons.church, size: 17, color: AppTheme.goldLight),
                label: Text(
                  'Request a Holy Mass — \$10',
                  style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                ),
                style: OutlinedButton.styleFrom(
                  backgroundColor: AppTheme.marianNavyCard,
                  side: const BorderSide(color: AppTheme.sacredGold),
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'No obligation — your prayer alone is a beautiful gift.',
              style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted),
            ),
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(
                'Continue in peace →',
                style: GoogleFonts.inter(
                  color: AppTheme.goldLight,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
