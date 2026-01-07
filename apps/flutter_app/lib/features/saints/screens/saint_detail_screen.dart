import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/saints_provider.dart';

class SaintDetailScreen extends ConsumerWidget {
  final String saintId;

  const SaintDetailScreen({super.key, required this.saintId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // In a real app, use ref.watch(saintDetailsProvider(saintId))
    final saintAsync = ref.watch(saintOfTheDayProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy950,
            flexibleSpace: FlexibleSpaceBar(
              background: saintAsync.when(
                data: (saint) => Stack(
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
                            AppTheme.sacredNavy950.withValues(alpha: 0.8),
                            AppTheme.sacredNavy950,
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                loading: () => Container(color: AppTheme.sacredNavy900),
                error: (_, __) => Container(color: AppTheme.sacredNavy900),
              ),
            ),
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: saintAsync.when(
                data: (saint) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      saint.name,
                      style: GoogleFonts.merriweather(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (saint.title != null)
                      Text(
                        saint.title!,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    const SizedBox(height: 8),
                    if (saint.feastMonth != null &&
                        saint.feastDayOfMonth != null)
                      Text(
                        'Feast Day: ${saint.feastDayOfMonth}/${saint.feastMonth}',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    const SizedBox(height: 24),
                    if (saint.biography != null)
                      Text(
                        saint.biography!,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: AppTheme.textPrimary,
                          height: 1.6,
                        ),
                      ),
                    if (saint.prayer != null) ...[
                      const SizedBox(height: 32),
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: AppTheme.sacredCardDecoration,
                        child: Column(
                          children: [
                            const Icon(
                              LucideIcons.scroll,
                              color: AppTheme.gold500,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              saint.prayer!,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.merriweather(
                                fontSize: 16,
                                fontStyle: FontStyle.italic,
                                color: AppTheme.textPrimary,
                                height: 1.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Center(child: Text('Error: $err')),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
