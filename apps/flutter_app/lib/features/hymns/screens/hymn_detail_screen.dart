import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../models/hymn_model.dart';

class HymnDetailScreen extends StatelessWidget {
  final Hymn hymn;

  const HymnDetailScreen({super.key, required this.hymn});

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [_buildAppBar(context), _buildLyricsBody()],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy900,
      leading: IconButton(
        icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: true,
        title: Text(
          hymn.title,
          textAlign: TextAlign.center,
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Abstract Background
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppTheme.sacredNavy950, AppTheme.royalPurple900],
                ),
              ),
            ),
            // Pattern
            Opacity(
              opacity: 0.1,
              child: Center(
                child: Icon(
                  _getCategoryIcon(hymn.category),
                  size: 150,
                  color: AppTheme.gold500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLyricsBody() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (hymn.latinTitle != null) ...[
              Text(
                hymn.latinTitle!,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.gold400,
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Metadata Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (hymn.composer != null)
                  _MetadataItem(label: 'Composer', value: hymn.composer!),
                if (hymn.tune != null) ...[
                  if (hymn.composer != null) const _Divider(),
                  _MetadataItem(label: 'Tune', value: hymn.tune!),
                ],
              ],
            ),
            const SizedBox(height: 40),

            // Lyrics
            Text(
              hymn.lyrics,
              textAlign: TextAlign.center,
              style: GoogleFonts.merriweather(
                fontSize: 18,
                height: 1.8,
                color: Colors.white.withValues(alpha: 0.95),
              ),
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  IconData _getCategoryIcon(HymnCategory category) {
    switch (category) {
      case HymnCategory.marian:
        return LucideIcons.heart;
      case HymnCategory.eucharistic:
        return LucideIcons.crown;
      case HymnCategory.seasonal:
        return LucideIcons.calendar;
      case HymnCategory.psalms:
        return LucideIcons.music;
      default:
        return LucideIcons.book;
    }
  }
}

class _MetadataItem extends StatelessWidget {
  final String label;
  final String value;

  const _MetadataItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label.toUpperCase(),
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: Colors.white38,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 20,
      color: Colors.white10,
      margin: const EdgeInsets.symmetric(horizontal: 16),
    );
  }
}
