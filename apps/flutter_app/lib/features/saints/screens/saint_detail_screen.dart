import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../models/saint_model.dart';
import '../providers/saints_provider.dart';

class SaintDetailScreen extends ConsumerWidget {
  final String saintId;

  const SaintDetailScreen({super.key, required this.saintId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saintAsync = ref.watch(saintBySlugProvider(saintId));

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: saintAsync.when(
        data: (saint) => CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 350,
              pinned: true,
              backgroundColor: AppTheme.sacredNavy950,
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (saint.imageUrl != null)
                      CachedNetworkImage(
                        imageUrl: saint.imageUrl!,
                        fit: BoxFit.cover,
                        placeholder: (context, url) =>
                            Container(color: AppTheme.sacredNavy900),
                        errorWidget: (context, url, error) => Container(
                          color: AppTheme.sacredNavy800,
                          child: const Center(
                            child: Icon(
                              LucideIcons.imageOff,
                              color: Colors.white24,
                              size: 48,
                            ),
                          ),
                        ),
                      ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            AppTheme.sacredNavy950.withValues(alpha: 0.6),
                            AppTheme.sacredNavy950,
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      left: 20,
                      right: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (saint.title != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              margin: const EdgeInsets.only(bottom: 8),
                              decoration: BoxDecoration(
                                color: AppTheme.gold500.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: AppTheme.gold500.withValues(
                                    alpha: 0.3,
                                  ),
                                ),
                              ),
                              child: Text(
                                saint.title!.toUpperCase(),
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.gold500,
                                  letterSpacing: 1,
                                ),
                              ),
                            ),
                          Text(
                            saint.name,
                            style: GoogleFonts.merriweather(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              shadows: [
                                const Shadow(
                                  color: Colors.black54,
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              leading: IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
                onPressed: () => context.pop(),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Quick Info Grid
                    _buildInfoGrid(saint),

                    const SizedBox(height: 32),

                    // Biography
                    Text(
                      'Life and Hagiography',
                      style: GoogleFonts.merriweather(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      saint.biography ?? 'Biography coming soon.',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        color: Colors.white.withValues(alpha: 0.8),
                        height: 1.7,
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Patronage
                    if (saint.patronOf != null &&
                        saint.patronOf!.isNotEmpty) ...[
                      Text(
                        'Patron Of',
                        style: GoogleFonts.merriweather(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: saint.patronOf!.map((p) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.white10),
                            ),
                            child: Text(
                              p,
                              style: GoogleFonts.inter(
                                color: AppTheme.gold400,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 40),
                    ],

                    // Prayer
                    if (saint.prayer != null) ...[
                      _buildPrayerSection(saint),
                      const SizedBox(height: 40),
                    ],

                    // CTAs
                    _buildIntercessionCTAs(context, saint),

                    const SizedBox(height: 60),
                  ],
                ),
              ),
            ),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildInfoGrid(Saint saint) {
    return Row(
      children: [
        if (saint.feastMonth != null)
          Expanded(
            child: _buildInfoCard(
              icon: LucideIcons.calendar,
              label: 'Feast Day',
              value: '${saint.feastDayOfMonth}/${saint.feastMonth}',
            ),
          ),
        if (saint.bornDate != null) ...[
          const SizedBox(width: 12),
          Expanded(
            child: _buildInfoCard(
              icon: LucideIcons.baby,
              label: 'Born',
              value: saint.bornDate!,
            ),
          ),
        ],
        if (saint.canonizedDate != null) ...[
          const SizedBox(width: 12),
          Expanded(
            child: _buildInfoCard(
              icon: LucideIcons.shieldCheck,
              label: 'Canonized',
              value: saint.canonizedDate!,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: AppTheme.gold500.withValues(alpha: 0.7)),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.inter(fontSize: 10, color: Colors.white38),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildPrayerSection(Saint saint) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppTheme.gold500.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
        image: const DecorationImage(
          image: AssetImage('assets/images/texture_gold.png'),
          opacity: 0.05,
          fit: BoxFit.cover,
        ),
      ),
      child: Column(
        children: [
          const Icon(LucideIcons.scroll, color: AppTheme.gold500, size: 32),
          const SizedBox(height: 24),
          Text(
            saint.prayer!,
            textAlign: TextAlign.center,
            style: GoogleFonts.merriweather(
              fontSize: 18,
              fontStyle: FontStyle.italic,
              color: AppTheme.gold100,
              height: 1.8,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Amen',
            style: GoogleFonts.merriweather(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppTheme.gold500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIntercessionCTAs(BuildContext context, Saint saint) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: () => context.push(
              '/prayer-wall',
              extra: 'Intercession through ${saint.name}',
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.sacredNavy800,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              side: const BorderSide(color: Colors.white10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  LucideIcons.utilityPole,
                  size: 20,
                ), // Placeholder for handsHelping
                const SizedBox(width: 12),
                Text(
                  'Ask for ${saint.name}\'s Intercession',
                  style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: () => context.push('/light-candle'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold500,
              foregroundColor: AppTheme.sacredNavy900,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(LucideIcons.heart, size: 20),
                const SizedBox(width: 12),
                Text(
                  'Light a Candle for ${saint.name}',
                  style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
