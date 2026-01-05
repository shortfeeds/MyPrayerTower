import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class ReadingsScreen extends StatelessWidget {
  const ReadingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: const Text('Daily Readings'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            _buildReadingCard(
              context,
              'First Reading',
              'Isaiah 60:1-6',
              'Rise up in splendor, Jerusalem! Your light has come, the glory of the Lord shines upon you.',
            ),
            const SizedBox(height: 16),
            _buildReadingCard(
              context,
              'Responsorial Psalm',
              'Psalm 72',
              'Lord, every nation on earth will adore you.',
            ),
            const SizedBox(height: 16),
            _buildReadingCard(
              context,
              'Second Reading',
              'Ephesians 3:2-3a, 5-6',
              'brothers and sisters: You have heard of the stewardship of God\'s grace...',
            ),
            const SizedBox(height: 16),
            _buildReadingCard(
              context,
              'Gospel',
              'Matthew 2:1-12',
              'When Jesus was born in Bethlehem of Judea, in the days of King Herod...',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReadingCard(
    BuildContext context,
    String title,
    String reference,
    String excerpt,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.accentGold,
                  letterSpacing: 1.0,
                ),
              ),
              const Icon(LucideIcons.bookOpen, size: 16, color: Colors.white24),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            excerpt,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              height: 1.6,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            reference,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.white60,
            ),
          ),
        ],
      ),
    );
  }
}
