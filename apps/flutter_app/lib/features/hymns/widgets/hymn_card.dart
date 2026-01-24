import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../models/hymn_model.dart';

class HymnCard extends StatelessWidget {
  final Hymn hymn;
  final VoidCallback onTap;

  const HymnCard({super.key, required this.hymn, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _CategoryBadge(category: hymn.category),
              if (hymn.recordingUrl != null)
                const Icon(
                  LucideIcons.music,
                  size: 14,
                  color: AppTheme.gold500,
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            hymn.title,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          if (hymn.latinTitle != null)
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(
                hymn.latinTitle!,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: AppTheme.gold400.withValues(alpha: 0.8),
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
          const SizedBox(height: 8),
          Text(
            hymn.firstLine ?? _getSnippet(hymn.lyrics),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
          ),
        ],
      ),
    );
  }

  String _getSnippet(String lyrics) {
    return lyrics
        .split('\n')
        .firstWhere((l) => l.trim().isNotEmpty, orElse: () => "");
  }
}

class _CategoryBadge extends StatelessWidget {
  final HymnCategory category;

  const _CategoryBadge({required this.category});

  @override
  Widget build(BuildContext context) {
    final color = _getCategoryColor();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        category.name.toUpperCase(),
        style: GoogleFonts.inter(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }

  Color _getCategoryColor() {
    switch (category) {
      case HymnCategory.traditional:
        return Colors.blue;
      case HymnCategory.marian:
        return Colors.pink;
      case HymnCategory.eucharistic:
        return AppTheme.gold500;
      case HymnCategory.seasonal:
        return Colors.green;
      case HymnCategory.psalms:
        return Colors.purple;
      case HymnCategory.contemporary:
        return Colors.teal;
    }
  }
}
